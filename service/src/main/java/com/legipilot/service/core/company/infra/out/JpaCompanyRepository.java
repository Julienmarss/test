package com.legipilot.service.core.company.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaCompanyRepository extends JpaRepository<CompanyDto, UUID> {

    List<CompanyDto> getAllByAdministratorAssociationsAdministratorId(UUID administratorId);

    List<CompanyDto> findByAdministratorAssociations_AdministratorId(UUID administratorId);

}