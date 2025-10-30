package com.legipilot.service.core.collaborator.events.domain.model.event;

import java.util.List;

public record AvailableEvents(List<AvailableEvent> events) {

    public List<Event> build() {
        return events.stream()
                .map(AvailableEvent::build)
                .toList();
    }

}
