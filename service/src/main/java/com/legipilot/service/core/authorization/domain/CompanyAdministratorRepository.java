package com.legipilot.service.core.authorization.domain;

import com.legipilot.service.core.authorization.domain.model.CompanyRight;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyAdministratorRepository {


    Optional<CompanyRight> findRightByAdministratorAndCompany(UUID administratorId, UUID companyId);

    void updateRights(UUID companyId, UUID administratorId, CompanyRight rights);

    void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights);

    void removeAdministratorFromCompany(UUID companyId, UUID administratorId);

    List<CompanyAdministratorInfo> findAdministratorsByCompany(UUID companyId);

    List<CompanyInfo> findCompaniesByAdministrator(UUID administratorId);

}