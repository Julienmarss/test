package com.legipilot.service.core.company.infra.in.response;

import com.legipilot.service.core.collaborator.domain.model.Note;
import lombok.Builder;

import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

@Builder
public record NoteResponse(
        UUID id,
        String title,
        String content,
        String createdBy,
        String updatedAt
) {
    public static NoteResponse from(Note note) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return NoteResponse.builder()
                .id(note.id())
                .title(note.title())
                .content(note.content())
                .createdBy(note.author())
                .updatedAt(Objects.isNull(note.date()) ? null : note.date().format(formatter))
                .build();
    }
}
