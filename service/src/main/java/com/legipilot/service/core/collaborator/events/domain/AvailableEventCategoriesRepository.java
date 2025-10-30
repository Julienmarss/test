package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.events.domain.model.category.AvailableEventCategories;

public interface AvailableEventCategoriesRepository {

    AvailableEventCategories load();

}
