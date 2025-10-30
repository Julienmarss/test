package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;

import java.util.List;
import java.util.Optional;

public interface EventsRepository {

    void save(List<Event> events);

    List<Event> getForCategory(EventCategoryId categoryId);

    Optional<Event> get(EventId eventId);

    List<FieldId> getAutomaticallyCalculatedFieldIds(EventId eventId);
}
