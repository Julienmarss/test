package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.command.ModifyCollaboratorPicture;
import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateCollaboratorUseCase {

    private final CollaboratorRepository repository;
    private final EmailPort emailPort;
    private final DocumentStoragePort documentStoragePort;

    public Collaborator execute(UpdateCollaborator command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        collaborator.update(command);
        return repository.save(collaborator);
    }

    public void execute(UUID comapnyId, CollaboratorId collaboratorId) {
        Collaborator collaborator = repository.get(collaboratorId);
        if (collaborator == null || !collaborator.company().id().equals(comapnyId)) {
            throw new RessourceNotFound("Collaborator not found with value: " + collaboratorId);
        }
        emailPort.sendRequestFillProfilInvitationEmail(collaborator);
    }

    public Collaborator execute(ModifyCollaboratorPicture command) {
        Collaborator collaborator = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExposePicture(collaborator, command.picture());
        collaborator.modifyPicture(file);
        return repository.save(collaborator);
    }
}
