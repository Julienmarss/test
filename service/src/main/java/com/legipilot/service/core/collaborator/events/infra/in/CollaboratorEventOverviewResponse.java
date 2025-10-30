package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.infra.out.ActionDto;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record CollaboratorEventOverviewResponse(
        UUID id,
        String title,
        String subtitle,
        List<ActionDto> actions
) {

    public static CollaboratorEventOverviewResponse from(TriggeredEvent triggeredEvent, Event eventTemplate) {
        return CollaboratorEventOverviewResponse.builder()
                .id(triggeredEvent.id().value())
                .title(eventTemplate.title())
                .subtitle(eventTemplate.subtitle())
                .actions(eventTemplate.actions() != null
                        ? eventTemplate.actions().stream().map(ActionDto::fromDomain).toList()
                        : List.of())
                .build();
    }
}
