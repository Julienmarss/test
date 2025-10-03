package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.DeleteInvitationUseCase;
import com.legipilot.service.core.administrator.InviteAdministratorUseCase;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.command.InviteAdministrator;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.administrator.domain.model.Invitation;
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
    private final InviteAdministratorUseCase inviteAdministratorUseCase;
    private final DeleteInvitationUseCase deleteInvitationUseCase;
    private final AcceptInvitationUseCase acceptInvitationUseCase;
    private final InvitationRepository invitationRepository;

    @GetMapping
    @Operation(
            summary = "Obtenir les administrateurs de l'entreprise",
            description = "Récupère tous les administrateurs et leurs droits pour une entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.READONLY, companyIdParam = "companyId")
    public ResponseEntity<List<CompanyAdministratorRepository.CompanyAdministratorInfo>> getCompanyAdministrators(
            @PathVariable("companyId") UUID companyId
    ) {
        List<CompanyAdministratorRepository.CompanyAdministratorInfo> administrators =
                companyRightsService.getCompanyAdministrators(companyId);
        return ResponseEntity.ok(administrators);
    }

    @PostMapping("/invite")
    @Operation(
            summary = "Inviter un administrateur à l'entreprise",
            description = "Invite un administrateur (existant ou nouveau) à rejoindre l'entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.MANAGER, companyIdParam = "companyId")
    public ResponseEntity<InvitationResponse> inviteAdministrator(
            @PathVariable("companyId") UUID companyId,
            @RequestBody InviteAdministratorRequest request
    ) {
        UUID currentUserId = getCurrentUserId();

        InviteAdministrator command = InviteAdministrator.builder()
                .email(request.email())
                .rights(request.rights())
                .companyId(companyId)
                .build();

        Invitation invitation = inviteAdministratorUseCase.execute(command, currentUserId);

        return ResponseEntity.ok(InvitationResponse.from(invitation));
    }

    @GetMapping("/invitations")
    @Operation(
            summary = "Obtenir les invitations en cours",
            description = "Récupère toutes les invitations pending pour l'entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.MANAGER, companyIdParam = "companyId")
    public ResponseEntity<List<InvitationResponse>> getPendingInvitations(
            @PathVariable("companyId") UUID companyId
    ) {
        List<Invitation> invitations = invitationRepository.findPendingByCompanyId(companyId);
        return ResponseEntity.ok(
                invitations.stream()
                        .map(InvitationResponse::from)
                        .toList()
        );
    }

    @DeleteMapping("/invitations/{invitationId}")
    @Operation(
            summary = "Supprimer une invitation",
            description = "Supprime une invitation en attente"
    )
    @RequiresCompanyRight(value = CompanyRight.MANAGER, companyIdParam = "companyId")
    public ResponseEntity<Void> deleteInvitation(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("invitationId") UUID invitationId
    ) {
        UUID currentUserId = getCurrentUserId();
        deleteInvitationUseCase.execute(invitationId, companyId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{administratorId}/rights")
    @Operation(
            summary = "Modifier les droits d'un administrateur",
            description = "Met à jour les droits d'un administrateur pour cette entreprise"
    )
    @RequiresCompanyRight(value = CompanyRight.OWNER, companyIdParam = "companyId")
    public ResponseEntity<Void> updateAdministratorRights(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("administratorId") UUID administratorId,
            @RequestBody UpdateRightsRequest request
    ) {
        UUID currentUserId = getCurrentUserId();

        companyRightsService.updateAdministratorRights(
                companyId,
                administratorId,
                request.rights(),
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
            @PathVariable("companyId") UUID companyId,
            @PathVariable("administratorId") UUID administratorId
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
    public ResponseEntity<CompanyRightInfo> getMyRights(@PathVariable("companyId") UUID companyId) {
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

    public record InviteAdministratorRequest(String email, CompanyRight rights) {}

    public record UpdateRightsRequest(CompanyRight rights) {}

    public record InvitationResponse(
            UUID id,
            UUID token,
            String email,
            String status,
            String rights,
            String createdAt,
            String expiresAt
    ) {
        public static InvitationResponse from(Invitation invitation) {
            return new InvitationResponse(
                    invitation.id(),
                    invitation.token(),
                    invitation.email(),
                    invitation.status().name(),
                    invitation.rights().getDisplayName(),
                    invitation.createdAt().toString(),
                    invitation.expiresAt().toString()
            );
        }
    }
}