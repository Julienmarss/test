package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.model.Administrator;
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

    public Administrator execute(ModifyAdministratorWithCompanyDetails command) {
        log.info("Modification de l'administrateur {} avec détails entreprise", command.id());

        Administrator administrator = repository.get(command.id());

        administrator.modify(command);
        administrator = repository.save(administrator);
        log.info("Informations personnelles de l'administrateur {} mises à jour", command.id());

        if (command.idCompany().isPresent()) {
            try {
                UUID companyId = command.idCompany().get();
                log.info("Tentative de modification de l'entreprise {}", companyId);

                Company company = companyRepository.get(companyId);
                company.modify(command);
                companyRepository.save(company);

                log.info("Entreprise {} modifiée avec succès", companyId);
            } catch (Exception e) {
                log.error("Erreur lors de la modification de l'entreprise: {}", e.getMessage(), e);
            }
        }

        return administrator;
    }

    public Administrator execute(ModifyAdministratorPicture command) {
        log.info("Modification de la photo de l'administrateur {}", command.id());

        Administrator administrator = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExpose(administrator, command.picture());
        administrator.modifyPicture(file);

        return repository.save(administrator);
    }
}