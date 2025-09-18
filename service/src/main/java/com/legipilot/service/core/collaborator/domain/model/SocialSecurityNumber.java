package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSocialSecurityNumber;

public record SocialSecurityNumber(String value) {

    public SocialSecurityNumber {
        if (value == null) {
            throw new InvalidSocialSecurityNumber("Le numéro de sécurité sociale ne peut pas être vide.");
        }

        String cleaned = value
                .trim()
                .replaceAll("[^0-9]", "")
                .replaceAll(" ", "");

        if (cleaned.length() != 15) {
            throw new InvalidSocialSecurityNumber("Le numéro de sécurité sociale doit contenir exactement 15 chiffres.");
        }

        if (!cleaned.matches("\\d{15}")) {
            throw new InvalidSocialSecurityNumber("Le numéro de sécurité sociale ne doit contenir que des chiffres.");
        }

        if (!cleaned.startsWith("1") && !cleaned.startsWith("2")) {
            throw new InvalidSocialSecurityNumber("Le numéro de sécurité sociale doit commencer par 1 (Homme) ou 2 (Femme).");
        }
    }
}

