package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

import java.math.BigDecimal;

/**
 * Represents a monetary amount field (salary, severance pay, etc.)
 */
@Builder
public record AmountField(
        FieldId id,
        String label,
        BigDecimal value,
        FieldSource source,
        BusinessRule businessRule,
        ExpectedFormat expectedFormat,
        FieldValidation validation
) implements Field {
}
