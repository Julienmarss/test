// ProcessSignatureWebhookUseCase.java - VERSION SIMPLIFIÉE
package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort;
import com.legipilot.service.core.collaborator.events.domain.model.webhook.YousignWebhookEvent;
import com.legipilot.service.shared.domain.EmailPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessSignatureWebhookUseCase {

    private final ElectronicSignaturePort electronicSignaturePort;
    private final DocumentStoragePort documentStoragePort;
    private final EmailPort emailPort;

    public void execute(YousignWebhookEvent event) {
        log.info("Processing webhook event: type={}, signatureRequestId={}",
                event.eventType(), event.signatureRequestId());

        switch (event.eventType()) {
            case SIGNER_SIGNED -> handleSignerSigned(event);
            case SIGNATURE_REQUEST_DONE -> handleSignatureCompleted(event);
            case SIGNATURE_REQUEST_DECLINED -> handleSignatureDeclined(event);
            case SIGNATURE_REQUEST_EXPIRED -> handleSignatureExpired(event);
            case SIGNER_ERROR -> handleSignerError(event);
            default -> log.debug("Webhook event type {} not handled", event.eventType());
        }
    }

    private void handleSignerSigned(YousignWebhookEvent event) {
        log.info("Signer {} has signed document {}",
                event.signerEmail(), event.signatureRequestId());

        // TODO: Envoyer notification à l'admin si c'est l'employé qui a signé
    }

    private void handleSignatureCompleted(YousignWebhookEvent event) {
        log.info("All signatures completed for document {}", event.signatureRequestId());

        try {
            byte[] signedDocument = electronicSignaturePort.downloadSignedDocument(
                    event.signatureRequestId()
            );

            // TODO: Stocker le document signé dans S3
            log.info("Signed document downloaded for signature request {}",
                    event.signatureRequestId());

        } catch (Exception e) {
            log.error("Error processing completed signature for {}",
                    event.signatureRequestId(), e);
        }
    }

    private void handleSignatureDeclined(YousignWebhookEvent event) {
        log.warn("Signature declined by {} for document {}",
                event.signerEmail(), event.signatureRequestId());

        // TODO: Notifier les parties prenantes
    }

    private void handleSignatureExpired(YousignWebhookEvent event) {
        log.warn("Signature expired for document {}", event.signatureRequestId());

        // TODO: Notifier les parties prenantes
    }

    private void handleSignerError(YousignWebhookEvent event) {
        log.error("Error during signature process for signer {} on document {}",
                event.signerEmail(), event.signatureRequestId());

        // TODO: Gérer l'erreur
    }
}