package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legipilot.service.core.collaborator.events.domain.AvailableEventCategoriesRepository;
import com.legipilot.service.core.collaborator.events.domain.model.category.AvailableEventCategories;
import com.legipilot.service.core.collaborator.events.domain.model.category.AvailableEventCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JsonAvailableEventCategoriesRepository implements AvailableEventCategoriesRepository {

    private final ObjectMapper objectMapper;

    private static final String EVENT_CATEGORIES_FILE_PATH = "domain/events/event-categories.json";

    @Override
    public AvailableEventCategories load() {
        try {
            byte[] fileAsBytes = this.getClass().getClassLoader()
                    .getResourceAsStream(EVENT_CATEGORIES_FILE_PATH)
                    .readAllBytes();
            List<AvailableEventCategory> categories = objectMapper.readValue(fileAsBytes, new TypeReference<List<AvailableEventCategoriesDto>>() {
                    })
                    .stream()
                    .map(AvailableEventCategoriesDto::versDomaine)
                    .toList();
            return new AvailableEventCategories(categories);
        } catch (IOException e) {
            throw new RuntimeException("Impossible to load '%s' resources file".formatted(EVENT_CATEGORIES_FILE_PATH), e);
        }
    }

}
