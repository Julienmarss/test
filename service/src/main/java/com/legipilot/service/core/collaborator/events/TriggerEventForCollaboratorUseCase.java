package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.events.domain.TriggeredEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.EventsRepository;
import com.legipilot.service.core.collaborator.events.domain.command.TriggerEventForCollaborator;
import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriggerEventForCollaboratorUseCase {

    private final CollaboratorRepository collaboratorRepository;
    private final EventsRepository eventsRepository;
    private final TriggeredEventsRepository triggeredEventsRepository;
    private final EventDataPopulationService dataPopulationService;

    public TriggeredEvent execute(TriggerEventForCollaborator command) {
        Event eventTemplate = eventsRepository.get(command.eventId())
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé l'événement demandé."));

        Collaborator collaborator = collaboratorRepository.get(command.collaboratorId());

        List<ActionData> prefilledData = dataPopulationService.populateActionsData(
                eventTemplate.actions(),
                collaborator
        );

        TriggeredEvent triggeredEvent = TriggeredEvent.initialize(
                command.collaboratorId(),
                command.eventId(),
                prefilledData
        );

        return triggeredEventsRepository.save(triggeredEvent);
    }
}

// TODO :
//  1. Implémenter les calculs automatiques dans EventDataPopulationService
//  2. Enrichir les mappings dans populateFromEmployeeFile et populateFromContract
//  3. Ajouter la validation des données dans CompleteTriggeredEventUseCase
//  4. Gérer la persistance de actionsData dans le repository (si pas déjà fait)
//  5. Créer les DTOs de réponse enrichis pour inclure les actionsData dans TriggeredEventResponse

