package com.legipilot.service.core.administrator.authentication.infra.in.response;

public record ReinitialisationMotDePasseResponse(String message) {
    public static ReinitialisationMotDePasseResponse demandeEnvoyee() {
        return new ReinitialisationMotDePasseResponse("Si l'email existe, un lien de réinitialisation a été envoyé.");
    }

    public static ReinitialisationMotDePasseResponse motDePasseReinitialise() {
        return new ReinitialisationMotDePasseResponse("Mot de passe mis à jour avec succès.");
    }
} 