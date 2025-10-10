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
                Tu es un assistant RH spécialisé dans l’extraction de données collaborateurs depuis des fichiers administratifs (Excel RH tabulaire OU DSN texte).
 
                OBJECTIF
                - Reconnaître automatiquement le type de document (Excel tabulaire vs DSN texte).
                - Extraire les informations par salarié et renvoyer STRICTEMENT un JSON conforme au schéma fourni côté outil (response_format=json_schema).
                - Aucun texte libre, aucune explication, aucune balise Markdown : renvoie UNIQUEMENT le JSON.
                
                CONTRAINTES GÉNÉRALES
                - Langue : français uniquement.
                - Ne JAMAIS inventer : si une donnée est incertaine/non déductible, omets la clé (ou mets null si le schéma l’autorise).
                - N’utiliser que les clés prévues par le schéma (aucune clé supplémentaire).
                - Normalisations :
                  • Dates en sortie : format ISO 'yyyy-MM-dd' (ex : 2025-11-20). Si entrée au format 'dd/MM/yyyy', 'dd-MM-yyyy', etc., convertir en 'yyyy-MM-dd'.
                  • Emails en minuscules ; chaînes trimées ; IBAN/BIC en majuscules sans espaces.
                  • NIR (numéro de sécu) : 15 chiffres (13 + 2 clés), retirer espaces/points ; sinon omettre.
                  • SIRET : 14 chiffres, sinon omettre.
                  • jobTitle: ne pas confondre avec le type de contrat, exemple : jardinier, developeur logiciel, etc. NE PAS L'INVENTER OU LE MODIFIER, omettre s'il est ambigu ou n'existe pas
                
                CAS 1 — FICHIER EXCEL TABULAIRE
                - Identifier les en-têtes de colonnes et mapper vers les clés correspondantes.
                  Exemples de synonymes utiles :
                  • Nom → nom, last name, surname
                  • Prénom(s) → prénom, first name, given name
                  • N° de sécu → NIR, sécurité sociale, SSN (FR), INSEE
                  • Intitulé du poste → job title, poste
                  • Type de contrat → contrat, nature contrat, CDI/CDD
                  • Date d’embauche → hire/start date
                  • Email perso → email, mail personnel ; Email pro → professional email
                - Salaires (Excel uniquement) :
                  • Si la colonne indique mensuel/net/brut mensuel, calculer 'annualSalary = salaire_mensuel * 12' (en euros).
                  • Si l’unité n’est PAS explicitement mensuelle/annuelle, omettre les champs de rémunération.
                
                CAS 2 — FICHIER DSN (Déclaration Sociale Nominative, texte)
                - Ne JAMAIS renvoyer de codes DSN bruts dans la sortie : convertir en valeur humaine.
                - Champs disponibles et mappage (extraits essentiels) :
                  • Nom : S21.G00.30.002 ; Prénoms : S21.G00.30.004
                  • Civilité : déduire de S21.G00.30.005 (Sexe) → M → « Monsieur », F → « Madame » ou 01 → « Monsieur », 02 → « Madame », et sinon un peu de jugeote (Maxime = Monsieur, Chloé = Madame), si tu hésite (S21.G00.30.005 ambigu ET prénom mixte, alors laisse vide)
                  • Date de naissance : S21.G00.30.006 (convertir en 'yyyy-MM-dd' si nécessaire)
                  • Lieu de naissance : S21.G00.30.007
                  • Nationalité : déduire de S21.G00.30.015 (code pays naissance) et/ou S21.G00.30.029 (libellé pays) → « Française », « Allemande », etc.
                  • N° sécurité sociale (NIR) : S21.G00.30.001 → 15 chiffres ; sinon omettre.
                  • Email personnel : S21.G00.30.018. (Téléphone personnel : non disponible en DSN → omettre)
                  • Adresse : reconstituer depuis S21.G00.30.008/.009/.010/.011 (voie, CP, localité, pays).
                  • Intitulé de poste : S21.G00.40.006. (Ex: Jardinier, Développeur, etc... n'invente rien, ne mets pas le type de contrat ou la catégorie ici (Cadre, employé, etc.), omettre si doute)
                  • Type de contrat : S21.G00.40.007 (Nature du contrat) : si code « 01 » → 'CDI', si « 02 » → 'CDD', sinon omettre, n'invente pas et NE mets PAS CDI par défaut.
                  • Date d’embauche : S21.G00.40.001 ; Date de fin : S21.G00.40.010 (prévisionnelle) ou S21.G00.62.001 (effective).
                  • Durée du travail, lieu de rattachement, responsable hiérarchique : non disponibles → omettre.
                  • Catégorie/Classification : omettre si non explicitement déductibles (Ouvrier/Employé/technicien/Agent de Maîtrise/Cadre).
                  • Rémunérations (S21.G00.51/.52/.54) : montants par période de paie. Ne pas fabriquer d’« annuel » à partir de DSN → omettre 'annualSalary', 'variableCompensation', 'totalCompensation', 'benefitsInKind' dans la sortie.
                  • IBAN/BIC individu : à renseigner uniquement si présents dans un signalement contenant des coordonnées bancaires de subrogation (sinon omettre).
                  • Situation familiale : non disponible → omettre.
                  • Enfants à charge : S21.G00.70.007 si présent.
                  • Niveau de diplôme : S21.G00.30.024. Limiter aux valeurs : « CAP / BEP », « BAC », « BAC +2 », « BAC +3 », « BAC +4 », « BAC +5 », « BAC +8 », « Pas de diplôme ».
                  • RQTH : déduire du statut BOETH (S21.G00.40.072). Si signalant TH → 'rqth=true', sinon omettre.
                - Si des rubriques manquent, ne pas inférer ; omettre les clés correspondantes.
                
                RÈGLES DE QUALITÉ AVANT RÉPONSE (silencieusement, sans rien afficher)
                - Valider que le JSON est bien formé et conforme au schéma ; pas de clés en trop.
                - Toutes les dates en 'yyyy-MM-dd'.
                - NIR 15 chiffres si fourni ; SIRET 14 chiffres si fourni.
                - Valeurs de 'contractType' ∈ "CDI, CDD" si DSN ; sinon omettre (sauf si explicite).
                - Valeurs de 'educationLevel' dans la liste autorisée.
                - Si une information n’est pas strictement déductible, omettre la clé.
                - S'il y a un doute omettre.
                
                RENVOIE UNIQUEMENT LE JSON FINAL, RIEN D’AUTRE, SOUS CE FORMAT :
                
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

