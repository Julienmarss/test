package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSiret;
import com.legipilot.service.shared.domain.error.ValidationError;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

class SiretTest {

    @Test
    void doit_refuser_un_siret_non_valide() {
        assertThatThrownBy(() -> new Siret("9510736420001"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidSiret.class)
                .hasMessage("Le SIRET doit contenir exactement 14 chiffres.");
    }

    @Test
    void doit_reduser_si_siret_null() {
        assertThatThrownBy(() -> new Siret(null))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidSiret.class)
                .hasMessage("Le SIRET ne peut pas être vide.");
    }
}