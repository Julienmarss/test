package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.ProfessionalSituation;
import lombok.Builder;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Builder
public record ProfessionalSituationResponse(
        String jobTitle,
        String contractType,
        String hireDate,
        String endDate,
        String location,
        String responsible,
        Integer workHoursPerWeek,
        String workHoursType
) {

    public static ProfessionalSituationResponse from(ProfessionalSituation domain) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        if(domain == null) {
            return null;
        }
        return ProfessionalSituationResponse.builder()
                .jobTitle(domain.jobTitle())
                .contractType(Objects.isNull(domain.contractType()) ? null : domain.contractType().name())
                .hireDate(Objects.isNull(domain.hireDate()) ? null : domain.hireDate().format(formatter))
                .endDate(Objects.isNull(domain.endDate()) ? null : domain.endDate().format(formatter))
                .location(domain.location())
                .workHoursPerWeek(domain.workHoursPerWeek())
                .workHoursType(Objects.isNull(domain.workHoursType()) ? null : domain.workHoursType().name())
                .responsible(domain.responsible())
                .build();
    }
}
