package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;

import java.util.List;

public interface EventCategoriesRepository {

    void save(List<EventCategory> categories);

    List<EventCategory> get();

}
