package com.legipilot.service.core.administrator.authentication.infra.in.response;

import com.legipilot.service.core.administrator.authentication.domain.AuthenticatedAdministrator;
import lombok.Builder;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Builder
public record AuthenticatedAdministratorResponse(
        UUID id,
        String email,
        String firstname,
        String lastname,
        String picture,
        List<String> roles,
        String accessToken,
        String expiration
) {
    public static AuthenticatedAdministratorResponse from(AuthenticatedAdministrator administrator) {
        String expiration = DateTimeFormatter.ISO_INSTANT.format(administrator.tokens().expiration());
        return AuthenticatedAdministratorResponse.builder()
                .id(administrator.administrator().id())
                .email(administrator.administrator().email())
                .firstname(administrator.administrator().firstname())
                .lastname(administrator.administrator().lastname())
                .picture(administrator.administrator().picture().orElse(null))
                .roles(administrator.administrator().roles().stream().map(Enum::name).toList())
                .accessToken(administrator.tokens().accessToken())
                .expiration(expiration)
                .build();
    }
}
