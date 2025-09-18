package com.legipilot.service.core.collaborator.domain.model;

import java.util.Arrays;
import java.util.Optional;

public enum SocioProfessionalCategory {
    OUVRIER("Ouvrier"),
    EMPLOYE("Employé"),
    TECHNICIEN("Technicien"),
    AGENT_DE_MAITRISE("Agent de maîtrise"),
    CADRE("Cadre");

    private final String label;

    SocioProfessionalCategory(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static Optional<SocioProfessionalCategory> fromLabel(String label) {
        return Arrays.stream(values())
                .filter(c -> c.label.equalsIgnoreCase(label))
                .findFirst();
    }
}
