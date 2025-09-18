package com.legipilot.service.core.administrator.domain.command;

import com.legipilot.service.core.administrator.domain.model.Password;
import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import lombok.Builder;

import java.util.Optional;

@Builder
public record SignUp(
        Authentication authentication,
        String email,
        Password password,
        String firstName,
        String lastName,
        Optional<String> picture,
        String fonction,
        String phone,

        String companyName,
        String siren,
        String siret,
        String legalForm,
        String nafCode,
        String activityDomain,
        String idcc,
        String collectiveAgreement) {
}
