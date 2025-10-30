package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.events.domain.model.event.action.ActionId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "triggered_event_actions")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TriggeredEventActionDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "triggered_event_id", columnDefinition = "uuid", nullable = false)
    private UUID triggeredEventId;

    @Column(name = "action_id", columnDefinition = "uuid", nullable = false)
    private UUID actionId;

    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TriggeredEventActionFieldValueDto> fieldValues;

    public static TriggeredEventActionDto from(ActionData actionData, UUID triggeredEventId) {
        TriggeredEventActionDto action = TriggeredEventActionDto.builder()
                .triggeredEventId(triggeredEventId)
                .actionId(actionData.actionId().value())
                .build();

        if (actionData.fieldValues() != null) {
            action.setFieldValues(
                    actionData.fieldValues().stream()
                            .map(fieldValue -> TriggeredEventActionFieldValueDto.from(fieldValue, action))
                            .toList()
            );
        }

        return action;
    }

    public ActionData toDomain() {
        List<TriggeredEventActionFieldValueDto> values = fieldValues != null ? fieldValues : Collections.emptyList();

        return ActionData.builder()
                .actionId(ActionId.of(actionId))
                .fieldValues(values.stream().map(TriggeredEventActionFieldValueDto::toDomain).toList())
                .build();
    }

    void setFieldValues(List<TriggeredEventActionFieldValueDto> fieldValues) {
        this.fieldValues = fieldValues;
    }
}
