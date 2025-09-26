package com.legipilot.service.core.administrator.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaCompanyAdministratorRepository extends JpaRepository<CompanyAdministratorDto, CompanyAdministratorId> {

    Optional<CompanyAdministratorDto> findByAdministratorIdAndCompanyId(UUID administratorId, UUID companyId);

    List<CompanyAdministratorDto> findByCompanyId(UUID companyId);

    List<CompanyAdministratorDto> findByAdministratorId(UUID administratorId);

    long countByCompanyIdAndRights(UUID companyId, String rights);
}