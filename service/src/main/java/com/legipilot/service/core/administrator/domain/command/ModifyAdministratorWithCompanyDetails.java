package com.legipilot.service.core.administrator.domain.command;

import com.legipilot.service.core.administrator.domain.model.Fonction;
import com.legipilot.service.core.company.domain.model.CollectiveAgreement;
import lombok.Builder;

import java.util.Optional;
import java.util.UUID;

@Builder
public record ModifyAdministratorWithCompanyDetails(
        UUID id,
        Optional<String> firstname,
        Optional<String> lastname,
        Optional<String> email,
        Optional<String> phone,
        Optional<Fonction> fonction,
        Optional<Boolean> isNotifViewed,
        Optional<Boolean> isNewsViewed,

        Optional<UUID> idCompany,
        Optional<String> companyName,
        Optional<String> siren,
        Optional<String> siret,
        Optional<String> legalForm,
        Optional<String> nafCode,
        Optional<String> principalActivity,
        Optional<String> activityDomain,
        Optional<CollectiveAgreement> collectiveAgreement,
        Optional<String> idcc,
        Optional<String> companyPicture
) {
}