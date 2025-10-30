package com.legipilot.service.core.collaborator.events.domain.model.trigger;

import java.util.UUID;

public record TriggeredEventId(UUID value) {
    public static TriggeredEventId of(UUID id) {
        return new TriggeredEventId(id);
    }

    public static TriggeredEventId init() {
        return new TriggeredEventId(UUID.randomUUID());
    }
}
