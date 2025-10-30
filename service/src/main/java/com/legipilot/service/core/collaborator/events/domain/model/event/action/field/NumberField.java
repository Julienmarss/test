package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

/**
 * Represents an integer number field (paid leave days, seniority in days, etc.)
 */
@Builder
public record NumberField(
        FieldId id,
        String label,
        Integer value,
        FieldSource source,
        BusinessRule businessRule,
        ExpectedFormat expectedFormat,
        FieldValidation validation
) implements Field {
}
