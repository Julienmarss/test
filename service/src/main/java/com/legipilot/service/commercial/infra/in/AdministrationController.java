package com.legipilot.service.commercial.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.authentication.domain.AuthenticatedAdministrator;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Role;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorsResponse;
import com.legipilot.service.core.company.domain.model.Company;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@RestController
@RequestMapping("/administration")
@RequiredArgsConstructor
public class AdministrationController {

    private final AdministratorService service;

    @GetMapping("/administrators")
    public ResponseEntity<List<AdministratorsResponse>> getAll(Authentication authentication) {
        Administrator authenticatedAdministrator = service.get(authentication.getName());
        if(authenticatedAdministrator == null || !authenticatedAdministrator.roles().contains(Role.SUPER_ADMIN)) {
            throw new AccessDeniedException("Not authorized to export administrators.");
        }

        List<Administrator> administrators = service.getAll();
        return ResponseEntity.ok(
                administrators.stream()
                        .map(AdministratorsResponse::from)
                        .toList()
        );
    }

    @GetMapping(value = "/administrators/export", produces = "application/zip")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void exportAll(HttpServletResponse response, Authentication authentication) throws IOException {
        Administrator authenticatedAdministrator = service.get(authentication.getName());
        if(authenticatedAdministrator == null || !authenticatedAdministrator.roles().contains(Role.SUPER_ADMIN)) {
            throw new AccessDeniedException("Not authorized to export administrators.");
        }

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=export_legipilot.zip");

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            // 1. Administrators CSV
            zipOut.putNextEntry(new ZipEntry("administrators.csv"));
            writeAdministratorsCsv(zipOut);
            zipOut.closeEntry();

            // 2. Companies CSV
            zipOut.putNextEntry(new ZipEntry("companies.csv"));
            writeCompaniesCsv(zipOut);
            zipOut.closeEntry();
        }
    }

    private void writeAdministratorsCsv(OutputStream out) {
        PrintWriter writer = new PrintWriter(out);
        writer.println("Prénom,Nom,Email,Téléphone,Fonction,Role,Entreprises");
        List<Administrator> admins = service.getAll();
        for (Administrator a : admins) {
            String companies = a.companies().stream()
                    .map(Company::name)
                    .collect(Collectors.joining(", "));
            writer.printf("%s,%s,%s,%s,%s,%s,%s%n",
                    a.firstname(),
                    a.lastname(),
                    a.email(),
                    a.phone(),
                    a.fonction().label(),
                    a.roles().stream().map(Enum::name).collect(Collectors.joining(",")),
                    companies
            );
        }
        writer.flush();
    }

    private void writeCompaniesCsv(OutputStream out) {
        PrintWriter writer = new PrintWriter(out);
        writer.println("Nom,Siren,Siret,Forme juridique,Code NAF,Domaine d'activité,Identifiant CC,Convention collective");
        List<Company> companies = service.getAll().stream()
                .flatMap(a -> a.companies().stream())
                .distinct()
                .toList();
        for (Company c : companies) {
            writer.printf("%s,%s,%s,%s,%s,%s,%s%n",
                    c.name(),
                    c.siren().value(),
                    c.siret().value(),
                    c.legalForm(),
                    c.nafCode().value(),
                    c.activityDomain(),
                    c.collectiveAgreement().idcc()
            );
        }
        writer.flush();
    }

}
