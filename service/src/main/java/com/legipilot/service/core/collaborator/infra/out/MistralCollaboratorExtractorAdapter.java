package com.legipilot.service.core.collaborator.infra.out;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.legipilot.service.core.collaborator.domain.CollaboratorExtractorPort;
import com.legipilot.service.core.collaborator.domain.model.*;
import com.legipilot.service.shared.domain.error.TechnicalError;
import com.legipilot.service.shared.domain.model.DocumentText;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MistralCollaboratorExtractorAdapter implements CollaboratorExtractorPort {

    private final ChatModel chatModel;

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
        String format = outputConverter.getFormat();

        String template = """
                Tu es un assistant RH. À partir du contenu suivant extrait d’un fichier administratif (DSN, registre du personnel, etc.),
                tu dois extraire la liste des collaborateurs.
                
                ⚠️ Réponds uniquement avec un JSON **strictement conforme** au format ci-dessous.
                N’inclus pas de texte d’explication, ni de blocs markdown.
                Utilise exactement les noms de propriété spécifiés.
                Utilise le format de date `yyyy-MM-dd` (ex: 2025-20-01) pour toutes les dates.
                Le champ `nationality` doit contenir une nationalité en français (par exemple : Française, Allemande, Italienne, Anglaise, etc.).
                Le champ `education_level` doit contenir une de ces valeurs: 'CAP / BEP', 'BAC', 'BAC +2', 'BAC +3', 'BAC +4', 'BAC +5', 'BAC +8', 'Pas de diplôme'.
                Les informations saisies doivent être en français.
                
                Voici le format :
                
                {format}
                
                Texte source :
                
                {text}
                """;

        PromptTemplate promptTemplate = PromptTemplate.builder()
                .template(template)
                .variables(Map.of("format", format, "text", document.text()))
                .build();
        Prompt prompt = new Prompt(promptTemplate.createMessage());
        Generation generation = this.chatModel.call(prompt).getResult();

        CollaboratorsDto collaborators = outputConverter.convert(generation.getOutput().getText());
        return collaborators.collaborators().stream()
                .map(CollaboratorDto::toDomain)
                .toList();
    }

    record CollaboratorsDto(List<CollaboratorDto> collaborators) {
    }

    record CollaboratorDto(
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
                    .socialSecurityNumber(socialSecurityNumber.length() == 15 ? new SocialSecurityNumber(socialSecurityNumber) : null)
                    .status(status)
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
