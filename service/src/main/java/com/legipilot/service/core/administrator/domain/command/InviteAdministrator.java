package com.legipilot.service.core.administrator.domain.command;

import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import lombok.Builder;

import java.util.UUID;

@Builder
public record InviteAdministrator(
        String email,
        CompanyRight rights,
        UUID companyId
) {
}