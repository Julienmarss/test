package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.company.domain.command.ModifyCompany;
import com.legipilot.service.core.company.domain.model.CollectiveAgreement;

import java.util.Optional;
import java.util.UUID;

public record ModifyCompanyRequest(
        String companyName,
        String siren,
        String siret,
        String legalForm,
        String nafCode,
        String principalActivity,
        String activityDomain,
        String idcc,
        String collectiveAgreementTitle,
        String companyPicture
) {
    public ModifyCompany toDomain(UUID companyId) {
        return ModifyCompany.builder()
                .id(companyId)
                .companyName(Optional.ofNullable(companyName))
                .siren(Optional.ofNullable(siren))
                .siret(Optional.ofNullable(siret))
                .legalForm(Optional.ofNullable(legalForm))
                .nafCode(Optional.ofNullable(nafCode))
                .principalActivity(Optional.ofNullable(principalActivity))
                .activityDomain(Optional.ofNullable(activityDomain))
                .collectiveAgreement(
                        (idcc != null && collectiveAgreementTitle != null)
                                ? Optional.of(new CollectiveAgreement(idcc, collectiveAgreementTitle))
                                : Optional.empty()
                )
                .idcc(Optional.ofNullable(idcc))
                .companyPicture(Optional.ofNullable(companyPicture))
                .build();
    }
}