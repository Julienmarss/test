package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import lombok.Builder;

import java.util.List;

/**
 * Represents a selection field with predefined options
 * @param <T> The enum type representing the options (ContractType, CollectiveBargainingAgreementType, SendingMethod, etc.)
 */
@Builder
public record SelectionField<T extends Enum<T>>(
        FieldId id,
        String label,
        T value,
        List<T> options,
        FieldSource source,
        BusinessRule businessRule,
        ExpectedFormat expectedFormat,
        FieldValidation validation
) implements Field {
}
