package com.legipilot.service.core.collaborator.events.infra.in;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.ProcessSignatureWebhookUseCase;
import com.legipilot.service.core.collaborator.events.domain.model.webhook.YousignWebhookEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@Slf4j
@RestController
@RequestMapping("/webhooks/yousign")
@RequiredArgsConstructor
public class YousignWebhookController {

    private final ProcessSignatureWebhookUseCase processSignatureWebhookUseCase;

    @PostMapping
    public ResponseEntity<Void> handleWebhook(@RequestBody YousignWebhookPayload payload) {
        log.info("Received Yousign webhook: eventType={}, signatureRequestId={}",
                payload.eventType(), payload.data().signatureRequest().id());

        try {
            YousignWebhookEvent event = mapToEvent(payload);
            processSignatureWebhookUseCase.execute(event);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing Yousign webhook", e);
            return ResponseEntity.ok().build();
        }
    }

    private YousignWebhookEvent mapToEvent(YousignWebhookPayload payload) {
        return YousignWebhookEvent.builder()
                .eventType(YousignWebhookEvent.EventType.fromString(payload.eventType()))
                .signatureRequestId(payload.data().signatureRequest().id())
                .status(payload.data().signatureRequest().status())
                .signerEmail(payload.data().signer() != null ? payload.data().signer().info().email() : null)
                .occurredAt(payload.occurredAt())
                .build();
    }

    public record YousignWebhookPayload(
            @JsonProperty("event_type") String eventType,
            @JsonProperty("occurred_at") Instant occurredAt,
            YousignWebhookData data
    ) {}

    public record YousignWebhookData(
            @JsonProperty("signature_request") SignatureRequestData signatureRequest,
            SignerData signer
    ) {}

    public record SignatureRequestData(
            String id,
            String name,
            String status
    ) {}

    public record SignerData(
            SignerInfo info,
            String status
    ) {}

    public record SignerInfo(
            @JsonProperty("first_name") String firstName,
            @JsonProperty("last_name") String lastName,
            String email
    ) {}
}