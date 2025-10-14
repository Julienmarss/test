package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;

import java.util.UUID;

public class RepositoryErrors {

    public static class InvalidValidationTokenError extends NotAllowed {
        public InvalidValidationTokenError() {
            super(", votre token n'est pas correct");
        }
    }

    public static class AdministratorNotFoundInCompanyError extends NotAllowed {
        public AdministratorNotFoundInCompanyError() {
            super("Administrateur non trouvé dans cette entreprise");
        }
    }

    public static class CompanyNotFoundError extends com.legipilot.service.shared.domain.error.RessourceNotFound {
        public CompanyNotFoundError() {
            super("Entreprise non trouvée");
        }

        public CompanyNotFoundError(UUID companyId) {
            super("Entreprise avec l'ID '" + companyId + "' non trouvée");
        }
    }
}