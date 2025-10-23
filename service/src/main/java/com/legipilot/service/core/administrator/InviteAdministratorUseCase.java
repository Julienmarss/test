package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.command.InviteAdministrator;
import com.legipilot.service.core.administrator.domain.error.InsufficientRightsError;
import com.legipilot.service.core.administrator.domain.error.InvitationErrors;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.EmailPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InviteAdministratorUseCase {

    private final AdministratorRepository administratorRepository;
    private final InvitationRepository invitationRepository;
    private final CompanyAdministratorRepository companyAdminRepository;
    private final CompanyRepository companyRepository;
    private final EmailPort emailPort;

    @Transactional
    public Invitation execute(InviteAdministrator command, UUID currentUserId) {

        if (!companyAdminRepository.findRightByAdministratorAndCompany(currentUserId, command.companyId())
                .map(right -> right.hasPermission(CompanyRight.MANAGER))
                .orElse(false)) {
            throw InsufficientRightsError.forInviting();
        }

        Optional<Invitation> existingInvitation = invitationRepository
                .findByEmailAndCompanyId(command.email(), command.companyId());

        if (existingInvitation.isPresent() && existingInvitation.get().isPending()) {
            throw new InvitationErrors.InvitationAlreadyPendingError();
        }

        Optional<Administrator> existingAdmin = administratorRepository.findByEmail(command.email());
        Company company = companyRepository.get(command.companyId());

        Invitation invitation = Invitation.create(
                command.email(),
                command.rights(),
                command.companyId(),
                currentUserId
        );

        invitation = invitationRepository.save(invitation);

        if (existingAdmin.isPresent()) {
            Administrator admin = existingAdmin.get();

            Optional<CompanyRight> existingRight = companyAdminRepository
                    .findRightByAdministratorAndCompany(admin.id(), command.companyId());

            if (existingRight.isPresent()) {
                throw new InvitationErrors.AdministratorAlreadyInCompanyError();
            }

            companyAdminRepository.addAdministratorToCompany(
                    command.companyId(),
                    admin.id(),
                    command.rights()
            );
            invitation.accept();
            invitationRepository.save(invitation);
            emailPort.sendAdministratorAddedToCompanyEmail(admin, company, command.rights());
        }
        else {
            emailPort.sendAdministratorInvitationEmail(
                    command.email(),
                    company,
                    invitation.token(),
                    command.rights()
            );
        }
        return invitation;
    }
}