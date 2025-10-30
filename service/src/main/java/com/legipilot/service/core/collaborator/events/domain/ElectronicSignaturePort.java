// domain/ElectronicSignaturePort.java - MISE À JOUR
package com.legipilot.service.core.collaborator.events.domain;

import com.legipilot.service.core.collaborator.events.domain.model.signature.SignatureFieldMention;
import java.util.List;

public interface ElectronicSignaturePort {

    /**
     * Initier une signature avec des mentions de champs (@signature)
     */
    SignatureSession initiateSignatureWithMentions(
            byte[] documentContent,
            String documentName,
            List<SignerWithMention> signers
    );

    SignatureSession getSignatureStatus(String signatureRequestId);

    byte[] downloadSignedDocument(String signatureRequestId);

    /**
     * Signataire avec mention de champ
     */
    record SignerWithMention(
            String email,
            String firstName,
            String lastName,
            SignerRole role,
            SignatureFieldMention mention,
            int signatureOrder
    ) {}

    record SignatureSession(
            String signatureRequestId,
            SignatureStatus status,
            List<SignerInfo> signers
    ) {}

    record SignerInfo(
            String email,
            SignatureStatus status,
            String signatureUrl
    ) {}

    enum SignerRole {
        ADMINISTRATOR,
        EMPLOYEE
    }

    enum SignatureStatus {
        DRAFT,
        ONGOING,
        DONE,
        EXPIRED,
        CANCELED,
        DECLINED
    }
}