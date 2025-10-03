package com.legipilot.service.core.administrator.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.Accessors;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Accessors(fluent = true)
public class Invitation {
    private final UUID id;
    private final UUID token;
    private final String email;
    private InvitationStatus status;
    private final CompanyRight rights;
    private final UUID companyId;
    private final UUID administratorId;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private LocalDateTime acceptedAt;

    public static Invitation create(String email, CompanyRight rights, UUID companyId, UUID administratorId) {
        return Invitation.builder()
                .token(UUID.randomUUID())
                .email(email)
                .status(InvitationStatus.PENDING)
                .rights(rights)
                .companyId(companyId)
                .administratorId(administratorId)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
    }

    public void accept() {
        this.status = InvitationStatus.ACCEPTED;
        this.acceptedAt = LocalDateTime.now();
    }

    public void expire() {
        this.status = InvitationStatus.EXPIRED;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt) || status == InvitationStatus.EXPIRED;
    }

    public boolean isPending() {
        return status == InvitationStatus.PENDING && !isExpired();
    }
}