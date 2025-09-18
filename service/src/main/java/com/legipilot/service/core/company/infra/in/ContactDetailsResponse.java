package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.ContactDetails;
import lombok.Builder;

import java.util.Objects;

@Builder
public record ContactDetailsResponse(
        String personalPhone,
        String personalEmail,
        EmergencyContactResponse emergencyContact,
        String personalAddress,
        String professionalPhone,
        String professionalEmail,
        String iban,
        String socialName,
        String siret,
        String tva,
        String rcs
){
    public static ContactDetailsResponse from(ContactDetails domain) {
        if(Objects.isNull(domain)) {
            return null;
        }
        return ContactDetailsResponse.builder()
                .personalPhone(domain.personalPhone())
                .personalEmail(domain.personalEmail())
                .personalAddress(domain.personalAddress())
                .emergencyContact(Objects.isNull(domain.emergencyContact()) ? null : EmergencyContactResponse.from(domain.emergencyContact()))
                .professionalPhone(domain.professionalPhone())
                .professionalEmail(domain.professionalEmail())
                .iban(domain.iban())
                .socialName(domain.socialName())
                .siret(domain.siret())
                .tva(domain.tva())
                .rcs(domain.rcs())
                .build();
    }
}
