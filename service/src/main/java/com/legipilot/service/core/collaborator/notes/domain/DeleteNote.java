package com.legipilot.service.core.collaborator.notes.domain;

import lombok.Builder;

import java.util.UUID;

@Builder
public record DeleteNote(
    UUID noteId,
    UUID collaboratorId) {
}
