package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.Arrays;

public enum ContractType {
    CDI("Contrat à durée indéterminée"),
    CDD("Contrat à durée déterminée"),
    APP("Contrat d'apprentissage"),
    PRO("Contrat de professionnalisation"),
    STA("Convention de stage"),
    CTT("Contrat de travail temporaire"),
    CTI("Contrat de travail intermittent"),
    CUI("Contrat unique d'insertion");

    private final String label;

    ContractType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static ContractType fromLabel(String label) {
        return Arrays.stream(ContractType.values())
                .filter(e -> e.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No ContractType found for label: " + label));
    }
}
