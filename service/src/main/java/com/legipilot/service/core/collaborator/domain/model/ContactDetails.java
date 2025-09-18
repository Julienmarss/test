package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import lombok.Builder;

@Builder
public record ContactDetails(
        String personalPhone,
        String personalEmail,
        EmergencyContact emergencyContact,
        String personalAddress,
        String professionalPhone,
        String professionalEmail,
        String iban,
        String socialName,
        String siret,
        String tva,
        String rcs
) {

    public static ContactDetails of(UpdateCollaborator command) {
        return ContactDetails.builder()
                .personalPhone(command.personalPhone().orElse(null))
                .personalEmail(command.personalEmail().orElse(null))
                .emergencyContact(EmergencyContact.of(command))
                .personalAddress(command.personalAddress().orElse(null))
                .professionalPhone(command.professionalPhone().orElse(null))
                .professionalEmail(command.professionalEmail().orElse(null))
                .iban(command.iban().orElse(null))
                .socialName(command.socialName().orElse(null))
                .siret(command.siret().orElse(null))
                .tva(command.tva().orElse(null))
                .rcs(command.rcs().orElse(null))
                .build();
    }
}