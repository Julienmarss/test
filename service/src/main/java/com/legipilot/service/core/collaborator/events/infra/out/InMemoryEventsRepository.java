package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.events.domain.EventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.Event;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.Field;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldId;
import com.legipilot.service.core.collaborator.events.domain.model.event.action.field.FieldSource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class InMemoryEventsRepository implements EventsRepository {

    private final HashMap<EventId, Event> events = new HashMap<>();

    @Override
    public void save(List<Event> events) {
        events.forEach(event -> this.events.put(event.id(), event));
    }

    @Override
    public List<Event> getForCategory(EventCategoryId categoryId) {
        return events.values().stream()
                .filter(event -> event.eventCategoryId().equals(categoryId))
                .toList();
    }

    @Override
    public Optional<Event> get(EventId eventId) {
        return Optional.ofNullable(events.get(eventId));
    }

    @Override
    public List<FieldId> getAutomaticallyCalculatedFieldIds(EventId eventId) {
        return get(eventId)
                .map(event -> event.actions() == null ? List.<FieldId>of() : event.actions().stream()
                        .filter(action -> action.fields() != null)
                        .flatMap(action -> action.fields().stream())
                        .filter(field -> FieldSource.AUTOMATICALLY_CALCULATED.equals(field.source()))
                        .map(Field::id)
                        .toList())
                .orElse(List.of());
    }

}
