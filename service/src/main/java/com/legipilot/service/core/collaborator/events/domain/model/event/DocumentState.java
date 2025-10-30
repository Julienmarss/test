package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.Arrays;

public enum DocumentState {
    NOT_GENERATED("Not generated"),
    GENERATED("Generated"),
    PROCESSED("Processed");

    private final String label;

    DocumentState(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static DocumentState fromLabel(String label) {
        return Arrays.stream(DocumentState.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No DocumentState found for label: " + label));
    }
}
