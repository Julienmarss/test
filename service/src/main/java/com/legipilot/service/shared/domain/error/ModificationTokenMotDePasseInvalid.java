package com.legipilot.service.shared.domain.error;

public class ModificationTokenMotDePasseInvalid extends NotAllowed {
    public ModificationTokenMotDePasseInvalid() {
        super("modifier ce mot de passe, le jeton est invalide ou a expiré");
    }
}
