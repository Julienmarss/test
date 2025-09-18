package com.legipilot.service.shared.infra;

import brevo.ApiClient;
import brevo.Configuration;
import brevoApi.TransactionalEmailsApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class EmailConfig {

    @Value("${app.email.brevo.api-key}")
    private String brevoApiKey;

    @Bean
    public TransactionalEmailsApi transactionalEmailsApi() {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setApiKey(brevoApiKey);
        return new TransactionalEmailsApi();
    }

}