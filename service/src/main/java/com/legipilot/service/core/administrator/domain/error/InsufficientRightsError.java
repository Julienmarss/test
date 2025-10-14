package com.legipilot.service.core.administrator.domain.error;

import com.legipilot.service.shared.domain.error.NotAllowed;

public class InsufficientRightsError extends NotAllowed {

    public InsufficientRightsError(String action) {
        super(action);
    }

    public static InsufficientRightsError forInviting() {
        return new InsufficientRightsError("inviter des administrateurs");
    }

    public static InsufficientRightsError forManaging() {
        return new InsufficientRightsError("gérer les administrateurs");
    }

    public static InsufficientRightsError forUpdatingRights() {
        return new InsufficientRightsError("modifier les droits. Seul le propriétaire peut modifier les droits");
    }

    public static InsufficientRightsError forRemovingAdministrator() {
        return new InsufficientRightsError("supprimer des administrateurs. Seul le propriétaire peut supprimer des administrateurs");
    }

    public static InsufficientRightsError forDeletingInvitation() {
        return new InsufficientRightsError("supprimer des invitations");
    }

    public static InsufficientRightsError forAddingAdministrator() {
        return new InsufficientRightsError("ajouter des administrateurs");
    }
}