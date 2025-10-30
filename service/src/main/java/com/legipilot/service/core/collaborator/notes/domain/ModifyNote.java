package com.legipilot.service.core.collaborator.notes.domain;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ModifyNote(
        UUID noteId,
        CollaboratorId collaboratorId,
        String content,
        String title,
        String administratorEmail) {
}
