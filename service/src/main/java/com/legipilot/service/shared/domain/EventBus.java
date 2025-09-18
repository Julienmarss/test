package com.legipilot.service.shared.domain;

import com.legipilot.service.shared.domain.model.Event;

public interface EventBus {

    void publish(Event event);

}
