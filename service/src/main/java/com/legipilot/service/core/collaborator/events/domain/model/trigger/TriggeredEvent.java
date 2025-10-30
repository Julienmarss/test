package com.legipilot.service.core.collaborator.events.domain.model.trigger;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import lombok.*;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
@RequiredArgsConstructor
@EqualsAndHashCode
@ToString
@Getter
@Accessors(fluent = true)
public final class TriggeredEvent {
    private final TriggeredEventId id;
    private final CollaboratorId collaboratorId;
    private final EventId eventId;
    private final List<ActionData> actionsData;
    private final TriggeredEventStatus status;
    private final LocalDateTime createdAt;
    private final LocalDateTime completedAt;

    public static TriggeredEvent initialize(
            CollaboratorId collaboratorId,
            EventId eventId,
            List<ActionData> prefilledData
    ) {
        return TriggeredEvent.builder()
                .id(TriggeredEventId.init())
                .collaboratorId(collaboratorId)
                .eventId(eventId)
                .actionsData(prefilledData)
                .status(TriggeredEventStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public TriggeredEvent complete(List<ActionData> updatedData) {
        return this.toBuilder()
                .actionsData(updatedData)
                .status(TriggeredEventStatus.COMPLETED)
                .completedAt(LocalDateTime.now())
                .build();
    }

    public boolean isCompleted() {
        return TriggeredEventStatus.COMPLETED.equals(status);
    }

    public boolean isActive() {
        return !isCompleted();
    }

}
