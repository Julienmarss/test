package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import lombok.Builder;

import java.util.UUID;

@Builder
public record EventResponse(UUID id, String title, String subtitle) {

    public static EventResponse from(Event event) {
        return EventResponse.builder()
                .id(event.id().value())
                .title(event.title())
                .subtitle(event.subtitle())
                .build();
    }
}
