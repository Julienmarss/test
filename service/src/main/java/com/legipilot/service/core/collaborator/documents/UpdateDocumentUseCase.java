package com.legipilot.service.core.collaborator.documents;

import com.legipilot.service.core.collaborator.documents.domain.command.UpdateDocument;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateDocumentUseCase {

    private final CollaboratorRepository repository;

    public Collaborator execute(UpdateDocument command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        collaborator.modifyDocument(command.documentId(), command.type());
        return repository.save(collaborator);
    }

}
