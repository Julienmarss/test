package com.legipilot.service.shared.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;

import java.util.List;
import java.util.UUID;

public interface EmailPort {

    void sendVerificationEmail(Administrator admin, UUID token);

    void sendCollaboratorsImported(Administrator admin, List<Collaborator> collaborators);

    void sendCollaboratorsImportFailed(Administrator admin);

    void sendOnboarding(Administrator admin);

    void sendResetPasswordEmail(String email, ReinitialisationToken token);

    void sendRequestFillProfilInvitationEmail(Collaborator collaborator);

    void sendAdministratorAddedToCompanyEmail(Administrator admin, Company company, CompanyRight rights);

    void sendAdministratorInvitationEmail(String email, Company company, UUID token, CompanyRight rights);
}
