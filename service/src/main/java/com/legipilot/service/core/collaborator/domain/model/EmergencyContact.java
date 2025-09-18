package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import lombok.Builder;

@Builder
public record EmergencyContact(
        Civility civility,
        String firstname,
        String lastname,
        String phone,
        String email
) {
    public static EmergencyContact of(UpdateCollaborator command) {
        return EmergencyContact.builder()
                .civility(command.emergencyCivility().orElse(null))
                .firstname(command.emergencyFirstname().orElse(null))
                .lastname(command.emergencyLastname().orElse(null))
                .phone(command.emergencyPhone().orElse(null))
                .email(command.emergencyEmail().orElse(null))
                .build();
    }
}
