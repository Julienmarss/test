package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.DeleteAdministrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeleteAdministratorUseCase {

    private final AdministratorRepository repository;
    private final CompanyAdministratorRepository companyAdminRepository;

    public void execute(DeleteAdministrator command, UUID currentUserId) {
        if (!command.id().equals(currentUserId)) {
            throw new NotAllowed("Vous ne pouvez pas supprimer le compte d'un autre utilisateur");
        }

        List<CompanyAdministratorRepository.CompanyInfo> companies =
                companyAdminRepository.findCompaniesByAdministrator(command.id());

        boolean isOwnerAnywhere = companies.stream()
                .anyMatch(company -> company.getRights().isOwner());

        if (isOwnerAnywhere) {
            throw new NotAllowed("Impossible de supprimer votre compte car vous êtes propriétaire d'une ou plusieurs entreprises. Veuillez d'abord transférer la propriété");
        }
        repository.remove(command.id());
    }
}