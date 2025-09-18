package com.legipilot.service.core.collaborator.documents;

import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.documents.domain.DownloadUrl;
import com.legipilot.service.core.collaborator.documents.domain.StoredDocument;
import com.legipilot.service.core.collaborator.documents.domain.command.AddDocuments;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.Document;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentsService {

    private final CollaboratorRepository repository;
    private final DocumentStoragePort documentStoragePort;

    public DownloadUrl visualize(UUID id, UUID collaboratorId) {
        Collaborator collaborator = repository.get(collaboratorId);
        Document document = collaborator.getDocument(id);
        return documentStoragePort.generateDownloadUrl(document.url());
    }
}
