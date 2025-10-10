package com.legipilot.service.commercial.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaCommercialEventsRepository extends JpaRepository<CommercialEventDto, UUID> {
}
