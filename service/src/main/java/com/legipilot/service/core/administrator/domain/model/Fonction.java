package com.legipilot.service.core.administrator.domain.model;

import lombok.Getter;

import java.util.Arrays;

public enum Fonction {
    DIRIGEANT("Dirigeant"),
    RH("RH"),
    JURIDIQUE("Juridique"),
    COMPTABILITE("Comptabilité"),
    EXPERT_COMPTABLE("Expert-comptable"),
    RH_EXTERNE("RH Externe");

    private final String label;

    Fonction(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static Fonction fromLabel(String label) {
        return Arrays.stream(Fonction.values())
                .filter(f -> f.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Aucune fonction trouvée pour le label : " + label));
    }
}
