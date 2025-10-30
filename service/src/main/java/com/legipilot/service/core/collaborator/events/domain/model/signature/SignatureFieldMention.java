package com.legipilot.service.core.collaborator.events.domain.model.signature;

public record SignatureFieldMention(String value) {

    public static SignatureFieldMention forEmployee() {
        return new SignatureFieldMention("employee");
    }

    public static SignatureFieldMention forAdministrator() {
        return new SignatureFieldMention("admin");
    }

    /**
     * Retourne le texte de la mention pour le template Word (ancien format)
     */
    @Deprecated
    public String toMentionText() {
        return "@signature(" + value + ")";
    }

    /**
     * Retourne le smart anchor au format Yousign
     * Format: {{sX|signature|width|height}}
     */
    public String toSmartAnchor(int signerIndex) {
        return String.format("{{s%d|signature|150|50}}", signerIndex);
    }
}