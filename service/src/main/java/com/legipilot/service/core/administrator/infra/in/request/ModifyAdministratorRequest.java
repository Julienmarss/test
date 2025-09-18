package com.legipilot.service.core.administrator.infra.in.request;

import com.legipilot.service.core.administrator.domain.command.ModifyAdministrator;
import com.legipilot.service.core.administrator.domain.model.Fonction;

import java.util.Optional;
import java.util.UUID;

public record ModifyAdministratorRequest(
        String firstname,
        String lastname,
        String email,
        String phone,
        String fonction
) {
    public ModifyAdministrator toDomain(UUID id) {
        return ModifyAdministrator.builder()
                .id(id)
                .firstname(Optional.ofNullable(firstname))
                .lastname(Optional.ofNullable(lastname))
                .email(Optional.ofNullable(email))
                .phone(Optional.ofNullable(phone))
                .fonction(Optional.ofNullable(fonction).map(Fonction::fromLabel))
                .build();
    }
}
