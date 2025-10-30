package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import com.legipilot.service.shared.domain.error.ValidationError;

public class InvitationErrors {

    public static class InvitationAlreadyPendingError extends ValidationError {
        public InvitationAlreadyPendingError() {
            super("Une invitation est déjà en cours pour cet email");
        }
    }

    public static class AdministratorAlreadyInCompanyError extends ValidationError {
        public AdministratorAlreadyInCompanyError() {
            super("Cet administrateur fait déjà partie de cette entreprise");
        }
    }

    public static class InvalidInvitationTokenError extends NotAllowed {
        public InvalidInvitationTokenError() {
            super("Token d'invitation invalide ou expiré");
        }
    }

    public static class ExpiredInvitationError extends NotAllowed {
        public ExpiredInvitationError() {
            super("Cette invitation n'est plus valide");
        }
    }

    public static class InvitationEmailMismatchError extends NotAllowed {
        public InvitationEmailMismatchError() {
            super("L'email ne correspond pas à celui de l'invitation");
        }
    }

    public static class CannotInviteOwnerError extends NotAllowed {
        public CannotInviteOwnerError() {
            super("inviter un propriétaire. Seul un propriétaire peut ajouter un autre propriétaire");
        }
    }

    public static class InvitationNotFoundError extends RessourceNotFound {
        public InvitationNotFoundError() {
            super("Invitation non trouvée");
        }
    }

    public static class InvitationCompanyMismatchError extends NotAllowed {
        public InvitationCompanyMismatchError() {
            super("Cette invitation n'appartient pas à cette entreprise");
        }
    }

    public static class InvitationRequiredError extends NotAllowed {
        public InvitationRequiredError() {
            super("L'inscription nécessite un token d'invitation valide");
        }
    }

    public static class CannotAcceptInvitationError extends NotAllowed {
        public CannotAcceptInvitationError() {
            super("accepter cette invitation");
        }
    }
}