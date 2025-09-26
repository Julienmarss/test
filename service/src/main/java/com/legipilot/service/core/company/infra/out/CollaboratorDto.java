package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.Civility;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.SocialSecurityNumber;
import com.legipilot.service.core.collaborator.domain.model.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "collaborators")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollaboratorDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    private String picture;

    private String civility;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private String birthPlace;

    @Column(nullable = false)
    private String nationality;

    private String socialSecurityNumber;
    private String status;

    @Embedded
    private PersonalSituationDto personalInfo;

    @Embedded
    private ProfessionalSituationDto professionalSituation;

    @Embedded
    private ContractInformationsDto contractInformations;

    @Embedded
    private ContactDetailsDto contactDetails;

    @OneToMany(mappedBy = "collaborator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NoteDto> notes;

    @OneToMany(mappedBy = "collaborator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentDto> documents;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyDto company;

    public static CollaboratorDto from(Collaborator collaborator) {
        CollaboratorDto dto = CollaboratorDto.builder()
                .id(collaborator.id())
                .firstname(collaborator.firstname())
                .lastname(collaborator.lastname())
                .picture(Objects.isNull(collaborator.picture()) ? null : collaborator.picture().orElse(null))
                .civility(Objects.isNull(collaborator.civility()) ? null : collaborator.civility().name())
                .birthDate(collaborator.birthDate())
                .birthPlace(collaborator.birthPlace())
                .nationality(collaborator.nationality())
                .status(Objects.isNull(collaborator.status()) ? Status.ACTIVE.name() : collaborator.status().name())
                .socialSecurityNumber(Objects.isNull(collaborator.socialSecurityNumber()) ? null : collaborator.socialSecurityNumber().value())
                .personalInfo(Objects.isNull(collaborator.personalSituation()) ? null : PersonalSituationDto.from(collaborator.personalSituation()))
                .professionalSituation(Objects.isNull(collaborator.professionalSituation()) ? null : ProfessionalSituationDto.from(collaborator.professionalSituation()))
                .contractInformations(Objects.isNull(collaborator.contractInformations()) ? null : ContractInformationsDto.from(collaborator.contractInformations()))
                .contactDetails(Objects.isNull(collaborator.contactDetails()) ? null : ContactDetailsDto.from(collaborator.contactDetails()))
                .company(Objects.isNull(collaborator.company()) ? null : CompanyDto.builder().id(collaborator.company().id()).build())
                .build();

        if (collaborator.notes() != null) {
            dto.setNotes(
                    collaborator.notes().stream()
                            .map(note -> NoteDto.from(note, dto))
                            .toList()
            );
        }

        if (collaborator.documents() != null) {
            dto.setDocuments(
                    collaborator.documents().stream()
                            .map(doc -> DocumentDto.from(doc, dto))
                            .toList()
            );
        }

        return dto;
    }

//    public static CollaboratorDto fromWithoutCompany(Collaborator collaborator) {
//        CollaboratorDto dto = CollaboratorDto.builder()
//                .id(UUID.randomUUID())
//                .firstname(collaborator.firstname())
//                .lastname(collaborator.lastname())
//                .picture(collaborator.picture().orElse(null))
//                .civility(Objects.isNull(collaborator.civility()) ? null : collaborator.civility().name())
//                .birthDate(collaborator.birthDate())
//                .birthPlace(collaborator.birthPlace())
//                .nationality(collaborator.nationality())
//                .socialSecurityNumber(Objects.isNull(collaborator.socialSecurityNumber()) ? null : collaborator.socialSecurityNumber().value())
//                .personalSituation(Objects.isNull(collaborator.personalSituation()) ? null : PersonalInfoDto.from(collaborator.personalSituation()))
//                .professionalSituation(Objects.isNull(collaborator.professionalSituation()) ? null : ProfessionalInfoDto.from(collaborator.professionalSituation()))
//                .contractInfo(Objects.isNull(collaborator.contractInfo()) ? null : ContractInfoDto.from(collaborator.contractInfo()))
//                .contactDetails(Objects.isNull(collaborator.contactDetails()) ? null : ContactInfoDto.from(collaborator.contactDetails()))
//                .build();
//
//        if (collaborator.notes() != null) {
//            dto.setNotes(
//                    collaborator.notes().stream()
//                            .map(note -> NoteDto.from(note, dto))
//                            .toList()
//            );
//        }
//
//        if (collaborator.documents() != null) {
//            dto.setDocuments(
//                    collaborator.documents().stream()
//                            .map(doc -> DocumentDto.from(doc, dto))
//                            .toList()
//            );
//        }
//
//        return dto;
//    }

    public Collaborator toDomainWithoutCompany() {
        return Collaborator.builder()
                .id(id)
                .firstname(firstname)
                .lastname(lastname)
                .picture(Optional.ofNullable(picture))
                .civility(Objects.isNull(civility) ? null : Civility.valueOf(civility))
                .birthDate(birthDate)
                .birthPlace(birthPlace)
                .nationality(nationality)
                .socialSecurityNumber(Objects.isNull(socialSecurityNumber) ? null : new SocialSecurityNumber(socialSecurityNumber))
                .status(Objects.isNull(status) ? null : Status.valueOf(status))
                .personalSituation(Objects.isNull(personalInfo()) ? null : personalInfo.toDomain())
                .professionalSituation(Objects.isNull(professionalSituation()) ? null : professionalSituation().toDomain())
                .contractInformations(Objects.isNull(contractInformations()) ? null : contractInformations().toDomain())
                .contactDetails(Objects.isNull(contactDetails()) ? null : contactDetails().toDomain())
                .notes(new ArrayList<>(notes().stream().map(NoteDto::toDomain).toList()))
                .documents(new ArrayList<>(documents().stream().map(DocumentDto::toDomain).toList()))
                .build();
    }

    public Collaborator toDomain() {
        return Collaborator.builder()
                .id(id)
                .firstname(firstname)
                .lastname(lastname)
                .picture(Optional.ofNullable(picture))
                .civility(Objects.isNull(civility) ? null : Civility.valueOf(civility))
                .birthDate(birthDate)
                .birthPlace(birthPlace)
                .nationality(nationality)
                .socialSecurityNumber(Objects.isNull(socialSecurityNumber) ? null : new SocialSecurityNumber(socialSecurityNumber))
                .status(Objects.isNull(status) ? null : Status.valueOf(status))
                .personalSituation(Objects.isNull(personalInfo()) ? null : personalInfo.toDomain())
                .professionalSituation(Objects.isNull(professionalSituation()) ? null : professionalSituation().toDomain())
                .contractInformations(Objects.isNull(contractInformations()) ? null : contractInformations().toDomain())
                .contactDetails(Objects.isNull(contactDetails()) ? null : contactDetails().toDomain())
                .notes(new ArrayList<>(notes().stream().map(NoteDto::toDomain).toList()))
                .documents(new ArrayList<>(documents().stream().map(DocumentDto::toDomain).toList()))
                .company(Objects.isNull(company) ? null : company.toDomain())
                .build();
    }

    public void setCompany(CompanyDto companyDto) {
        this.company = companyDto;
    }

    private void setNotes(List<NoteDto> notes) {
        this.notes = notes;
    }

    private void setDocuments(List<DocumentDto> documents) {
        this.documents = documents;
    }
}
