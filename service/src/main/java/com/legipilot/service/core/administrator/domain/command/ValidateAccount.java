package com.legipilot.service.core.administrator.domain.command;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ValidateAccount(UUID administratorId, UUID token) {
}
