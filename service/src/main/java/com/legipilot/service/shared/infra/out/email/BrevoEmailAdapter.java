package com.legipilot.service.shared.infra.out.email;

import brevo.ApiException;
import brevoApi.TransactionalEmailsApi;
import brevoModel.SendSmtpEmail;
import brevoModel.SendSmtpEmailTo;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.shared.domain.EmailPort;
import com.legipilot.service.shared.domain.error.TechnicalError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.legipilot.service.shared.infra.EncriptionUtils.encrypt;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrevoEmailAdapter implements EmailPort {

    @Value("${app.front.url}")
    private String frontUrl;

    private final TransactionalEmailsApi transactionalEmailsApi;

    private static final String ACTIVATION_PATH = "/api/auth/activate?id=";
    private static final String REINITIALISATION_PATH = "/change-password";
    private static final String FILL_PROFILE = "/collaborator?token=<token>";

    @Override
    public void sendVerificationEmail(Administrator admin, UUID token) {
        String url = frontUrl + ACTIVATION_PATH + admin.id() + "&token=" + token;

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(admin.email())))
                .templateId(45L)
                .params(Map.of(
                        "firstname", admin.firstname(),
                        "lastname", admin.lastname(),
                        "url", url
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send verification email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email de confirmation.");
        }
    }

    @Override
    public void sendCollaboratorsImported(Administrator admin, List<Collaborator> collaborators) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(admin.email())))
                .templateId(46L)
                .params(Map.of(
                        "firstname", admin.firstname(),
                        "lastname", admin.lastname()
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send verification email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email de confirmation d'import.");
        }
    }

    @Override
    public void sendCollaboratorsImportFailed(Administrator admin) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(admin.email())))
                .templateId(48L)
                .params(Map.of(
                        "firstname", admin.firstname(),
                        "lastname", admin.lastname()
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send verification email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email de confirmation d'import.");
        }
    }

    @Override
    public void sendOnboarding(Administrator admin) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(admin.email())))
                .templateId(97L);
        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send onboarding email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email d'onboarding.");
        }
    }

    @Override
    public void sendResetPasswordEmail(String email, ReinitialisationToken token) {
        String url = frontUrl + REINITIALISATION_PATH + "?token=" + token.value();

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(email)))
                .templateId(49L)
                .params(Map.of(
                        "url", url
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send reinitialization email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email de réinitialisation du mot de passe.");
        }
    }

    @Override
    public void sendRequestFillProfilInvitationEmail(Collaborator collaborator) {
        String url = frontUrl + FILL_PROFILE;
        url = url.replace("<token>", encrypt(collaborator.id().toString()));

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(collaborator.contactDetails().personalEmail())))
                .templateId(50L)
                .params(Map.of(
                        "firstname", collaborator.firstname(),
                        "lastname", collaborator.lastname(),
                        "url", url
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send invitation email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email d'invitation.");
        }
    }

    @Override
    public void sendAdministratorAddedToCompanyEmail(Administrator admin, Company company, CompanyRight rights) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(admin.email())))
                .templateId(86L)
                .params(Map.of(
                        "firstname", admin.firstname(),
                        "lastname", admin.lastname(),
                        "companyName", company.name(),
                        "rights", rights.getDisplayName(),
                        "url", frontUrl + "/dashboard"
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send administrator added email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email de confirmation.");
        }
    }

    @Override
    public void sendAdministratorInvitationEmail(String email, Company company, UUID token, CompanyRight rights) {
        String invitationUrl = frontUrl + "/invitation?token=" + token;

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail()
                .to(List.of(new SendSmtpEmailTo().email(email)))
                .templateId(87L)
                .params(Map.of(
                        "email", email,
                        "companyName", company.name(),
                        "rights", rights.getDisplayName(),
                        "invitationUrl", invitationUrl,
                        "signupUrl", frontUrl + "/signup?token=" + token
                ));

        try {
            transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        } catch (ApiException e) {
            log.error("Failed to send invitation email: ", e);
            throw new TechnicalError("Désolé, nous n'avons pas pu envoyer l'email d'invitation.");
        }
    }
}
