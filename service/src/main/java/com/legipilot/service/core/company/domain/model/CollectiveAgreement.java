package com.legipilot.service.core.company.domain.model;

import lombok.Builder;

@Builder
public record CollectiveAgreement(String idcc, String titre) {

    public static CollectiveAgreement from(String idcc, String titre) {
        return new CollectiveAgreement(idcc, titre);
    }

}
