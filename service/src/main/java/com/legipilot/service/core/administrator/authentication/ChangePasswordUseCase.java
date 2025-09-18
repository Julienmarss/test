package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.authentication.domain.command.ChangePassword;
import com.legipilot.service.core.administrator.authentication.domain.error.PasswordModificationImpossible;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.shared.domain.ReinitialisationTokenRepository;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChangePasswordUseCase {
    private static final Logger log = LoggerFactory.getLogger(ChangePasswordUseCase.class);

    private final ReinitialisationTokenRepository reinitialisationTokenRepository;
    private final AdministratorRepository administratorRepository;

    public void execute(ChangePassword command) {
        ReinitialisationToken token = new ReinitialisationToken(command.token());
        reinitialisationTokenRepository.validateToken(token, command.email());

        try {
            Administrator administrator = administratorRepository.get(command.email());
            administrator.modifyPassword(command.newPassword());
            administratorRepository.save(administrator);
            reinitialisationTokenRepository.deleteToken(command.email());
        } catch (Exception e) {
            log.error("Erreur lors de la réinitialisation du mot de passe pour le token '{}': ", command.token(), e);
            throw new PasswordModificationImpossible();
        }
    }
}