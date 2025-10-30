package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.Arrays;

public enum SendingMethod {
    REGISTERED_MAIL("Registered mail with acknowledgment of receipt"),
    HAND_DELIVERY("Hand delivery");

    private final String label;

    SendingMethod(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static SendingMethod fromLabel(String label) {
        return Arrays.stream(SendingMethod.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No SendingMethod found for label: " + label));
    }
}
