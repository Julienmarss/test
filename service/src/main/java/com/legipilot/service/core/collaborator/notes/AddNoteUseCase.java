package com.legipilot.service.core.collaborator.notes;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.notes.domain.AddNote;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddNoteUseCase {

    private final CollaboratorRepository repository;
    private final AdministratorRepository administratorRepository;

    public Collaborator execute(AddNote command) {
        Collaborator collaborator = repository.get(command.collaboratorId());
        Administrator administrator = administratorRepository.get(command.administratorEmail());
        collaborator.addNote(command, administrator);
        return repository.save(collaborator);
    }

}
