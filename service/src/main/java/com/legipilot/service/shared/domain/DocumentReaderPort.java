package com.legipilot.service.shared.domain;

import com.legipilot.service.shared.domain.model.DocumentText;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentReaderPort {

    DocumentText read(MultipartFile file);

}
