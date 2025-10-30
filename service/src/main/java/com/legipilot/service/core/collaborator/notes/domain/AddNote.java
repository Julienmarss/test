package com.legipilot.service.core.collaborator.notes.domain;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;

@Builder
public record AddNote(
        CollaboratorId collaboratorId,
        String content,
        String title,
        String administratorEmail) {
}
