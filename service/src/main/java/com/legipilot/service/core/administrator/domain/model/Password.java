package com.legipilot.service.core.administrator.domain.model;

import com.legipilot.service.core.administrator.domain.error.InvalidPassword;

import java.util.regex.Pattern;

public record Password(String value, String encodedValue) {

    private static final Pattern MOT_DE_PASSE_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");

    public Password {
        if (!MOT_DE_PASSE_PATTERN.matcher(value).matches()) {
            throw new InvalidPassword();
        }
    }
}