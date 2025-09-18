package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidPassword extends ValidationError {

    public InvalidPassword() {
        super("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
    }

}
