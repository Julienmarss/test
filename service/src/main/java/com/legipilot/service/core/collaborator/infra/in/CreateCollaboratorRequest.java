package com.legipilot.service.core.collaborator.infra.in;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.legipilot.service.core.collaborator.domain.command.CreateCollaborator;
import com.legipilot.service.core.collaborator.domain.model.Civility;
import com.legipilot.service.core.collaborator.domain.model.SocialSecurityNumber;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

public record CreateCollaboratorRequest(
        String firstname,
        String lastname,
        String civility,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate birthDate,
        String birthPlace,
        String nationality,
        String socialSecurityNumber,
        String personalEmail
) {
    public CreateCollaborator toDomain(UUID companyId) {
        return CreateCollaborator.builder()
                .companyId(companyId)
                .firstname(firstname)
                .lastname(lastname)
                .civility(Objects.isNull(civility) ? null : Civility.valueOf(civility))
                .birthDate(birthDate)
                .birthPlace(birthPlace)
                .nationality(nationality)
                .socialSecurityNumber(Objects.isNull(socialSecurityNumber) ? null : new SocialSecurityNumber(socialSecurityNumber))
                .personalEmail(personalEmail)
                .build();
    }
}
