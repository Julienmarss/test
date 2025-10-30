package com.legipilot.service.core.collaborator.events.domain.model.category;

import java.util.UUID;

public record EventCategoryId(UUID value) {
    public static EventCategoryId of(UUID id) {
        return new EventCategoryId(id);
    }
}
