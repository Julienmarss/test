package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.events.domain.model.event.AvailableEvents;

public interface AvailableEventsRepository {

    AvailableEvents  load();

}
