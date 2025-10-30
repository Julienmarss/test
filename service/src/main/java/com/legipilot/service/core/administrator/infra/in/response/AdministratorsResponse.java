package com.legipilot.service.core.administrator.infra.in.response;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.company.infra.in.response.CompanyResponse;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record AdministratorsResponse(
        UUID id,
        String email,
        String firstname,
        String lastname,
        String picture,
        String fonction,
        String phone,
        List<String> roles,
        List<CompanyResponse> companies
) {
    public static AdministratorsResponse from(Administrator administrator) {
        return AdministratorsResponse.builder()
                .id(administrator.id())
                .email(administrator.email())
                .firstname(administrator.firstname())
                .fonction(administrator.fonction().label())
                .phone(administrator.phone())
                .lastname(administrator.lastname())
                .picture(administrator.picture().orElse(null))
                .roles(administrator.roles().stream().map(Enum::name).toList())
                .companies(administrator.companies().stream().map(CompanyResponse::from).toList())
                .build();
    }
}
