package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.domain.model.event.*;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.AmountField;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Builder
public record FieldDto(
        @JsonProperty("fieldType") String fieldType,
        @JsonProperty("selectionType") String selectionType,
        @JsonProperty("id") String id,
        @JsonProperty("label") String label,
        @JsonProperty("value") String value,
        @JsonProperty("options") List<String> options,
        @JsonProperty("source") String source,
        @JsonProperty("expectedFormat") String expectedFormat,
        @JsonProperty("businessRule") String businessRule,
        @JsonProperty("validation") FieldValidationDto validation
) {
    public Field toDomain() {
        FieldId fieldId = FieldId.of(id);
        FieldSource fieldSource = source != null ? FieldSource.fromLabel(source.replace("_", " ")) : null;
        BusinessRule rule = businessRule != null ? BusinessRule.of(businessRule) : null;
        ExpectedFormat format = expectedFormat != null ? ExpectedFormat.of(expectedFormat) : null;
        FieldValidation fieldValidation = validation != null ? validation.toDomain() : null;

        return switch (fieldType) {
            case "DATE" -> DateField.builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? LocalDate.parse(value) : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "AMOUNT" -> AmountField.builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? new BigDecimal(value) : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "NUMBER" -> NumberField.builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? Integer.parseInt(value) : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "BOOLEAN" -> BooleanField.builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? Boolean.valueOf(value) : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "SELECTION" -> buildSelectionField(fieldId, fieldSource, rule, format, fieldValidation);
            default -> throw new IllegalArgumentException("Unknown field type: " + fieldType);
        };
    }

    private Field buildSelectionField(FieldId fieldId, FieldSource fieldSource, BusinessRule rule,
                                      ExpectedFormat format, FieldValidation fieldValidation) {
        return switch (selectionType) {
            case "ContractType" -> SelectionField.<ContractType>builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? ContractType.valueOf(value) : null)
                    .options(options != null ? options.stream().map(ContractType::valueOf).toList() : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "CollectiveBargainingAgreementType" -> SelectionField.<CollectiveBargainingAgreementType>builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null && !value.isEmpty() ? CollectiveBargainingAgreementType.valueOf(value) : null)
                    .options(options != null ? options.stream().map(CollectiveBargainingAgreementType::valueOf).toList() : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            case "SendingMethod" -> SelectionField.<SendingMethod>builder()
                    .id(fieldId)
                    .label(label)
                    .value(value != null ? SendingMethod.valueOf(value) : null)
                    .options(options != null ? options.stream().map(SendingMethod::valueOf).toList() : null)
                    .source(fieldSource)
                    .businessRule(rule)
                    .expectedFormat(format)
                    .validation(fieldValidation)
                    .build();
            default -> throw new IllegalArgumentException("Unknown selection type: " + selectionType);
        };
    }

    public static FieldDto fromDomain(Field field) {
        if (field instanceof DateField dateField) {
            return FieldDto.builder()
                    .fieldType("DATE")
                    .id(dateField.id().value())
                    .label(dateField.label())
                    .value(dateField.value() != null ? dateField.value().toString() : null)
                    .source(dateField.source() != null ? dateField.source().name() : null)
                    .businessRule(dateField.businessRule() != null ? dateField.businessRule().explanation() : null)
                    .expectedFormat(dateField.expectedFormat() != null ? dateField.expectedFormat().example() : null)
                    .validation(FieldValidationDto.fromDomain(dateField.validation()))
                    .build();
        }
        if (field instanceof AmountField amountField) {
            return FieldDto.builder()
                    .fieldType("AMOUNT")
                    .id(amountField.id().value())
                    .label(amountField.label())
                    .value(amountField.value() != null ? amountField.value().toPlainString() : null)
                    .source(amountField.source() != null ? amountField.source().name() : null)
                    .businessRule(amountField.businessRule() != null ? amountField.businessRule().explanation() : null)
                    .expectedFormat(amountField.expectedFormat() != null ? amountField.expectedFormat().example() : null)
                    .validation(FieldValidationDto.fromDomain(amountField.validation()))
                    .build();
        }
        if (field instanceof NumberField numberField) {
            return FieldDto.builder()
                    .fieldType("NUMBER")
                    .id(numberField.id().value())
                    .label(numberField.label())
                    .value(numberField.value() != null ? numberField.value().toString() : null)
                    .source(numberField.source() != null ? numberField.source().name() : null)
                    .businessRule(numberField.businessRule() != null ? numberField.businessRule().explanation() : null)
                    .expectedFormat(numberField.expectedFormat() != null ? numberField.expectedFormat().example() : null)
                    .validation(FieldValidationDto.fromDomain(numberField.validation()))
                    .build();
        }
        if (field instanceof BooleanField booleanField) {
            return FieldDto.builder()
                    .fieldType("BOOLEAN")
                    .id(booleanField.id().value())
                    .label(booleanField.label())
                    .value(booleanField.value() != null ? booleanField.value().toString() : null)
                    .source(booleanField.source() != null ? booleanField.source().name() : null)
                    .businessRule(booleanField.businessRule() != null ? booleanField.businessRule().explanation() : null)
                    .expectedFormat(booleanField.expectedFormat() != null ? booleanField.expectedFormat().example() : null)
                    .validation(FieldValidationDto.fromDomain(booleanField.validation()))
                    .build();
        }
        if (field instanceof SelectionField<?> selectionField) {
            String selectionType = determineSelectionType(selectionField);
            List<String> optionValues = selectionField.options() != null
                    ? selectionField.options().stream()
                    .filter(Enum.class::isInstance)
                    .map(opt -> ((Enum<?>) opt).name())
                    .toList()
                    : null;
            String value = selectionField.value() instanceof Enum<?> enumValue ? enumValue.name() : null;

            return FieldDto.builder()
                    .fieldType("SELECTION")
                    .selectionType(selectionType)
                    .id(selectionField.id().value())
                    .label(selectionField.label())
                    .value(value)
                    .options(optionValues)
                    .source(selectionField.source() != null ? selectionField.source().name() : null)
                    .businessRule(selectionField.businessRule() != null ? selectionField.businessRule().explanation() : null)
                    .expectedFormat(selectionField.expectedFormat() != null ? selectionField.expectedFormat().example() : null)
                    .validation(FieldValidationDto.fromDomain(selectionField.validation()))
                    .build();
        }
        throw new IllegalArgumentException("Unsupported field type: " + field.getClass().getSimpleName());
    }

    private static String determineSelectionType(SelectionField<?> selectionField) {
        if (selectionField.value() instanceof Enum<?> enumValue) {
            return enumValue.getClass().getSimpleName();
        }
        if (selectionField.options() != null && !selectionField.options().isEmpty()) {
            Object first = selectionField.options().get(0);
            if (first instanceof Enum<?> enumValue) {
                return enumValue.getClass().getSimpleName();
            }
        }
        return null;
    }
}
