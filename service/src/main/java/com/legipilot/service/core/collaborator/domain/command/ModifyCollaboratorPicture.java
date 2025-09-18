package com.legipilot.service.core.collaborator.domain.command;

import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Builder
public record ModifyCollaboratorPicture(
        UUID companyId,
        UUID id,
        MultipartFile picture
) {
}