package com.legipilot.service.core.collaborator.documents;

import com.legipilot.service.core.collaborator.documents.domain.command.AddDocuments;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.documents.domain.StoredDocument;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.Document;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddDocumentsUseCase {

    private final CollaboratorRepository repository;
    private final DocumentStoragePort documentStoragePort;

    public Collaborator execute(AddDocuments command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        command.documents().forEach(document -> {
            StoredDocument storedDocument = documentStoragePort.storeAndExpose(collaborator, document);
            Document addedDocument = Document.initialize(document, storedDocument);
            collaborator.addDocument(addedDocument);
        });
        return repository.save(collaborator);
    }

}
