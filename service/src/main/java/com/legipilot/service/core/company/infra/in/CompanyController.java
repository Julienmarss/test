package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.company.CompanyService;
import com.legipilot.service.core.company.ModifyCompanyUseCase;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.command.ModifyCompanyPicture;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.core.company.domain.model.CompanyId;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final CompanyService service;
    private final ModifyCompanyUseCase modifyCompanyUseCase;
    private final AdministratorService administratorService;
    private final CompanyRightsService companyRightsService;
    private final CompanyAdministratorRepository companyAdminRepository;
    private final CompanyRepository companyRepository;
    private final AdministratorRepository administratorRepository;

    @GetMapping
    public ResponseEntity<CompanyResponse> getCompanyByUserId(@RequestParam("administratorId") UUID administratorId) {
        Company company = service.getFor(administratorId);
        return ResponseEntity.ok(
                CompanyResponse.from(company)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Administrator currentAdmin = administratorService.get(email);

        Company company = service.get(new CompanyId(id), currentAdmin.id());
        return ResponseEntity.ok(
                CompanyResponse.from(company)
        );
    }

    @PostMapping("/{id}/picture")
    public ResponseEntity<CompanyResponse> addPicture(@PathVariable UUID id, @RequestParam("file") MultipartFile picture) {
        // TODO: add checks c'est bien moi
        Company company = modifyCompanyUseCase.execute(
                ModifyCompanyPicture.builder()
                        .id(id)
                        .picture(picture)
                        .build()
        );
        return ResponseEntity.ok(
                CompanyResponse.from(company)
        );
    }

    // TODO : Ajouter la modification de l'entreprise + modifier si cet utilisateur là a bien le droit

    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable UUID companyId,
            @RequestParam UUID administratorId,
            Authentication authentication) {

        String email = authentication.getName();
        Administrator currentAdmin = administratorService.get(email);

        if (!currentAdmin.id().equals(administratorId)) {
            throw new NotAllowed("Vous ne pouvez supprimer que votre propre entreprise");
        }

        if (!companyRightsService.hasRight(administratorId, companyId, CompanyRight.OWNER)) {
            throw new NotAllowed("Seuls le propriétaire peut supprimer l'entreprise");
        }

        try {
            companyRepository.delete(companyId);
            administratorRepository.remove(administratorId);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression: " + e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}