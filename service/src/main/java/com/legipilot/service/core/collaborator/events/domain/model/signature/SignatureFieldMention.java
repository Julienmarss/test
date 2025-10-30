package com.legipilot.service.core.collaborator.events.domain.model.signature;

/**
 * Value Object - Mention de champ de signature (@signature(employee))
 */
public record SignatureFieldMention(String value) {

    public static SignatureFieldMention forEmployee() {
        return new SignatureFieldMention("employee");
    }

    public static SignatureFieldMention forAdministrator() {
        return new SignatureFieldMention("admin");
    }

    /**
     * Retourne le texte de la mention pour le template Word
     */
    public String toMentionText() {
        return "@signature(" + value + ")";
    }
}