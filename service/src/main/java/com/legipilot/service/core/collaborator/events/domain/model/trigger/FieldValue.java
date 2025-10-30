package com.legipilot.service.core.collaborator.events.domain.model.trigger;

import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import lombok.Builder;

@Builder(toBuilder = true)
public record FieldValue(
        FieldId fieldId,
        Object value
) {
}
