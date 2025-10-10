package com.legipilot.service.core.administrator;

import com.legipilot.service.config.BaseIntegrationTest;
import com.legipilot.service.config.TestConfig;
import com.legipilot.service.core.administrator.authentication.SignUpUseCase;
import com.legipilot.service.core.administrator.authentication.domain.event.AdministratorCreated;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Password;
import com.legipilot.service.core.administrator.domain.model.Tenant;
import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.EventBus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;
import java.util.UUID;

import static com.legipilot.service.core.administrator.AdministratorFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@Import(TestConfig.class)
class SignUpUseCaseIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private SignUpUseCase signUpUseCase;
    @Autowired
    private CompanyRepository companyRepository;
    @MockitoBean
    private ValidationRepository validationRepository;
    @MockitoBean
    private EventBus eventBus;

    @Autowired
    private EmailPort emailPort;

    @Test
    void sign_up_administrator_and_company() {
        SignUp command = SignUp.builder()
                .authentication(new Authentication(Tenant.GOOGLE, "01839743847822"))
                .email("gabin.bloquet.pro@gmail.com")
                .password(new Password("1Password$", "1encodedPassword$"))
                .firstName("Gabin")
                .lastName("Bloquet")
                .picture(Optional.of("https://lh3.googleusercontent.com/a/ACg8ocJKWyOxBluEKgndVlPfP-eMEnfieQgx_aYbDeDOoxshS8qPNbI=s96-c"))
                .fonction("Dirigeant")
                .phone("0762699316")
                .companyName("Justiana")
                .siren("944797877")
                .siret("94479787700015")
                .legalForm("SASU")
                .activityDomain("Programmation, conseil et autres activités informatiques")
                .nafCode("62.01Z")
                .idcc("1486")
                .collectiveAgreement("Convention collective nationale des bureaux d'études techniques")
                .build();
        UUID token = UUID.fromString("a6e2b0b3-0c8e-4b3e-a5c3-3b9a4f5e2b0b");
        when(validationRepository.createToken(any(Administrator.class)))
                .thenReturn(token);

        Administrator admin = signUpUseCase.execute(command);

        assertThat(admin)
                .usingRecursiveComparison().ignoringFieldsMatchingRegexes(".*id")
                .isEqualTo(GABIN_WITH_JUSTIANA);
        assertThat(companyRepository.getOfAdministrator(admin.id()))
                .usingRecursiveComparison().ignoringFieldsMatchingRegexes(".*id")
                .isEqualTo(JUSTIANA_AVEC_INFOS);
        verify(emailPort).sendVerificationEmail(any(Administrator.class), eq(token));
        verify(eventBus).publish(new AdministratorCreated(admin));
    }
}