package com.legipilot.service.core.administrator.authentication.infra.in.request;

import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Password;
import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Optional;
import java.util.UUID;

public record SignUpWithInvitationRequest(
        Authentication authentication,

        @NotBlank(message = "Le prénom ne peut pas être vide")
        String firstName,

        @NotBlank(message = "Le nom ne peut pas être vide")
        String lastName,

        String picture,

        @NotBlank(message = "La fonction ne peut pas être vide")
        String fonction,

        @NotBlank(message = "L'email ne peut pas être vide")
        @Email(message = "L'email doit être valide")
        String email,

        @NotBlank(message = "Le numéro de téléphone ne peut pas être vide")
        @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "Le numéro de téléphone doit être valide")
        String phone,

        String companyName,
        String siren,
        String siret,
        String legalForm,
        String nafCode,
        String activityDomain,
        String collectiveAgreement,
        String idcc,

        @NotBlank(message = "Le mot de passe ne peut pas être vide")
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
        String password,

        @NotBlank(message = "La confirmation du mot de passe ne peut pas être vide")
        String confirmPassword,

        UUID invitationToken
) {

    public SignUpWithInvitationRequest {
        if (password != null && !password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }
    }

    public SignUp toDomain(String encodedPassword) {
        return SignUp.builder()
                .authentication(new Authentication(
                        authentication.tenant(),
                        (authentication.sub() == null || authentication.sub().trim().isEmpty()) ? null : authentication.sub()
                ))
                .firstName(firstName)
                .lastName(lastName)
                .picture(picture == null || picture.isEmpty() ? Optional.empty() : Optional.of(picture))
                .email(email)
                .fonction(fonction)
                .phone(phone)
                .idcc(idcc != null ? idcc : "")
                .collectiveAgreement(collectiveAgreement != null ? collectiveAgreement : "")
                .siren(siren != null ? siren : "")
                .siret(siret != null ? siret : "")
                .nafCode(nafCode != null ? nafCode : "")
                .activityDomain(activityDomain != null ? activityDomain : "")
                .legalForm(legalForm != null ? legalForm : "")
                .companyName(companyName != null ? companyName : "")
                .password(new Password(password, encodedPassword))
                .build();
    }
}