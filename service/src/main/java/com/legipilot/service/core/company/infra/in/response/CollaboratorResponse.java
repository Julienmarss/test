package com.legipilot.service.core.company.infra.in.response;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.Builder;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Builder
public record CollaboratorResponse(
        UUID id,
        String firstname,
        String lastname,
        String picture,
        String civility,
        String birthDate,
        String birthPlace,
        String nationality,
        String socialSecurityNumber,
        String status,
        ProfessionalSituationResponse professionalSituation,
        ContractInformationsResponse contractInformations,
        ContactDetailsResponse contactDetails,
        PersonalSituationResponse personalSituation,
        List<NoteResponse> notes,
        List<DocumentResponse> documents
) {

    public static CollaboratorResponse from(Collaborator collaborator) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return CollaboratorResponse.builder()
                .id(collaborator.id().value())
                .firstname(collaborator.firstname())
                .lastname(collaborator.lastname())
                .picture(collaborator.picture().orElse(null))
                .civility(Objects.isNull(collaborator.civility()) ? null : collaborator.civility().name())
                .birthDate(Objects.isNull(collaborator.birthDate()) ? null : collaborator.birthDate().format(formatter))
                .birthPlace(collaborator.birthPlace())
                .nationality(collaborator.nationality())
                .socialSecurityNumber(Objects.isNull(collaborator.socialSecurityNumber()) ? null : collaborator.socialSecurityNumber().value())
                .professionalSituation(ProfessionalSituationResponse.from(collaborator.professionalSituation()))
                .contractInformations(ContractInformationsResponse.from(collaborator.contractInformations()))
                .contactDetails(ContactDetailsResponse.from(collaborator.contactDetails()))
                .personalSituation(PersonalSituationResponse.from(collaborator.personalSituation()))
                .notes(collaborator.notes().stream().map(NoteResponse::from).toList())
                .documents(collaborator.documents().stream().map(DocumentResponse::from).toList())
                .status(collaborator.status().name())
                .build();
    }

}
