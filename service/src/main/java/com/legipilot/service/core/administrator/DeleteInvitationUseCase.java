package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.shared.domain.error.NotAllowed;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
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
    private final CompanyRightsService companyRightsService;

    @Transactional
    public void execute(UUID invitationId, UUID companyId, UUID currentUserId) {
        if (!companyRightsService.hasRight(currentUserId, companyId,
                com.legipilot.service.core.administrator.domain.model.CompanyRight.MANAGER)) {
            throw new NotAllowed("supprimer des invitations");
        }

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RessourceNotFound("Invitation non trouvée"));

        if (!invitation.companyId().equals(companyId)) {
            throw new NotAllowed("Cette invitation n'appartient pas à cette entreprise");
        }
        invitationRepository.delete(invitationId);
    }
}