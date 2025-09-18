package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidSiret extends ValidationError {

    public InvalidSiret() {
        super("Désolé, le SIRET que vous avez fourni est invalide, il doit contenir exactement 14 chiffres.");
    }

}
