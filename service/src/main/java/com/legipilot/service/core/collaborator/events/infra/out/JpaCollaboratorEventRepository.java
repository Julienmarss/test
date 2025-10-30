package com.legipilot.service.core.collaborator.events.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface JpaCollaboratorEventRepository extends JpaRepository<TriggeredEventDto, UUID> {
    List<TriggeredEventDto> findByCollaboratorId(UUID collaboratorId);
}
