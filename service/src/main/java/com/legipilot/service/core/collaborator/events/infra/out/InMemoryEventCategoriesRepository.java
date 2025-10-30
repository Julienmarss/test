package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.events.domain.EventCategoriesRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class InMemoryEventCategoriesRepository implements EventCategoriesRepository {

    private final HashMap<EventCategoryId, EventCategory> categories = new HashMap<>();

    @Override
    public void save(List<EventCategory> categories) {
        categories.forEach(category -> this.categories.put(category.id(), category));
    }

    @Override
    public List<EventCategory> get() {
        return categories.values().stream()
                .sorted((left, right) -> Integer.compare(left.sequence(), right.sequence()))
                .toList();
    }
}
