package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
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
        log.info("Tentative de modification des droits pour admin {} sur company {} par user {}",
                administratorId, companyId, currentUserId);

        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls les propriétaires peuvent modifier les droits");
        }

        if (currentUserId.equals(administratorId)) {
            throw new NotAllowed("Vous ne pouvez pas modifier vos propres droits");
        }

        Optional<CompanyRight> currentRights = getAdministratorRightForCompany(administratorId, companyId);

        if (currentRights.isEmpty()) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        CompanyRight targetCurrentRights = currentRights.get();

        if (targetCurrentRights.isOwner() && !newRights.isOwner()) {
            long ownerCount = companyAdminRepository.countOwnersByCompany(companyId);
            if (ownerCount <= 1) {
                throw new NotAllowed("Impossible de retirer le dernier propriétaire de l'entreprise");
            }
        }

        if (!newRights.isOwner() && !newRights.isManager() && !newRights.isReadOnly()) {
            throw new NotAllowed("Les droits autorisés sont uniquement Propriétaire, Responsable ou Observateur");
        }

        companyAdminRepository.updateRights(companyId, administratorId, newRights);

        log.info("Droits mis à jour avec succès pour admin {} sur company {}: {}",
                administratorId, companyId, newRights);
    }

    public void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights, UUID currentUserId) {
        log.info("Ajout de l'admin {} à l'entreprise {} avec droits {} par user {}",
                administratorId, companyId, rights, currentUserId);

        administratorRepository.get(administratorId);

        Optional<CompanyRight> currentUserRights = companyAdminRepository
                .findRightByAdministratorAndCompany(currentUserId, companyId);

        if (currentUserRights.isEmpty() || !currentUserRights.get().hasPermission(CompanyRight.MANAGER)) {
            throw new NotAllowed("Droits insuffisants pour ajouter des administrateurs");
        }

        if (rights.isOwner() && !currentUserRights.get().isOwner()) {
            throw new NotAllowed("Seuls les propriétaires peuvent attribuer le droit Propriétaire");
        }

        if (!rights.isOwner() && !rights.isManager() && !rights.isReadOnly()) {
            throw new NotAllowed("Les droits autorisés sont uniquement Propriétaire, Responsable ou Observateur");
        }

        companyAdminRepository.addAdministratorToCompany(companyId, administratorId, rights);

        log.info("Administrateur {} ajouté avec succès à l'entreprise {} avec droits {}",
                administratorId, companyId, rights);
    }

    public void removeAdministratorFromCompany(UUID companyId, UUID administratorId, UUID currentUserId) {
        log.info("Suppression de l'admin {} de l'entreprise {} par user {}",
                administratorId, companyId, currentUserId);

        if (currentUserId.equals(administratorId)) {
            throw new NotAllowed("Vous ne pouvez pas vous retirer vous-même de l'entreprise");
        }

        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls les propriétaires peuvent supprimer des administrateurs");
        }

        Optional<CompanyRight> adminRight = getAdministratorRightForCompany(administratorId, companyId);

        if (adminRight.isEmpty()) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        if (adminRight.get().isOwner()) {
            long ownerCount = companyAdminRepository.countOwnersByCompany(companyId);
            if (ownerCount <= 1) {
                throw new NotAllowed("Impossible de supprimer le dernier propriétaire de l'entreprise");
            }
        }

        companyAdminRepository.removeAdministratorFromCompany(companyId, administratorId);

        log.info("Administrateur {} supprimé avec succès de l'entreprise {}", administratorId, companyId);
    }

    public List<CompanyAdministratorRepository.CompanyAdministratorInfo> getCompanyAdministrators(UUID companyId) {
        return companyAdminRepository.findAdministratorsByCompany(companyId);
    }

    public List<CompanyAdministratorRepository.CompanyInfo> getAdministratorCompanies(UUID administratorId) {
        return companyAdminRepository.findCompaniesByAdministrator(administratorId);
    }
}