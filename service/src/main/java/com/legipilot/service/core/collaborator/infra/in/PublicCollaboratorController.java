package com.legipilot.service.core.collaborator.infra.in;

import com.legipilot.service.core.collaborator.*;
import com.legipilot.service.core.collaborator.domain.command.ModifyCollaboratorPicture;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.company.infra.in.response.CollaboratorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import static com.legipilot.service.shared.infra.EncriptionUtils.decrypt;

@RestController
@RequestMapping("/public/collaborator")
@RequiredArgsConstructor
public class PublicCollaboratorController {

    private final CollaboratorService service;
    private final UpdateCollaboratorUseCase updateCollaboratorUseCase;

    @PostMapping()
    public ResponseEntity<CollaboratorResponse> getCollaborator(@RequestBody TokenRequest command) {
        UUID collaboratorId = UUID.fromString(decrypt(command.token()));
        Collaborator collaborator = service.get(new CollaboratorId(collaboratorId));
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

    @PostMapping("update")
    public ResponseEntity<CollaboratorResponse> update(@RequestBody UpdateCollaboratorRequest request) {
        UUID collaboratorId = UUID.fromString(decrypt(request.token()));
        Collaborator collaborator = updateCollaboratorUseCase.execute(request.toDomain(new CollaboratorId(collaboratorId)));

        return ResponseEntity.ok(CollaboratorResponse.from(collaborator));
    }

    @PostMapping("picture")
    public ResponseEntity<CollaboratorResponse> addPicture(@RequestParam("token") String token, @RequestParam("file") MultipartFile picture) {
        UUID collaboratorId = UUID.fromString(decrypt(token));
        Collaborator collaborator = updateCollaboratorUseCase.execute(
            ModifyCollaboratorPicture.builder()
                .id(new CollaboratorId(collaboratorId))
                .picture(picture)
                .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }
}
