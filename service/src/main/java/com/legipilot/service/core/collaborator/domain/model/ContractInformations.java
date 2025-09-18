package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ContractInformations(
    SocioProfessionalCategory category,
    String classification,
    BigDecimal annualSalary,
    BigDecimal variableCompensation,
    BigDecimal totalCompensation,
    BigDecimal benefitsInKind,
    String trialPeriod, // duration
    Boolean nonCompeteClause
){
    public static ContractInformations of(UpdateCollaborator command) {
        return ContractInformations.builder()
            .category(command.category().orElse(null))
            .classification(command.classification().orElse(null))
            .annualSalary(command.annualSalary().orElse(null))
            .variableCompensation(command.variableCompensation().orElse(null))
            .totalCompensation(command.totalCompensation().orElse(null))
            .benefitsInKind(command.benefitsInKind().orElse(null))
            .trialPeriod(command.trialPeriod().orElse(null))
            .nonCompeteClause(command.nonCompeteClause().orElse(null))
            .build();
    }
}

