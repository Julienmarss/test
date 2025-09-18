package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;

public class IncorrectPassword extends NotAllowed {

    public IncorrectPassword() {
        super("Le mot de passe saisi est incorrect.");
    }

}
