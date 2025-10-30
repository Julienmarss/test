package com.legipilot.service.core.authorization;

import com.legipilot.service.core.authorization.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.CannotGrantOwnerRightsError;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.InsufficientRightsError;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.NotCompanyMemberError;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyAuthorizationService {

    private final CompanyAdministratorRepository companyAdminRepository;

    public void ensureHasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        Objects.requireNonNull(administratorId, "administratorId ne peut pas être null");
        Objects.requireNonNull(companyId, "companyId ne peut pas être null");
        Objects.requireNonNull(requiredRight, "requiredRight ne peut pas être null");

        Optional<CompanyRight> userRight = companyAdminRepository
                .findRightByAdministratorAndCompany(administratorId, companyId);

        if (userRight.isEmpty()) {
            log.warn("Tentative d'accès refusée: l'administrateur {} n'est pas membre de l'entreprise {}",
                    administratorId, companyId);
            throw new NotCompanyMemberError();
        }

        if (!userRight.get().hasPermission(requiredRight)) {
            log.warn("Droits insuffisants: l'administrateur {} (droit: {}) n'a pas le droit requis {} pour l'entreprise {}",
                    administratorId, userRight.get(), requiredRight, companyId);
            throw new InsufficientRightsError(requiredRight.getDisplayName());
        }

        log.debug("Autorisation accordée: administrateur {} a le droit {} pour l'entreprise {}",
                administratorId, requiredRight, companyId);
    }

    public void ensureCanManage(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.MANAGER);
    }

    public void ensureIsOwner(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.OWNER);
    }

    public void ensureCanRead(UUID administratorId, UUID companyId) {
        ensureHasRight(administratorId, companyId, CompanyRight.READONLY);
    }

    public void ensureCanGrantRight(UUID administratorId, UUID companyId, CompanyRight rightToGrant) {
        Objects.requireNonNull(administratorId, "administratorId ne peut pas être null");
        Objects.requireNonNull(companyId, "companyId ne peut pas être null");
        Objects.requireNonNull(rightToGrant, "rightToGrant ne peut pas être null");

        Optional<CompanyRight> currentUserRight = getAdministratorRight(administratorId, companyId);

        // Vérifier que l'utilisateur est membre de l'entreprise
        if (currentUserRight.isEmpty()) {
            log.warn("Tentative d'attribution de droits refusée: l'administrateur {} n'est pas membre de l'entreprise {}",
                    administratorId, companyId);
            throw new NotCompanyMemberError();
        }

        CompanyRight currentRight = currentUserRight.get();

        // Un MANAGER peut attribuer READONLY ou MANAGER, mais pas OWNER
        // Un READONLY ne peut attribuer aucun rôle
        if (!currentRight.hasPermission(CompanyRight.MANAGER)) {
            log.warn("Tentative d'attribution de droits refusée: l'administrateur {} (droit: {}) ne peut pas attribuer de droits pour l'entreprise {}",
                    administratorId, currentRight, companyId);
            throw new InsufficientRightsError("Responsable ou Propriétaire");
        }

        // Seul un OWNER peut attribuer le rôle OWNER
        if (rightToGrant.isOwner() && !currentRight.isOwner()) {
            log.warn("Tentative d'attribution du rôle OWNER refusée: l'administrateur {} (droit: {}) n'est pas propriétaire de l'entreprise {}",
                    administratorId, currentRight, companyId);
            throw new CannotGrantOwnerRightsError();
        }

        log.debug("Attribution de droits autorisée: administrateur {} (droit: {}) peut accorder le droit {} pour l'entreprise {}",
                administratorId, currentRight, rightToGrant, companyId);
    }

    public Optional<CompanyRight> getAdministratorRight(UUID administratorId, UUID companyId) {
        Objects.requireNonNull(administratorId, "administratorId ne peut pas être null");
        Objects.requireNonNull(companyId, "companyId ne peut pas être null");

        return companyAdminRepository
                .findRightByAdministratorAndCompany(administratorId, companyId);
    }

    public boolean hasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        Objects.requireNonNull(administratorId, "administratorId ne peut pas être null");
        Objects.requireNonNull(companyId, "companyId ne peut pas être null");
        Objects.requireNonNull(requiredRight, "requiredRight ne peut pas être null");

        return getAdministratorRight(administratorId, companyId)
                .map(right -> right.hasPermission(requiredRight))
                .orElse(false);
    }
}