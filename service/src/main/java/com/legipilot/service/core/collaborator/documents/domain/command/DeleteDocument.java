package com.legipilot.service.core.collaborator.documents.domain.command;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;

import java.util.UUID;

@Builder
public record DeleteDocument(
        CollaboratorId collaboratorId,
        UUID documentId) {
}
