package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.ContractInformations;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.Objects;

@Builder
public record ContractInformationsResponse(
        String category,
        String classification,
        BigDecimal annualSalary,
        BigDecimal variableCompensation,
        BigDecimal totalCompensation,
        BigDecimal benefitsInKind,
        String trialPeriod,
        Boolean nonCompeteClause
) {
    public static ContractInformationsResponse from(ContractInformations domain) {
        if(domain == null) {
            return null;
        }
        return ContractInformationsResponse.builder()
                .category(Objects.isNull(domain.category()) ? null : domain.category().label())
                .classification(domain.classification())
                .annualSalary(domain.annualSalary())
                .variableCompensation(domain.variableCompensation())
                .totalCompensation(domain.totalCompensation())
                .benefitsInKind(domain.benefitsInKind())
                .trialPeriod(domain.trialPeriod())
                .nonCompeteClause(domain.nonCompeteClause())
                .build();
    }
}
