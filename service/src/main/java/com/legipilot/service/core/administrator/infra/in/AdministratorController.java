package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.DeleteAdministratorUseCase;
import com.legipilot.service.core.administrator.ModifyAdministratorUseCase;
import com.legipilot.service.core.administrator.domain.command.DeleteAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.in.request.ModifyAdministratorWithCompanyDetailsRequest;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/administrators")
@RequiredArgsConstructor
public class AdministratorController {

    private final AdministratorService service;
    private final ModifyAdministratorUseCase modifyAdministratorUseCase;
    private final DeleteAdministratorUseCase deleteAdministratorUseCase;

    @GetMapping("/{id}")
    public ResponseEntity<AdministratorResponse> get(@PathVariable UUID id) {
        Administrator administrator = service.get(id);
        return ResponseEntity.ok(
                AdministratorResponse.from(administrator)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdministratorResponse> modify(@PathVariable UUID id,
                                                        @Valid @RequestBody ModifyAdministratorWithCompanyDetailsRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator currentAdmin = service.get(email);

        if (!currentAdmin.id().equals(id)) {
            throw new com.legipilot.service.shared.domain.error.NotAllowed("modifier le profil d'un autre utilisateur");
        }

        Administrator administrator = modifyAdministratorUseCase.execute(
                request.toDomain(id),
                currentAdmin.id()
        );
        return ResponseEntity.ok(
                AdministratorResponse.from(administrator)
        );
    }

    @PostMapping("/{id}/picture")
    public ResponseEntity<AdministratorResponse> addPicture(@PathVariable UUID id,
                                                            @RequestParam("file") MultipartFile picture) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator currentAdmin = service.get(email);

        if (!currentAdmin.id().equals(id)) {
            throw new com.legipilot.service.shared.domain.error.NotAllowed("modifier le profil d'un autre utilisateur");
        }

        Administrator administrator = modifyAdministratorUseCase.execute(
                ModifyAdministratorPicture.builder()
                        .id(id)
                        .picture(picture)
                        .build()
        );
        return ResponseEntity.ok(
                AdministratorResponse.from(administrator)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator currentAdmin = service.get(email);

        deleteAdministratorUseCase.execute(new DeleteAdministrator(id), currentAdmin.id());

        return ResponseEntity.noContent().build();
    }
}