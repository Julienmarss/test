package com.legipilot.service.core.authorization.domain;

import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import lombok.Builder;

import java.util.UUID;

@Builder
public record CompanyAdministratorInfo(UUID administratorId, CompanyRight rights, String firstname, String lastname,
                                       String email) {
}
