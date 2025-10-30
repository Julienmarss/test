package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

/**
 * Represents an example of expected format or value for a field
 * Example: "DD/MM/YYYY", "e.g. 2,450.00 €"
 */
public record ExpectedFormat(String example) {
    public static ExpectedFormat of(String example) {
        return new ExpectedFormat(example);
    }
}
