package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.TriggeredEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.EventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventsService {

    private final CollaboratorRepository collaboratorRepository;
    private final EventsRepository eventsRepository;
    private final TriggeredEventsRepository triggeredEventsRepository;

    public List<Event> get(CollaboratorId id, EventCategoryId eventCategoryId) {
        Collaborator collaborator = collaboratorRepository.get(id);
        List<Event> allEvents = eventsRepository.getForCategory(eventCategoryId);
        return allEvents.stream()
                .filter(event -> event.availableFor(collaborator))
                .toList();
    }

    public TriggeredEvent get(TriggeredEventId eventId) {
        return triggeredEventsRepository.get(eventId)
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé cet événement collaborateur."));
    }

    public List<TriggeredEvent> getActiveFor(CollaboratorId collaboratorId) {
        return triggeredEventsRepository.findFor(collaboratorId).stream()
                .filter(TriggeredEvent::isActive)
                .toList();
    }

    public Event getTemplate(EventId eventId) {
        return eventsRepository.get(eventId)
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé l'événement demandé."));
    }

}
