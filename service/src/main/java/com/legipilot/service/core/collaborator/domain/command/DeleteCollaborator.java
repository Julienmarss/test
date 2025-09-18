package com.legipilot.service.core.collaborator.domain.command;

import lombok.Builder;

import java.util.UUID;

@Builder
public record DeleteCollaborator(UUID id) {
}
