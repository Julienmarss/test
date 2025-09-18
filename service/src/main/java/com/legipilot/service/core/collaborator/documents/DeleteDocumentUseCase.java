package com.legipilot.service.core.collaborator.documents;

import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.documents.domain.command.DeleteDocument;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.Document;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteDocumentUseCase {

    private final CollaboratorRepository repository;
    private final DocumentStoragePort documentStoragePort;

    public Collaborator execute(DeleteDocument command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        Document documentToDelete = collaborator.getDocument(command.documentId());
        documentStoragePort.delete(documentToDelete.url());
        collaborator.deleteDocument(documentToDelete);
        return repository.save(collaborator);
    }

}
