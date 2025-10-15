package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.DeleteAdministrator;
import com.legipilot.service.core.administrator.domain.error.AdministratorRightsErrors.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeleteAdministratorUseCase {

    private final AdministratorRepository repository;
    private final CompanyAdministratorRepository companyAdminRepository;

    public void execute(DeleteAdministrator command, UUID currentUserId) {
        if (!command.id().equals(currentUserId)) {
            throw new CannotDeleteOtherAccountError();
        }

        List<CompanyAdministratorRepository.CompanyInfo> companies =
                companyAdminRepository.findCompaniesByAdministrator(command.id());

        boolean isOwnerAnywhere = companies.stream()
                .anyMatch(company -> company.getRights().isOwner());

        if (isOwnerAnywhere) {
            throw new CannotDeleteAccountAsOwnerError();
        }

        repository.remove(command.id());
    }
}