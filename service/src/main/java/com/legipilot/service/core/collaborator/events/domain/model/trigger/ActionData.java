package com.legipilot.service.core.collaborator.events.domain.model.trigger;

import com.legipilot.service.core.collaborator.events.domain.model.event.action.ActionId;
import lombok.Builder;

import java.util.List;

@Builder
public record ActionData(
        ActionId actionId,
        List<FieldValue> fieldValues
) {
}