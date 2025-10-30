package com.legipilot.service.core.collaborator.events.domain.model.event;

import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryColor;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryIcon;
import com.legipilot.service.core.collaborator.events.domain.model.category.EventCategoryId;
import lombok.Builder;

@Builder
public record EventCategory(EventCategoryId id, int sequence, String title, String subtitle, String action, EventCategoryIcon icon, EventCategoryColor color) {
}
