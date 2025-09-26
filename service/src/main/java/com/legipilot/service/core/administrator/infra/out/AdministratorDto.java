package com.legipilot.service.core.administrator.infra.out;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.legipilot.service.core.administrator.domain.model.*;
import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import com.legipilot.service.core.company.infra.out.CompanyDto;
import com.legipilot.service.shared.infra.out.database.StringListConvertor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;

@Entity
@Table(name = "administrators")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdministratorDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String email;

    @NotBlank
    private String firstname;
    @NotBlank
    private String lastname;
    @Column(name = "encoded_password")
    private String encodedPassword;
    private String picture;
    private String phone;
    private String fonction;
    private Boolean isNewsViewed;
    private Boolean isNotifViewed;
    private String accountState;

    private String tenant;
    private String sub;

    @Convert(converter = StringListConvertor.class)
    @JsonIgnore
    private List<String> roles;

    @ManyToMany
    @JoinTable(
            name = "companies_administrators",
            joinColumns = @JoinColumn(name = "administrator_id"),
            inverseJoinColumns = @JoinColumn(name = "company_id")
    )
    
    private List<CompanyDto> companies;

    public static AdministratorDto from(Administrator administrator) {
        return AdministratorDto.builder()
                .id(administrator.id())
                .tenant(administrator.authentication().tenant().name())
                .sub(administrator.authentication().sub())
                .email(administrator.email())
                .encodedPassword(administrator.password().value())
                .firstname(administrator.firstname())
                .lastname(administrator.lastname())
                .picture(administrator.picture().orElse(null))
                .fonction(administrator.fonction().name())
                .isNewsViewed(administrator.isNewsViewed())
                .isNotifViewed(administrator.isNotifViewed())
                .phone(administrator.phone())
                .roles(administrator.roles().stream().map(Role::name).toList())
                .accountState(administrator.state().name())
                .companies(administrator.companies() != null ?
                    administrator.companies().stream()
                            .map(company -> CompanyDto.builder().id(company.id()).build())
                            .toList() :
                    new ArrayList<>())
                .build();
    }

    public Administrator toDomain() {
        return Administrator.builder()
                .id(id)
                .authentication(new Authentication(Tenant.valueOf(tenant), sub))
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .picture(Optional.ofNullable(picture))
                .fonction(Fonction.valueOf(fonction))
                .isNewsViewed(isNewsViewed)
                .isNotifViewed(isNotifViewed)
                .phone(phone)
                .roles(roles.stream().map(Role::valueOf).toList())
                .companies(new ArrayList<>(companies.stream().map(CompanyDto::toDomain).toList()))
                .password(new EncodedPassword(encodedPassword))
                .state(AccountState.valueOf(accountState))
                .build();
    }

    public AuthenticatedAdministratorDetails toAuthenticatedAdministrator() {
        AuthenticatedAdministratorDetails authenticatedAdministratorDetails = new AuthenticatedAdministratorDetails();
        List<SimpleGrantedAuthority> authorities = this.roles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();
        authenticatedAdministratorDetails.setUsername(this.email());
        authenticatedAdministratorDetails.setEmail(this.email());
        authenticatedAdministratorDetails.setPicture(this.picture());
        authenticatedAdministratorDetails.setPassword(this.encodedPassword());
        authenticatedAdministratorDetails.setName(this.firstname() + ' ' + this.lastname());
        authenticatedAdministratorDetails.setState(this.accountState());
        authenticatedAdministratorDetails.setAuthorities(authorities);
        return authenticatedAdministratorDetails;
    }

    public Administrator toDomainWithoutCompany() {
        return Administrator.builder()
                .id(id)
                .authentication(new Authentication(Tenant.valueOf(tenant), sub))
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .picture(Optional.ofNullable(picture))
                .phone(phone)
                .fonction(Fonction.valueOf(fonction))
                .roles(roles.stream().map(Role::valueOf).toList())
                .password(new EncodedPassword(encodedPassword))
                .state(AccountState.valueOf(accountState))
                .build();
    }
}
