package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.error.InvitationErrors.*;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
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
    private final CompanyRepository companyRepository;
    private final AdministratorRepository administratorRepository;

    @GetMapping("/{token}")
    public ResponseEntity<InvitationDetailsResponse> getInvitationDetails(@PathVariable UUID token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(InvitationNotFoundError::new);

        Company company = companyRepository.get(invitation.companyId());
        Administrator inviter = administratorRepository.get(invitation.administratorId());

        return ResponseEntity.ok(InvitationDetailsResponse.from(invitation, company, inviter));
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable UUID token,
            @RequestBody AcceptInvitationRequest request
    ) {
        acceptInvitationUseCase.execute(token, request.email());
        return ResponseEntity.ok().build();
    }

    public record InvitationDetailsResponse(
            UUID token,
            String email,
            String status,
            String rights,
            String companyName,
            String inviterFirstname,
            String inviterLastname,
            boolean isExpired
    ) {
        public static InvitationDetailsResponse from(Invitation invitation, Company company, Administrator inviter) {
            return new InvitationDetailsResponse(
                    invitation.token(),
                    invitation.email(),
                    invitation.status().name(),
                    invitation.rights().getDisplayName(),
                    company.name(),
                    inviter.firstname(),
                    inviter.lastname(),
                    invitation.isExpired()
            );
        }
    }

    public record AcceptInvitationRequest(String email) {}
}