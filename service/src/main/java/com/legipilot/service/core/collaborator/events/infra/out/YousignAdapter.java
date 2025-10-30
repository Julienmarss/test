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
    public SignatureSession initiateSignature(byte[] documentContent, String documentName, List<Signer> signers) {
        try {
            String documentId = uploadDocument(documentContent, documentName);
            log.info("Document uploaded to Yousign with ID: {}", documentId);

            YousignSignatureRequest request = buildSignatureRequest(documentId, documentName, signers);

            HttpHeaders headers = createHeaders();
            HttpEntity<YousignSignatureRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<YousignSignatureResponse> response = restTemplate.exchange(
                    apiUrl + "/signature_requests",
                    HttpMethod.POST,
                    entity,
                    YousignSignatureResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new TechnicalError("Échec de la création de la demande de signature sur Yousign");
            }

            YousignSignatureResponse yousignResponse = response.getBody();
            log.info("Signature request created with ID: {}", yousignResponse.id());

            activateSignatureRequest(yousignResponse.id());

            return mapToSignatureSession(yousignResponse);

        } catch (Exception e) {
            log.error("Error initiating signature with Yousign", e);
            throw new TechnicalError("Erreur lors de l'initiation de la signature électronique: " + e.getMessage());
        }
    }

    @Override
    public SignatureSession getSignatureStatus(String signatureRequestId) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<YousignSignatureResponse> response = restTemplate.exchange(
                    apiUrl + "/signature_requests/" + signatureRequestId,
                    HttpMethod.GET,
                    entity,
                    YousignSignatureResponse.class
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
            SignatureSession session = getSignatureStatus(signatureRequestId);

            if (session.status() != SignatureStatus.DONE) {
                throw new TechnicalError("Le document n'est pas encore entièrement signé");
            }

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

            YousignDocumentUpload upload = new YousignDocumentUpload(
                    documentName,
                    "base64",
                    base64Content
            );

            HttpHeaders headers = createHeaders();
            HttpEntity<YousignDocumentUpload> entity = new HttpEntity<>(upload, headers);

            ResponseEntity<YousignDocumentResponse> response = restTemplate.exchange(
                    apiUrl + "/documents",
                    HttpMethod.POST,
                    entity,
                    YousignDocumentResponse.class
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

    private YousignSignatureRequest buildSignatureRequest(String documentId, String documentName, List<Signer> signers) {
        List<YousignSigner> yousignSigners = signers.stream()
                .map(signer -> new YousignSigner(
                        new YousignSignerInfo(
                                signer.firstName(),
                                signer.lastName(),
                                signer.email(),
                                null
                        ),
                        List.of(new YousignSignatureField(
                                documentId,
                                "signature",
                                1,
                                100,
                                signer.role() == SignerRole.ADMINISTRATOR ? 100 : 200,
                                200,
                                50
                        )),
                        "optional"
                ))
                .collect(Collectors.toList());

        String webhook = (webhookUrl != null && !webhookUrl.isEmpty()) ? webhookUrl : null;

        return new YousignSignatureRequest(
                documentName,
                "Une demande de signature pour le document " + documentName,
                yousignSigners,
                webhook
        );
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private SignatureSession mapToSignatureSession(YousignSignatureResponse response) {
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

    private record YousignDocumentUpload(
            String name,
            String nature,
            @JsonProperty("content_base64") String contentBase64
    ) {}

    private record YousignDocumentResponse(
            String id,
            String name
    ) {}

    private record YousignSignatureRequest(
            String name,
            String description,
            List<YousignSigner> signers,
            String webhook
    ) {}

    private record YousignSigner(
            YousignSignerInfo info,
            @JsonProperty("signature_fields") List<YousignSignatureField> signatureFields,
            @JsonProperty("signature_level") String signatureLevel
    ) {}

    private record YousignSignerInfo(
            @JsonProperty("first_name") String firstName,
            @JsonProperty("last_name") String lastName,
            String email,
            String locale
    ) {}

    private record YousignSignatureField(
            @JsonProperty("document_id") String documentId,
            String type,
            Integer page,
            Integer x,
            Integer y,
            Integer width,
            Integer height
    ) {}

    private record YousignSignatureResponse(
            String id,
            String name,
            String status,
            List<YousignSignerResponse> signers
    ) {}

    private record YousignSignerResponse(
            YousignSignerInfo info,
            String status,
            @JsonProperty("signature_link") String signatureLink
    ) {}
}