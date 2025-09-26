// src/main/java/com/legipilot/service/core/administrator/infra/in/CompanyRightsController.java
package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.shared.infra.security.RequiresCompanyRight;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies/{companyId}/administrators")
@RequiredArgsConstructor
@Tag(name = "Company Rights", description = "Gestion des droits d'administrateurs d'entreprise")
public class CompanyRightsController {

    private final CompanyRightsService companyRightsService;
    private final AdministratorService administratorService;

    @GetMapping
    @Operation(
            summary = "Obtenir les administrateurs de l'entreprise",
            description = "Récupère tous les administrateurs et leurs droits pour une entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.READONLY, companyIdParam = "companyId")
    public ResponseEntity<List<CompanyRightsService.CompanyAdministratorInfo>> getCompanyAdministrators(
            @PathVariable UUID companyId
    ) {
        List<CompanyRightsService.CompanyAdministratorInfo> administrators =
                companyRightsService.getCompanyAdministrators(companyId);
        return ResponseEntity.ok(administrators);
    }

    @PostMapping
    @Operation(
            summary = "Ajouter un administrateur à l'entreprise",
            description = "Ajoute un administrateur avec des droits spécifiques à l'entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.MANAGER, companyIdParam = "companyId")
    public ResponseEntity<Void> addAdministratorToCompany(
            @PathVariable UUID companyId,
            @RequestBody AddAdministratorRequest request
    ) {
        UUID currentUserId = getCurrentUserId();

        companyRightsService.addAdministratorToCompany(
                companyId,
                request.getAdministratorId(),
                request.getRights(),
                currentUserId
        );

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{administratorId}/rights")
    @Operation(
            summary = "Modifier les droits d'un administrateur",
            description = "Met à jour les droits d'un administrateur pour cette entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.OWNER, companyIdParam = "companyId")
    public ResponseEntity<Void> updateAdministratorRights(
            @PathVariable UUID companyId,
            @PathVariable UUID administratorId,
            @RequestBody UpdateRightsRequest request
    ) {
        UUID currentUserId = getCurrentUserId();

        companyRightsService.updateAdministratorRights(
                companyId,
                administratorId,
                request.getRights(),
                currentUserId
        );

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{administratorId}")
    @Operation(
            summary = "Retirer un administrateur de l'entreprise",
            description = "Supprime l'accès d'un administrateur à cette entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.OWNER, companyIdParam = "companyId")
    public ResponseEntity<Void> removeAdministratorFromCompany(
            @PathVariable UUID companyId,
            @PathVariable UUID administratorId
    ) {
        UUID currentUserId = getCurrentUserId();

        companyRightsService.removeAdministratorFromCompany(
                companyId,
                administratorId,
                currentUserId
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/available-rights")
    @Operation(
            summary = "Obtenir les droits disponibles",
            description = "Récupère tous les droits qui peuvent être assignés"
    )
    public ResponseEntity<List<CompanyRightInfo>> getAvailableRights() {
        List<CompanyRightInfo> rights = Arrays.stream(CompanyRight.values())
                .map(right -> new CompanyRightInfo(right, right.getDisplayName()))
                .toList();

        return ResponseEntity.ok(rights);
    }

    @GetMapping("/my-rights")
    @Operation(
            summary = "Obtenir mes droits",
            description = "Récupère les droits de l'utilisateur actuel pour cette entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.READONLY, companyIdParam = "companyId")
    public ResponseEntity<CompanyRightInfo> getMyRights(@PathVariable UUID companyId) {
        UUID currentUserId = getCurrentUserId();

        return companyRightsService.getAdministratorRightForCompany(currentUserId, companyId)
                .map(right -> ResponseEntity.ok(new CompanyRightInfo(right, right.getDisplayName())))
                .orElse(ResponseEntity.notFound().build());
    }

    private UUID getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator admin = administratorService.get(email);
        return admin.id();
    }

    // DTOs
    public record CompanyRightInfo(CompanyRight right, String displayName) {}

    @lombok.Data
    public static class UpdateRightsRequest {
        private CompanyRight rights;
    }

    @lombok.Data
    public static class AddAdministratorRequest {
        private UUID administratorId;
        private CompanyRight rights;
    }
}

// Contrôleur pour obtenir les entreprises d'un administrateur
@RestController
@RequestMapping("/administrators/companies")
@RequiredArgsConstructor
@Tag(name = "Administrator Companies", description = "Gestion des entreprises d'un administrateur")
class AdministratorCompaniesController {

    private final CompanyRightsService companyRightsService;
    private final AdministratorService administratorService;

    @GetMapping("/my-companies")
    @Operation(
            summary = "Obtenir mes entreprises",
            description = "Récupère toutes les entreprises auxquelles l'utilisateur a accès"
    )
    public ResponseEntity<List<CompanyRightsService.CompanyInfo>> getMyCompanies() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator admin = administratorService.get(email);

        List<CompanyRightsService.CompanyInfo> companies =
                companyRightsService.getAdministratorCompanies(admin.id());
        return ResponseEntity.ok(companies);
    }
}