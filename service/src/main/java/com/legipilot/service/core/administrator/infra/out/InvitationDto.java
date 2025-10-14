package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.administrator.domain.model.InvitationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invitations")
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvitationDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String rights;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "administrator_id", nullable = false)
    private UUID administratorId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime expiresAt;

    @Column
    private LocalDateTime acceptedAt;

    public static InvitationDto from(Invitation invitation) {
        return InvitationDto.builder()
                .id(invitation.id())
                .token(invitation.token())
                .email(invitation.email())
                .status(invitation.status().name())
                .rights(invitation.rights().getDbValue())
                .companyId(invitation.companyId())
                .administratorId(invitation.administratorId())
                .createdAt(invitation.createdAt())
                .expiresAt(invitation.expiresAt())
                .acceptedAt(invitation.acceptedAt())
                .build();
    }

    public Invitation toDomain() {
        return Invitation.builder()
                .id(id)
                .token(token)
                .email(email)
                .status(InvitationStatus.valueOf(status))
                .rights(com.legipilot.service.core.administrator.domain.model.CompanyRight.fromDbValue(rights))
                .companyId(companyId)
                .administratorId(administratorId)
                .createdAt(createdAt)
                .expiresAt(expiresAt)
                .acceptedAt(acceptedAt)
                .build();
    }
}