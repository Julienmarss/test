package com.legipilot.service.core.authorization;

import com.legipilot.service.core.authorization.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.CannotGrantOwnerRightsError;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.InsufficientRightsError;
import com.legipilot.service.core.administrator.domain.error.CompanyAuthorizationErrors.NotCompanyMemberError;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyAuthorizationServiceTest {

    @Mock
    private CompanyAdministratorRepository companyAdminRepository;

    @InjectMocks
    private CompanyAuthorizationService authorizationService;

    private UUID administratorId;
    private UUID companyId;

    @BeforeEach
    void setUp() {
        administratorId = UUID.randomUUID();
        companyId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("ensureHasRight")
    class EnsureHasRightTests {

        @Test
        @DisplayName("devrait valider quand l'administrateur a le droit requis")
        void shouldPassWhenAdministratorHasRequiredRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureHasRight(administratorId, companyId, CompanyRight.READONLY))
                    .doesNotThrowAnyException();

            verify(companyAdminRepository).findRightByAdministratorAndCompany(administratorId, companyId);
        }

        @Test
        @DisplayName("devrait échouer quand l'administrateur n'est pas membre")
        void shouldFailWhenAdministratorIsNotMember() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureHasRight(administratorId, companyId, CompanyRight.READONLY))
                    .isInstanceOf(NotCompanyMemberError.class);
        }

        @Test
        @DisplayName("devrait échouer quand l'administrateur n'a pas le droit suffisant")
        void shouldFailWhenAdministratorHasInsufficientRights() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.READONLY));

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureHasRight(administratorId, companyId, CompanyRight.MANAGER))
                    .isInstanceOf(InsufficientRightsError.class);
        }

        @Test
        @DisplayName("devrait échouer si administratorId est null")
        void shouldFailWhenAdministratorIdIsNull() {
            assertThatThrownBy(() -> authorizationService.ensureHasRight(null, companyId, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessageContaining("administratorId");
        }

        @Test
        @DisplayName("devrait échouer si companyId est null")
        void shouldFailWhenCompanyIdIsNull() {
            assertThatThrownBy(() -> authorizationService.ensureHasRight(administratorId, null, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessageContaining("companyId");
        }

        @Test
        @DisplayName("devrait échouer si requiredRight est null")
        void shouldFailWhenRequiredRightIsNull() {
            assertThatThrownBy(() -> authorizationService.ensureHasRight(administratorId, companyId, null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessageContaining("requiredRight");
        }
    }

    @Nested
    @DisplayName("ensureCanManage")
    class EnsureCanManageTests {

        @Test
        @DisplayName("devrait valider quand l'administrateur est MANAGER")
        void shouldPassWhenAdministratorIsManager() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureCanManage(administratorId, companyId))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("devrait valider quand l'administrateur est OWNER")
        void shouldPassWhenAdministratorIsOwner() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.OWNER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureCanManage(administratorId, companyId))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("devrait échouer quand l'administrateur est READONLY")
        void shouldFailWhenAdministratorIsReadOnly() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.READONLY));

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureCanManage(administratorId, companyId))
                    .isInstanceOf(InsufficientRightsError.class);
        }
    }

    @Nested
    @DisplayName("ensureIsOwner")
    class EnsureIsOwnerTests {

        @Test
        @DisplayName("devrait valider quand l'administrateur est OWNER")
        void shouldPassWhenAdministratorIsOwner() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.OWNER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureIsOwner(administratorId, companyId))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("devrait échouer quand l'administrateur est MANAGER")
        void shouldFailWhenAdministratorIsManager() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureIsOwner(administratorId, companyId))
                    .isInstanceOf(InsufficientRightsError.class);
        }
    }

    @Nested
    @DisplayName("ensureCanRead")
    class EnsureCanReadTests {

        @Test
        @DisplayName("devrait valider pour tous les niveaux de droits")
        void shouldPassForAllRightLevels() {
            // READONLY
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.READONLY));
            assertThatCode(() -> authorizationService.ensureCanRead(administratorId, companyId))
                    .doesNotThrowAnyException();

            // MANAGER
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));
            assertThatCode(() -> authorizationService.ensureCanRead(administratorId, companyId))
                    .doesNotThrowAnyException();

            // OWNER
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.OWNER));
            assertThatCode(() -> authorizationService.ensureCanRead(administratorId, companyId))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("ensureCanGrantRight")
    class EnsureCanGrantRightTests {

        @Test
        @DisplayName("OWNER peut accorder le droit OWNER")
        void ownerCanGrantOwnerRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.OWNER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.OWNER))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("MANAGER ne peut pas accorder le droit OWNER")
        void managerCannotGrantOwnerRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.OWNER))
                    .isInstanceOf(CannotGrantOwnerRightsError.class);
        }

        @Test
        @DisplayName("MANAGER peut accorder le droit MANAGER")
        void managerCanGrantManagerRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.MANAGER))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("MANAGER peut accorder le droit READONLY")
        void managerCanGrantReadOnlyRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When / Then
            assertThatCode(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.READONLY))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("READONLY ne peut accorder aucun droit")
        void readOnlyCannotGrantAnyRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.READONLY));

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.READONLY))
                    .isInstanceOf(InsufficientRightsError.class);

            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.MANAGER))
                    .isInstanceOf(InsufficientRightsError.class);

            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.OWNER))
                    .isInstanceOf(InsufficientRightsError.class);
        }

        @Test
        @DisplayName("devrait échouer si l'administrateur n'est pas membre")
        void shouldFailWhenAdministratorIsNotMember() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, CompanyRight.READONLY))
                    .isInstanceOf(NotCompanyMemberError.class);
        }

        @Test
        @DisplayName("devrait échouer si les paramètres sont null")
        void shouldFailWhenParametersAreNull() {
            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(null, companyId, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class);

            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, null, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class);

            assertThatThrownBy(() -> authorizationService.ensureCanGrantRight(administratorId, companyId, null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("getAdministratorRight")
    class GetAdministratorRightTests {

        @Test
        @DisplayName("devrait retourner le droit de l'administrateur")
        void shouldReturnAdministratorRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When
            Optional<CompanyRight> result = authorizationService.getAdministratorRight(administratorId, companyId);

            // Then
            assertThat(result).isPresent().contains(CompanyRight.MANAGER);
        }

        @Test
        @DisplayName("devrait retourner empty si l'administrateur n'est pas membre")
        void shouldReturnEmptyWhenAdministratorIsNotMember() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.empty());

            // When
            Optional<CompanyRight> result = authorizationService.getAdministratorRight(administratorId, companyId);

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("devrait échouer si les paramètres sont null")
        void shouldFailWhenParametersAreNull() {
            assertThatThrownBy(() -> authorizationService.getAdministratorRight(null, companyId))
                    .isInstanceOf(NullPointerException.class);

            assertThatThrownBy(() -> authorizationService.getAdministratorRight(administratorId, null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("hasRight")
    class HasRightTests {

        @Test
        @DisplayName("devrait retourner true quand l'administrateur a le droit")
        void shouldReturnTrueWhenAdministratorHasRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.MANAGER));

            // When
            boolean result = authorizationService.hasRight(administratorId, companyId, CompanyRight.READONLY);

            // Then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("devrait retourner false quand l'administrateur n'a pas le droit")
        void shouldReturnFalseWhenAdministratorDoesNotHaveRight() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.of(CompanyRight.READONLY));

            // When
            boolean result = authorizationService.hasRight(administratorId, companyId, CompanyRight.MANAGER);

            // Then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("devrait retourner false quand l'administrateur n'est pas membre")
        void shouldReturnFalseWhenAdministratorIsNotMember() {
            // Given
            when(companyAdminRepository.findRightByAdministratorAndCompany(administratorId, companyId))
                    .thenReturn(Optional.empty());

            // When
            boolean result = authorizationService.hasRight(administratorId, companyId, CompanyRight.READONLY);

            // Then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("devrait échouer si les paramètres sont null")
        void shouldFailWhenParametersAreNull() {
            assertThatThrownBy(() -> authorizationService.hasRight(null, companyId, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class);

            assertThatThrownBy(() -> authorizationService.hasRight(administratorId, null, CompanyRight.READONLY))
                    .isInstanceOf(NullPointerException.class);

            assertThatThrownBy(() -> authorizationService.hasRight(administratorId, companyId, null))
                    .isInstanceOf(NullPointerException.class);
        }
    }
}