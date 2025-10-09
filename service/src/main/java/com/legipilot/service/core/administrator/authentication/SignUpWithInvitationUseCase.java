package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
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
public class SignUpWithInvitationUseCase {

    private final AdministratorRepository repository;
    private final ValidationRepository validationRepository;
    private final InvitationRepository invitationRepository;
    private final AcceptInvitationUseCase acceptInvitationUseCase;
    private final EmailPort emailPort;

    @Transactional
    public Administrator execute(SignUp command, Optional<UUID> invitationToken) {
        log.info("Inscription avec invitation pour l'email {}", command.email());

        Administrator administrator = Administrator.signup(command);
        Administrator savedAdmin = repository.save(administrator);

        if (invitationToken.isPresent()) {
            Optional<Invitation> invitation = invitationRepository.findByToken(invitationToken.get());

            if (invitation.isEmpty()) {
                log.warn("Token d'invitation invalide: {}", invitationToken.get());
                throw new NotAllowed("Token d'invitation invalide ou expiré");
            }

            Invitation inv = invitation.get();

            if (!inv.isPending()) {
                log.warn("L'invitation n'est plus valide. Statut: {}", inv.status());
                throw new NotAllowed("Cette invitation n'est plus valide");
            }

            if (!inv.email().equalsIgnoreCase(command.email())) {
                log.warn("Email ne correspond pas à l'invitation. Attendu: {}, Reçu: {}",
                        inv.email(), command.email());
                throw new NotAllowed("L'email ne correspond pas à celui de l'invitation");
            }

            if (inv.rights().isOwner()) {
                log.error("Tentative d'acceptation d'une invitation OWNER pour {}", command.email());
                throw new NotAllowed("Les invitations ne peuvent pas créer de propriétaire");
            }

            log.info("Acceptation de l'invitation {} pour rejoindre l'entreprise {}",
                    inv.token(), inv.companyId());

            acceptInvitationUseCase.execute(invitationToken.get(), command.email());

            UUID validationToken = validationRepository.createToken(savedAdmin);
            emailPort.sendVerificationEmail(savedAdmin, validationToken);

            log.info("Administrateur {} inscrit avec succès et ajouté à l'entreprise {}",
                    savedAdmin.id(), inv.companyId());

            return repository.get(savedAdmin.id());
        }

        log.error("Tentative d'inscription sans token d'invitation");
        throw new NotAllowed("L'inscription nécessite un token d'invitation valide");
    }
}