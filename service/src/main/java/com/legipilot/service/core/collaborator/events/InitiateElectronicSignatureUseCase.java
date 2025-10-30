// InitiateElectronicSignatureUseCase.java - VERSION SIMPLIFIÉE
package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort.*;
import com.legipilot.service.core.collaborator.events.domain.command.InitiateElectronicSignature;
import com.legipilot.service.core.collaborator.events.domain.model.signature.SignatureFieldMention;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitiateElectronicSignatureUseCase {

    private final CollaboratorRepository collaboratorRepository;
    private final AdministratorRepository administratorRepository;
    private final ElectronicSignaturePort electronicSignaturePort;

    public SignatureSession execute(InitiateElectronicSignature command) {
        // 1. Récupérer les entités du domaine
        Collaborator collaborator = collaboratorRepository.get(command.collaboratorId());
        Administrator administrator = administratorRepository.get(command.administratorEmail());

        validateCollaboratorHasEmail(collaborator);

        // 2. Charger le template
        byte[] documentContent = loadTemplateDocument(command.templateId().value().toString());
        String documentName = generateDocumentName(collaborator);

        // 3. Définir les signataires avec leurs mentions
        // Business Rule: Employee signe en premier (order=1), Admin en second (order=2)
        List<SignerWithMention> signers = List.of(
                new SignerWithMention(
                        collaborator.contactDetails().professionalEmail(),
                        collaborator.firstname(),
                        collaborator.lastname(),
                        SignerRole.EMPLOYEE,
                        SignatureFieldMention.forEmployee(), // @signature(employee)
                        1
                ),
                new SignerWithMention(
                        administrator.email(),
                        administrator.firstname(),
                        administrator.lastname(),
                        SignerRole.ADMINISTRATOR,
                        SignatureFieldMention.forAdministrator(), // @signature(admin)
                        2
                )
        );

        // 4. Initier la signature via le port (adapter)
        SignatureSession session = electronicSignaturePort.initiateSignatureWithMentions(
                documentContent,
                documentName,
                signers
        );

        log.info("Signature initiated for document {} with signers: {}, {}",
                documentName,
                collaborator.contactDetails().professionalEmail(),
                administrator.email());

        return session;
    }

    private void validateCollaboratorHasEmail(Collaborator collaborator) {
        if (collaborator.contactDetails() == null ||
                collaborator.contactDetails().professionalEmail() == null) {
            throw new RessourceNotFound("Le collaborateur n'a pas d'email professionnel.");
        }
    }

    private String generateDocumentName(Collaborator collaborator) {
        return "Licenciement-%s-%s-%s.docx".formatted(
                collaborator.lastname(),
                collaborator.firstname(),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"))
        );
    }

    private byte[] loadTemplateDocument(String templateId) {
        try {
            String path = resolveTemplatePath(templateId);
            ClassPathResource resource = new ClassPathResource(path);

            if (!resource.exists()) {
                log.error("Template file not found at path: {}", path);
                throw new RessourceNotFound("Template document not found: " + templateId);
            }

            return resource.getInputStream().readAllBytes();
        } catch (IOException e) {
            log.error("Failed to load template document for templateId: {}", templateId, e);
            throw new RessourceNotFound("Template document not found: " + templateId);
        }
    }

    private String resolveTemplatePath(String templateId) {
        // Mapping des templateId vers les chemins de fichiers
        return switch (templateId) {
            case "550e8400-e29b-41d4-a716-446655440000" ->
                    "domain/events/list/licenciement-faute-simple/test.docx";
            case "autre-template-id" ->
                    "domain/events/list/licenciement-faute-simple/test.pdf";
            default -> {
                log.warn("Unknown templateId: {}, using default template path", templateId);
                yield "domain/events/list/licenciement-faute-simple/tests.docx";
            }
        };
    }
}