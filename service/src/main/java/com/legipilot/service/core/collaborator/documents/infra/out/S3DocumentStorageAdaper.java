package com.legipilot.service.core.collaborator.documents.infra.out;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import com.legipilot.service.core.collaborator.documents.domain.DownloadUrl;
import com.legipilot.service.core.collaborator.documents.domain.StoredDocument;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.error.TechnicalError;
import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
public class S3DocumentStorageAdaper implements DocumentStoragePort {

    private final MinioClient s3Client;
    private final Supplier<String> s3Url;
    private final static String PUBLIC_PATH = "public/";

    private final Logger log = LoggerFactory.getLogger(S3DocumentStorageAdaper.class);

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Value("${aws.s3.environnement}")
    private String environnement;

    @Override
    public StoredDocument storeAndExpose(Collaborator collaborator, MultipartFile document) {
        String fileName = (document.getOriginalFilename() != null) ?
                document.getOriginalFilename() :
                "document-" + System.currentTimeMillis();
        String chemin = createCollaboratorPath(fileName, collaborator);

        try {
            s3Client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(chemin)
                            .stream(document.getInputStream(), document.getSize(), -1)
                            .contentType(document.getContentType())
                            .build());

            return new StoredDocument(chemin);
        } catch (IOException e) {
            log.error("Erreur lors de l'ouverture du fichier pour stockage: " + e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (MinioException e) {
            log.error("Erreur Minio lors du stockage du document: ErrorMessage={}", e.getMessage());
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors du stockage du document: {}", e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        }
    }

    @Override
    public ExposedFile storeAndExposePicture(Collaborator collaborator, MultipartFile document) {
        // WARNING: We have to add it in Policy to be able to access it, in S3Config file
        String fileName = (document.getOriginalFilename() != null) ?
                document.getOriginalFilename() :
                "document-" + System.currentTimeMillis();
        String chemin = createPublicAvatarPath(fileName, collaborator);

        try {
            s3Client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(chemin)
                            .stream(document.getInputStream(), document.getSize(), -1)
                            .contentType(document.getContentType())
                            .build());

            return new ExposedFile(s3Url.get() + chemin);
        } catch (IOException e) {
            log.error("Erreur lors de l'ouverture du fichier pour stockage: " + e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (MinioException e) {
            log.error("Erreur Minio lors du stockage du document: ErrorMessage={}", e.getMessage());
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors du stockage du document: {}", e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        }
    }

    @Override
    public ExposedFile storeAndExpose(Administrator administrator, MultipartFile document) {
        // WARNING: We have to add it in Policy to be able to access it, in S3Config file
        String fileName = (document.getOriginalFilename() != null) ?
                document.getOriginalFilename() :
                "document-" + System.currentTimeMillis();
        String chemin = createPublicAdministratorPath(fileName, administrator);

        try {
            s3Client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(chemin)
                            .stream(document.getInputStream(), document.getSize(), -1)
                            .contentType(document.getContentType())
                            .build());

            return new ExposedFile(s3Url.get() + chemin);
        } catch (IOException e) {
            log.error("Erreur lors de l'ouverture du fichier pour stockage: " + e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (MinioException e) {
            log.error("Erreur Minio lors du stockage du document: ErrorMessage={}", e.getMessage());
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors du stockage du document: {}", e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        }
    }

    @Override
    public ExposedFile storeAndExpose(Company company, MultipartFile document) {
        // WARNING: We have to add it in Policy to be able to access it, in S3Config file
        String fileName = (document.getOriginalFilename() != null) ?
                document.getOriginalFilename() :
                "document-" + System.currentTimeMillis();
        String chemin = createPublicCompanyPath(fileName, company);

        try {
            s3Client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(chemin)
                            .stream(document.getInputStream(), document.getSize(), -1)
                            .contentType(document.getContentType())
                            .build());

            return new ExposedFile(s3Url.get() + chemin);
        } catch (IOException e) {
            log.error("Erreur lors de l'ouverture du fichier pour stockage: " + e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (MinioException e) {
            log.error("Erreur Minio lors du stockage du document: ErrorMessage={}", e.getMessage());
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors du stockage du document: {}", e.getMessage(), e);
            throw new TechnicalError("Erreur lors du stockage du fichier.");
        }
    }

    @Override
    public DownloadUrl generateDownloadUrl(String objectName) {
        try {
            String url = s3Client.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(10, TimeUnit.MINUTES)
                            .build());
            return new DownloadUrl(url);
        } catch (MinioException e) {
            log.error("Erreur Minio lors de la génération de l'URL de téléchargement pour {}: {}", objectName, e.getMessage(), e);
            throw new TechnicalError("Erreur lors de la génération de l'URL de téléchargement du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la génération de l'URL: {}", e.getMessage(), e);
            throw new TechnicalError("Erreur lors de la génération de l'URL de téléchargement du fichier.");
        }
    }

    @Override
    public InputStream getDocument(String objectName) {
        try {
            return s3Client.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build());
        } catch (MinioException e) {
            log.error("Erreur Minio lors de la récupération du document {}: {}", objectName, e.getMessage(), e);
            throw new TechnicalError("Erreur lors de la récupération du fichier.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la récupération du document {}: {}", objectName, e.getMessage(), e);
            throw new TechnicalError("Erreur lors de la récupération du fichier.");
        }
    }

    @Override
    public void delete(String url) {
        try {
            s3Client.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(url)
                            .build());
        } catch (MinioException e) {
            log.error("Erreur Minio lors de la suppression du fichier {}: {}", url, e.getMessage(), e);
            throw new TechnicalError("Désolé, nous n'avons pas réussi à supprimer votre document.");
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la suppression: {}", e.getMessage(), e);
            throw new TechnicalError("Désolé, nous n'avons pas réussi à supprimer votre document.");
        }
    }

    private String createCollaboratorPath(String filename, Collaborator collaborator) {
        String companyName = collaborator.company().name().replaceAll("[^a-zA-Z0-9._-]", "_");
        String collaboratorName = "%s_%s".formatted(collaborator.id(), collaborator.lastname()).toLowerCase().replaceAll("[^a-zA-Z0-9._-]", "_");
        String nomDuFichierNettoye = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        return environnement + "/" + companyName + "/" + collaboratorName + "/" + nomDuFichierNettoye;
    }

    private String createPublicAdministratorPath(String filename, Administrator administrator) {
        String administratorName = "%s_%s_%s".formatted(administrator.id(), administrator.lastname(), administrator.firstname()).toLowerCase().replaceAll("[^a-zA-Z0-9._-]", "_");
        String nomDuFichierNettoye = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        return PUBLIC_PATH + environnement + "/administrators/" + administratorName + "/" + nomDuFichierNettoye;
    }

    private String createPublicCompanyPath(String filename, Company company) {
        String companyName = "%s_%s".formatted(company.id(), company.name()).toLowerCase().replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9._-]", "_");
        String nomDuFichierNettoye = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        return PUBLIC_PATH + environnement + "/companies/" + companyName + "/" + nomDuFichierNettoye;
	}
	
    private String createPublicAvatarPath(String filename, Collaborator collaborator) {
        String collaboratorName = "%s_%s_%s".formatted(collaborator.id(), collaborator.lastname(), collaborator.firstname()).toLowerCase().replaceAll("[^a-zA-Z0-9._-]", "_");
        String nomDuFichierNettoye = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        return PUBLIC_PATH + environnement + "/administrators/" + collaboratorName + "/" + nomDuFichierNettoye;
    }
}
