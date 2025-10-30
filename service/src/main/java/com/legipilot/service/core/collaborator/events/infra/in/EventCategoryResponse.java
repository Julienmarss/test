package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;
import lombok.Builder;

import java.util.UUID;

@Builder
public record EventCategoryResponse(UUID id, int sequence, String title, String subtitle, String action, String icon,
                                    String color) {

    public static EventCategoryResponse from(EventCategory eventCategory) {
        return EventCategoryResponse.builder()
                .id(eventCategory.id().value())
                .sequence(eventCategory.sequence())
                .title(eventCategory.title())
                .subtitle(eventCategory.subtitle())
                .action(eventCategory.action())
                .icon(eventCategory.icon().getValue())
                .color(eventCategory.color().name())
                .build();
    }

}
