// YousignAdapter.java - VERSION AVEC MENTIONS
package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort;
import com.legipilot.service.shared.domain.error.TechnicalError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
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

    @Value("${yousign.webhook-url:}")
    private String webhookUrl;

    @Override
    public SignatureSession initiateSignatureWithMentions(
            byte[] documentContent,
            String documentName,
            List<SignerWithMention> signers
    ) {
        try {
            // 1. Upload du document
            String documentId = uploadDocument(documentContent, documentName);
            log.info("Document uploaded to Yousign with ID: {}", documentId);

            // 2. Créer la signature request avec mentions
            YousignSignatureRequestDto request = buildSignatureRequestWithMentions(
                    documentId,
                    documentName,
                    signers
            );

            HttpHeaders headers = createHeaders();
            HttpEntity<YousignSignatureRequestDto> entity = new HttpEntity<>(request, headers);

            ResponseEntity<YousignSignatureResponseDto> response = restTemplate.exchange(
                    apiUrl + "/signature_requests",
                    HttpMethod.POST,
                    entity,
                    YousignSignatureResponseDto.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new TechnicalError("Échec de la création de la demande de signature sur Yousign");
            }

            YousignSignatureResponseDto yousignResponse = response.getBody();
            log.info("Signature request created with ID: {}", yousignResponse.id());

            // 3. Activer (pour envoyer les emails automatiquement)
            activateSignatureRequest(yousignResponse.id());

            return mapToSignatureSession(yousignResponse);

        } catch (Exception e) {
            log.error("Error initiating signature with Yousign", e);
            throw new TechnicalError("Erreur lors de l'initiation de la signature électronique: " + e.getMessage());
        }
    }

    private YousignSignatureRequestDto buildSignatureRequestWithMentions(
            String documentId,
            String documentName,
            List<SignerWithMention> signers
    ) {
        List<YousignSignerDto> yousignSigners = signers.stream()
                .map(signer -> new YousignSignerDto(
                        new YousignSignerInfoDto(
                                signer.firstName(),
                                signer.lastName(),
                                signer.email(),
                                "fr"
                        ),
                        List.of(new YousignSignatureFieldDto(
                                documentId,
                                "signature",
                                signer.mention().toMentionText() // @signature(employee) ou @signature(admin)
                        )),
                        "handwritten",
                        signer.signatureOrder()
                ))
                .collect(Collectors.toList());

        String webhook = (webhookUrl != null && !webhookUrl.isEmpty()) ? webhookUrl : null;

        return new YousignSignatureRequestDto(
                documentName,
                "Demande de signature pour le document " + documentName,
                signers.stream().map(SignerWithMention::email).collect(Collectors.toList()),
                yousignSigners,
                webhook,
                "email" // delivery_mode
        );
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

    private String uploadDocument(byte[] documentContent, String documentName) {
        try {
            String base64Content = Base64.getEncoder().encodeToString(documentContent);

            YousignDocumentUploadDto upload = new YousignDocumentUploadDto(
                    documentName,
                    "base64",
                    base64Content
            );

            HttpHeaders headers = createHeaders();
            HttpEntity<YousignDocumentUploadDto> entity = new HttpEntity<>(upload, headers);

            ResponseEntity<YousignDocumentResponseDto> response = restTemplate.exchange(
                    apiUrl + "/documents",
                    HttpMethod.POST,
                    entity,
                    YousignDocumentResponseDto.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new TechnicalError("Échec de l'upload du document sur Yousign");
            }

            return response.getBody().id();

        } catch (Exception e) {
            log.error("Error uploading document to Yousign", e);
            throw new TechnicalError("Erreur lors de l'upload du document: " + e.getMessage());
        }
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

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
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

    // DTOs Yousign
    private record YousignDocumentUploadDto(
            String name,
            String nature,
            @JsonProperty("content_base64") String contentBase64
    ) {}

    private record YousignDocumentResponseDto(
            String id,
            String name
    ) {}

    private record YousignSignatureRequestDto(
            String name,
            String description,
            List<String> recipients,
            List<YousignSignerDto> signers,
            String webhook,
            @JsonProperty("delivery_mode") String deliveryMode
    ) {}

    private record YousignSignerDto(
            YousignSignerInfoDto info,
            @JsonProperty("signature_fields") List<YousignSignatureFieldDto> signatureFields,
            @JsonProperty("signature_level") String signatureLevel,
            @JsonProperty("signature_order") int signatureOrder
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
            String mention // "@signature(employee)" ou "@signature(admin)"
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