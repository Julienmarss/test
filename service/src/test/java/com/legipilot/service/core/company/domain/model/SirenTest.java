package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.company.domain.error.InvalidSiren;
import com.legipilot.service.shared.domain.error.ValidationError;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SirenTest {

    @Test
    void ne_doit_pas_etre_mal_formate() {
        assertThatThrownBy(() -> new Siren("ABC123"))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidSiren.class)
                .hasMessage("Désolé, le SIREN que vous avez fourni est invalide, il doit contenir exactement 9 chiffres.");
    }

    @Test
    void ne_doit_pas_etre_null() {
        assertThatThrownBy(() -> new Siren(null))
                .isInstanceOf(ValidationError.class)
                .isInstanceOf(InvalidSiren.class)
                .hasMessage("Désolé, le SIREN que vous avez fourni est invalide, il doit contenir exactement 9 chiffres.");
    }

    @Test
    void creer_a_partir_dun_siret() {
        Siret BLOQUET_CRAFTS_CONSULTING = new Siret("95107364200013");

        assertThat(Siren.aPartirDe(BLOQUET_CRAFTS_CONSULTING))
                .isEqualTo(new Siren("951073642"));
    }
}