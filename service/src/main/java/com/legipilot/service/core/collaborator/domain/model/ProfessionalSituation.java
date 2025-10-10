package com.legipilot.service.core.collaborator.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record ProfessionalSituation(
    String jobTitle,
    ContractType contractType,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate hireDate,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
    String location,
    String responsible,
    Integer workHoursPerWeek,
    WorkHoursType workHoursType
) {
    public static ProfessionalSituation of(UpdateCollaborator command) {
        return ProfessionalSituation.builder()
            .jobTitle(command.jobTitle().orElse(null))
            .contractType(command.contractType().orElse(null))
            .hireDate(command.hireDate().orElse(null))
            .endDate(command.endDate().orElse(null))
            .location(command.location().orElse(null))
            .responsible(command.responsible().orElse(null))
            .workHoursPerWeek(command.workHoursPerWeek().orElse(null))
            .workHoursType(command.workHoursType().orElse(null))
            .build();
    }
}
