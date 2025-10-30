package com.legipilot.service.core.collaborator.events.domain.model.event;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.Action;
import lombok.Builder;

import java.util.List;

@Builder
public record Event(
        EventId id,
        String title,
        String subtitle,
        EventCategoryId eventCategoryId,
        String collaboratorId,
        String documentationUrl,
        List<Action> actions
) {

    public boolean availableFor(Collaborator collaborator) {
        return true;
    }

}
