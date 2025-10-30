package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.domain.model.event.DocumentState;
import com.legipilot.service.core.collaborator.events.domain.model.event.ExportOption;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.GeneratableDocument;
import com.legipilot.service.core.collaborator.events.domain.model.event.TemplateId;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record GeneratableDocumentDto(
        @JsonProperty("templateId") UUID templateId,
        @JsonProperty("state") String state,
        @JsonProperty("label") String label,
        @JsonProperty("generatorAction") String generatorAction,
        @JsonProperty("exportOptions") List<String> exportOptions
) {
    public GeneratableDocument toDomain() {
        return GeneratableDocument.builder()
                .templateId(TemplateId.of(templateId))
                .state(state != null ? DocumentState.valueOf(state) : null)
                .label(label)
                .generatorAction(generatorAction)
                .exportOptions(exportOptions != null ?
                        exportOptions.stream().map(ExportOption::valueOf).toList() : null)
                .build();
    }

    public static GeneratableDocumentDto fromDomain(GeneratableDocument document) {
        if (document == null) {
            return null;
        }
        return GeneratableDocumentDto.builder()
                .templateId(document.templateId() != null ? document.templateId().value() : null)
                .state(document.state() != null ? document.state().name() : null)
                .label(document.label())
                .generatorAction(document.generatorAction())
                .exportOptions(document.exportOptions() != null
                        ? document.exportOptions().stream().map(ExportOption::name).toList()
                        : null)
                .build();
    }
}
