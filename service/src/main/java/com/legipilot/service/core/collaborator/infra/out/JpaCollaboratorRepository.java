package com.legipilot.service.core.collaborator.infra.out;

import com.legipilot.service.core.administrator.infra.out.AdministratorDto;
import com.legipilot.service.core.company.infra.out.CollaboratorDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaCollaboratorRepository extends JpaRepository<CollaboratorDto, UUID> {

    List<CollaboratorDto> findAllByCompanyId(UUID companyId);

}
