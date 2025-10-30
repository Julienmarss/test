package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.events.domain.model.event.CollectiveBargainingAgreementType;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.Action;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.Field;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldSource;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.ActionData;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.FieldValue;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventDataPopulationService {

    /**
     * Populates field values for all actions based on collaborator data
     */
    public List<ActionData> populateActionsData(List<Action> actions, Collaborator collaborator) {
        return actions.stream()
                .map(action -> populateActionData(action, collaborator))
                .toList();
    }

    /**
     * Populates field values for a single action
     */
    private ActionData populateActionData(Action action, Collaborator collaborator) {
        List<FieldValue> fieldValues = action.fields().stream()
                .map(field -> populateFieldValue(field, collaborator))
                .toList();

        return ActionData.builder()
                .actionId(action.id())
                .fieldValues(fieldValues)
                .build();
    }

    /**
     * Populates a single field value based on its source
     */
    private FieldValue populateFieldValue(Field field, Collaborator collaborator) {
        Object value = switch (field.source()) {
            case PREFILLED_FROM_EMPLOYEE_FILE -> populateFromEmployeeFile(field.id(), collaborator);
            case PREFILLED_FROM_CONTRACT -> populateFromContract(field.id(), collaborator);
            case AUTOMATICALLY_CALCULATED -> null; // Will be calculated later
            case MANUAL_INPUT -> null; // User must provide
        };

        return FieldValue.builder()
                .fieldId(field.id())
                .value(normalizeValue(value))
                .build();
    }

    /**
     * Populates field from employee file data
     */
    private Object populateFromEmployeeFile(FieldId fieldId, Collaborator collaborator) {
        return switch (fieldId.value()) {
            case "hire_date" -> collaborator.professionalSituation() != null
                    ? collaborator.professionalSituation().hireDate()
                    : null;
            case "employment_category" -> collaborator.professionalSituation() != null
                    ? collaborator.professionalSituation().contractType()
                    : null;
            default -> null;
        };
    }

    /**
     * Populates field from contract data
     */
    private Object populateFromContract(FieldId fieldId, Collaborator collaborator) {
        return switch (fieldId.value()) {
            case "collective_agreement" -> this.getCollectiveAgreement(collaborator);
            default -> null;
        };
    }

    private Object normalizeValue(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Enum<?> enumValue) {
            return enumValue.name();
        }

        if (value instanceof java.time.LocalDate localDate) {
            return localDate.toString();
        }

        if (value instanceof java.time.LocalDateTime localDateTime) {
            return localDateTime.toString();
        }

        if (value instanceof java.time.Instant instant) {
            return instant.toString();
        }

        return value;
    }

    private String getCollectiveAgreement(Collaborator collaborator) {
        if (collaborator == null || collaborator.company() == null
                || collaborator.company().collectiveAgreement() == null) {
            return null;
        }

        String idcc = collaborator.company().collectiveAgreement().idcc();

        // Switch et non if par anticipation
        return switch (idcc) {
            case "1486" -> CollectiveBargainingAgreementType.SYNTEC.name();
            default -> CollectiveBargainingAgreementType.OTHER.name();
        };
    }
}
