package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.Note;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "notes")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteDto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    private String content;
    private LocalDate date;
    private String author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id")
    private CollaboratorDto collaborator;

    public static NoteDto from(Note note, CollaboratorDto collaborator) {
        return NoteDto.builder()
                .id(note.id())
                .title(note.title())
                .content(note.content())
                .author(note.author())
                .collaborator(collaborator)
                .date(note.date())
                .build();
    }

    public Note toDomain() {
        return Note.builder()
                .id(id)
                .title(title)
                .content(content)
                .author(author)
                .date(date)
                .build();
    }
}
