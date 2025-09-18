package com.legipilot.service.shared.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;

import java.util.List;
import java.util.UUID;

public interface EmailPort {

    void sendVerificationEmail(Administrator admin, UUID token);

    void sendCollaboratorsImported(Administrator admin, List<Collaborator> collaborators);

    void sendCollaboratorsImportFailed(Administrator admin);

    void sendResetPasswordEmail(String email, ReinitialisationToken token);

    void sendRequestFillProfilInvitationEmail(Collaborator collaborator);
}
