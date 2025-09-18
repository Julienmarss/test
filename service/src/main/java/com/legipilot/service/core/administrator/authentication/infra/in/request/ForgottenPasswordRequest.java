package com.legipilot.service.core.administrator.authentication.infra.in.request;

import com.legipilot.service.core.administrator.authentication.domain.command.ForgottenPassword;

public record ForgottenPasswordRequest(
    String email
) {
    public ForgottenPassword toDomain() {
        return new ForgottenPassword(email);
    }
}