package com.legipilot.service.core.administrator.domain;

import com.legipilot.service.core.administrator.domain.model.Invitation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository {

    Invitation save(Invitation invitation);

    Optional<Invitation> findById(UUID id);

    Optional<Invitation> findByToken(UUID token);

    Optional<Invitation> findByEmailAndCompanyId(String email, UUID companyId);

    List<Invitation> findByCompanyId(UUID companyId);

    List<Invitation> findPendingByCompanyId(UUID companyId);

    void delete(UUID id);
}