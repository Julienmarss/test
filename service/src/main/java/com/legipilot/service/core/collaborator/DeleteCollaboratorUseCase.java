package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.command.DeleteCollaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteCollaboratorUseCase {

    private final CollaboratorRepository repository;

    public void execute(DeleteCollaborator command) {
        repository.delete(command.id());
    }
}
