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

    private static boolean isValidSiretChecksum(String siret) {
        int sum = 0;

        for (int i = 0; i < 14; i++) {
            int digit = Character.getNumericValue(siret.charAt(i));

            if (i % 2 == 1) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }

        return sum % 10 == 0;
    }
}