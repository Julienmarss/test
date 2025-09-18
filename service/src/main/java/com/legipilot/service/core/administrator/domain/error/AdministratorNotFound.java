package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.RessourceNotFound;

public class AdministratorNotFound extends RessourceNotFound {

    public AdministratorNotFound(String email) {
        super("Administrateur avec email '%s' non trouvé.".formatted(email));
    }

}
