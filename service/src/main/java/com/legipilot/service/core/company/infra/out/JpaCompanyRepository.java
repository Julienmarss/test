package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.administrator.infra.out.AdministratorDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaCompanyRepository extends JpaRepository<CompanyDto, UUID> {

    List<CompanyDto> getAllByAdministratorsId(UUID administratorId);

}
