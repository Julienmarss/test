package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidSocialSecurityNumber extends ValidationError {

    public InvalidSocialSecurityNumber(String message) {
        super(message);
    }

}
