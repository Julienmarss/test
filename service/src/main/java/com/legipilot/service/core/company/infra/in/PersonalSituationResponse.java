package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.PersonalSituation;
import lombok.Builder;

import java.util.List;
import java.util.Objects;

@Builder
public record PersonalSituationResponse(
        String maritalStatus,
        Integer numberOfChildren,
        String educationLevel,
        List<String> drivingLicenses,
        Boolean rqth
) {

    public static PersonalSituationResponse from(PersonalSituation domain) {
        if (Objects.isNull(domain)) {
            return null;
        }
        return PersonalSituationResponse.builder()
                .maritalStatus(domain.maritalStatus())
                .numberOfChildren(domain.numberOfChildren())
                .educationLevel(domain.educationLevel())
                .drivingLicenses(domain.drivingLicenses())
                .rqth(domain.rqth())
                .build();
    }

}
