package com.legipilot.service.core.collaborator.events.infra.in;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.ProcessSignatureWebhookUseCase;
import com.legipilot.service.core.collaborator.events.domain.model.webhook.YousignWebhookEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/webhooks/yousign")
@RequiredArgsConstructor
public class YousignWebhookController {

    private final ProcessSignatureWebhookUseCase processSignatureWebhookUseCase;

    @PostMapping
    public ResponseEntity<Void> handleWebhook(
            @RequestBody YousignWebhookPayload payload,
            @RequestHeader(value = "X-Yousign-Signature", required = false) String signature
    ) {
        log.info("📨 Received Yousign webhook");
        log.info("Event ID: {}", payload.eventId());
        log.info("Event Name: {}", payload.eventName());
        log.info("Signature Request ID: {}", payload.data().signatureRequest().id());
        log.info("Sandbox: {}", payload.sandbox());

        try {
            YousignWebhookEvent event = mapToEvent(payload);
            processSignatureWebhookUseCase.execute(event);

            log.info("✅ Webhook processed successfully");
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("❌ Error processing Yousign webhook", e);
            // Toujours retourner 200 pour éviter les retry
            return ResponseEntity.ok().build();
        }
    }

    private YousignWebhookEvent mapToEvent(YousignWebhookPayload payload) {
        String signerEmail = null;
        if (payload.data().signer() != null) {
            signerEmail = payload.data().signer().info().email();
        }

        return YousignWebhookEvent.builder()
                .eventType(YousignWebhookEvent.EventType.fromString(payload.eventName()))
                .signatureRequestId(payload.data().signatureRequest().id())
                .status(payload.data().signatureRequest().status())
                .signerEmail(signerEmail)
                .occurredAt(Instant.ofEpochSecond(Long.parseLong(payload.eventTime())))
                .build();
    }

    // ==================== DTOs V3 ====================

    public record YousignWebhookPayload(
            @JsonProperty("event_id") String eventId,
            @JsonProperty("event_name") String eventName,
            @JsonProperty("event_time") String eventTime,  // timestamp en string
            @JsonProperty("subscription_id") String subscriptionId,
            @JsonProperty("subscription_description") String subscriptionDescription,
            @JsonProperty("sandbox") boolean sandbox,
            YousignWebhookData data
    ) {}

    public record YousignWebhookData(
            @JsonProperty("signature_request") SignatureRequestData signatureRequest,
            SignerData signer  // Peut être null selon l'événement
    ) {}

    public record SignatureRequestData(
            String id,
            String name,
            String status,
            @JsonProperty("delivery_mode") String deliveryMode,
            @JsonProperty("created_at") String createdAt,
            @JsonProperty("expiration_date") String expirationDate,
            @JsonProperty("ordered_signers") boolean orderedSigners,
            List<SignerInRequestData> signers,
            List<DocumentData> documents
    ) {}

    public record SignerInRequestData(
            String id,
            String status,
            @JsonProperty("delivery_mode") String deliveryMode
    ) {}

    public record DocumentData(
            String id,
            String nature
    ) {}

    public record SignerData(
            String id,
            SignerInfo info,
            String status,
            @JsonProperty("signature_level") String signatureLevel,
            @JsonProperty("signature_authentication_mode") String signatureAuthenticationMode
    ) {}

    public record SignerInfo(
            @JsonProperty("first_name") String firstName,
            @JsonProperty("last_name") String lastName,
            String email,
            @JsonProperty("phone_number") String phoneNumber,
            String locale
    ) {}
}