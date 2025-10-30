package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.events.CompleteTriggeredEventUseCase;
import com.legipilot.service.core.collaborator.events.EventsService;
import com.legipilot.service.core.collaborator.events.domain.command.CompleteTriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/triggered-events")
@RequiredArgsConstructor
public class TriggeredEventController {

    private final EventsService eventsService;
    private final CompleteTriggeredEventUseCase completeTriggeredEventUseCase;

    @GetMapping("/{triggeredEventId}")
    public TriggeredEventResponse getTriggeredEvent(@PathVariable UUID triggeredEventId) {
        return TriggeredEventResponse.from(
                eventsService.get(TriggeredEventId.of(triggeredEventId))
        );
    }

    @PutMapping("/{triggeredEventId}/complete")
    public TriggeredEventResponse completeTriggeredEvent(
            @PathVariable UUID triggeredEventId,
            @RequestBody CompleteTriggeredEventRequest request
    ) {
        CompleteTriggeredEvent command = CompleteTriggeredEvent.builder()
                .triggeredEventId(TriggeredEventId.of(triggeredEventId))
                .actionsData(request.actionsData())
                .build();

        return TriggeredEventResponse.from(completeTriggeredEventUseCase.execute(command));
    }
}