package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;

import java.util.List;
import java.util.Optional;

public interface TriggeredEventsRepository {

    TriggeredEvent save(TriggeredEvent event);

    Optional<TriggeredEvent> get(TriggeredEventId eventId);

    List<TriggeredEvent> findFor(CollaboratorId collaboratorId);

    void delete(TriggeredEventId eventId);
}
