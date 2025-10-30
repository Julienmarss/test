package com.legipilot.service.core.collaborator.events.domain;

import java.util.List;

public interface ElectronicSignaturePort {

    SignatureSession initiateSignature(byte[] documentContent, String documentName, List<Signer> signers);

    SignatureSession getSignatureStatus(String signatureRequestId);

    byte[] downloadSignedDocument(String signatureRequestId);

    record Signer(
            String email,
            String firstName,
            String lastName,
            SignerRole role,
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