package com.legipilot.service.core.collaborator.domain.command;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;

@Builder
public record DeleteCollaborator(CollaboratorId id) {
}
