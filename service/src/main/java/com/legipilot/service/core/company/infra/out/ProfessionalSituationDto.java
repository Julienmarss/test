package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.ContractType;
import com.legipilot.service.core.collaborator.domain.model.ProfessionalSituation;
import com.legipilot.service.core.collaborator.domain.model.WorkHoursType;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfessionalSituationDto {
    private String jobTitle;
    private String contractType;
    private LocalDate hireDate;
    private LocalDate endDate;
    private String location;
    private Integer workHoursPerWeek;
    private String workHoursType;
    private String responsible;

    public static ProfessionalSituationDto from(ProfessionalSituation professionalSituation) {
        return ProfessionalSituationDto.builder()
                .jobTitle(professionalSituation.jobTitle())
                .contractType(Objects.isNull(professionalSituation.contractType()) ? null : professionalSituation.contractType().name())
                .hireDate(professionalSituation.hireDate())
                .endDate(professionalSituation.endDate())
                .location(professionalSituation.location())
                .workHoursPerWeek(professionalSituation.workHoursPerWeek())
                .workHoursType(Objects.isNull(professionalSituation.workHoursType()) ? null : professionalSituation.workHoursType().name())
                .responsible(professionalSituation.responsible())
                .build();
    }

    public ProfessionalSituation toDomain() {
        return ProfessionalSituation.builder()
                .jobTitle(jobTitle)
                .contractType(Objects.isNull(contractType) ? null : ContractType.valueOf(contractType))
                .hireDate(hireDate)
                .endDate(endDate)
                .location(location)
                .workHoursPerWeek(workHoursPerWeek)
                .workHoursType(Objects.isNull(workHoursType) ? null : WorkHoursType.valueOf(workHoursType))
                .responsible(responsible)
                .build();
    }
}
