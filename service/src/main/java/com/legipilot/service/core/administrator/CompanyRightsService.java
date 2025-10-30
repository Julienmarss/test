package com.legipilot.service.core.administrator;

import com.legipilot.service.core.authorization.CompanyAuthorizationService;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.authorization.domain.CompanyAdministratorInfo;
import com.legipilot.service.core.authorization.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.authorization.domain.CompanyInfo;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
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

    /**
     * Met à jour les droits d'un administrateur dans une entreprise.
     * Seul un OWNER peut modifier les droits, et seul un OWNER peut attribuer le rôle OWNER.
     */
    public void updateAdministratorRights(UUID companyId, UUID administratorId,
                                          CompanyRight newRights, UUID currentUserId) {
        authorizationService.ensureCanGrantRight(currentUserId, companyId, newRights);

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

    /**
     * Ajoute un administrateur à une entreprise avec un droit spécifique.
     * Un MANAGER peut ajouter des READONLY/MANAGER, seul un OWNER peut ajouter des OWNER.
     */
    public void addAdministratorToCompany(UUID companyId, UUID administratorId,
                                          CompanyRight rights, UUID currentUserId) {
        Administrator admin = administratorRepository.get(administratorId);

        authorizationService.ensureCanGrantRight(currentUserId, companyId, rights);
        authorizationService.ensureCanManage(currentUserId, companyId);
        companyAdminRepository.addAdministratorToCompany(companyId, administratorId, rights);
    }

    /**
     * Retire un administrateur d'une entreprise.
     * Seul un OWNER peut retirer des membres, et on ne peut pas se retirer soi-même.
     */
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

    /**
     * Récupère la liste des administrateurs d'une entreprise.
     * Nécessite au minimum le droit READONLY.
     */
    public List<CompanyAdministratorInfo> getCompanyAdministrators(
            UUID companyId, UUID currentUserId
    ) {
        authorizationService.ensureCanRead(currentUserId, companyId);
        return companyAdminRepository.findAdministratorsByCompany(companyId);
    }

    public List<CompanyInfo> getAdministratorCompanies(
            UUID administratorId
    ) {
        return companyAdminRepository.findCompaniesByAdministrator(administratorId);
    }
}