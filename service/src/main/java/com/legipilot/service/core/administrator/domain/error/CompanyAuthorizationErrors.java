package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;

/**
 * Erreurs liées à l'autorisation sur les entreprises.
 * Encapsule toutes les exceptions levées par le CompanyAuthorizationService.
 */
public class CompanyAuthorizationErrors {

    /**
     * Erreur levée quand un administrateur n'est pas membre d'une entreprise.
     */
    public static class NotCompanyMemberError extends NotAllowed {
        public NotCompanyMemberError() {
            super("accéder à cette entreprise - Vous n'êtes pas membre de cette entreprise");
        }
    }

    /**
     * Erreur levée quand un administrateur n'a pas les droits suffisants pour effectuer une action.
     */
    public static class InsufficientRightsError extends NotAllowed {
        public InsufficientRightsError(String requiredRight) {
            super(String.format("effectuer cette action - Droit requis: %s", requiredRight));
        }
    }

    /**
     * Erreur levée quand un non-propriétaire tente d'attribuer le rôle OWNER.
     */
    public static class CannotGrantOwnerRightsError extends NotAllowed {
        public CannotGrantOwnerRightsError() {
            super("attribuer le rôle de propriétaire - Seul un propriétaire peut accorder ce droit");
        }
    }
}