package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.EventsService;
import com.legipilot.service.core.collaborator.events.TriggerEventForCollaboratorUseCase;
import com.legipilot.service.core.collaborator.events.DeleteCollaboratorEventUseCase;
import com.legipilot.service.core.collaborator.events.domain.command.TriggerEventForCollaborator;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/collaborators/{collaboratorId}/events")
@RequiredArgsConstructor
public class EventController {
    private final EventsService eventsService;
    private final TriggerEventForCollaboratorUseCase triggerEventForCollaboratorUseCase;
    private final DeleteCollaboratorEventUseCase deleteCollaboratorEventUseCase;

    @GetMapping
    public List<EventResponse> getEventsByCategory(@PathVariable UUID collaboratorId, @RequestParam UUID categoryId) {
        return eventsService.get(new CollaboratorId(collaboratorId), new EventCategoryId(categoryId))
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @PostMapping("/{eventId}")
    public TriggeredEventResponse triggerEvent(@PathVariable UUID collaboratorId, @PathVariable UUID eventId) {
        var command = TriggerEventForCollaborator.builder()
                .collaboratorId(new CollaboratorId(collaboratorId))
                .eventId(EventId.of(eventId))
                .build();

        return TriggeredEventResponse.from(triggerEventForCollaboratorUseCase.execute(command));
    }

    @GetMapping("/active")
    public List<CollaboratorEventOverviewResponse> getActiveEvents(@PathVariable UUID collaboratorId) {
        CollaboratorId id = new CollaboratorId(collaboratorId);
        return eventsService.getActiveFor(id).stream()
                .map(triggeredEvent -> {
                    var template = eventsService.getTemplate(triggeredEvent.eventId());
                    return CollaboratorEventOverviewResponse.from(triggeredEvent, template);
                })
                .toList();
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable UUID collaboratorId, @PathVariable UUID eventId) {
        deleteCollaboratorEventUseCase.execute(new CollaboratorId(collaboratorId), TriggeredEventId.of(eventId));
    }

}
