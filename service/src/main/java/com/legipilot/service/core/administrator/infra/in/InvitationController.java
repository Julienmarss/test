package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/public/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationRepository invitationRepository;
    private final AcceptInvitationUseCase acceptInvitationUseCase;

    @GetMapping("/{token}")
    public ResponseEntity<InvitationDetailsResponse> getInvitationDetails(@PathVariable UUID token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new RessourceNotFound("Invitation non trouvée"));

        return ResponseEntity.ok(InvitationDetailsResponse.from(invitation));
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable UUID token,
            @RequestBody AcceptInvitationRequest request
    ) {
        acceptInvitationUseCase.execute(token, request.email());
        return ResponseEntity.ok().build();
    }

    // DTOs
    public record InvitationDetailsResponse(
            UUID token,
            String email,
            String status,
            String rights,
            String companyName,
            boolean isExpired
    ) {
        public static InvitationDetailsResponse from(Invitation invitation) {
            return new InvitationDetailsResponse(
                    invitation.token(),
                    invitation.email(),
                    invitation.status().name(),
                    invitation.rights().getDisplayName(),
                    "",
                    invitation.isExpired()
            );
        }
    }

    public record AcceptInvitationRequest(String email) {}
}