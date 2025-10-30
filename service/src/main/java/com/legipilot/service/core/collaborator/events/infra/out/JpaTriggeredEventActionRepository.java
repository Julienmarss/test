package com.legipilot.service.core.collaborator.events.infra.out;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaTriggeredEventActionRepository extends JpaRepository<TriggeredEventActionDto, UUID> {

    @EntityGraph(attributePaths = "fieldValues")
    List<TriggeredEventActionDto> findByTriggeredEventId(UUID triggeredEventId);

    void deleteByTriggeredEventId(UUID triggeredEventId);
}
