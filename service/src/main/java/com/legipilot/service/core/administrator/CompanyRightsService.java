package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.shared.domain.error.NotAllowed;
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

    public boolean hasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        Optional<CompanyRight> userRight = companyAdminRepository
                .findRightByAdministratorAndCompany(administratorId, companyId);

        return userRight.map(right -> right.hasPermission(requiredRight)).orElse(false);
    }

    public Optional<CompanyRight> getAdministratorRightForCompany(UUID administratorId, UUID companyId) {
        return companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId);
    }

    public void updateAdministratorRights(UUID companyId, UUID administratorId, CompanyRight newRights, UUID currentUserId) {

        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seul le propriétaire peut modifier les droits");
        }

        if (currentUserId.equals(administratorId)) {
            throw new NotAllowed("Vous ne pouvez pas modifier vos propres droits");
        }

        Optional<CompanyRight> currentRights = getAdministratorRightForCompany(administratorId, companyId);

        if (currentRights.isEmpty()) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        companyAdminRepository.updateRights(companyId, administratorId, newRights);
    }

    public void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights, UUID currentUserId) {
        Administrator admin = administratorRepository.get(administratorId);

        if (!hasRight(currentUserId, companyId, CompanyRight.MANAGER)) {
            throw new NotAllowed("Droits insuffisants pour ajouter des administrateurs");
        }

        companyAdminRepository.addAdministratorToCompany(companyId, administratorId, rights);
    }

    public void removeAdministratorFromCompany(UUID companyId, UUID administratorId, UUID currentUserId) {

        if (currentUserId.equals(administratorId)) {
            throw new NotAllowed("Vous ne pouvez pas vous retirer vous-même de l'entreprise");
        }

        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seul le propriétaire peut supprimer des administrateurs");
        }

        Optional<CompanyRight> adminRight = getAdministratorRightForCompany(administratorId, companyId);

        if (adminRight.isEmpty()) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        companyAdminRepository.removeAdministratorFromCompany(companyId, administratorId);
    }

    public List<CompanyAdministratorRepository.CompanyAdministratorInfo> getCompanyAdministrators(UUID companyId) {
        return companyAdminRepository.findAdministratorsByCompany(companyId);
    }

    public List<CompanyAdministratorRepository.CompanyInfo> getAdministratorCompanies(UUID administratorId) {
        return companyAdminRepository.findCompaniesByAdministrator(administratorId);
    }
}