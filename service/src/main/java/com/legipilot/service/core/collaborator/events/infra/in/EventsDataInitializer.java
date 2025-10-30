package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.IntegrateEventCategoriesUseCase;
import com.legipilot.service.core.collaborator.events.IntegrateEventsUseCase;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventsDataInitializer {

    @NonNull
    private final IntegrateEventCategoriesUseCase eventGroupsUseCase;
    @NonNull
    private final IntegrateEventsUseCase eventsUseCase;

    public void bootstrap() {
        log.info("----- Bootstraping legipilot event groups -----");
        eventGroupsUseCase.execute();

        log.info("----- Bootstraping legipilot events -----");
        eventsUseCase.execute();
    }

}
