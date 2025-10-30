package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.events.domain.TriggeredEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.command.CompleteTriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompleteTriggeredEventUseCase {

    private final TriggeredEventsRepository triggeredEventsRepository;
    private final TriggeredEventAutoCalculationService triggeredEventAutoCalculationService;

    public TriggeredEvent execute(CompleteTriggeredEvent command) {
        TriggeredEvent triggeredEvent = triggeredEventsRepository.get(command.triggeredEventId())
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé cet événement collaborateur."));

        TriggeredEvent completedEvent = triggeredEvent.complete(command.actionsData());

        // TODO: check AUTOMATICALLY_CALCULATED fields and complete them if needed
        TriggeredEvent computedEvent = triggeredEventAutoCalculationService.applyAutomaticCalculations(completedEvent);

        return triggeredEventsRepository.save(computedEvent);
    }
}