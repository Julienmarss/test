package com.legipilot.service.core.administrator.authentication.domain;

import com.legipilot.service.core.administrator.domain.model.Tenant;
import lombok.Builder;

@Builder
public record Authentication(Tenant tenant, String sub) {
}
