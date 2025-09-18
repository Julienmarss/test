package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import lombok.Builder;

import java.util.List;

@Builder
public record PersonalSituation(
        String maritalStatus,
        Integer numberOfChildren,
        String educationLevel,
        List<String> drivingLicenses,
        Boolean rqth
) {
    public static PersonalSituation of(UpdateCollaborator command) {
        return PersonalSituation.builder()
                .maritalStatus(command.maritalStatus().orElse(null))
                .numberOfChildren(command.numberOfChildren().orElse(null))
                .educationLevel(command.educationLevel().orElse(null))
                .drivingLicenses(command.drivingLicenses().orElse(List.of()))
                .rqth(command.rqth().orElse(null))
                .build();
    }
}

