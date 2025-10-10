package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSiret;

import java.util.Objects;

public record Siret(String value) {

    private static final String SIRET_PATTERN = "^\\d{14}$";

    public Siret {
        if (Objects.isNull(value)) {
            throw new InvalidSiret("Le SIRET ne peut pas être vide.");
        }
        if (!value.matches(SIRET_PATTERN)) {
            throw new InvalidSiret("Le SIRET doit contenir exactement 14 chiffres.");
        }
    }
}