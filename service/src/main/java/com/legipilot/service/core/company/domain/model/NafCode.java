package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidNafCode;

import java.util.Objects;

public record NafCode(String value) {

    private static final String CODE_APE_PATTERN = "^\\d{2}\\.\\d{2}[A-Z]$";

    public NafCode {
        if (Objects.isNull(value)) {
            throw new InvalidNafCode();
        }
        if (!value.matches(CODE_APE_PATTERN)) {
            throw new InvalidNafCode();
        }
    }
}