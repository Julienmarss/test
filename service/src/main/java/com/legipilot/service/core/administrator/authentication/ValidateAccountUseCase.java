package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.ValidateAccount;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidateAccountUseCase {

    private final AdministratorRepository repository;
    private final ValidationRepository validationRepository;

    public void execute(ValidateAccount command) {
        Administrator administrator = repository.get(command.administratorId());
        validationRepository.validateToken(administrator, command.token());
        administrator.activate();
        repository.save(administrator);
        validationRepository.deleteTokenOf(administrator.id());
    }
}
