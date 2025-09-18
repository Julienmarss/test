package com.legipilot.service.core.collaborator.documents.domain.command;

import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UpdateDocument(
        UUID collaboratorId,
        UUID documentId,
        DocumentType type) {
}
