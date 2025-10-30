package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;

import java.util.List;

public record CompleteTriggeredEventRequest(
        List<ActionData> actionsData
) {
}