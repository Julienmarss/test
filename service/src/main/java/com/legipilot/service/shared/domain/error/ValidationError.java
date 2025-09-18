package com.legipilot.service.shared.domain.error;

public class ValidationError extends RuntimeException {

    public ValidationError(String message) {
        super(message);
    }

}
