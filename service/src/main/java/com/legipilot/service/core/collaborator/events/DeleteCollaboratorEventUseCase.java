package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.TriggeredEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteCollaboratorEventUseCase {

    private final TriggeredEventsRepository triggeredEventsRepository;

    public void execute(CollaboratorId collaboratorId, TriggeredEventId eventId) {
        TriggeredEvent event = triggeredEventsRepository.get(eventId)
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé cet événement collaborateur."));

        if (!event.collaboratorId().equals(collaboratorId)) {
            throw new RessourceNotFound("Désolé, nous n'avons pas trouvé cet événement collaborateur.");
        }

        triggeredEventsRepository.delete(eventId);
    }
}
