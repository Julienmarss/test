package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidNafCode;
import com.legipilot.service.shared.domain.error.ValidationError;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


class NafCodeTest {

    @ParameterizedTest
    @ValueSource(strings = {"6201Z", "62.01Z"})
    void valide_naf_code(String value) {
        NafCode nafCode = new NafCode(value);
        assertThat(nafCode.value()).isEqualTo(value);
    }

    @Test
    void ne_doit_pas_etre_null() {
        assertThatThrownBy(() -> new NafCode(null))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Le code NAF ne peut pas être vide.");
    }

    @Test
    void doit_contenir_une_lettre_a_la_fin() {
        assertThatThrownBy(() -> new NafCode("A2.123"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Le code NAF doit être au format XX.XXX ou XXXXX (ex: 62.01Z ou 6201Z).");
    }

    @Test
    void doit_commencer_par_2_chiffres_une_point_2_chiffres() {
        assertThatThrownBy(() -> new NafCode("22.A2B"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidNafCode.class)
                .hasMessage("Le code NAF doit être au format XX.XXX ou XXXXX (ex: 62.01Z ou 6201Z).");
    }
}