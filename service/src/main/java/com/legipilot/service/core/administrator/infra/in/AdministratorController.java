package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.DeleteAdministratorUseCase;
import com.legipilot.service.core.administrator.ModifyAdministratorUseCase;
import com.legipilot.service.core.administrator.domain.command.DeleteAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.in.request.ModifyAdministratorRequest;
import com.legipilot.service.core.administrator.infra.in.request.ModifyAdministratorWithCompanyDetailsRequest;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        // TODO: add checks c'est bien moi
        Administrator administrator = modifyAdministratorUseCase.execute(
                request.toDomain(id)
        );
        return ResponseEntity.ok(
                AdministratorResponse.from(administrator)
        );
    }

    @PostMapping("/{id}/picture")
    public ResponseEntity<AdministratorResponse> addPicture(@PathVariable UUID id,
                                                            @RequestParam("file") MultipartFile picture) {
        // TODO: add checks c'est bien moi
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
    public ResponseEntity<AdministratorResponse> delete(@PathVariable UUID id) {
        // TODO: add checks c'est bien moi
        deleteAdministratorUseCase.execute(new DeleteAdministrator(id));
        return ResponseEntity.noContent().build();
    }
}
