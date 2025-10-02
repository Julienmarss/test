package com.legipilot.service.core.collaborator.domain.command;

import com.legipilot.service.core.collaborator.domain.model.Civility;
import com.legipilot.service.core.collaborator.domain.model.SocialSecurityNumber;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record CreateCollaborator(
        UUID companyId,
        String firstname,
        String lastname,
        Civility civility,
        LocalDate birthDate,
        String birthPlace,
        String nationality,
        SocialSecurityNumber socialSecurityNumber
) {
}
