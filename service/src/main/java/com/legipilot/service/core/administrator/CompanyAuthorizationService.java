package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.error.InsufficientRightsError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * Service de domaine pour gérer l'autorisation sur les entreprises.
 * Ce service encapsule toute la logique métier d'autorisation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyAuthorizationService {

    private final CompanyAdministratorRepository companyAdminRepository;

    /**
     * Vérifie qu'un administrateur a un droit spécifique sur une entreprise.
     * Lance une exception si le droit n'est pas accordé.
     */
    public void ensureHasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        Optional<CompanyRight> userRight = companyAdminRepository
                .findRightByAdministratorAndCompany(administratorId, companyId);

        if (userRight.isEmpty()) {
            log.warn("Accès refusé: l'administrateur {} n'est pas membre de l'entreprise {}",
                    administratorId, companyId);
            throw new InsufficientRightsError(
                    "accéder à cette entreprise - Vous n'êtes pas membre de cette entreprise"
            );
        }

        if (!userRight.get().hasPermission(requiredRight)) {
            log.warn("Accès refusé: l'administrateur {} a le droit {} mais {} est requis sur l'entreprise {}",
                    administratorId, userRight.get(), requiredRight, companyId);
            throw new InsufficientRightsError(
                    String.format("effectuer cette action - Droit requis: %s",
                            requiredRight.getDisplayName())
            );
        }

        log.debug("Autorisation accordée: admin={}, company={}, right={}",
                administratorId, companyId, requiredRight);
    }

    /**
     * Vérifie si un administrateur peut gérer (MANAGER ou plus) une entreprise.
     */
    public void ensureCanManage(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.MANAGER);
    }

    /**
     * Vérifie si un administrateur est propriétaire d'une entreprise.
     */
    public void ensureIsOwner(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.OWNER);
    }

    /**
     * Vérifie si un administrateur peut lire les informations d'une entreprise.
     */
    public void ensureCanRead(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.READONLY);
    }

    /**
     * Récupère le droit d'un administrateur sur une entreprise.
     */
    public Optional<CompanyRight> getAdministratorRight(UUID administratorId, UUID companyId) {
        return companyAdminRepository
                .findRightByAdministratorAndCompany(administratorId, companyId);
    }

    /**
     * Vérifie si un administrateur a un droit spécifique (retourne un booléen).
     */
    public boolean hasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        return getAdministratorRight(administratorId, companyId)
                .map(right -> right.hasPermission(requiredRight))
                .orElse(false);
    }
}