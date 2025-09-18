package com.legipilot.service.shared.domain.model;

import java.util.UUID;

public record ReinitialisationToken(UUID value) {
    public static ReinitialisationToken generate() {
        return new ReinitialisationToken(UUID.randomUUID());
    }
}
