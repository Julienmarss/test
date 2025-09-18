package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.authentication.domain.command.ForgottenPassword;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.ReinitialisationTokenRepository;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordForgottenUseCase {
    private static final Logger log = LoggerFactory.getLogger(PasswordForgottenUseCase.class);

    private final ReinitialisationTokenRepository reinitialisationTokenRepository;
    private final AdministratorRepository repository;
    private final EmailPort emailPort;

    public void execute(ForgottenPassword commande) {
        if (checkUserExistence(commande)) return;
        ReinitialisationToken token = reinitialisationTokenRepository.generateToken(commande.email());
        emailPort.sendResetPasswordEmail(commande.email(), token);
    }

    private boolean checkUserExistence(ForgottenPassword commande) {
        try {
            repository.get(commande.email());
        } catch (Exception e) {
            return true;
        }
        return false;
    }
}