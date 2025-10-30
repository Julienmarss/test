package com.legipilot.service.core.administrator.authentication.infra.in.request;

import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Password;
import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Optional;

public record SignUpRequest(
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

        @NotBlank(message = "Le nom de l'entreprise ne peut pas être vide")
        String companyName,

        @NotBlank(message = "Le SIREN ne peut pas être vide")
        @Size(min = 9, max = 9, message = "Le SIREN doit contenir 9 chiffres")
        @Pattern(regexp = "^[0-9]{9}$", message = "Le SIREN doit contenir uniquement des chiffres")
        String siren,

        @NotBlank(message = "Le SIRET ne peut pas être vide")
        @Size(min = 14, max = 14, message = "Le SIRET doit contenir 14 chiffres")
        @Pattern(regexp = "^[0-9]{14}$", message = "Le SIRET doit contenir uniquement des chiffres")
        String siret,

        @NotBlank(message = "La forme juridique ne peut pas être vide")
        String legalForm,

        @NotBlank(message = "Le code NAF ne peut pas être vide")
        @Size(min = 5, max = 5, message = "Le code NAF doit contenir 5 caractères (ex: 3514Z)")
        @Pattern(regexp = "^[0-9]{4}[A-Z]$", message = "Le code NAF doit être au format 0000X")
        String nafCode,

        String activityDomain,

        String principalActivity,

        String collectiveAgreement,

        @Pattern(regexp = "^[0-9]{4}$", message = "L'IDCC doit contenir 4 chiffres")
        String idcc,
        // IDCC est un code numérique de 4 chiffres, peut être String pour simplicité ou Integer si non null

        // Account creation
        @NotBlank(message = "Le mot de passe ne peut pas être vide")
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
        String password,

        @NotBlank(message = "La confirmation du mot de passe ne peut pas être vide")
        String confirmPassword
) {

    public SignUpRequest {
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
                .idcc(idcc)
                .collectiveAgreement(collectiveAgreement)
                .siren(siren)
                .siret(siret)
                .nafCode(nafCode)
                .activityDomain(activityDomain)
                .principalActivity(principalActivity)
                .legalForm(legalForm)
                .companyName(companyName)
                .password(new Password(password, encodedPassword))
                .build();
    }
}
