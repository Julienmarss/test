package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.NullNode;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.FieldValue;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.UUID;

@Entity
@Table(name = "triggered_event_action_field_values")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TriggeredEventActionFieldValueDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triggered_event_action_id", nullable = false)
    private TriggeredEventActionDto action;

    @Column(name = "field_id", nullable = false)
    private String fieldId;

    @Type(JsonType.class)
    @Column(name = "value", columnDefinition = "jsonb")
    private Object value;

    public static TriggeredEventActionFieldValueDto from(FieldValue fieldValue, TriggeredEventActionDto action) {
        return TriggeredEventActionFieldValueDto.builder()
                .action(action)
                .fieldId(fieldValue.fieldId().value())
                .value(toDatabaseValue(fieldValue.value()))
                .build();
    }

    public FieldValue toDomain() {
        return FieldValue.builder()
                .fieldId(FieldId.of(fieldId))
                .value(fromDatabaseValue(value))
                .build();
    }

    private static Object toDatabaseValue(Object original) {
        if (original == null) {
            return null;
        }

        if (original instanceof JsonNode) {
            return original;
        }

        if (original instanceof String str) {
            return JsonNodeFactory.instance.textNode(str);
        }

        if (original instanceof Integer i) {
            return JsonNodeFactory.instance.numberNode(i);
        }
        if (original instanceof Long l) {
            return JsonNodeFactory.instance.numberNode(l);
        }
        if (original instanceof Short s) {
            return JsonNodeFactory.instance.numberNode(s);
        }
        if (original instanceof Double d) {
            return JsonNodeFactory.instance.numberNode(d);
        }
        if (original instanceof Float f) {
            return JsonNodeFactory.instance.numberNode(f);
        }
        if (original instanceof BigDecimal bigDecimal) {
            return JsonNodeFactory.instance.numberNode(bigDecimal);
        }
        if (original instanceof BigInteger bigInteger) {
            return JsonNodeFactory.instance.numberNode(bigInteger);
        }
        if (original instanceof Boolean bool) {
            return JsonNodeFactory.instance.booleanNode(bool);
        }

        return original;
    }

    private static Object fromDatabaseValue(Object stored) {
        if (stored == null) {
            return null;
        }

        if (stored instanceof JsonNode node) {
            if (node instanceof NullNode) {
                return null;
            }
            if (node.isTextual()) {
                return node.asText();
            }
            if (node.isIntegralNumber()) {
                return node.bigIntegerValue();
            }
            if (node.isFloatingPointNumber()) {
                return node.decimalValue();
            }
            if (node.isBoolean()) {
                return node.booleanValue();
            }
            return node;
        }

        return stored;
    }
}
