package com.legipilot.service.core.collaborator.events.domain.model.event.action;

import java.util.Arrays;

public enum ActionState {
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed");

    private final String label;

    ActionState(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static ActionState fromLabel(String label) {
        return Arrays.stream(ActionState.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No ActionState found for label: " + label));
    }
}
