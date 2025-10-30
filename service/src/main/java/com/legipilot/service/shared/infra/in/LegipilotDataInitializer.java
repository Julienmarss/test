package com.legipilot.service.shared.infra.in;

import com.legipilot.service.core.collaborator.events.infra.in.EventsDataInitializer;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LegipilotDataInitializer {

    @NonNull
    private final EventsDataInitializer eventsDataInitializer;

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrap() {
        log.info("----- Bootstraping legipilot data -----");
        eventsDataInitializer.bootstrap();
    }

}
