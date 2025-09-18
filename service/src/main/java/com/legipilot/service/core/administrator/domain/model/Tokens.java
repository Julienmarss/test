package com.legipilot.service.core.administrator.domain.model;

import java.time.Instant;

public record Tokens(String accessToken, Instant expiration) {

    public static Tokens aPartirDe(String accessToken, Instant expiration) {
        return new Tokens(accessToken, expiration);
    }

}
