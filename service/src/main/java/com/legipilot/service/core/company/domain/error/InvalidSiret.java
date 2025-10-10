package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidSiret extends ValidationError {

    public InvalidSiret(String message) {
        super(message);
    }
}