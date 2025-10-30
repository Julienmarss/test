package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.authorization.infra.out.CompanyAdministratorDto;
import com.legipilot.service.core.company.domain.model.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyDto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String siren;

    @Column(nullable = false)
    private String siret;

    @Column(nullable = false)
    private String legalForm;

    @Column(nullable = false)
    private String nafCode;

    @Column(nullable = false)
    private String activityDomain;

    @Column
    private String principalActivity;

    @Column(nullable = false)
    private String idcc;

    @Column(nullable = false)
    private String collectiveAgreement;

    private String picture;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CompanyAdministratorDto> administratorAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CollaboratorDto> collaborators = new ArrayList<>();

    public static CompanyDto from(Company company) {
        CompanyDto companyDto = CompanyDto.builder()
                .id(company.id())
                .name(company.name())
                .siren(company.siren().value())
                .siret(company.siret().value())
                .legalForm(company.legalForm())
                .nafCode(company.nafCode().value())
                .activityDomain(company.activityDomain())
                .principalActivity(company.principalActivity())
                .idcc(company.collectiveAgreement().idcc())
                .picture(company.picture().orElse(null))
                .collectiveAgreement(company.collectiveAgreement().titre())
                .administratorAssociations(new ArrayList<>())
                .build();

        List<CollaboratorDto> collaborators = company.collaborators().stream()
                .map(CollaboratorDto::from)
                .peek(dto -> dto.setCompany(companyDto))
                .toList();

        companyDto.setCollaborators(new ArrayList<>(collaborators));

        return companyDto;
    }

    public Company toDomain() {
        return Company.builder()
                .id(id)
                .name(name)
                .siren(new Siren(siren))
                .siret(new Siret(siret))
                .legalForm(legalForm)
                .nafCode(new NafCode(nafCode))
                .activityDomain(activityDomain)
                .principalActivity(principalActivity)
                .collectiveAgreement(new CollectiveAgreement(idcc, collectiveAgreement))
                .picture(Optional.ofNullable(picture))
                .administrators(new ArrayList<>(administratorAssociations != null ?
                        administratorAssociations.stream()
                                .filter(assoc -> assoc.administrator() != null)
                                .map(assoc -> assoc.administrator().toDomainWithoutCompany())
                                .toList() :
                        new ArrayList<>()))
                .collaborators(new ArrayList<>(collaborators.stream()
                        .map(CollaboratorDto::toDomainWithoutCompany).toList()))
                .build();
    }

    private void setCollaborators(List<CollaboratorDto> collaborators) {
        this.collaborators = collaborators;
    }

    public void setAdministratorAssociations(List<CompanyAdministratorDto> associations) {
        this.administratorAssociations = associations;
    }
}