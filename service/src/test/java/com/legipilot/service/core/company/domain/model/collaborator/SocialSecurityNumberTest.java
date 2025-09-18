package com.legipilot.service.core.company.domain.model.collaborator;

import com.legipilot.service.core.collaborator.domain.model.SocialSecurityNumber;
import com.legipilot.service.core.company.domain.error.InvalidSocialSecurityNumber;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SocialSecurityNumberTest {

    @Test
    void validNumber_shouldBeAccepted_withSpaces() {
        String raw = "1 83 04 92 385 094 83";
        SocialSecurityNumber ssn = new SocialSecurityNumber(raw);
        assertThat(ssn.value()).isEqualTo("1 83 04 92 385 094 83");
    }

    @Test
    void validNumber_shouldBeAccepted_withoutSpaces() {
        SocialSecurityNumber ssn = new SocialSecurityNumber("183049238509483");
        assertThat(ssn.value()).isEqualTo("183049238509483");
    }

    @Test
    void invalidLength_shouldThrow() {
        assertThatThrownBy(() -> new SocialSecurityNumber("18304923850948"))
                .isInstanceOf(InvalidSocialSecurityNumber.class)
                .hasMessage("Le numéro de sécurité sociale doit contenir exactement 15 chiffres.");
    }

    @Test
    void invalidCharacters_shouldThrow() {
        assertThatThrownBy(() -> new SocialSecurityNumber("1A3049238509483"))
                .isInstanceOf(InvalidSocialSecurityNumber.class)
                .hasMessage("Le numéro de sécurité sociale doit contenir exactement 15 chiffres.");
    }

    @Test
    void invalidStartDigit_shouldThrow() {
        assertThatThrownBy(() -> new SocialSecurityNumber("383049238509483"))
                .isInstanceOf(InvalidSocialSecurityNumber.class)
                .hasMessage("Le numéro de sécurité sociale doit commencer par 1 (Homme) ou 2 (Femme).");
    }

    @Test
    void nullValue_shouldThrow() {
        assertThatThrownBy(() -> new SocialSecurityNumber(null))
                .isInstanceOf(InvalidSocialSecurityNumber.class)
                .hasMessage("Le numéro de sécurité sociale ne peut pas être vide.");
    }
}
