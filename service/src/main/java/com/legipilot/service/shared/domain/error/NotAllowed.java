package com.legipilot.service.shared.domain.error;

public class NotAllowed extends RuntimeException {

    public NotAllowed(String action) {
        super("Désolé, vous n'avez pas les droits pour %s.".formatted(action));
    }

}
