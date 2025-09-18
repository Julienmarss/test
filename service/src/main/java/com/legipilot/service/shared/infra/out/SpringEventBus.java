package com.legipilot.service.shared.infra.out;

import com.legipilot.service.shared.domain.EventBus;
import com.legipilot.service.shared.domain.model.Event;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpringEventBus implements EventBus {

    private static final String ERROR_MESSAGE_PUBLICATION = "Une erreur est survenue lors de la publication de l'evenement '%s' : %s";
    private final ApplicationEventPublisher applicationEventPublisher;

    private final Logger logger = LoggerFactory.getLogger(SpringEventBus.class);

    @Override
    public void publish(Event event) {
        try {
            applicationEventPublisher.publishEvent(event);
        } catch (Exception e) {
            logger.error(buildErrorMessage(event), e);
        }
    }

    private String buildErrorMessage(Event event) {
        return String.format(ERROR_MESSAGE_PUBLICATION, event.id(), event);
    }
}
