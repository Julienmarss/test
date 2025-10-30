package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.domain.model.event.AvailableEvent;
import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record AvailableEventsDto(
        @JsonProperty("id") UUID id,
        @JsonProperty("eventCategoryId") UUID eventCategoryId,
        @JsonProperty("title") String title,
        @JsonProperty("subtitle") String subtitle,
        @JsonProperty("documentationUrl") String documentationUrl,
        @JsonProperty("actions") List<ActionDto> actions
) {
    public AvailableEvent toDomain() {
        return AvailableEvent.builder()
                .id(id)
                .eventCategoryId(EventCategoryId.of(eventCategoryId))
                .title(title)
                .subtitle(subtitle)
                .documentationUrl(documentationUrl)
                .actions(actions != null ?
                        actions.stream().map(ActionDto::toDomain).toList() : null)
                .build();
    }

    public static AvailableEventsDto from(Event event) {
        return AvailableEventsDto.builder()
                .id(event.id() != null ? event.id().value() : null)
                .eventCategoryId(event.eventCategoryId() != null ? event.eventCategoryId().value() : null)
                .title(event.title())
                .subtitle(event.subtitle())
                .documentationUrl(event.documentationUrl())
                .actions(event.actions() != null
                        ? event.actions().stream().map(ActionDto::fromDomain).toList()
                        : null)
                .build();
    }
}
