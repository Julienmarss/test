package com.legipilot.service.core.collaborator.infra.out;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.victools.jsonschema.generator.*;
import com.legipilot.service.core.collaborator.domain.CollaboratorExtractorPort;
import com.legipilot.service.core.collaborator.domain.model.*;
import com.legipilot.service.shared.domain.AgentClientPort;
import com.legipilot.service.shared.domain.error.TechnicalError;
import com.legipilot.service.shared.domain.model.DocumentText;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MistralCollaboratorExtractorAdapter implements CollaboratorExtractorPort {

    private final AgentClientPort agentClient;

    @Value("${spring.ai.agent.collaborators-extract-id}")
    private String agentId;

    @Override
    public List<Collaborator> extract(DocumentText document) {
        try {
            BeanOutputConverter<CollaboratorsDto> outputConverter = new BeanOutputConverter<>(CollaboratorsDto.class);
            return generateAndParse(document, outputConverter);
        } catch (Exception e) {
            throw new TechnicalError("Désolé, nous n'avons pas pu extraire les collaborateurs du fichier fourni.");
        }
    }

    @Retryable(retryFor = {JsonProcessingException.class, IllegalArgumentException.class})
    public List<Collaborator> generateAndParse(DocumentText document, BeanOutputConverter<CollaboratorsDto> outputConverter) {

        SchemaGeneratorConfigBuilder configBuilder = new SchemaGeneratorConfigBuilder(SchemaVersion.DRAFT_2020_12, OptionPreset.PLAIN_JSON);
        SchemaGeneratorConfig config = configBuilder.build();
        SchemaGenerator generator = new SchemaGenerator(config);
        JsonNode jsonSchema = generator.generateSchema(CollaboratorsDto.class);

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> schemaMap = mapper.convertValue(jsonSchema, new TypeReference<>() {});

        Map<String, Object> responseFormat = Map.of(
                "type", "json_schema",
                "json_schema", Map.of(
                        "name", "collaborators_payload",
                        "strict", false,
                        "schema", schemaMap
                )
        );

        String raw = agentClient.complete(
                agentId,
                List.of(AgentClientPort.Message.user(document.text())),
                responseFormat
        );

        String contentJson = extractContentJson(raw);
        CollaboratorsDto collaborators = outputConverter.convert(contentJson);
        return collaborators.collaborators().stream()
                .map(CollaboratorDto::toDomain)
                .toList();
    }

    private static String extractContentJson(String raw) {
        try {
            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(raw);
            String content = root.at("/choices/0/message/content").asText();
            String t = content.trim();
            if (t.startsWith("```")) {
                int firstNl = t.indexOf('\n');
                int lastFence = t.lastIndexOf("```");
                if (firstNl >= 0 && lastFence > firstNl) {
                    t = t.substring(firstNl + 1, lastFence).trim();
                }
            }
            return t;
        } catch (Exception e) {
            throw new TechnicalError("Réponse Agent invalide: impossible d'extraire le contenu JSON.");
        }
    }

    public record CollaboratorsDto(List<CollaboratorDto> collaborators) {
    }

    public record CollaboratorDto(
            String firstname,
            String lastname,
            Civility civility,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate birthDate,
            String birthPlace,
            String nationality,
            Status status,
            String socialSecurityNumber,
            PersonalSituation personalSituation,
            ProfessionalSituation professionalSituation,
            ContractInformations contractInformations,
            ContactDetails contactDetails
    ) {

        public Collaborator toDomain() {
            return Collaborator.builder()
                    .firstname(firstname)
                    .lastname(lastname)
                    .civility(civility)
                    .birthDate(birthDate)
                    .birthPlace(birthPlace)
                    .nationality(nationality)
                    .socialSecurityNumber(
                            socialSecurityNumber != null && socialSecurityNumber.length() == 15
                                    ? new SocialSecurityNumber(socialSecurityNumber) : null)                    .status(status)
                    .personalSituation(personalSituation)
                    .professionalSituation(professionalSituation)
                    .contractInformations(contractInformations)
                    .contactDetails(contactDetails)
                    .notes(new ArrayList<>())
                    .documents(new ArrayList<>())
                    .build();
        }
    }

}
