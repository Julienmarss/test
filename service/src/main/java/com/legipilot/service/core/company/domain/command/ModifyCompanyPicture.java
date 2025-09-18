package com.legipilot.service.core.company.domain.command;

import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Builder
public record ModifyCompanyPicture(
        UUID id,
        MultipartFile picture
) {
}
