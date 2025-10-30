package com.legipilot.service.core.collaborator.events.domain.model.event;

import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.Action;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

/**
 * Represents an available HR event (event template)
 */
@Builder
public record AvailableEvent(
        UUID id,
        EventCategoryId eventCategoryId,
        String title,
        String subtitle,
        String documentationUrl,
        List<Action> actions
) {
    public Event build() {
        return Event.builder()
                .id(EventId.of(id))
                .title(title)
                .subtitle(subtitle)
                .eventCategoryId(eventCategoryId)
                .documentationUrl(documentationUrl)
                .actions(actions)
                .build();
    }
}
