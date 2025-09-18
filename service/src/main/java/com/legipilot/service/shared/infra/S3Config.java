package com.legipilot.service.shared.infra;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.SetBucketPolicyArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Supplier;

@Configuration
public class S3Config {

    private final Logger log = LoggerFactory.getLogger(S3Config.class);

    @Value("${aws.s3.endpoint}")
    private String endpoint;
    @Value("${aws.s3.accesskey}")
    private String accessKey;
    @Value("${aws.s3.secretkey}")
    private String secretKey;
    @Value("${aws.s3.region:fr-par}")
    private String region;
    @Value("${aws.s3.bucketname}")
    private String bucketName;
    @Value("${aws.s3.environnement}")
    private String environnement;

    @Bean
    public MinioClient s3Client() {
        MinioClient minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();

        createBucketIfDoesntExist(minioClient);
        if (environnement.equals("dev")) {
            addPolicy(minioClient);
        }
        return minioClient;
    }

    @Bean
    public Supplier<String> s3Url() {
        return () -> endpoint + "/" + bucketName + "/";
    }

    private void addPolicy(MinioClient minioClient) {
        String policy = """
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Action": ["s3:GetObject"],
                      "Effect": "Allow",
                      "Principal": "*",
                      "Resource": ["arn:aws:s3:::%s/public/%s/*"]
                    }
                  ]
                }
                """.formatted(bucketName, environnement);

        try {
            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(policy)
                            .build()
            );
            log.info("Policy ajouté avec succès au bucket '{}' !", bucketName);
        } catch (Exception e) {
            log.error("Policy non ajouté au bucket '{}' !", bucketName);
            throw new RuntimeException(e);
        }
    }

    public void createBucketIfDoesntExist(MinioClient minioClient) {
        try {
            boolean bucketExiste = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build()
            );

            if (!bucketExiste) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build()
                );
                log.info("Bucket '{}' créé avec succès !", bucketName);
            } else {
                log.info("Le bucket '{}' existe déjà.", bucketName);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la validation de l'existence du bucket: {}", e.getMessage(), e);
        }
    }

}
