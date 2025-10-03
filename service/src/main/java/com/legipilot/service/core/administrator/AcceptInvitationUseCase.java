package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.shared.domain.error.NotAllowed;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
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
        log.info("Acceptation de l'invitation avec token {} pour email {}", token, email);

        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new RessourceNotFound("Invitation non trouvée"));

        if (!invitation.email().equalsIgnoreCase(email)) {
            throw new NotAllowed("accepter cette invitation");
        }

        if (!invitation.isPending()) {
            throw new IllegalArgumentException("Cette invitation n'est plus valide");
        }

        Administrator administrator = administratorRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNotFound("Administrateur non trouvé"));

        companyAdminRepository.addAdministratorToCompany(
                invitation.companyId(),
                administrator.id(),
                invitation.rights()
        );
        invitation.accept();
        invitationRepository.save(invitation);

        log.info("Invitation acceptée avec succès pour {} dans l'entreprise {}",
                email, invitation.companyId());
    }
}