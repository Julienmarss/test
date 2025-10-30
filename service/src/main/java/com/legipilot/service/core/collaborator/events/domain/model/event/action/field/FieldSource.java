package com.legipilot.service.core.collaborator.events.domain.model.event.action.field;

import java.util.Arrays;

public enum FieldSource {
    MANUAL_INPUT("Manual input"),
    AUTOMATICALLY_CALCULATED("Automatically calculated"),
    PREFILLED_FROM_EMPLOYEE_FILE("Prefilled from employee file"),
    PREFILLED_FROM_CONTRACT("Prefilled from contract");

    private final String label;

    FieldSource(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static FieldSource fromLabel(String label) {
        return Arrays.stream(FieldSource.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No FieldSource found for label: " + label));
    }
}
