package com.legipilot.service.core.collaborator.events.domain.model.category;

import lombok.Getter;

import java.util.stream.Stream;

public enum EventCategoryIcon {
    paper("paper"),
    calendar("calendar"),
    userPlus("user-plus"),
    userMinus("user-minus"),
    question("question"),
    file("file");

    @Getter
    private final String value;

    EventCategoryIcon(String value) {
        this.value = value;
    }

    public static EventCategoryIcon fromValue(String icon) {
        return Stream.of(EventCategoryIcon.values())
                .filter(e -> e.value.equals(icon))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid icon: " + icon));
    }
}
