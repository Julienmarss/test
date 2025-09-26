package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.ContactDetails;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactDetailsDto {
    private String personalPhone;
    private String personalEmail;
    private String personalAddress;
    private String professionalPhone;
    private String professionalEmail;
    private String iban;
    private String bic;
    private String socialName;
    private String siret;
    private String tva;
    private String rcs;

    @Embedded
    private EmergencyContactDto emergencyContact;

    public static ContactDetailsDto from(ContactDetails domain) {
        return ContactDetailsDto.builder()
                .personalPhone(domain.personalPhone())
                .personalEmail(domain.personalEmail())
                .personalAddress(domain.personalAddress())
                .emergencyContact(Objects.isNull(domain.emergencyContact()) ? null : EmergencyContactDto.from(domain.emergencyContact()))
                .professionalPhone(domain.professionalPhone())
                .professionalEmail(domain.professionalEmail())
                .iban(domain.iban())
                .bic(domain.bic())
                .socialName(domain.socialName())
                .siret(domain.siret())
                .tva(domain.tva())
                .rcs(domain.rcs())
                .build();
    }

    public ContactDetails toDomain() {
        return ContactDetails.builder()
                .personalPhone(personalPhone)
                .personalEmail(personalEmail)
                .personalAddress(personalAddress)
                .emergencyContact(Objects.isNull(emergencyContact) ? null : emergencyContact.toDomain())
                .professionalPhone(professionalPhone)
                .professionalEmail(professionalEmail)
                .iban(iban)
                .bic(bic)
                .socialName(socialName)
                .siret(siret)
                .tva(tva)
                .rcs(rcs)
                .build();
    }
}
