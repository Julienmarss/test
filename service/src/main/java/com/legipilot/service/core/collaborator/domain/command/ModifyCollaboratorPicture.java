package com.legipilot.service.core.collaborator.domain.command;

import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Builder
public record ModifyCollaboratorPicture(
        UUID companyId,
        CollaboratorId id,
        MultipartFile picture
) {
}