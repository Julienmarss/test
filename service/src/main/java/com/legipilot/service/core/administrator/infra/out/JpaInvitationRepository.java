package com.legipilot.service.core.administrator.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaInvitationRepository extends JpaRepository<InvitationDto, UUID> {

    Optional<InvitationDto> findByToken(UUID token);

    Optional<InvitationDto> findByEmailAndCompanyId(String email, UUID companyId);

    List<InvitationDto> findByCompanyId(UUID companyId);

    List<InvitationDto> findByCompanyIdAndStatus(UUID companyId, String status);
}