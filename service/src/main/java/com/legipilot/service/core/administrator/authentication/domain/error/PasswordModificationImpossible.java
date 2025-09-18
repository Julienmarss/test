package com.legipilot.service.core.administrator.authentication.domain.error;

import com.legipilot.service.shared.domain.error.TechnicalError;

public class PasswordModificationImpossible extends TechnicalError {
    public PasswordModificationImpossible() {
        super("Désolé, nous n'avons pas réussi à modifier votre mot de passe.");
    }
}
