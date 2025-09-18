package com.legipilot.service.core.administrator.authentication.domain.command;

import com.legipilot.service.core.administrator.domain.model.Password;

import java.util.UUID;

public record ChangePassword(String email, UUID token, Password newPassword) {
}
