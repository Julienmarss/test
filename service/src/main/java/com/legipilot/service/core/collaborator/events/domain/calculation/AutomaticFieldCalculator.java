package com.legipilot.service.core.collaborator.events.domain.calculation;

import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.FieldValue;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;

public interface AutomaticFieldCalculator {

    Object computeFieldValue(TriggeredEvent triggeredEvent, FieldValue field);
}
