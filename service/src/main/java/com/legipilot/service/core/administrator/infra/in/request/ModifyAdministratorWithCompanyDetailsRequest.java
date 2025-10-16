package com.legipilot.service.core.administrator.infra.in.request;

import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.model.Fonction;

import java.util.Optional;
import java.util.UUID;

public record ModifyAdministratorWithCompanyDetailsRequest(
        String firstname,
        String lastname,
        String email,
        String phone,
        String fonction,
        Boolean isNewsViewed,
        Boolean isNotifViewed,

        // Nouveaux champs pour les infos company
        UUID idCompany,
        String companyName,
        String siren,
        String siret,
        String legalForm,
        String nafCode,
        String principalActivity,
        String activityDomain,
        String idcc,
        String companyPicture
) {
    public ModifyAdministratorWithCompanyDetails toDomain(UUID id) {
        return ModifyAdministratorWithCompanyDetails.builder()
                .id(id)
                .firstname(Optional.ofNullable(firstname))
                .lastname(Optional.ofNullable(lastname))
                .email(Optional.ofNullable(email))
                .phone(Optional.ofNullable(phone))
                .fonction(Optional.ofNullable(fonction).map(Fonction::fromLabel))
                .isNewsViewed(Optional.ofNullable(isNewsViewed))
                .isNotifViewed(Optional.ofNullable(isNotifViewed))

                .idCompany(Optional.ofNullable(idCompany))
                .companyName(Optional.ofNullable(companyName))
                .siren(Optional.ofNullable(siren))
                .siret(Optional.ofNullable(siret))
                .legalForm(Optional.ofNullable(legalForm))
                .nafCode(Optional.ofNullable(nafCode))
                .principalActivity(Optional.ofNullable(principalActivity))
                .activityDomain(Optional.ofNullable(activityDomain))
                .idcc(Optional.ofNullable(idcc))
                .companyPicture(Optional.ofNullable(companyPicture))
                .build();
    }
}