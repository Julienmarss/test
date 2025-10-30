package com.legipilot.service.core.company.infra.in.response;

import com.legipilot.service.core.company.domain.model.CollectiveAgreement;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record CompanyResponse(
        UUID id,
        String name,
        String siren,
        String siret,
        String legalForm,
        String nafCode,
        String activityDomain,
        String principalActivity,
        String picture,
        CollectiveAgreement collectiveAgreement,
        List<CollaboratorResponse> collaborators) {

    public static CompanyResponse from(Company company) {
        return CompanyResponse.builder()
                .id(company.id())
                .name(company.name())
                .siren(company.siren().value())
                .siret(company.siret().value())
                .legalForm(company.legalForm())
                .nafCode(company.nafCode().value())
                .activityDomain(company.activityDomain())
                .principalActivity(company.principalActivity())
                .picture(company.picture().orElse(null))
                .collectiveAgreement(company.collectiveAgreement())
                .collaborators(company.collaborators().stream().map(CollaboratorResponse::from).toList())
                .build();
    }

}
