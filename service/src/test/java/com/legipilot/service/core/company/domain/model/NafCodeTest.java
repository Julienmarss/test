package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidNafCode;
import com.legipilot.service.shared.domain.error.ValidationError;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;


class NafCodeTest {

    @Test
    void ne_doit_pas_etre_null() {
        assertThatThrownBy(() -> new NafCode(null))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Désolé, le code NAF que vous avez fourni est invalide.");
    }

    @Test
    void doit_contenir_une_lettre_a_la_fin() {
        assertThatThrownBy(() -> new NafCode("A2.123"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Désolé, le code NAF que vous avez fourni est invalide.");
    }

    @Test
    void doit_commencer_par_2_chiffres_une_point_2_chiffres() {
        assertThatThrownBy(() -> new NafCode("22.A2B"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Désolé, le code NAF que vous avez fourni est invalide.");
    }
}