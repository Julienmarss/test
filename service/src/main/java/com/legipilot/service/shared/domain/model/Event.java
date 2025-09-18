package com.legipilot.service.shared.domain.model;

import java.time.Instant;
import java.util.UUID;

public abstract class Event {

  private final UUID id = UUID.randomUUID();
  private final Instant occurredAt = Instant.now();

  public UUID id() {
    return id;
  }

  public Instant occurredAt() {
    return occurredAt;
  }

}
