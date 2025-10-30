package com.legipilot.service.core.collaborator.events.infra.out;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.domain.TriggeredEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEventId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DatabaseTriggeredEventsRepository implements TriggeredEventsRepository {

    private final JpaCollaboratorEventRepository repository;
    private final JpaTriggeredEventActionRepository actionRepository;

    @Override
    @Transactional
    public TriggeredEvent save(TriggeredEvent event) {
        TriggeredEventDto savedEvent = repository.save(TriggeredEventDto.from(event));

        actionRepository.deleteByTriggeredEventId(savedEvent.id());

        if (event.actionsData() != null && !event.actionsData().isEmpty()) {
            List<TriggeredEventActionDto> actions = event.actionsData().stream()
                    .map(actionData -> TriggeredEventActionDto.from(actionData, savedEvent.id()))
                    .toList();
            actionRepository.saveAll(actions);
        }

        return toDomain(savedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TriggeredEvent> get(TriggeredEventId eventId) {
        return repository.findById(eventId.value())
                .map(this::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TriggeredEvent> findFor(CollaboratorId collaboratorId) {
        return repository.findByCollaboratorId(collaboratorId.value()).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public void delete(TriggeredEventId eventId) {
        actionRepository.deleteByTriggeredEventId(eventId.value());
        repository.deleteById(eventId.value());
    }

    private TriggeredEvent toDomain(TriggeredEventDto dto) {
        List<TriggeredEventActionDto> actions = actionRepository.findByTriggeredEventId(dto.id());
        return dto.toDomain(actions);
    }
}
