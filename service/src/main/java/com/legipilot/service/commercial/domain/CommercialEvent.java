package com.legipilot.service.commercial.domain;

import com.legipilot.service.shared.domain.model.Event;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;

import java.util.UUID;

@Getter
@Accessors(fluent = true)
@RequiredArgsConstructor
public abstract class CommercialEvent extends Event {
    private final UUID aggregateId;
    private final String action;

    private final UUID actorId;
    private final Object content;
}
