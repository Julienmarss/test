package com.legipilot.service.core.company.domain.model;

import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.domain.model.*;
import com.legipilot.service.core.company.domain.command.ModifyCompany;
import lombok.*;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Builder
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Company {
    private final UUID id;
    private String name;
    private Siren siren;
    private Siret siret;
    private String legalForm;
    private NafCode nafCode;
    private String activityDomain;
    private CollectiveAgreement collectiveAgreement;
    private Optional<String> picture;
    private List<Administrator> administrators;
    private List<Collaborator> collaborators;

    public static Company register(Administrator administrator, SignUp command) {
        Siret siret = new Siret(command.siret());
        List<Collaborator> collaborators = new ArrayList<>(List.of(
                Collaborator.initialize(command.firstName(), command.lastName(), command.email(), command.phone(), command.picture()),
                Collaborator.builder()
                        .firstname("Julie")
                        .lastname("Lacroix")
                        .birthDate(LocalDate.of(1990, 2, 17))
                        .birthPlace("Lille")
                        .nationality("Française")
                        .civility(Civility.Madame)
                        .socialSecurityNumber(new SocialSecurityNumber("2 90 02 59 123 456 78"))
                        .picture(Optional.of("https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/julie.jpg"))
                        .status(Status.ACTIVE)
                        .contactDetails(ContactDetails.builder()
                                .personalPhone("06 12 23 34 45")
                                .personalEmail("julie.lacroix@gmail.com")
                                .personalAddress("15 rue des Lilas, 59000 Lille")
                                .emergencyContact(EmergencyContact.builder()
                                        .civility(Civility.Monsieur)
                                        .firstname("Maxime")
                                        .lastname("Lacroix")
                                        .phone("06 54 43 32 21")
                                        .email("maxime.lacroix@gmail.com")
                                        .build())
                                .professionalPhone("07 21 32 43 54")
                                .professionalEmail("julie.lacroix@entreprise.fr")
                                .iban("FR76 1111 2222 3333 4444 5555 666")
                                .build())
                        .personalSituation(PersonalSituation.builder()
                                .maritalStatus("Marié(e)")
                                .numberOfChildren(2)
                                .educationLevel("BAC+2")
                                .drivingLicenses(List.of("B"))
                                .rqth(false)
                                .build())
                        .professionalSituation(ProfessionalSituation.builder()
                                .jobTitle("Chargée d'accueil")
                                .contractType(ContractType.CDI)
                                .hireDate(LocalDate.of(2018, 3, 5))
                                .workHoursPerWeek(35)
                                .workHoursType(WorkHoursType.HEURES)
                                .location("Lille")
                                .responsible("Benoit Durant")
                                .build())
                        .contractInformations(ContractInformations.builder()
                                .category(SocioProfessionalCategory.EMPLOYE)
                                .classification("Position 2, Coefficient 250")
                                .annualSalary(BigDecimal.valueOf(32000))
                                .variableCompensation(BigDecimal.valueOf(1000))
                                .benefitsInKind(BigDecimal.valueOf(1200))
                                .totalCompensation(BigDecimal.valueOf(34200))
                                .trialPeriod("2 mois")
                                .nonCompeteClause(false)
                                .stayType("APS")
                                .stayNumber("123456789")
                                .stayValidityDate(LocalDate.parse(String.valueOf(LocalDate.of(1990, 2, 17))))
                                .build())
                        .documents(List.of())
                        .notes(List.of())
                        .build()
                )
        );
        return Company.builder()
                .name(command.companyName())
                .siret(siret)
                .siren(Siren.aPartirDe(siret))
                .legalForm(command.legalForm())
                .nafCode(new NafCode(command.nafCode()))
                .activityDomain(command.activityDomain())
                .collectiveAgreement(new CollectiveAgreement(command.idcc(), command.collectiveAgreement()))
                .administrators(List.of(administrator))
                .collaborators(collaborators)
                .picture(Optional.empty())
                .build();
    }

    public void modifyPicture(ExposedFile file) {
        this.picture = Optional.of(file.url());
    }

    /**
     * Modifie l'entreprise avec les nouvelles données
     *
     * @param command Commande contenant les modifications
     */
    public void modify(ModifyCompany command) {
        command.companyName().ifPresent(x -> this.name = x);
        command.siren().ifPresent(x -> this.siren = new Siren(x));
        command.siret().ifPresent(x -> this.siret = new Siret(x));
        command.legalForm().ifPresent(x -> this.legalForm = x);
        command.nafCode().ifPresent(x -> this.nafCode = new NafCode(x));
        command.activityDomain().ifPresent(x -> this.activityDomain = x);
        command.collectiveAgreement().ifPresent(x -> this.collectiveAgreement = x);
        command.idcc().ifPresent(idcc ->
                this.collectiveAgreement = new CollectiveAgreement(idcc, this.collectiveAgreement.titre())
        );
    }
}
