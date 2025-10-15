package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.error.AdministratorNotFound;
import com.legipilot.service.core.administrator.domain.error.InvitationErrors.*;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcceptInvitationUseCase {

    private final InvitationRepository invitationRepository;
    private final AdministratorRepository administratorRepository;
    private final CompanyAdministratorRepository companyAdminRepository;

    @Transactional
    public void execute(UUID token, String email) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(InvitationNotFoundError::new);

        if (!invitation.email().equalsIgnoreCase(email)) {
            throw new CannotAcceptInvitationError();
        }

        if (!invitation.isPending()) {
            throw new ExpiredInvitationError();
        }

        Administrator administrator = administratorRepository.findByEmail(email)
                .orElseThrow(() -> new AdministratorNotFound(email));

        companyAdminRepository.addAdministratorToCompany(
                invitation.companyId(),
                administrator.id(),
                invitation.rights()
        );
        invitation.accept();
        invitationRepository.save(invitation);
    }
}