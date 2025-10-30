package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.events.domain.AvailableEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.EventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.AvailableEvents;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IntegrateEventsUseCase {

    private final AvailableEventsRepository availableEventsRepository;
    private final EventsRepository eventsRepository;

    public void execute() {
        AvailableEvents availableEvents = availableEventsRepository.load();
        eventsRepository.save(availableEvents.build());
    }
}
