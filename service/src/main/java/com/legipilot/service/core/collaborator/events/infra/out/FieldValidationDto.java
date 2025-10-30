package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldValidation;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record FieldValidationDto(
        @JsonProperty("required") Boolean required,
        @JsonProperty("minimumAmount") Double minimumAmount,
        @JsonProperty("maximumAmount") Double maximumAmount,
        @JsonProperty("minimumNumber") Integer minimumNumber,
        @JsonProperty("maximumNumber") Integer maximumNumber,
        @JsonProperty("minimumDate") String minimumDate,
        @JsonProperty("maximumDate") String maximumDate
) {
    public FieldValidation toDomain() {
        return FieldValidation.builder()
                .required(required != null && required)
                .minimumAmount(minimumAmount)
                .maximumAmount(maximumAmount)
                .minimumNumber(minimumNumber)
                .maximumNumber(maximumNumber)
                .minimumDate(minimumDate != null ? LocalDate.parse(minimumDate) : null)
                .maximumDate(maximumDate != null ? LocalDate.parse(maximumDate) : null)
                .build();
    }

    public static FieldValidationDto fromDomain(FieldValidation validation) {
        if (validation == null) {
            return null;
        }
        return FieldValidationDto.builder()
                .required(validation.required())
                .minimumAmount(validation.minimumAmount())
                .maximumAmount(validation.maximumAmount())
                .minimumNumber(validation.minimumNumber())
                .maximumNumber(validation.maximumNumber())
                .minimumDate(validation.minimumDate() != null ? validation.minimumDate().toString() : null)
                .maximumDate(validation.maximumDate() != null ? validation.maximumDate().toString() : null)
                .build();
    }
}
