package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.events.domain.EventCategoriesRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.EventCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventCategoriesService {

    private final EventCategoriesRepository repository;

    public List<EventCategory> get() {
        return repository.get();
    }
}
