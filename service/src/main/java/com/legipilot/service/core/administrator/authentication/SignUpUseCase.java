package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.authentication.domain.event.AdministratorCreated;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.EventBus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignUpUseCase {

    private final AdministratorRepository repository;
    private final ValidationRepository validationRepository;
    private final CompanyRepository companyRepository;
    private final EmailPort emailPort;
    private final EventBus eventBus;

    public Administrator execute(SignUp command) {
        Administrator administrator = Administrator.signup(command);
        Administrator savedAdmin = repository.save(administrator);
        Company company = Company.register(savedAdmin, command);
        companyRepository.save(company);
        UUID token = validationRepository.createToken(savedAdmin);
        emailPort.sendVerificationEmail(savedAdmin, token);
        Administrator creadtedAdministrator = repository.get(savedAdmin.id());
        eventBus.publish(new AdministratorCreated(creadtedAdministrator));
        return creadtedAdministrator;
    }
}
