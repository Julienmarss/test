package com.legipilot.service.core.authorization.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaCompanyAdministratorRepository extends JpaRepository<CompanyAdministratorDto, CompanyAdministratorId> {

    Optional<CompanyAdministratorDto> findByAdministratorIdAndCompanyId(UUID administratorId, UUID companyId);

    List<CompanyAdministratorDto> findByCompanyId(UUID companyId);

    /**
     * Récupère les associations entreprise-administrateurs avec les données administrateur en une seule requête.
     * Optimisation : JOIN FETCH évite le problème N+1.
     * ORDER BY en SQL au lieu d'un tri en mémoire Java.
     */
    @Query("""
        SELECT ca FROM CompanyAdministratorDto ca
        JOIN FETCH ca.administrator a
        WHERE ca.companyId = :companyId
        ORDER BY ca.rights DESC, a.firstname ASC, a.lastname ASC
    """)
    List<CompanyAdministratorDto> findByCompanyIdWithAdministrator(@Param("companyId") UUID companyId);

    List<CompanyAdministratorDto> findByAdministratorId(UUID administratorId);

    /**
     * Récupère les associations entreprise-administrateurs avec les données entreprise en une seule requête.
     * Optimisation : JOIN FETCH évite le problème N+1.
     * ORDER BY en SQL au lieu d'un tri en mémoire Java.
     */
    @Query("""
        SELECT ca FROM CompanyAdministratorDto ca
        JOIN FETCH ca.company c
        WHERE ca.administratorId = :administratorId
        ORDER BY ca.rights DESC, c.name ASC
    """)
    List<CompanyAdministratorDto> findByAdministratorIdWithCompany(@Param("administratorId") UUID administratorId);

    long countByCompanyIdAndRights(UUID companyId, String rights);
}