package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

import java.time.LocalDate;

/**
 * Represents a date field (hire date, interview date, sending date, etc.)
 */
@Builder
public record DateField(
        FieldId id,
        String label,
        LocalDate value,
        FieldSource source,
        BusinessRule businessRule,
        ExpectedFormat expectedFormat,
        FieldValidation validation
) implements Field {
}
