package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "triggered_events")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TriggeredEventDto {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "collaborator_id", columnDefinition = "uuid", nullable = false)
    private UUID collaboratorId;

    @Column(name = "event_id", columnDefinition = "uuid", nullable = false)
    private UUID eventId;

//    @Type(JsonType.class)
//    @Column(name = "event_payload", columnDefinition = "jsonb", nullable = false)
//    private Map<String, Object> eventPayload;

    public static TriggeredEventDto from(TriggeredEvent event) {

        return TriggeredEventDto.builder()
                .id(event.id().value())
                .collaboratorId(event.collaboratorId().value())
                .eventId(event.eventId().value())
                .build();
    }

    public TriggeredEvent toDomain() {
        return toDomain(Collections.emptyList());
    }

    public TriggeredEvent toDomain(List<TriggeredEventActionDto> actions) {
        List<ActionData> actionData = actions != null
                ? actions.stream().map(TriggeredEventActionDto::toDomain).toList()
                : Collections.emptyList();

        return TriggeredEvent.builder()
                .id(TriggeredEventId.of(id))
                .collaboratorId(new CollaboratorId(collaboratorId))
                .eventId(EventId.of(eventId))
                .actionsData(actionData)
                .build();
    }
}
