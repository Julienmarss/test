package com.legipilot.service.shared.domain.error;

public class RessourceNotFound extends RuntimeException {

    public RessourceNotFound(String message) {
        super(message);
    }

}
