package com.legipilot.service.config;

import com.legipilot.service.core.administrator.infra.out.JpaAdministratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.collaborator.infra.out.JpaCollaboratorRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.core.company.infra.out.CollaboratorDto;
import com.legipilot.service.core.company.infra.out.CompanyDto;
import com.legipilot.service.core.company.infra.out.JpaCompanyRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.utility.DockerImageName;

import java.util.Optional;
import java.util.UUID;

import static com.legipilot.service.core.administrator.AdministratorFixtures.JUSTIANA;
import static org.awaitility.Awaitility.await;
import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

public class BaseIntegrationTest {

    static final PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("pgvector/pgvector:0.8.0-pg16")
            .waitingFor(Wait.forListeningPort())
            .withReuse(true);

    static final LocalStackContainer localstack = new LocalStackContainer(
            DockerImageName.parse("localstack/localstack:latest"))
            .withServices(S3);

    @Autowired
    private JpaAdministratorRepository jpaAdministratorRepository;
    @Autowired
    private JpaCompanyRepository jpaCompanyRepository;
    @Autowired
    private JpaCollaboratorRepository jpaCollaboratorRepository;

    @BeforeAll
    static void beforeAll() {
        postgreSQLContainer.start();
    }

    @BeforeEach
    void setUp() {
        jpaAdministratorRepository.deleteAll();
        jpaCompanyRepository.deleteAll();
        jpaCollaboratorRepository.deleteAll();
    }

    protected Collaborator etantDonneLeCollaborateur() {
        CompanyDto companyDto = jpaCompanyRepository.save(CompanyDto.from(JUSTIANA));

        Collaborator collaborator = Collaborator.initialize(
                "Jean",
                "Dupont",
                "jean.dupont@test.fr",
                "0612345678",
                Optional.empty()
        );
        collaborator.associateWith(companyDto.toDomain());

        CollaboratorDto dto = CollaboratorDto.from(collaborator);
        jpaCollaboratorRepository.save(dto);

        return dto.toDomain();
    }

    @DynamicPropertySource
    static void overrideDataSourceProperties(DynamicPropertyRegistry registry) {
        localstack.start();
        await().until(localstack::isRunning);

        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);

        registry.add("aws.s3.endpoint", () -> localstack.getEndpointOverride(S3).toString());
        registry.add("aws.s3.accesskey", localstack::getAccessKey);
        registry.add("aws.s3.secretkey", localstack::getSecretKey);
        registry.add("aws.s3.region", localstack::getRegion);
        registry.add("aws.s3.bucketname", () -> "justiana-documents-test");
        registry.add("aws.s3.environnement", () -> "test");
    }

}
