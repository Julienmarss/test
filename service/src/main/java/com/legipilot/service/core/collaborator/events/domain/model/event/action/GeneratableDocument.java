package com.legipilot.service.core.collaborator.events.domain.model.event.action;

import com.legipilot.service.core.collaborator.events.domain.model.event.DocumentState;
import com.legipilot.service.core.collaborator.events.domain.model.event.ExportOption;
import com.legipilot.service.core.collaborator.events.domain.model.event.TemplateId;
import lombok.Builder;

import java.util.List;

/**
 * Represents a document that can be generated as part of an HR event
 * (summons, notification, summary, etc.)
 */
@Builder
public record GeneratableDocument(
        TemplateId templateId,
        DocumentState state,
        String label,
        String generatorAction,
        List<ExportOption> exportOptions
) {
}
