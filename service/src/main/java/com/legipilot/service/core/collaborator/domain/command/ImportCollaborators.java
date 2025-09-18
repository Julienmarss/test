package com.legipilot.service.core.collaborator.domain.command;

import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Builder
public record ImportCollaborators(UUID companyId, MultipartFile file, String adminEmail) {
}
