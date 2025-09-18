package com.legipilot.service.core.collaborator.domain.model;

public enum ContractType {
    CDI("Contrat à durée indéterminée"),
    CDD("Contrat à durée déterminée"),
    APP("Contrat d’apprentissage"),
    PRO("Contrat de professionnalisation"),
    STA("Convention de stage"),
    CTT("Contrat de travail temporaire"),
    CTI("Contrat de travail intermittent"),
    CUI("Contrat unique d'insertion"),
    EXT("Externe");

    private final String label;

    ContractType(String label) {
        this.label = label;
    }

}
