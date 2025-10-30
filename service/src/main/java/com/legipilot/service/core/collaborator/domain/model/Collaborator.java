package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import com.legipilot.service.core.collaborator.domain.command.CreateCollaborator;
import com.legipilot.service.core.collaborator.domain.command.UpdateCollaborator;
import com.legipilot.service.core.collaborator.notes.domain.AddNote;
import com.legipilot.service.core.collaborator.notes.domain.ModifyNote;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.*;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Getter
@Setter
@Accessors(fluent = true)
@Builder
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Collaborator {
    private final CollaboratorId id;
    private String firstname;
    private String lastname;
    private Optional<String> picture;
    private Civility civility;
    private LocalDate birthDate;
    private String birthPlace;
    private String nationality;
    private SocialSecurityNumber socialSecurityNumber;
    private Status status;

    private ProfessionalSituation professionalSituation;
    private ContractInformations contractInformations;
    private ContactDetails contactDetails;
    private PersonalSituation personalSituation;

    private List<Note> notes;
    private List<Document> documents;

    private Company company;

    public static Collaborator initialize(String firstName, String lastName, String email, String phone, Optional<String> picture) {
        return Collaborator.builder()
                .firstname(firstName)
                .lastname(lastName)
                .status(Status.ACTIVE)
                .contactDetails(ContactDetails.builder()
                        .professionalEmail(email)
                        .professionalPhone(phone)
                        .build())
                .picture(picture)
                .notes(List.of())
                .documents(List.of())
                .build();
    }

    public static Collaborator create(CreateCollaborator command, Company company) {
        ContactDetails contactDetails = null;
        if (command.personalEmail() != null && !command.personalEmail().trim().isEmpty()) {
            contactDetails = ContactDetails.builder()
                    .personalEmail(command.personalEmail())
                    .build();
        }

        return Collaborator.builder()
                .firstname(command.firstname())
                .lastname(command.lastname())
                .birthDate(command.birthDate())
                .birthPlace(command.birthPlace())
                .nationality(command.nationality())
                .civility(command.civility())
                .socialSecurityNumber(command.socialSecurityNumber())
                .status(Status.ACTIVE)
                .contactDetails(contactDetails)
                .notes(List.of())
                .documents(List.of())
                .company(company)
                .build();
    }

    public void associateWith(Company company) {
        this.company = company;
    }

    public void addNote(AddNote command, Administrator administrator) {
        this.notes.add(Note.builder()
                .title(command.title())
                .content(command.content())
                .date(LocalDate.now())
                .author(administrator.firstname() + " " + administrator.lastname())
                .build()
        );
    }

    public void addDocument(Document document) {
        this.documents.add(document);
    }

    public void deleteNote(UUID noteId) {
        this.notes.removeIf(note -> note.id().equals(noteId));
    }

    public Document getDocument(UUID documentId) {
        return this.documents.stream()
                .filter(document -> document.id().equals(documentId))
                .findFirst()
                .orElseThrow(() -> new RessourceNotFound("Désolé, le document demandé n'existe pas."));
    }

    public void deleteDocument(Document documentToDelete) {
        this.documents.remove(documentToDelete);
    }

    public void modifyNote(ModifyNote command, Administrator administrator) {
        this.notes.stream()
                .filter(note -> note.id().equals(command.noteId()))
                .findFirst()
                .ifPresent(note -> {
                    note.modify(command, administrator);
                });
    }

    public void modifyDocument(UUID documentId, DocumentType type) {
        this.documents.stream()
                .filter(document -> document.id().equals(documentId))
                .findFirst()
                .ifPresent(document -> {
                    document.modify(type);
                });
    }

    public void update(UpdateCollaborator command) {
        this.firstname = command.firstname().orElse(this.firstname);
        this.lastname = command.lastname().orElse(this.lastname);
        this.birthDate = command.birthDate().orElse(this.birthDate);
        this.birthPlace = command.birthPlace().orElse(this.birthPlace);
        this.nationality = command.nationality().orElse(this.nationality);
        this.civility = command.civility().orElse(this.civility);
        this.socialSecurityNumber = command.socialSecurityNumber().orElse(this.socialSecurityNumber);
        this.contractInformations = ContractInformations.of(command);
        this.contactDetails = ContactDetails.of(command);
        this.professionalSituation = ProfessionalSituation.of(command);
        this.personalSituation = PersonalSituation.of(command);
        this.status = command.status().orElse(this.status);
        this.picture = command.picture();
    }

    public void modifyPicture(ExposedFile file) {
        this.picture = Optional.of(file.url());
    }
}

