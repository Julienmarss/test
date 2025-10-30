package com.legipilot.service.core.collaborator.events.domain.model.event.action;

import java.util.UUID;

public record ActionId(UUID value) {

    public static ActionId of(UUID value) {
        return new ActionId(value);
    }

}