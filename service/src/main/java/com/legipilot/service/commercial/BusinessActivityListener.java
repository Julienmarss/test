package com.legipilot.service.commercial;

import com.legipilot.service.commercial.domain.CommercialEvent;
import com.legipilot.service.commercial.domain.CommercialEventsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusinessActivityListener {

    private final CommercialEventsRepository repository;

    @Async
    @EventListener
    public void handle(CommercialEvent event) {
        repository.save(event);
    }

}
