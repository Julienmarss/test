package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

/**
 * Represents a business rule or decision aid for a field
 * Example: "Include bonuses according to applicable rules"
 */
public record BusinessRule(String explanation) {
    public static BusinessRule of(String explanation) {
        return new BusinessRule(explanation);
    }
}
