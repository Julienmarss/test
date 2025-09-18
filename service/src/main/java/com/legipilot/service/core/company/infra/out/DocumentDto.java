package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import com.legipilot.service.core.collaborator.domain.model.Document;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private String url;
    private String filename;
    private String type;
    private String contentType;
    private LocalDate uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id")
    private CollaboratorDto collaborator;

    public static DocumentDto from(Document domain, CollaboratorDto dto) {
        return DocumentDto.builder()
                .id(domain.id())
                .name(domain.name())
                .url(domain.url())
                .filename(domain.filename())
                .type(Objects.isNull(domain.type()) ? null : domain.type().name())
                .uploadedAt(domain.uploadedAt())
                .collaborator(dto)
                .build();
    }

    public Document toDomain() {
        return Document.builder()
                .id(id)
                .name(name)
                .url(url)
                .filename(filename)
                .type(Objects.isNull(type) ? null : DocumentType.valueOf(type))
                .uploadedAt(uploadedAt)
                .contentType(contentType)
                .build();
    }
}
