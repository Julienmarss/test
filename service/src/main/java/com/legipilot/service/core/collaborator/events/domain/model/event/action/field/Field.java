package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

/**
 * Base interface for all fields in an HR event
 */
public interface Field {
    FieldId id();
    String label();
    FieldSource source();
    BusinessRule businessRule();
    ExpectedFormat expectedFormat();
    FieldValidation validation();
}
