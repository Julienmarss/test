package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.Civility;
import com.legipilot.service.core.collaborator.domain.model.EmergencyContact;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyContactDto {

    @Column(name = "emergency_civility")
    private String civility;

    @Column(name = "emergency_firstname")
    private String firstname;

    @Column(name = "emergency_lastname")
    private String lastname;

    @Column(name = "emergency_phone")
    private String phone;

    @Column(name = "emergency_email")
    private String email;

    public static EmergencyContactDto from(EmergencyContact domain) {
        return EmergencyContactDto.builder()
                .civility(Objects.isNull(domain.civility()) ? null : domain.civility().name())
                .firstname(domain.firstname())
                .lastname(domain.lastname())
                .phone(domain.phone())
                .email(domain.email())
                .build();
    }

    public EmergencyContact toDomain() {
        return EmergencyContact.builder()
                .civility(Objects.isNull(civility) ? null : Civility.valueOf(civility))
                .firstname(firstname)
                .lastname(lastname)
                .phone(phone)
                .email(email)
                .build();
    }
}
