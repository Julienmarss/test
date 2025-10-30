package com.legipilot.service.core.administrator.infra.in.response;

import com.legipilot.service.core.administrator.domain.model.Invitation;

import java.util.UUID;

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
                invitation.rights().name(),
                invitation.createdAt().toString(),
                invitation.expiresAt().toString()
        );
    }
}
