package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.collaborator.domain.CollaboratorExtractorPort;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.event.ImportCollaboratorsStarted;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.shared.domain.EmailPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportCollaboratorsUseCase {

    private final CollaboratorExtractorPort collaboratorExtractorPort;
    private final CollaboratorRepository repository;
    private final EmailPort emailPort;

    @Async
    @EventListener
    public void execute(ImportCollaboratorsStarted event) {
        try {
            List<Collaborator> collaborators = collaboratorExtractorPort.extract(event.document());
            collaborators.forEach(collaborator -> collaborator.associateWith(event.company()));
            repository.saveAll(collaborators);
            emailPort.sendCollaboratorsImported(event.administrator(), collaborators);
        } catch (Exception e) {
            log.error("Failed to import collaborators: ", e);
            emailPort.sendCollaboratorsImportFailed(event.administrator());
        }
    }

}
