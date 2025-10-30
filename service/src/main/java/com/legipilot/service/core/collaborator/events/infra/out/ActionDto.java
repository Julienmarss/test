package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.Action;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.ActionId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.ActionState;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record ActionDto(
        @JsonProperty("id") UUID id,
        @JsonProperty("title") String title,
        @JsonProperty("state") String state,
        @JsonProperty("availabilityDate") String availabilityDate,
        @JsonProperty("dependencies") List<UUID> dependencies,
        @JsonProperty("fields") List<FieldDto> fields,
        @JsonProperty("documents") List<GeneratableDocumentDto> documents
) {
    public Action toDomain() {
        return Action.builder()
                .id(ActionId.of(id))
                .title(title)
                .state(state != null ? ActionState.valueOf(state) : null)
                .availabilityDate(availabilityDate)
                .dependencies(dependencies != null ?
                        dependencies.stream().map(ActionId::of).toList() : null)
                .fields(fields != null ?
                        fields.stream().map(FieldDto::toDomain).toList() : null)
                .documents(documents != null ?
                        documents.stream().map(GeneratableDocumentDto::toDomain).toList() : null)
                .build();
    }

    public static ActionDto fromDomain(Action action) {
        if (action == null) {
            return null;
        }
        return ActionDto.builder()
                .id(action.id() != null ? action.id().value() : null)
                .title(action.title())
                .state(action.state() != null ? action.state().name() : null)
                .availabilityDate(action.availabilityDate())
                .dependencies(action.dependencies() != null
                        ? action.dependencies().stream()
                        .map(ActionId::value)
                        .toList()
                        : null)
                .fields(action.fields() != null
                        ? action.fields().stream().map(FieldDto::fromDomain).toList()
                        : null)
                .documents(action.documents() != null
                        ? action.documents().stream().map(GeneratableDocumentDto::fromDomain).toList()
                        : null)
                .build();
    }
}
