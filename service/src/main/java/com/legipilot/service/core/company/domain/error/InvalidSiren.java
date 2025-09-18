package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidSiren extends ValidationError {

    public InvalidSiren() {
        super("Désolé, le SIREN que vous avez fourni est invalide, il doit contenir exactement 9 chiffres.");
    }

}
