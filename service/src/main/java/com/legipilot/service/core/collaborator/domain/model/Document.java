package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import com.legipilot.service.core.collaborator.documents.domain.StoredDocument;
import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@AllArgsConstructor
@Getter
@Accessors(fluent = true)
@ToString
@EqualsAndHashCode
public final class Document {
    private final UUID id;
    private final String name;
    private final String url;
    private final String filename;
    private DocumentType type;
    private final String contentType;
    private final LocalDate uploadedAt;

    public static Document initialize(MultipartFile document, StoredDocument storedDocument) {
        return Document.builder()
                .name(document.getName())
                .url(storedDocument.url())
                .filename(document.getOriginalFilename())
                .contentType(document.getContentType())
                .uploadedAt(LocalDate.now())
                .build();
    }

    public void modify(DocumentType type) {
        this.type = type;
    }
}

