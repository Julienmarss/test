package com.legipilot.service.core.company.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class InvalidCompanyId extends ValidationError {

    public InvalidCompanyId() {
        super("L'identifiant de l'entreprise ne peut être vide.");
    }

}
