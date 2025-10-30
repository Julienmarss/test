package com.legipilot.service.core.collaborator.events.domain.model.category;

import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;

import java.util.List;

public record AvailableEventCategories(List<AvailableEventCategory> categories) {

    public List<EventCategory> build() {
        return categories.stream()
                .map(AvailableEventCategory::build)
                .toList();
    }

}
