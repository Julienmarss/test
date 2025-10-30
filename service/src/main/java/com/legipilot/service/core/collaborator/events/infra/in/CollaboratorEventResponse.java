package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.infra.out.AvailableEventsDto;
import lombok.Builder;

import java.util.UUID;

@Builder
public record CollaboratorEventResponse(
        UUID id,
        UUID collaboratorId,
        AvailableEventsDto eventTemplate
) {

    public static CollaboratorEventResponse from(TriggeredEvent triggeredEvent, Event template) {
        return CollaboratorEventResponse.builder()
                .id(triggeredEvent.id().value())
                .collaboratorId(triggeredEvent.collaboratorId().value())
                .eventTemplate(AvailableEventsDto.from(template))
                .build();
    }
}
