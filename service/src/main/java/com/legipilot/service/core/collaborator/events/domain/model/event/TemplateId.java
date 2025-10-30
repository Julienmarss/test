package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.UUID;

public record TemplateId(UUID value) {

    public static TemplateId of(UUID value) {
        return new TemplateId(value);
    }

    public static TemplateId of(String value) {
        return new TemplateId(UUID.fromString(value));
    }

}
