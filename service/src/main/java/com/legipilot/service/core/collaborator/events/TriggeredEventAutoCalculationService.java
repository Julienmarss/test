package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.events.domain.EventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import com.legipilot.service.core.collaborator.events.domain.calculation.AutomaticFieldCalculator;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriggeredEventAutoCalculationService {

    private final EventsRepository eventsRepository;
    private final AutomaticFieldCalculator automaticFieldCalculator;

    public TriggeredEvent applyAutomaticCalculations(TriggeredEvent triggeredEvent) {
        List<FieldId> autoCalculatedFieldIds =
                eventsRepository.getAutomaticallyCalculatedFieldIds(triggeredEvent.eventId());

        List<ActionData> updatedActionsData = triggeredEvent.actionsData().stream()
                .map(actionData -> ActionData.builder()
                        .actionId(actionData.actionId())
                        .fieldValues(actionData.fieldValues().stream()
                                .map(fieldValue -> autoCalculatedFieldIds.contains(fieldValue.fieldId())
                                        ? fieldValue.toBuilder()
                                        .value(automaticFieldCalculator.computeFieldValue(triggeredEvent, fieldValue))
                                        .build()
                                        : fieldValue)
                                .toList())
                        .build())
                .toList();

        return triggeredEvent.toBuilder()
                .actionsData(updatedActionsData)
                .build();
    }
}
