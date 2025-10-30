package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.Arrays;

public enum ExportOption {
    DOWNLOAD("Télécharger"),
    LRAR("Lettre recommandée avec accusé de réception"),
    /**
     * Represents a traditional postal mail dispatch (snail mail).
     */
    MAIL("Courrier postal"),
    ESIGN("Signature électronique");

    private final String label;

    ExportOption(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static ExportOption fromLabel(String label) {
        return Arrays.stream(ExportOption.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No ExportOption found for label: " + label));
    }
}
