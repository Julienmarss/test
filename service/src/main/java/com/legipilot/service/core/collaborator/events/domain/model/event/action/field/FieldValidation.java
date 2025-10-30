package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

import java.time.LocalDate;

/**
 * Represents business validation rules for a field
 */
@Builder
public record FieldValidation(
        boolean required,
        Double minimumAmount,
        Double maximumAmount,
        Integer minimumNumber,
        Integer maximumNumber,
        LocalDate minimumDate,
        LocalDate maximumDate
) {
}
