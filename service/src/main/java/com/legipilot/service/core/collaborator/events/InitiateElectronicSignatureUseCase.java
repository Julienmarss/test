package com.legipilot.service.core.collaborator.events;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort.Signer;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort.SignerRole;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort.SignatureSession;
import com.legipilot.service.core.collaborator.events.domain.command.InitiateElectronicSignature;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitiateElectronicSignatureUseCase {

    private final CollaboratorRepository collaboratorRepository;
    private final AdministratorRepository administratorRepository;
    private final ElectronicSignaturePort electronicSignaturePort;

    public SignatureSession execute(InitiateElectronicSignature command) {
        Collaborator collaborator = collaboratorRepository.get(command.collaboratorId());

        if (collaborator.contactDetails() == null || collaborator.contactDetails().professionalEmail() == null) {
            throw new RessourceNotFound("Le collaborateur n'a pas d'email professionnel.");
        }

        Administrator administrator = administratorRepository.get(command.administratorEmail());

        byte[] documentContent = loadTemplateDocument(command.templateId().value().toString());
        String documentName = "Licenciement-" + collaborator.lastname() + "-" + collaborator.firstname() + ".docx";

        List<Signer> signers = List.of(
                new Signer(
                        administrator.email(),
                        administrator.firstname(),
                        administrator.lastname(),
                        SignerRole.ADMINISTRATOR,
                        1
                ),
                new Signer(
                        collaborator.contactDetails().professionalEmail(),
                        collaborator.firstname(),
                        collaborator.lastname(),
                        SignerRole.EMPLOYEE,
                        2
                )
        );

        log.info("Initiating electronic signature for document {} with signers: {}, {}",
                documentName, administrator.email(), collaborator.contactDetails().professionalEmail());

        return electronicSignaturePort.initiateSignature(documentContent, documentName, signers);
    }

    private byte[] loadTemplateDocument(String templateId) {
        try {
            String path = "domain/events/list/licenciement-faute-simple/test.docx";
            ClassPathResource resource = new ClassPathResource(path);
            return resource.getInputStream().readAllBytes();
        } catch (IOException e) {
            log.error("Failed to load template document for templateId: {}", templateId, e);
            throw new RessourceNotFound("Template document not found: " + templateId);
        }
    }
}