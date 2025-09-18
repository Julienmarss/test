package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSiren;

import java.util.Objects;

public record Siren(String value) {

    private static final String SIREN_PATTERN = "^\\d{9}$";

    public Siren {
        if (Objects.isNull(value)) {
            throw new InvalidSiren();
        }
        if (!value.matches(SIREN_PATTERN)) {
            throw new InvalidSiren();
        }
    }

    public static Siren aPartirDe(Siret siret) {
        return new Siren(siret.value().substring(0, 9));
    }
}