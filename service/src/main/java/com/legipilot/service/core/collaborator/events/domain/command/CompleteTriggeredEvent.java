package com.legipilot.service.core.collaborator.events.domain.command;

import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import lombok.Builder;

import java.util.List;

@Builder
public record CompleteTriggeredEvent(
        TriggeredEventId triggeredEventId,
        List<ActionData> actionsData
) {
}