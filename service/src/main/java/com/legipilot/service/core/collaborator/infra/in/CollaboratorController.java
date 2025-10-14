package com.legipilot.service.core.collaborator.infra.in;

import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorResponse;
import com.legipilot.service.core.collaborator.*;
import com.legipilot.service.core.collaborator.domain.command.DeleteCollaborator;
import com.legipilot.service.core.collaborator.domain.command.ImportCollaborators;
import com.legipilot.service.core.collaborator.domain.command.ModifyCollaboratorPicture;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.company.infra.in.CollaboratorResponse;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.coyote.BadRequestException;
import org.hibernate.sql.Update;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies/{companyId}/collaborators")
@RequiredArgsConstructor
public class CollaboratorController {

    private final CollaboratorService service;
    private final StartImportingCollaboratorsUseCase startImportingCollaboratorsUseCase;
    private final CreateCollaboratorUseCase createCollaboratorUseCase;
    private final UpdateCollaboratorUseCase updateCollaboratorUseCase;
    private final DeleteCollaboratorUseCase deleteCollaboratorUseCase;

    @GetMapping
    public ResponseEntity<List<CollaboratorResponse>> getCollaborators(@PathVariable("companyId") UUID companyId) {
        List<Collaborator> collaborators = service.getFromCompany(companyId);
        return ResponseEntity.ok(
                collaborators.stream()
                        .map(CollaboratorResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> getCollaborator(@PathVariable("id") UUID id) {
        Collaborator collaborator = service.get(id);
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

    @PostMapping
    public ResponseEntity<CollaboratorResponse> create(@PathVariable("companyId") UUID companyId,
                                                       @RequestBody CreateCollaboratorRequest request) {
        // TODO: verif identité du demandeur
        Collaborator collaborator = createCollaboratorUseCase.execute(request.toDomain(companyId));

        return ResponseEntity.ok(CollaboratorResponse.from(collaborator));
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importSeveral(@PathVariable("companyId") UUID companyId,
                                              @RequestParam("files") List<MultipartFile> files) {
        // TODO: verif identité du demandeur
        Authentication authenticatedAdmin = SecurityContextHolder.getContext().getAuthentication();
        ImportCollaborators command = ImportCollaborators.builder()
                .companyId(companyId)
                .file(files.getFirst())
                .adminEmail(authenticatedAdmin.getName())
                .build();

        startImportingCollaboratorsUseCase.execute(command);

        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> update(@PathVariable("companyId") UUID companyId,
                                                       @PathVariable("id") UUID collaboratorId,
                                                       @RequestBody UpdateCollaboratorRequest request) {
        // TODO: verif identité du demandeur
        Collaborator collaborator = updateCollaboratorUseCase.execute(request.toDomain(collaboratorId));

        return ResponseEntity.ok(CollaboratorResponse.from(collaborator));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        deleteCollaboratorUseCase.execute(
                DeleteCollaborator.builder()
                        .id(id)
                        .build()
        );
        return ResponseEntity.noContent()
                .build();
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportCollaborators(@PathVariable("companyId") UUID companyId) throws IOException {
        try {
            List<Collaborator> collaborators = service.getFromCompany(companyId);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            StringWriter writer = new StringWriter();
            CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                    "Prénom", "Nom", "Date de naissance", "Lieu de naissance", "Nationalité", "Civilité",
                    "Numéro de sécurité sociale", "Statut",
                    "Téléphone personnel", "Email personnel", "Adresse personnelle",
                    "Civilité contact d’urgence", "Prénom contact d’urgence", "Nom contact d’urgence", "Téléphone contact d’urgence", "Email contact d’urgence",
                    "Téléphone professionnel", "Email professionnel", "IBAN",
                    "Situation familiale", "Nombre d’enfants", "Niveau d’étude", "Permis de conduire", "RQTH",
                    "Poste", "Type de contrat", "Date d’embauche", "Heures de travail par semaine", "Lieu de travail",
                    "Catégorie socio-professionnelle", "Classification", "Salaire annuel", "Rémunération variable",
                    "Avantages en nature", "Rémunération totale", "Période d’essai", "Clause de non-concurrence"
            ));

            for (Collaborator c : collaborators) {
                csvPrinter.printRecord(
                        c.firstname(),
                        c.lastname(),
                        c.birthDate() != null ? c.birthDate().format(formatter) : "",
                        c.birthPlace(),
                        c.nationality(),
                        c.civility() != null ? c.civility().name() : "",
                        c.socialSecurityNumber() != null ? c.socialSecurityNumber().value() : "",
                        c.status() != null ? c.status().name() : "",

                        c.contactDetails() == null ? "" : c.contactDetails().personalPhone(),
                        c.contactDetails() == null ? "" : c.contactDetails().personalEmail(),
                        c.contactDetails() == null ? "" : c.contactDetails().personalAddress(),

                        c.contactDetails() == null ? "" : c.contactDetails().emergencyContact() == null ? "" : c.contactDetails().emergencyContact().civility() != null ? c.contactDetails().emergencyContact().civility().name() : "",
                        c.contactDetails() == null ? "" : c.contactDetails().emergencyContact() == null ? "" : c.contactDetails().emergencyContact().firstname(),
                        c.contactDetails() == null ? "" : c.contactDetails().emergencyContact() == null ? "" : c.contactDetails().emergencyContact().lastname(),
                        c.contactDetails() == null ? "" : c.contactDetails().emergencyContact() == null ? "" : c.contactDetails().emergencyContact().phone(),
                        c.contactDetails() == null ? "" : c.contactDetails().emergencyContact() == null ? "" : c.contactDetails().emergencyContact().email(),

                        c.contactDetails() == null ? "" : c.contactDetails().professionalPhone(),
                        c.contactDetails() == null ? "" : c.contactDetails().professionalEmail(),
                        c.contactDetails() == null ? "" : c.contactDetails().iban(),

                        c.personalSituation() == null ? "" : c.personalSituation().maritalStatus(),
                        c.personalSituation() == null ? "" : c.personalSituation().numberOfChildren(),
                        c.personalSituation() == null ? "" : c.personalSituation().educationLevel(),
                        c.personalSituation() == null ? "" : c.personalSituation().drivingLicenses() != null ? String.join(";", c.personalSituation().drivingLicenses()) : "",
                        c.personalSituation() == null ? "" : c.personalSituation().rqth() == null ? "" : c.personalSituation().rqth() ? "Oui" : "Non",

                        c.professionalSituation() == null ? "" : c.professionalSituation().jobTitle(),
                        c.professionalSituation() == null ? "" : c.professionalSituation().contractType(),
                        c.professionalSituation() == null ? "" : c.professionalSituation().hireDate() != null ? c.professionalSituation().hireDate().format(formatter) : "",
                        c.professionalSituation() == null ? "" : c.professionalSituation().workHoursPerWeek(),
                        c.professionalSituation() == null ? "" : c.professionalSituation().location(),

                        c.contractInformations() == null ? "" : c.contractInformations().category(),
                        c.contractInformations() == null ? "" : c.contractInformations().classification(),
                        c.contractInformations() == null ? "" : c.contractInformations().annualSalary(),
                        c.contractInformations() == null ? "" : c.contractInformations().variableCompensation(),
                        c.contractInformations() == null ? "" : c.contractInformations().benefitsInKind(),
                        c.contractInformations() == null ? "" : c.contractInformations().totalCompensation(),
                        c.contractInformations() == null ? "" : c.contractInformations().trialPeriod(),
                        c.contractInformations() == null ? "" : c.contractInformations().nonCompeteClause() == null ? "" : c.contractInformations().nonCompeteClause() ? "Oui" : "Non"
                );
            }

            csvPrinter.flush();
            csvPrinter.close();

            byte[] csvData = writer.toString().getBytes(StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"collaborators.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csvData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/fill-profile-request")
    public ResponseEntity<Void> sendRequestFillProfilInvitationEmail(@PathVariable("companyId") UUID companyId, @PathVariable("id") UUID id) {
        try {
            updateCollaboratorUseCase.execute(companyId, id);
            return ResponseEntity.ok().build();
        } catch (RessourceNotFound ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
	}
	
    @PostMapping("/{id}/picture")
    public ResponseEntity<CollaboratorResponse> addPicture(@PathVariable UUID companyId,
                                                            @PathVariable UUID id,
                                                            @RequestParam("file") MultipartFile picture) {
        // TODO: add checks c'est bien moi
        Collaborator collaborator = updateCollaboratorUseCase.execute(
                ModifyCollaboratorPicture.builder()
                    .id(id)
                    .companyId(companyId)
                    .picture(picture)
                    .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }
}
