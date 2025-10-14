package com.legipilot.service.core.administrator.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/administrators/companies")
@RequiredArgsConstructor
@Tag(name = "Administrator Companies", description = "Gestion des entreprises d'un administrateur")
public class AdministratorCompaniesController {

    private final CompanyRightsService companyRightsService;
    private final AdministratorService administratorService;

    @GetMapping("/my-companies")
    @Operation(
            summary = "Obtenir mes entreprises",
            description = "Récupère toutes les entreprises auxquelles l'utilisateur a accès"
    )
    public ResponseEntity<List<CompanyAdministratorRepository.CompanyInfo>> getMyCompanies() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator admin = administratorService.get(email);

        List<CompanyAdministratorRepository.CompanyInfo> companies =
                companyRightsService.getAdministratorCompanies(admin.id());
        return ResponseEntity.ok(companies);
    }
}