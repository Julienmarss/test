package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

import java.math.BigDecimal;

/**
 * Represents a boolean field, label is a question, and the user answer yes or no
 */
@Builder
public record BooleanField(
        FieldId id,
        String label,
        Boolean value,
        FieldSource source,
        BusinessRule businessRule,
        ExpectedFormat expectedFormat,
        FieldValidation validation
) implements Field {
}
