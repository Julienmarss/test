package com.legipilot.service.core.collaborator.documents.domain;

import java.util.Arrays;

public enum DocumentType {
    CONTRACTS_AND_ADDENDUMS("Contrats et avenants"),
    ADMINISTRATIVE("Administratif"),
    OTHER("Autres");

    private final String label;

    public String label() {
        return label;
    }

    DocumentType(String label) {
        this.label = label;
    }

    public static DocumentType fromLabel(String label) {
        return Arrays.stream(DocumentType.values())
                .filter(f -> f.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Aucun type de document trouvé pour le label : " + label));
    }
}
