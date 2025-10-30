package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

public record FieldId(String value) {
    public static FieldId of(String value) {
        return new FieldId(value);
    }
}
