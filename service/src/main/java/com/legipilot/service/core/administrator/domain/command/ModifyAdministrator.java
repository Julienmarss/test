package com.legipilot.service.core.administrator.domain.command;

import com.legipilot.service.core.administrator.domain.model.Fonction;
import lombok.Builder;

import java.util.Optional;
import java.util.UUID;

@Builder
public record ModifyAdministrator(
        UUID id,
        Optional<String> firstname,
        Optional<String> lastname,
        Optional<String> email,
        Optional<String> phone,
        Optional<Fonction> fonction
) {
}
