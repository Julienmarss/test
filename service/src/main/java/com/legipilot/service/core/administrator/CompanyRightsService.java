package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.error.AdministratorRightsErrors.*;
import com.legipilot.service.core.administrator.domain.error.RepositoryErrors.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyRightsService {

    private final CompanyAdministratorRepository companyAdminRepository;
    private final AdministratorRepository administratorRepository;
    private final CompanyAuthorizationService authorizationService;

    public boolean hasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        return authorizationService.hasRight(administratorId, companyId, requiredRight);
    }

    public Optional<CompanyRight> getAdministratorRightForCompany(UUID administratorId, UUID companyId) {
        return authorizationService.getAdministratorRight(administratorId, companyId);
    }

    public void updateAdministratorRights(UUID companyId, UUID administratorId,
                                          CompanyRight newRights, UUID currentUserId) {
        authorizationService.ensureIsOwner(currentUserId, companyId);

        if (currentUserId.equals(administratorId)) {
            throw new CannotModifyOwnRightsError();
        }

        Optional<CompanyRight> currentRights = getAdministratorRightForCompany(
                administratorId, companyId
        );

        if (currentRights.isEmpty()) {
            throw new AdministratorNotFoundInCompanyError();
        }

        companyAdminRepository.updateRights(companyId, administratorId, newRights);
    }

    public void addAdministratorToCompany(UUID companyId, UUID administratorId,
                                          CompanyRight rights, UUID currentUserId) {
        Administrator admin = administratorRepository.get(administratorId);

        authorizationService.ensureCanManage(currentUserId, companyId);

        companyAdminRepository.addAdministratorToCompany(companyId, administratorId, rights);
    }

    public void removeAdministratorFromCompany(UUID companyId, UUID administratorId,
                                               UUID currentUserId) {
        if (currentUserId.equals(administratorId)) {
            throw new CannotRemoveSelfFromCompanyError();
        }

        authorizationService.ensureIsOwner(currentUserId, companyId);

        Optional<CompanyRight> adminRight = getAdministratorRightForCompany(
                administratorId, companyId
        );

        if (adminRight.isEmpty()) {
            throw new AdministratorNotFoundInCompanyError();
        }

        companyAdminRepository.removeAdministratorFromCompany(companyId, administratorId);
    }

    public List<CompanyAdministratorRepository.CompanyAdministratorInfo> getCompanyAdministrators(
            UUID companyId
    ) {
        return companyAdminRepository.findAdministratorsByCompany(companyId);
    }

    public List<CompanyAdministratorRepository.CompanyInfo> getAdministratorCompanies(
            UUID administratorId
    ) {
        return companyAdminRepository.findCompaniesByAdministrator(administratorId);
    }
}