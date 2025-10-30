package com.legipilot.service.core.collaborator.events.domain.command;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import lombok.Builder;

@Builder
public record TriggerEventForCollaborator(EventId eventId, CollaboratorId collaboratorId) {}
