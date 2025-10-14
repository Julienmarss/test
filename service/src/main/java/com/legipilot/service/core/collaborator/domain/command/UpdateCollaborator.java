package com.legipilot.service.core.collaborator.domain.command;

import com.legipilot.service.core.collaborator.domain.model.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Builder
public record UpdateCollaborator(
        UUID companyId,
        UUID collaboratorId,
        Optional<String> firstname,
        Optional<String> lastname,
        Optional<Civility> civility,
        Optional<LocalDate> birthDate,
        Optional<String> birthPlace,
        Optional<String> nationality,
        Optional<SocialSecurityNumber> socialSecurityNumber,
        Optional<String> jobTitle,
        Optional<ContractType> contractType,
        Optional<LocalDate> hireDate,
        Optional<LocalDate> endDate,
        Optional<String> location,
        Optional<Integer> workHoursPerWeek,
        Optional<WorkHoursType> workHoursType,
        Optional<String> responsible,
        Optional<SocioProfessionalCategory> category,
        Optional<String> classification,
        Optional<BigDecimal> annualSalary,
        Optional<BigDecimal> variableCompensation,
        Optional<BigDecimal> totalCompensation,
        Optional<BigDecimal> benefitsInKind,
        Optional<String> trialPeriod,
        Optional<Boolean> nonCompeteClause,
        Optional<String> personalPhone,
        Optional<String> personalEmail,
        Optional<String> personalAddress,
        Optional<Civility> emergencyCivility,
        Optional<String> emergencyFirstname,
        Optional<String> emergencyLastname,
        Optional<String> emergencyPhone,
        Optional<String> emergencyEmail,
        Optional<String> professionalEmail,
        Optional<String> professionalPhone,
        Optional<String> iban,
        Optional<String> bic,
        Optional<String> socialName,
        Optional<String> siret,
        Optional<String> tva,
        Optional<String> rcs,
        Optional<String> maritalStatus,
        Optional<Integer> numberOfChildren,
        Optional<String> educationLevel,
        Optional<List<String>> drivingLicenses,
        Optional<Boolean> rqth,
        Optional<Status> status,
        Optional<String> picture
) {
}
