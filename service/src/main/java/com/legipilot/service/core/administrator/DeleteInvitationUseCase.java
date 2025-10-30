package com.legipilot.service.core.administrator;

import com.legipilot.service.core.authorization.CompanyAuthorizationService;

import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.administrator.domain.error.InvitationErrors.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeleteInvitationUseCase {

    private final InvitationRepository invitationRepository;
    private final CompanyAuthorizationService authorizationService;

    @Transactional
    public void execute(UUID invitationId, UUID companyId, UUID currentUserId) {
        authorizationService.ensureCanManage(currentUserId, companyId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(InvitationNotFoundError::new);

        if (!invitation.companyId().equals(companyId)) {
            throw new InvitationCompanyMismatchError();
        }

        invitationRepository.delete(invitationId);
    }
}