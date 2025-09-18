package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.collaborator.domain.model.Civility;
import com.legipilot.service.core.collaborator.domain.model.EmergencyContact;
import lombok.Builder;

@Builder
public record EmergencyContactResponse(
        Civility civility,
        String firstname,
        String lastname,
        String phone,
        String email
) {
    public static EmergencyContactResponse from(EmergencyContact domain) {
        return EmergencyContactResponse.builder()
                .civility(domain.civility())
                .firstname(domain.firstname())
                .lastname(domain.lastname())
                .phone(domain.phone())
                .email(domain.email())
                .build();
    }
}
