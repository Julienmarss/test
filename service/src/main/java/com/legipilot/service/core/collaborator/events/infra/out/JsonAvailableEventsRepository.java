package com.legipilot.service.core.collaborator.events.infra.out;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legipilot.service.core.collaborator.events.domain.AvailableEventsRepository;
import com.legipilot.service.core.collaborator.events.domain.model.event.AvailableEvent;
import com.legipilot.service.core.collaborator.events.domain.model.event.AvailableEvents;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JsonAvailableEventsRepository implements AvailableEventsRepository {

    private final ObjectMapper objectMapper;

    private static final String EVENTS_GLOB = "classpath*:domain/events/list/*.json";

    @Override
    public AvailableEvents load() {
        try {
            ResourcePatternResolver resolver =
                    new PathMatchingResourcePatternResolver(this.getClass().getClassLoader());
            Resource[] resources = resolver.getResources(EVENTS_GLOB);

            if (resources.length == 0) {
                throw new IOException("No JSON files found for pattern: " + EVENTS_GLOB);
            }

            List<AvailableEvent> events = new ArrayList<>();

            java.util.Arrays.stream(resources)
                    .filter(Resource::isReadable)
                    .filter(r -> {
                        String name = r.getFilename();
                        return name != null && name.endsWith(".json");
                    })
                    .sorted(Comparator.comparing(Resource::getFilename, Comparator.nullsLast(String::compareTo)))
                    .forEach(resource -> {
                        try (InputStream is = resource.getInputStream()) {
                            AvailableEventsDto dto = objectMapper.readValue(is, AvailableEventsDto.class);
                            events.add(dto.toDomain());
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to read " + resource.getDescription(), e);
                        }
                    });

            return new AvailableEvents(events);

        } catch (IOException e) {
            throw new RuntimeException("Unable to load events from pattern '%s'".formatted(EVENTS_GLOB), e);
        }
    }
}
