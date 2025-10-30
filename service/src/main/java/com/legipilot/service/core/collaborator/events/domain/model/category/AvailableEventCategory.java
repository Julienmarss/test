package com.legipilot.service.core.collaborator.events.domain.model.category;

import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AvailableEventCategory(UUID id, int sequence, String title, String subtitle, String action, String icon,
                                     String color) {
    public EventCategory build() {
        return EventCategory.builder()
                .id(EventCategoryId.of(id))
                .sequence(sequence)
                .title(title)
                .subtitle(subtitle)
                .action(action)
                .icon(EventCategoryIcon.fromValue(icon))
                .color(EventCategoryColor.valueOf(color))
                .build();
    }
}
