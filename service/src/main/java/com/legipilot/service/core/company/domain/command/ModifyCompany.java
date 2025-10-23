package com.legipilot.service.core.company.domain.command;

import com.legipilot.service.core.company.domain.model.CollectiveAgreement;
import lombok.Builder;

import java.util.Optional;
import java.util.UUID;

/**
 * Command pour modifier une entreprise
 *
 * Contient uniquement les données métier de l'entreprise
 */
@Builder
public record ModifyCompany(
        UUID id,
        Optional<String> companyName,
        Optional<String> siren,
        Optional<String> siret,
        Optional<String> legalForm,
        Optional<String> nafCode,
        Optional<String> principalActivity,
        Optional<String> activityDomain,
        Optional<CollectiveAgreement> collectiveAgreement,
        Optional<String> idcc,
        Optional<String> companyPicture
) {
}