package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidNafCode extends ValidationError {

    public InvalidNafCode() {
        super("Désolé, le code NAF que vous avez fourni est invalide.");
    }

}
