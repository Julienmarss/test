package com.legipilot.service.core.administrator.authentication.infra.in.request;

import com.legipilot.service.core.administrator.authentication.domain.command.ChangePassword;
import com.legipilot.service.core.administrator.domain.model.Password;

import java.util.UUID;

public record ChangePasswordRequest(UUID token, String email, String password) {

    public ChangePassword toDomain(String nouveauMotDePasseEncode) {
        return new ChangePassword(email, token, new Password(password, nouveauMotDePasseEncode));
    }

}