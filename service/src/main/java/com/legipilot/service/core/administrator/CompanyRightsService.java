// src/main/java/com/legipilot/service/core/administrator/CompanyRightsService.java
package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyRightsService {

    private final JdbcTemplate jdbcTemplate;
    private final AdministratorRepository administratorRepository;

    public boolean hasRight(UUID administratorId, UUID companyId, CompanyRight requiredRight) {
        Optional<CompanyRight> userRight = getAdministratorRightForCompany(administratorId, companyId);
        return userRight.map(right -> right.hasPermission(requiredRight)).orElse(false);
    }

    public Optional<CompanyRight> getAdministratorRightForCompany(UUID administratorId, UUID companyId) {
        String sql = "SELECT rights FROM companies_administrators WHERE administrator_id = ? AND company_id = ?";

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return Optional.of(CompanyRight.fromDbValue(rs.getString("rights")));
            }
            return Optional.empty();
        }, administratorId, companyId);
    }

    public void updateAdministratorRights(UUID companyId, UUID administratorId, CompanyRight newRights, UUID currentUserId) {
        log.info("Tentative de modification des droits pour admin {} sur company {} par user {}",
                administratorId, companyId, currentUserId);

        // Vérifier que l'utilisateur actuel a les droits pour modifier
        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls les propriétaires peuvent modifier les droits");
        }

        // Protection : ne pas permettre de modifier ses propres droits si c'est le seul owner
        if (currentUserId.equals(administratorId)) {
            long ownerCount = countOwners(companyId);
            if (ownerCount <= 1 && newRights != CompanyRight.OWNER) {
                throw new NotAllowed("Impossible de supprimer le dernier propriétaire de l'entreprise");
            }
        }

        String sql = "UPDATE companies_administrators SET rights = ? WHERE company_id = ? AND administrator_id = ?";
        int updatedRows = jdbcTemplate.update(sql, newRights.getDbValue(), companyId, administratorId);

        if (updatedRows == 0) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        log.info("Droits mis à jour avec succès pour admin {} sur company {}: {}",
                administratorId, companyId, newRights);
    }

    public void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights, UUID currentUserId) {
        log.info("Ajout de l'admin {} à l'entreprise {} avec droits {} par user {}",
                administratorId, companyId, rights, currentUserId);

        // Vérifier que l'administrateur existe
        Administrator admin = administratorRepository.get(administratorId);
        if (admin == null) {
            throw new NotAllowed("Administrateur non trouvé");
        }

        // Vérifier que l'utilisateur actuel a les droits pour ajouter
        if (!hasRight(currentUserId, companyId, CompanyRight.MANAGER)) {
            throw new NotAllowed("Droits insuffisants pour ajouter des administrateurs");
        }

        // Seuls les owners peuvent créer d'autres owners
        if (rights == CompanyRight.OWNER && !hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls les propriétaires peuvent créer d'autres propriétaires");
        }

        String sql = """
            INSERT INTO companies_administrators (company_id, administrator_id, rights) 
            VALUES (?, ?, ?)
            ON CONFLICT (company_id, administrator_id) 
            DO UPDATE SET rights = EXCLUDED.rights
            """;
        jdbcTemplate.update(sql, companyId, administratorId, rights.getDbValue());

        log.info("Administrateur {} ajouté avec succès à l'entreprise {} avec droits {}",
                administratorId, companyId, rights);
    }

    public void removeAdministratorFromCompany(UUID companyId, UUID administratorId, UUID currentUserId) {
        log.info("Suppression de l'admin {} de l'entreprise {} par user {}",
                administratorId, companyId, currentUserId);

        if (!hasRight(currentUserId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls les propriétaires peuvent supprimer des administrateurs");
        }

        // Vérifier qu'on ne supprime pas le dernier owner
        Optional<CompanyRight> adminRight = getAdministratorRightForCompany(administratorId, companyId);
        if (adminRight.isPresent() && adminRight.get() == CompanyRight.OWNER) {
            long ownerCount = countOwners(companyId);
            if (ownerCount <= 1) {
                throw new NotAllowed("Impossible de supprimer le dernier propriétaire de l'entreprise");
            }
        }

        String sql = "DELETE FROM companies_administrators WHERE company_id = ? AND administrator_id = ?";
        int deletedRows = jdbcTemplate.update(sql, companyId, administratorId);

        if (deletedRows == 0) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        log.info("Administrateur {} supprimé avec succès de l'entreprise {}", administratorId, companyId);
    }

    private long countOwners(UUID companyId) {
        String sql = "SELECT COUNT(*) FROM companies_administrators WHERE company_id = ? AND rights = 'Owner'";
        return jdbcTemplate.queryForObject(sql, Long.class, companyId);
    }

    public List<CompanyAdministratorInfo> getCompanyAdministrators(UUID companyId) {
        String sql = """
            SELECT ca.administrator_id, ca.rights, a.firstname, a.lastname, a.email 
            FROM companies_administrators ca
            JOIN administrators a ON ca.administrator_id = a.id
            WHERE ca.company_id = ?
            ORDER BY 
                CASE ca.rights 
                    WHEN 'Owner' THEN 1 
                    WHEN 'Manager' THEN 2 
                    WHEN 'ReadOnly' THEN 3 
                END,
                a.firstname, a.lastname
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                        CompanyAdministratorInfo.builder()
                                .administratorId(UUID.fromString(rs.getString("administrator_id")))
                                .rights(CompanyRight.fromDbValue(rs.getString("rights")))
                                .firstname(rs.getString("firstname"))
                                .lastname(rs.getString("lastname"))
                                .email(rs.getString("email"))
                                .build(),
                companyId
        );
    }

    public List<CompanyInfo> getAdministratorCompanies(UUID administratorId) {
        String sql = """
            SELECT ca.company_id, ca.rights, c.name as company_name
            FROM companies_administrators ca
            JOIN companies c ON ca.company_id = c.id
            WHERE ca.administrator_id = ?
            ORDER BY 
                CASE ca.rights 
                    WHEN 'Owner' THEN 1 
                    WHEN 'Manager' THEN 2 
                    WHEN 'ReadOnly' THEN 3 
                END,
                c.name
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                        CompanyInfo.builder()
                                .companyId(UUID.fromString(rs.getString("company_id")))
                                .rights(CompanyRight.fromDbValue(rs.getString("rights")))
                                .companyName(rs.getString("company_name"))
                                .build(),
                administratorId
        );
    }

    // Classes internes pour les DTOs
    @lombok.Builder
    @lombok.Value
    public static class CompanyAdministratorInfo {
        UUID administratorId;
        CompanyRight rights;
        String firstname;
        String lastname;
        String email;
    }

    @lombok.Builder
    @lombok.Value
    public static class CompanyInfo {
        UUID companyId;
        CompanyRight rights;
        String companyName;
    }
}