package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort;
import com.legipilot.service.shared.domain.error.TechnicalError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class YousignAdapter implements ElectronicSignaturePort {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    @Value("${yousign.api-key}")
    private String apiKey;

    @Value("${yousign.api-url:https://api-sandbox.yousign.app/v3}")
    private String apiUrl;

    @Override
    public SignatureSession initiateSignatureWithMentions(
            byte[] documentContent,
            String documentName,
            List<SignerWithMention> signers
    ) {
        try {
            // 1. Créer la Signature Request
            String signatureRequestId = createSignatureRequest(documentName);
            log.info("Signature request created with ID: {}", signatureRequestId);

            // 2. Upload du document avec parse_anchors=true
            String documentId = uploadDocumentToSignatureRequest(
                    signatureRequestId,
                    documentContent,
                    documentName
            );
            log.info("Document uploaded to Yousign with ID: {}", documentId);

            // 3. Ajouter les signers SANS fields (Yousign les créera depuis les smart anchors)
            List<YousignSignerResponseDto> yousignSigners = new ArrayList<>();
            for (SignerWithMention signer : signers) {
                YousignSignerResponseDto signerResponse = addSignerToRequest(
                        signatureRequestId,
                        documentId,
                        signer
                );
                yousignSigners.add(signerResponse);
            }

            // 4. Activer (pour envoyer les emails automatiquement)
            activateSignatureRequest(signatureRequestId);

            return new SignatureSession(
                    signatureRequestId,
                    SignatureStatus.ONGOING,
                    yousignSigners.stream()
                            .map(ys -> new SignerInfo(
                                    ys.info().email(),
                                    mapStatus(ys.status()),
                                    ys.signatureLink()
                            ))
                            .collect(Collectors.toList())
            );

        } catch (Exception e) {
            log.error("Error initiating signature with Yousign", e);
            throw new TechnicalError("Erreur lors de l'initiation de la signature électronique: " + e.getMessage());
        }
    }

    /**
     * Upload d'un document selon la doc Yousign V3 avec OkHttp
     */
    private String uploadDocumentToSignatureRequest(
            String signatureRequestId,
            byte[] documentContent,
            String documentName
    ) {
        try {
            log.info("==================== UPLOAD DEBUG ====================");
            log.info("Document name: {}", documentName);
            log.info("Document content size: {} bytes", documentContent != null ? documentContent.length : 0);

            // Magic bytes check
            if (documentContent != null && documentContent.length >= 4) {
                String magicBytes = String.format("%02X %02X %02X %02X",
                        documentContent[0], documentContent[1], documentContent[2], documentContent[3]);
                log.info("File magic bytes: {}", magicBytes);

                if (documentContent[0] == 0x50 && documentContent[1] == 0x4B) {
                    log.info("✅ File appears to be a ZIP/DOCX (magic bytes match)");
                } else if (documentContent[0] == 0x25 && documentContent[1] == 0x50) {
                    log.info("✅ File appears to be a PDF (magic bytes match)");
                } else {
                    log.warn("⚠️ File magic bytes don't match DOCX or PDF!");
                }
            }

            String mimeType = determineMimeType(documentName);
            log.info("MIME type: {}", mimeType);

            String url = apiUrl + "/signature_requests/" + signatureRequestId + "/documents";
            log.info("Upload URL: {}", url);

            // Créer le MediaType pour OkHttp
            okhttp3.MediaType mediaType = okhttp3.MediaType.parse(mimeType);

            // Créer le RequestBody avec le bon MediaType
            RequestBody fileRequestBody = RequestBody.create(documentContent, mediaType);

            // Construire le multipart
            MultipartBody.Builder multipartBuilder = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM);

            // Ajouter le fichier
            multipartBuilder.addFormDataPart(
                    "file",
                    documentName,
                    fileRequestBody
            );

            // Ajouter nature
            multipartBuilder.addFormDataPart("nature", "signable_document");

            // IMPORTANT: Activer le parsing des smart anchors
            multipartBuilder.addFormDataPart("parse_anchors", "true");

            RequestBody requestBody = multipartBuilder.build();

            log.info("Multipart Content-Type: {}", requestBody.contentType());

            // Construire la requête
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .post(requestBody)
                    .build();

            log.info("Executing request with OkHttp...");

            // Exécuter
            OkHttpClient client = new OkHttpClient();
            try (Response response = client.newCall(request).execute()) {
                int statusCode = response.code();
                String responseBody = response.body() != null ? response.body().string() : "";

                log.info("Response status: {}", statusCode);
                log.info("Response body: {}", responseBody);
                log.info("====================================================");

                if (statusCode < 200 || statusCode >= 300) {
                    log.error("Upload FAILED!");
                    throw new TechnicalError(
                            String.format("Échec de l'upload du document (HTTP %d): %s", statusCode, responseBody)
                    );
                }

                YousignDocumentResponseDto documentResponse = objectMapper.readValue(
                        responseBody,
                        YousignDocumentResponseDto.class
                );

                log.info("Document uploaded successfully with ID: {}", documentResponse.id());
                log.info("✅ Smart anchors detected: {}", documentResponse.totalAnchors());
                return documentResponse.id();
            }

        } catch (Exception e) {
            log.error("Exception during upload", e);
            throw new TechnicalError("Erreur lors de l'upload du document: " + e.getMessage());
        }
    }

    private String determineMimeType(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            log.warn("Filename is null or empty, using DOCX mime type");
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        String lowerFilename = filename.toLowerCase().trim();

        if (lowerFilename.endsWith(".pdf")) {
            log.info("File is PDF");
            return "application/pdf";
        } else if (lowerFilename.endsWith(".docx")) {
            log.info("File is DOCX");
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else {
            log.warn("Unknown extension '{}', defaulting to DOCX mime type", lowerFilename);
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
    }

    private String createSignatureRequest(String documentName) {
        YousignCreateSignatureRequestDto request = new YousignCreateSignatureRequestDto(
                documentName,
                "email"
        );

        HttpHeaders headers = createHeaders();
        HttpEntity<YousignCreateSignatureRequestDto> entity = new HttpEntity<>(request, headers);

        ResponseEntity<YousignSignatureRequestIdDto> response = restTemplate.exchange(
                apiUrl + "/signature_requests",
                HttpMethod.POST,
                entity,
                YousignSignatureRequestIdDto.class
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new TechnicalError("Échec de la création de la signature request");
        }

        return response.getBody().id();
    }

    private YousignSignerResponseDto addSignerToRequest(
            String signatureRequestId,
            String documentId,
            SignerWithMention signer
    ) {
        // Les smart anchors sont dans le document, Yousign créera automatiquement les fields
        // On n'envoie donc PAS de fields ici !
        log.info("Adding signer {} {} (order {}) - fields will be created automatically from smart anchors",
                signer.firstName(),
                signer.lastName(),
                signer.signatureOrder());

        YousignCreateSignerDto signerDto = new YousignCreateSignerDto(
                new YousignSignerInfoDto(
                        signer.firstName(),
                        signer.lastName(),
                        signer.email(),
                        "fr"
                ),
                List.of(),  // ✅ Liste vide ! Yousign créera les fields depuis les smart anchors
                "electronic_signature",
                "no_otp"
        );

        HttpHeaders headers = createHeaders();
        HttpEntity<YousignCreateSignerDto> entity = new HttpEntity<>(signerDto, headers);

        ResponseEntity<YousignSignerResponseDto> response = restTemplate.exchange(
                apiUrl + "/signature_requests/" + signatureRequestId + "/signers",
                HttpMethod.POST,
                entity,
                YousignSignerResponseDto.class
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new TechnicalError("Échec de l'ajout du signataire");
        }

        return response.getBody();
    }

    private void activateSignatureRequest(String signatureRequestId) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    apiUrl + "/signature_requests/" + signatureRequestId + "/activate",
                    HttpMethod.POST,
                    entity,
                    Void.class
            );

            log.info("Signature request {} activated, emails sent to signers", signatureRequestId);

        } catch (Exception e) {
            log.error("Error activating signature request", e);
            throw new TechnicalError("Erreur lors de l'activation de la demande de signature: " + e.getMessage());
        }
    }

    @Override
    public SignatureSession getSignatureStatus(String signatureRequestId) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<YousignSignatureResponseDto> response = restTemplate.exchange(
                    apiUrl + "/signature_requests/" + signatureRequestId,
                    HttpMethod.GET,
                    entity,
                    YousignSignatureResponseDto.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new TechnicalError("Échec de la récupération du statut de signature");
            }

            return mapToSignatureSession(response.getBody());

        } catch (Exception e) {
            log.error("Error getting signature status from Yousign", e);
            throw new TechnicalError("Erreur lors de la récupération du statut de signature: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadSignedDocument(String signatureRequestId) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    apiUrl + "/signature_requests/" + signatureRequestId + "/documents/download",
                    HttpMethod.GET,
                    entity,
                    byte[].class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new TechnicalError("Échec du téléchargement du document signé");
            }

            return response.getBody();

        } catch (Exception e) {
            log.error("Error downloading signed document from Yousign", e);
            throw new TechnicalError("Erreur lors du téléchargement du document signé: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private SignatureSession mapToSignatureSession(YousignSignatureResponseDto response) {
        List<SignerInfo> signerInfos = response.signers().stream()
                .map(ys -> new SignerInfo(
                        ys.info().email(),
                        mapStatus(ys.status()),
                        ys.signatureLink()
                ))
                .collect(Collectors.toList());

        return new SignatureSession(
                response.id(),
                mapStatus(response.status()),
                signerInfos
        );
    }

    private SignatureStatus mapStatus(String yousignStatus) {
        return switch (yousignStatus.toLowerCase()) {
            case "draft" -> SignatureStatus.DRAFT;
            case "ongoing" -> SignatureStatus.ONGOING;
            case "done" -> SignatureStatus.DONE;
            case "expired" -> SignatureStatus.EXPIRED;
            case "canceled" -> SignatureStatus.CANCELED;
            case "declined" -> SignatureStatus.DECLINED;
            default -> SignatureStatus.DRAFT;
        };
    }

    // ==================== DTOs ====================

    private record YousignCreateSignatureRequestDto(
            String name,
            @JsonProperty("delivery_mode") String deliveryMode
    ) {}

    private record YousignSignatureRequestIdDto(
            String id
    ) {}

    private record YousignDocumentResponseDto(
            String id,
            String name,
            @JsonProperty("total_anchors") Integer totalAnchors  // Ajouté pour logging
    ) {}

    private record YousignCreateSignerDto(
            YousignSignerInfoDto info,
            @JsonProperty("fields") List<YousignSignatureFieldDto> fields,  // Liste vide maintenant
            @JsonProperty("signature_level") String signatureLevel,
            @JsonProperty("signature_authentication_mode") String signatureAuthenticationMode
    ) {}

    private record YousignSignerInfoDto(
            @JsonProperty("first_name") String firstName,
            @JsonProperty("last_name") String lastName,
            String email,
            String locale
    ) {}

    private record YousignSignatureFieldDto(
            @JsonProperty("document_id") String documentId,
            String type,
            @JsonProperty("mention") String mention
    ) {}

    private record YousignSignatureResponseDto(
            String id,
            String name,
            String status,
            List<YousignSignerResponseDto> signers
    ) {}

    private record YousignSignerResponseDto(
            YousignSignerInfoDto info,
            String status,
            @JsonProperty("signature_link") String signatureLink
    ) {}
}