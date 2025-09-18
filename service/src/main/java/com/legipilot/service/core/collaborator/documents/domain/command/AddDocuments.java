package com.legipilot.service.core.collaborator.documents.domain.command;

import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Builder
public record AddDocuments(
    UUID collaboratorId,
    List<MultipartFile> documents,
    DocumentType type) {
}
