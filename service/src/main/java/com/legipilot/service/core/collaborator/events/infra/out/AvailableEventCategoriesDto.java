package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.events.domain.model.category.AvailableEventCategory;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AvailableEventCategoriesDto(UUID id, Integer sequence, String title, String subtitle, String action, String icon,
                                          String color) {
    public AvailableEventCategory versDomaine() {
        return AvailableEventCategory.builder()
                .id(id)
                .sequence(sequence != null ? sequence : Integer.MAX_VALUE)
                .title(title)
                .subtitle(subtitle)
                .action(action)
                .icon(icon)
                .color(color)
                .build();
    }
}
