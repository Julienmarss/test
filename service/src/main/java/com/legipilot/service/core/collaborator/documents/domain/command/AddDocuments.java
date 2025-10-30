package com.legipilot.service.core.collaborator.documents.domain.command;

import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
public record AddDocuments(
        CollaboratorId collaboratorId,
        List<MultipartFile> documents,
        DocumentType type) {
}
