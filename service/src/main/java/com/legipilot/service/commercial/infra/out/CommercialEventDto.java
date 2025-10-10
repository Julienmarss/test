package com.legipilot.service.commercial.infra.out;

import com.legipilot.service.commercial.domain.CommercialEvent;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "commercial_events")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommercialEventDto {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(columnDefinition = "uuid", name = "aggregate_id", nullable = false)
    private UUID aggregateId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(columnDefinition = "uuid", name = "actor_id", nullable = false)
    private UUID actorId;

    @Type(JsonType.class)
    @Column(name = "content", columnDefinition = "jsonb")
    private Map<String, Object> content;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    public static CommercialEventDto from(CommercialEvent event, Map<String, Object> content) {
        return new CommercialEventDto(
                event.id(),
                event.aggregateId(),
                event.action(),
                event.actorId(),
                content,
                event.occurredAt()
        );
    }
}
