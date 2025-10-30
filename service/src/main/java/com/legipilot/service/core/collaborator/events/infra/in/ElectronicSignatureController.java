package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.events.InitiateElectronicSignatureUseCase;
import com.legipilot.service.core.collaborator.events.domain.ElectronicSignaturePort.SignatureSession;
import com.legipilot.service.core.collaborator.events.domain.command.InitiateElectronicSignature;
import com.legipilot.service.core.collaborator.events.domain.model.event.TemplateId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies/{companyId}/collaborators/{collaboratorId}/events")
@RequiredArgsConstructor
public class ElectronicSignatureController {

    private final InitiateElectronicSignatureUseCase initiateElectronicSignatureUseCase;

    @PostMapping("/signature/initiate")
    public ResponseEntity<SignatureSessionResponse> initiateSignature(
            @PathVariable UUID companyId,
            @PathVariable UUID collaboratorId,
            @RequestBody InitiateSignatureRequest request
    ) {
        Authentication authenticatedAdmin = SecurityContextHolder.getContext().getAuthentication();

        InitiateElectronicSignature command = InitiateElectronicSignature.builder()
                .templateId(TemplateId.of(request.templateId()))
                .administratorEmail(authenticatedAdmin.getName())
                .collaboratorId(new CollaboratorId(collaboratorId))
                .build();

        SignatureSession session = initiateElectronicSignatureUseCase.execute(command);

        return ResponseEntity.ok(SignatureSessionResponse.from(session));
    }

    public record InitiateSignatureRequest(
            UUID templateId
    ) {}

    public record SignatureSessionResponse(
            String signatureRequestId,
            String status,
            java.util.List<SignerResponse> signers
    ) {
        public static SignatureSessionResponse from(SignatureSession session) {
            return new SignatureSessionResponse(
                    session.signatureRequestId(),
                    session.status().name(),
                    session.signers().stream()
                            .map(signer -> new SignerResponse(
                                    signer.email(),
                                    signer.status().name(),
                                    signer.signatureUrl()
                            ))
                            .toList()
            );
        }

        public record SignerResponse(
                String email,
                String status,
                String signatureUrl
        ) {}
    }
}