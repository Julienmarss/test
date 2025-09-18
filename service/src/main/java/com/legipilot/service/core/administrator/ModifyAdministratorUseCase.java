package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ModifyAdministratorUseCase {

    private final AdministratorRepository repository;
    private final CompanyRepository companyRepository;
    private final DocumentStoragePort documentStoragePort;

//    public Administrator execute(ModifyAdministrator command) {
//        Administrator administrator = repository.get(command.id());
//        administrator.modify(command);
//        return repository.save(administrator);
//    }

    public Administrator execute(ModifyAdministratorWithCompanyDetails command) {
        Administrator administrator = repository.get(command.id());

        //
        administrator.modify(command);
        administrator = repository.save(administrator);

        //
        if(command.idCompany().isPresent()) {
            Company company = companyRepository.get(command.idCompany().get());
            company.modify(command);
            companyRepository.save(company);
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
