package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.authentication.domain.AuthenticatedAdministrator;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.AccountState;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Tokens;
import com.legipilot.service.shared.domain.error.NotAllowed;
import com.legipilot.service.shared.infra.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdministratorService {

    private final AdministratorRepository repository;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public AuthenticatedAdministrator getAuthenticated(String username, String password) {
        UsernamePasswordAuthenticationToken authentification = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = authenticationManager.authenticate(authentification);
        Tokens tokens = tokenProvider.getTokens(authentication);
        Administrator administrator = repository.get(username, password);
        checkAccountValidation(administrator);
        return AuthenticatedAdministrator.from(administrator, tokens);
    }

    public AuthenticatedAdministrator getAuthenticated(String username) {
        Administrator administrator = repository.get(username);
        Tokens tokens = tokenProvider.getTokens(administrator);
        checkAccountValidation(administrator);
        return AuthenticatedAdministrator.from(administrator, tokens);
    }

    public Administrator get(String username) {
        return repository.get(username);
    }

    public Administrator get(UUID id) {
        return repository.get(id);
    }

    private static void checkAccountValidation(Administrator administrator) {
        if(AccountState.NOT_VALIDATED.equals(administrator.state())) {
            throw new NotAllowed("vous connecter, veuillez valider votre compte en cliquant sur le lien envoyé par e-mail");
        }
    }

    public List<Administrator> getAll() {
        return repository.getAll();
    }
}
