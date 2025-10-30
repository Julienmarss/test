package com.legipilot.service.core.authorization.domain;

import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import lombok.Builder;

import java.util.UUID;

@Builder
public record CompanyInfo(
        UUID companyId,
        CompanyRight rights,
        String companyName,
        String picture
) {
}
