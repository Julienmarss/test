package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.UUID;

public record EventId(UUID value) {
    public static EventId of(UUID id) {
        return new EventId(id);
    }
}
