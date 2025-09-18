package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.Document;
import lombok.Builder;

import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

@Builder
public record DocumentResponse(
        UUID id,
        String name,
        String filename,
        String type,
        String uploadedAt
) {
    public static DocumentResponse from(Document document) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return DocumentResponse.builder()
                .id(document.id())
                .name(document.name())
                .filename(document.filename())
                .type(Objects.isNull(document.type()) ? null : document.type().label())
                .uploadedAt(Objects.isNull(document.uploadedAt()) ? null : document.uploadedAt().format(formatter))
                .build();
    }
}
