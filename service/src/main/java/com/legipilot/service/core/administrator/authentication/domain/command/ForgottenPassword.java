package com.legipilot.service.core.administrator.authentication.domain.command;

import jakarta.validation.constraints.NotBlank;

public record ForgottenPassword(@NotBlank String email) {}