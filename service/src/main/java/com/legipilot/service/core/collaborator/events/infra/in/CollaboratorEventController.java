package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.EventsService;
import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
public class CollaboratorEventController {

    private final EventsService eventsService;

    @GetMapping("/{eventId}")
    public CollaboratorEventResponse getEvent(@PathVariable UUID eventId) {
        TriggeredEvent triggeredEvent = eventsService.get(TriggeredEventId.of(eventId));
        Event template = eventsService.getTemplate(triggeredEvent.eventId());
        return CollaboratorEventResponse.from(triggeredEvent, template);
    }
}
