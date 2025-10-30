package com.legipilot.service.core.collaborator.events.domain.model.event.action;

import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.Field;
import lombok.Builder;

import java.util.List;

@Builder
public record Action(
        ActionId id,
        String title,
        ActionState state,
        String availabilityDate,
        List<ActionId> dependencies,
        List<Field> fields,
        List<GeneratableDocument> documents
) {
}
