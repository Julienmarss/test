package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModifyAdministratorUseCase {

    private final AdministratorRepository repository;
    private final CompanyRepository companyRepository;
    private final DocumentStoragePort documentStoragePort;
    private final CompanyRightsService companyRightsService;

    public Administrator execute(ModifyAdministratorWithCompanyDetails command, UUID currentUserId) {
        if (!command.id().equals(currentUserId)) {
            throw new NotAllowed("Vous ne pouvez modifier que votre propre profil");
        }

        Administrator administrator = repository.get(command.id());

        administrator.modify(command);
        administrator = repository.save(administrator);

        if (command.idCompany().isPresent()) {
            UUID companyId = command.idCompany().get();

            boolean isOwner = companyRightsService.hasRight(currentUserId, companyId, CompanyRight.OWNER);

            if (!isOwner) {
                throw new NotAllowed("Seuls les propriétaires peuvent modifier les informations de l'entreprise");
            }

            try {
                Company company = companyRepository.get(companyId);
                company.modify(command);
                companyRepository.save(company);
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors de la modification de l'entreprise: " + e.getMessage());
            }
        }

        return administrator;
    }

    public Administrator execute(ModifyAdministratorPicture command) {
        Administrator administrator = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExpose(administrator, command.picture());
        administrator.modifyPicture(file);
        return repository.save(administrator);
    }
}