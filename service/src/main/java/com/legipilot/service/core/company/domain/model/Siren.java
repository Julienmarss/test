package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSiren;

import java.util.Objects;

public record Siren(String value) {

    private static final String SIREN_PATTERN = "^\\d{9}$";

    public Siren {
        if (Objects.isNull(value)) {
            throw new InvalidSiren("Le SIREN ne peut pas être vide.");
        }
        if (!value.matches(SIREN_PATTERN)) {
            throw new InvalidSiren("Le SIREN doit contenir exactement 9 chiffres.");
        }
    }

    public static Siren aPartirDe(Siret siret) {
        return new Siren(siret.value().substring(0, 9));
    }
}