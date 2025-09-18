package com.legipilot.service.core.administrator.infra.in.response;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.company.domain.model.*;
import lombok.Builder;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Builder
public record AdministratorResponse(
        UUID id,
        String email,
        String firstname,
        String lastname,
        String picture,
        String fonction,
        Boolean isNewsViewed,
        Boolean isNotifViewed,
        String phone,
        List<String> roles,
        List<CompanyLite> companies
) {

    @Builder
    public record CompanyLite(
            UUID id,
            String name,
            String siren,
            String siret,
            String legalForm,
            String nafCode,
            String picture,
            String activityDomain,
            CollectiveAgreement collectiveAgreement
    ) {
        public static CompanyLite from(Company company) {
            return CompanyLite.builder()
                .id(company.id())
                .name(company.name())
                .siren(company.siren() != null ? company.siren().value() : null)
                .siret(company.siret() != null ? company.siret().value() : null)
                .legalForm(company.legalForm())
                .nafCode(company.nafCode() != null ? company.nafCode().value() : null)
                .picture(company.picture().orElse(null))
                .activityDomain(company.activityDomain())
                .collectiveAgreement(company.collectiveAgreement())
                .build();
        }
    }

    public static AdministratorResponse from(Administrator administrator) {
        return AdministratorResponse.builder()
                .id(administrator.id())
                .email(administrator.email())
                .firstname(administrator.firstname())
                .fonction(administrator.fonction().label())
                .isNotifViewed(administrator.isNotifViewed())
                .isNewsViewed(administrator.isNewsViewed())
                .phone(administrator.phone())
                .lastname(administrator.lastname())
                .picture(administrator.picture().orElse(null))
                .roles(administrator.roles().stream().map(Enum::name).toList())
                .companies(administrator.companies().stream()
                        .map(CompanyLite::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
