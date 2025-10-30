package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.events.domain.AvailableEventCategoriesRepository;
import com.legipilot.service.core.collaborator.events.domain.EventCategoriesRepository;
import com.legipilot.service.core.collaborator.events.domain.model.category.AvailableEventCategories;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IntegrateEventCategoriesUseCase {

    private final AvailableEventCategoriesRepository availableEventCategoriesRepository;
    private final EventCategoriesRepository eventGroupsRepository;

    public void execute() {
        AvailableEventCategories groups = availableEventCategoriesRepository.load();
        eventGroupsRepository.save(groups.build());
    }
}
