package com.legipilot.service.core.collaborator.notes;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.notes.domain.DeleteNote;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteNoteUseCase {

    private final CollaboratorRepository repository;

    public Collaborator execute(DeleteNote command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        collaborator.deleteNote(command.noteId());
        return repository.save(collaborator);
    }

}
