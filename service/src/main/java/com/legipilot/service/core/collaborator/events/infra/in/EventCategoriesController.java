package com.legipilot.service.core.collaborator.events.infra.in;


import com.legipilot.service.core.collaborator.events.EventCategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/event-categories")
@RequiredArgsConstructor
public class EventCategoriesController {

    private final EventCategoriesService eventCategoriesService;

    @GetMapping
    public List<EventCategoryResponse> getEventCategories() {
        return eventCategoriesService.get()
                .stream()
                .map(EventCategoryResponse::from)
                .toList();
    }
}
