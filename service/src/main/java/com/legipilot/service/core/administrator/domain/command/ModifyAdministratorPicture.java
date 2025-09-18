package com.legipilot.service.core.administrator.domain.command;

import com.legipilot.service.core.administrator.domain.model.Fonction;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@Builder
public record ModifyAdministratorPicture(
        UUID id,
        MultipartFile picture
) {
}
