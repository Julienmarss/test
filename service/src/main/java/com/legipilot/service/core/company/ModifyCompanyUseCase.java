package com.legipilot.service.core.company;

import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.command.ModifyCompanyPicture;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ModifyCompanyUseCase {
    private final CompanyRepository repository;
    private final DocumentStoragePort documentStoragePort;

    public Company execute(ModifyCompanyPicture command) {
        Company company = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExpose(company, command.picture());
        company.modifyPicture(file);
        return repository.save(company);
    }
}
