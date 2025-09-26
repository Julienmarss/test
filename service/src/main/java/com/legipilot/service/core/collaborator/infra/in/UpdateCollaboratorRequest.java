package com.legipilot.service.core.collaborator.infra.in;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import com.legipilot.service.core.collaborator.domain.model.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record UpdateCollaboratorRequest(
        String token,
        String firstname,
        String lastname,
        String civility,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate birthDate,
        String birthPlace,
        String nationality,
        String socialSecurityNumber,
        String jobTitle,
        String contractType,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate hireDate,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate endDate,
        String location,
        Integer workHoursPerWeek,
        String workHoursType,
        String responsible,
        String category,
        String classification,
        BigDecimal annualSalary,
        BigDecimal variableCompensation,
        BigDecimal totalCompensation,
        BigDecimal benefitsInKind,
        String trialPeriod,
        Boolean nonCompeteClause,
        String residencePermit,
        String personalPhone,
        String personalEmail,
        String personalAddress,
        String emergencyCivility,
        String emergencyFirstname,
        String emergencyLastname,
        String emergencyPhone,
        String emergencyEmail,
        String professionalEmail,
        String professionalPhone,
        String iban,
        String bic,
        String socialName,
        String siret,
        String tva,
        String rcs,
        String maritalStatus,
        Integer numberOfChildren,
        String educationLevel,
        List<String> drivingLicenses,
        Boolean rqth,
        String status,
        String picture
) {
    public UpdateCollaborator toDomain(UUID collaboratorId) {
        return UpdateCollaborator.builder()
                .collaboratorId(collaboratorId)
                .firstname(Optional.ofNullable(firstname))
                .lastname(Optional.ofNullable(lastname))
                .civility(Optional.ofNullable(civility).map(Civility::valueOf))
                .birthDate(Optional.ofNullable(birthDate))
                .birthPlace(Optional.ofNullable(birthPlace))
                .nationality(Optional.ofNullable(nationality))
                .socialSecurityNumber(Optional.ofNullable(socialSecurityNumber).map(SocialSecurityNumber::new))
                .jobTitle(Optional.ofNullable(jobTitle))
                .contractType(Optional.ofNullable(contractType).map(ContractType::valueOf))
                .hireDate(Optional.ofNullable(hireDate))
                .endDate(Optional.ofNullable(endDate))
                .location(Optional.ofNullable(location))
                .workHoursPerWeek(Optional.ofNullable(workHoursPerWeek))
                .workHoursType(Optional.ofNullable(workHoursType))
                .responsible(Optional.ofNullable(responsible))
                .category(Optional.ofNullable(category).flatMap(SocioProfessionalCategory::fromLabel))
                .classification(Optional.ofNullable(classification))
                .annualSalary(Optional.ofNullable(annualSalary))
                .variableCompensation(Optional.ofNullable(variableCompensation))
                .totalCompensation(Optional.ofNullable(totalCompensation))
                .benefitsInKind(Optional.ofNullable(benefitsInKind))
                .trialPeriod(Optional.ofNullable(trialPeriod))
                .nonCompeteClause(Optional.ofNullable(nonCompeteClause))
                .residencePermit(Optional.ofNullable(residencePermit))
                .personalPhone(Optional.ofNullable(personalPhone))
                .personalEmail(Optional.ofNullable(personalEmail))
                .personalAddress(Optional.ofNullable(personalAddress))
                .emergencyCivility(Optional.ofNullable(emergencyCivility).map(Civility::valueOf))
                .emergencyFirstname(Optional.ofNullable(emergencyFirstname))
                .emergencyLastname(Optional.ofNullable(emergencyLastname))
                .emergencyPhone(Optional.ofNullable(emergencyPhone))
                .emergencyEmail(Optional.ofNullable(emergencyEmail))
                .professionalEmail(Optional.ofNullable(professionalEmail))
                .professionalPhone(Optional.ofNullable(professionalPhone))
                .iban(Optional.ofNullable(iban))
                .bic(Optional.ofNullable(bic))
                .socialName(Optional.ofNullable(socialName))
                .siret(Optional.ofNullable(siret))
                .tva(Optional.ofNullable(tva))
                .rcs(Optional.ofNullable(rcs))
                .maritalStatus(Optional.ofNullable(maritalStatus))
                .numberOfChildren(Optional.ofNullable(numberOfChildren))
                .educationLevel(Optional.ofNullable(educationLevel))
                .drivingLicenses(Optional.ofNullable(drivingLicenses))
                .rqth(Optional.ofNullable(rqth))
                .status(Optional.ofNullable(status).map(Status::valueOf))
                .picture(Optional.ofNullable(picture))
                .build();
    }
}
