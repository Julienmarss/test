package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.ContractInformations;
import com.legipilot.service.core.collaborator.domain.model.SocioProfessionalCategory;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Objects;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContractInformationsDto {
    private String category;
    private String classification;
    private BigDecimal annualSalary;
    private BigDecimal variableCompensation;
    private BigDecimal totalCompensation;
    private BigDecimal benefitsInKind;
    private String trialPeriod;
    private Boolean nonCompeteClause;
    private String residencePermit;

    public static ContractInformationsDto from(ContractInformations domain) {
        return ContractInformationsDto.builder()
                .category(Objects.isNull(domain.category()) ? null : domain.category().name())
                .classification(domain.classification())
                .annualSalary(domain.annualSalary())
                .variableCompensation(domain.variableCompensation())
                .totalCompensation(domain.totalCompensation())
                .benefitsInKind(domain.benefitsInKind())
                .trialPeriod(domain.trialPeriod())
                .nonCompeteClause(domain.nonCompeteClause())
                .residencePermit(domain.residencePermit())
                .build();
    }

    public ContractInformations toDomain() {
        return ContractInformations.builder()
                .category(Objects.isNull(category) ? null : SocioProfessionalCategory.valueOf(category))
                .classification(classification)
                .annualSalary(annualSalary)
                .variableCompensation(variableCompensation)
                .totalCompensation(totalCompensation)
                .benefitsInKind(benefitsInKind)
                .trialPeriod(trialPeriod)
                .nonCompeteClause(nonCompeteClause)
                .residencePermit(residencePermit)
                .build();
    }
}
