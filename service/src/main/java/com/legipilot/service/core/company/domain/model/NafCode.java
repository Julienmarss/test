package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidNafCode;

import java.util.Objects;

public record NafCode(String value) {

    private static final String CODE_APE_PATTERN = "^\\d{2}\\.\\d{2}[A-Z]$";
    private static final String CODE_APE_PATTERN_ALT = "^\\d{4}[A-Z]$";

    public NafCode {
        if (Objects.isNull(value)) {
            throw new InvalidNafCode("Le code NAF ne peut pas être vide.");
        }
        if (!value.matches(CODE_APE_PATTERN) && !value.matches(CODE_APE_PATTERN_ALT)) {
            throw new InvalidNafCode("Le code NAF doit être au format XX.XXX ou XXXXX (ex: 62.01Z ou 6201Z).");
        }
    }
}