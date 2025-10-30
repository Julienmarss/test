package com.legipilot.service.core.collaborator.events.domain.model.webhook;

import lombok.Builder;

import java.time.Instant;
import java.util.Arrays;

@Builder
public record YousignWebhookEvent(
        EventType eventType,
        String signatureRequestId,
        String status,
        String signerEmail,
        Instant occurredAt
) {
    public enum EventType {
        SIGNATURE_REQUEST_ACTIVATED("signature_request.activated"),
        SIGNATURE_REQUEST_DONE("signature_request.done"),
        SIGNATURE_REQUEST_EXPIRED("signature_request.expired"),
        SIGNATURE_REQUEST_DECLINED("signature_request.declined"),
        SIGNER_NOTIFIED("signer.notified"),
        SIGNER_OPENED("signer.opened"),
        SIGNER_SIGNED("signer.signed"),
        SIGNER_ERROR("signer.error"),
        UNKNOWN("unknown");

        private final String value;

        EventType(String value) {
            this.value = value;
        }

        public static EventType fromString(String value) {
            return Arrays.stream(values())
                    .filter(type -> type.value.equals(value))
                    .findFirst()
                    .orElse(UNKNOWN);
        }

        public String getValue() {
            return value;
        }
    }
}