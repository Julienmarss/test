package com.legipilot.service.core.collaborator.domain.error;

import com.legipilot.service.shared.domain.error.ValidationError;

public class CollaboratorIdInvalid extends ValidationError {

    public CollaboratorIdInvalid() {
        super("Le collaborateur fournit est invalide.");
    }

}
