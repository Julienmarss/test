package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;

public class AdministratorRightsErrors {

    public static class CannotModifyOtherProfileError extends NotAllowed {
        public CannotModifyOtherProfileError() {
            super("Vous ne pouvez modifier que votre propre profil");
        }
    }

    public static class CannotDeleteOtherAccountError extends NotAllowed {
        public CannotDeleteOtherAccountError() {
            super("Vous ne pouvez pas supprimer le compte d'un autre utilisateur");
        }
    }

    public static class CannotDeleteAccountAsOwnerError extends NotAllowed {
        public CannotDeleteAccountAsOwnerError() {
            super("Impossible de supprimer votre compte car vous êtes propriétaire d'une ou plusieurs entreprises. Veuillez d'abord transférer la propriété");
        }
    }

    public static class CannotRemoveSelfFromCompanyError extends NotAllowed {
        public CannotRemoveSelfFromCompanyError() {
            super("Vous ne pouvez pas vous retirer vous-même de l'entreprise");
        }
    }

    public static class CannotModifyOwnRightsError extends NotAllowed {
        public CannotModifyOwnRightsError() {
            super("Vous ne pouvez pas modifier vos propres droits");
        }
    }

    public static class OnlyOwnerCanModifyCompanyError extends NotAllowed {
        public OnlyOwnerCanModifyCompanyError() {
            super("Seuls les propriétaires peuvent modifier les informations de l'entreprise");
        }
    }
}