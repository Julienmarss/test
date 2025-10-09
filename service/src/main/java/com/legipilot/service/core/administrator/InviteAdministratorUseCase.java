package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.command.InviteAdministrator;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.error.NotAllowed;
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
        log.info("Invitation d'un administrateur {} pour la company {} par user {}",
                command.email(), command.companyId(), currentUserId);

        Optional<CompanyRight> currentUserRight = companyAdminRepository
                .findRightByAdministratorAndCompany(currentUserId, command.companyId());

        if (currentUserRight.isEmpty() || !currentUserRight.get().hasPermission(CompanyRight.MANAGER)) {
            throw new NotAllowed("inviter des administrateurs");
        }

        if (command.rights().isOwner() && !currentUserRight.get().isOwner()) {
            log.error("Tentative d'invitation OWNER non autorisée pour {} par {}",
                    command.email(), currentUserId);
            throw new NotAllowed("Seuls les propriétaires peuvent inviter un autre propriétaire");
        }

        if (!command.rights().isOwner()
                && !command.rights().isManager()
                && !command.rights().isReadOnly()) {
            log.error("Tentative d'invitation avec un rôle invalide {} pour {}",
                    command.rights(), command.email());
            throw new NotAllowed("Les droits autorisés sont uniquement Propriétaire, Responsable ou Observateur");
        }

        Optional<Invitation> existingInvitation = invitationRepository
                .findByEmailAndCompanyId(command.email(), command.companyId());

        if (existingInvitation.isPresent() && existingInvitation.get().isPending()) {
            log.warn("Une invitation est déjà en cours pour {} dans l'entreprise {}",
                    command.email(), command.companyId());
            throw new IllegalArgumentException("Une invitation est déjà en cours pour cet email");
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
        log.info("Invitation créée avec l'ID {} et le token {}", invitation.id(), invitation.token());

        if (existingAdmin.isPresent()) {
            Administrator admin = existingAdmin.get();
            log.info("Utilisateur {} trouvé en base avec l'ID {}", command.email(), admin.id());

            Optional<CompanyRight> existingRight = companyAdminRepository
                    .findRightByAdministratorAndCompany(admin.id(), command.companyId());

            if (existingRight.isPresent()) {
                log.warn("L'administrateur {} fait déjà partie de l'entreprise {} avec les droits {}",
                        admin.id(), command.companyId(), existingRight.get());
                throw new IllegalArgumentException("Cet administrateur fait déjà partie de cette entreprise");
            }

            companyAdminRepository.addAdministratorToCompany(
                    command.companyId(),
                    admin.id(),
                    command.rights()
            );
            log.info("Administrateur {} ajouté à l'entreprise {} avec les droits {}",
                    admin.id(), command.companyId(), command.rights());

            invitation.accept();
            invitationRepository.save(invitation);
            log.info("Invitation {} marquée comme acceptée", invitation.id());

            emailPort.sendAdministratorAddedToCompanyEmail(admin, company, command.rights());
            log.info("Email de notification envoyé à {} pour l'ajout à l'entreprise {}",
                    admin.email(), company.name());

            log.info("Administrateur existant {} ajouté avec succès à l'entreprise {}",
                    admin.id(), command.companyId());
        }
        else {
            log.info("Utilisateur {} non trouvé en base, envoi d'une invitation", command.email());

            emailPort.sendAdministratorInvitationEmail(
                    command.email(),
                    company,
                    invitation.token(),
                    command.rights()
            );
            log.info("Email d'invitation envoyé à {} pour rejoindre l'entreprise {} avec token {}",
                    command.email(), company.name(), invitation.token());

            log.info("Invitation envoyée avec succès à {} pour rejoindre l'entreprise {}",
                    command.email(), command.companyId());
        }

        return invitation;
    }
}