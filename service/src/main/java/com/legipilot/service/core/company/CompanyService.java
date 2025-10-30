package com.legipilot.service.core.company;

import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.error.InvalidRightsError;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.core.company.domain.model.CompanyId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository repository;
    private final CompanyRightsService companyRightsService;

    public Company getFor(UUID administratorId) {
        return repository.getOfAdministrator(administratorId);
    }

    public Company get(CompanyId companyId, UUID currentUserId) {
        if (!companyRightsService.hasRight(currentUserId, companyId.value(), CompanyRight.READONLY)) {
            throw InvalidRightsError.notEnoughRights();
        }

        return repository.get(companyId.value());
    }
}