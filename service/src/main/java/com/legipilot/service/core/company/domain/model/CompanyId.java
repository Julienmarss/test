package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidCompanyId;

import java.util.UUID;

public record CompanyId(UUID value) {

    public CompanyId {
        if (value == null) {
            throw new InvalidCompanyId();
        }
    }
}
