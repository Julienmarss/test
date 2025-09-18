package com.legipilot.service.core.collaborator.notes.domain;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AddNote(
    UUID collaboratorId,
    String content,
    String title,
    String administratorEmail) {
}
