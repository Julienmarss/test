package com.legipilot.service.core.administrator.domain;

import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import lombok.Builder;
import lombok.Value;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyAdministratorRepository {

    Optional<CompanyRight> findRightByAdministratorAndCompany(UUID administratorId, UUID companyId);
    void updateRights(UUID companyId, UUID administratorId, CompanyRight rights);
    void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights);
    void removeAdministratorFromCompany(UUID companyId, UUID administratorId);
    long countOwnersByCompany(UUID companyId);
    List<CompanyAdministratorInfo> findAdministratorsByCompany(UUID companyId);
    List<CompanyInfo> findCompaniesByAdministrator(UUID administratorId);

    @Builder
    @Value
    class CompanyAdministratorInfo {
        UUID administratorId;
        CompanyRight rights;
        String firstname;
        String lastname;
        String email;
    }

    @Builder
    @Value
    class CompanyInfo {
        UUID companyId;
        CompanyRight rights;
        String companyName;
    }
}