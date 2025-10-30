package com.legipilot.service.core.company.infra.in.response;

import com.legipilot.service.core.authorization.domain.CompanyAdministratorInfo;

import java.util.UUID;

public record CompanyAdministratorResponse(
        UUID administratorId,
        String rights,
        String firstname,
        String lastname,
        String email
) {
    public static CompanyAdministratorResponse from(CompanyAdministratorInfo info) {
        return new CompanyAdministratorResponse(
                info.administratorId(),
                info.rights().name(),
                info.firstname(),
                info.lastname(),
                info.email()
        );
    }
}
