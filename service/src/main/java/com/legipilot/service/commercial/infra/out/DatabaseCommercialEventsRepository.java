package com.legipilot.service.commercial.infra.out;

import com.legipilot.service.commercial.domain.CommercialEvent;
import com.legipilot.service.commercial.domain.CommercialEventsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DatabaseCommercialEventsRepository implements CommercialEventsRepository {

    private final JpaCommercialEventsRepository repository;
    private final CommercialEventMapper mapper;

    @Override
    public void save(CommercialEvent event) {
        repository.save(CommercialEventDto.from(event, mapper.convertContent(event.content())));
    }
}