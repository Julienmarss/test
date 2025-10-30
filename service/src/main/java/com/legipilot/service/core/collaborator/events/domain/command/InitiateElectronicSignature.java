package com.legipilot.service.core.collaborator.events.domain.command;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.model.event.TemplateId;
import lombok.Builder;

@Builder
public record InitiateElectronicSignature(
        TemplateId templateId,
        String administratorEmail,
        CollaboratorId collaboratorId
) {}