package com.legipilot.service.core.collaborator.events.domain.model.event;


import java.util.Arrays;

public enum CollectiveBargainingAgreementType {
    SYNTEC("Syntec"),
    OTHER("Other / No collective agreement");

    private final String label;

    CollectiveBargainingAgreementType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    /*public static CollectiveBargainingAgreementType fromLabel(String label) {
        return Arrays.stream(CollectiveBargainingAgreementType.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No CollectiveBargainingAgreementType found for label: " + label));
    }*/
}
