package com.legipilot.service.core.company.domain;

import com.legipilot.service.core.company.domain.model.Company;

import java.util.UUID;

public interface CompanyRepository {

    Company save(Company company);

    Company getOfAdministrator(UUID administratorId);

    Company get(UUID id);

    void delete (UUID id);

}
