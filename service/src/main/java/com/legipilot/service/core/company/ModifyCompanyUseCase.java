package com.legipilot.service.core.company;

import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.domain.error.InsufficientRightsError;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.command.ModifyCompany;
import com.legipilot.service.core.company.domain.command.ModifyCompanyPicture;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ModifyCompanyUseCase {
    private final CompanyRepository repository;
    private final DocumentStoragePort documentStoragePort;
    private final CompanyRepository companyRepository;
    private final CompanyRightsService companyRightsService;

    @Transactional
    public Company execute(ModifyCompany command, UUID currentUserId) {
        if (!companyRightsService.hasRight(currentUserId, command.id(), CompanyRight.OWNER)) {
            throw InsufficientRightsError.forManaging();
        }

        Company company = companyRepository.get(command.id());
        company.modify(command);
        Company savedCompany = companyRepository.save(company);
        return savedCompany;
    }


    public Company execute(ModifyCompanyPicture command) {
        Company company = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExpose(company, command.picture());
        company.modifyPicture(file);
        return repository.save(company);
    }
}