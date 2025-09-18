package com.legipilot.service.shared.domain.error;

public class TechnicalError extends RuntimeException {

    public TechnicalError(String message) {
        super(message);
    }

}
