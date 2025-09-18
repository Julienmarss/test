package com.legipilot.service.core.collaborator.documents.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.company.domain.model.Company;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface DocumentStoragePort {

    StoredDocument storeAndExpose(Collaborator collaborator, MultipartFile document);

    ExposedFile storeAndExposePicture(Collaborator collaborator, MultipartFile document);

    ExposedFile storeAndExpose(Administrator administrator, MultipartFile document);

    ExposedFile storeAndExpose(Company company, MultipartFile document);

    DownloadUrl generateDownloadUrl(String objectName);

    InputStream getDocument(String objectName);

    void delete(String url);

}
