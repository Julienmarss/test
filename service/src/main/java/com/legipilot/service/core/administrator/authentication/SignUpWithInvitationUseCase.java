package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.administrator.domain.error.InvitationErrors.*;
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
public class SignUpWithInvitationUseCase {

    private final AdministratorRepository repository;
    private final ValidationRepository validationRepository;
    private final InvitationRepository invitationRepository;
    private final AcceptInvitationUseCase acceptInvitationUseCase;
    private final EmailPort emailPort;

    @Transactional
    public Administrator execute(SignUp command, Optional<UUID> invitationToken) {
        Administrator administrator = Administrator.signup(command);
        Administrator savedAdmin = repository.save(administrator);

        if (invitationToken.isEmpty()) {
            throw new InvitationRequiredError();
        }

        Invitation invitation = invitationRepository.findByToken(invitationToken.get())
                .orElseThrow(InvalidInvitationTokenError::new);

        if (!invitation.isPending()) {
            throw new ExpiredInvitationError();
        }

        if (!invitation.email().equalsIgnoreCase(command.email())) {
            throw new InvitationEmailMismatchError();
        }

        if (invitation.rights().isOwner()) {
            throw new CannotInviteOwnerError();
        }

        acceptInvitationUseCase.execute(invitationToken.get(), command.email());
        UUID validationToken = validationRepository.createToken(savedAdmin);
        emailPort.sendVerificationEmail(savedAdmin, validationToken);
        return repository.get(savedAdmin.id());
    }
}