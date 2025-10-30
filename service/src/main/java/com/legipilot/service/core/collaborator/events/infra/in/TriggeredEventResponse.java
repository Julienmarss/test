package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.FieldValue;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record TriggeredEventResponse(
        UUID collaboratorEventId,
        UUID triggeredEventId,
        List<ActionDataResponse> actionsData
) {

    public static TriggeredEventResponse from(TriggeredEvent triggeredEvent) {
        return TriggeredEventResponse.builder()
                .collaboratorEventId(triggeredEvent.id().value())
                .triggeredEventId(triggeredEvent.id().value())
                .actionsData(triggeredEvent.actionsData() != null
                        ? triggeredEvent.actionsData().stream().map(ActionDataResponse::fromDomain).toList()
                        : List.of())
                .build();
    }

    @Builder
    public record ActionDataResponse(
            UUID actionId,
            List<FieldValueResponse> fieldValues
    ) {
        static ActionDataResponse fromDomain(ActionData actionData) {
            return ActionDataResponse.builder()
                    .actionId(actionData.actionId().value())
                    .fieldValues(actionData.fieldValues() != null
                            ? actionData.fieldValues().stream().map(FieldValueResponse::fromDomain).toList()
                            : List.of())
                    .build();
        }
    }

    @Builder
    public record FieldValueResponse(
            String fieldId,
            Object value
    ) {
        static FieldValueResponse fromDomain(FieldValue fieldValue) {
            return FieldValueResponse.builder()
                    .fieldId(fieldValue.fieldId().value())
                    .value(fieldValue.value())
                    .build();
        }
    }
}
