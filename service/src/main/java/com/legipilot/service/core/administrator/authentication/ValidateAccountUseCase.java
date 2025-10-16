package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.ValidateAccount;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.out.AdministratorDto;
import com.legipilot.service.core.administrator.infra.out.JpaAdministratorRepository;
import com.legipilot.service.shared.domain.EmailPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ValidateAccountUseCase {

    private final JpaAdministratorRepository jpaRepository;
    private final ValidationRepository validationRepository;
    private final EmailPort emailPort;

    @Transactional
    public void execute(ValidateAccount command) {
        AdministratorDto adminDto = jpaRepository.findById(command.administratorId())
                .orElseThrow(() -> new RuntimeException("Administrator not found"));
        Administrator administrator = adminDto.toDomainWithoutCompany();
        validationRepository.validateToken(administrator, command.token());
        adminDto.activate();
        jpaRepository.save(adminDto);
        emailPort.sendOnboarding(administrator);
        validationRepository.deleteTokenOf(command.administratorId());
    }
}