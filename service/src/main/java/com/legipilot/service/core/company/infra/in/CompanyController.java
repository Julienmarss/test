package com.legipilot.service.core.company.infra.in;

import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorResponse;
import com.legipilot.service.core.company.CompanyService;
import com.legipilot.service.core.company.ModifyCompanyUseCase;
import com.legipilot.service.core.company.domain.command.ModifyCompanyPicture;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService service;
    private final ModifyCompanyUseCase modifyCompanyUseCase;

    @GetMapping
    public ResponseEntity<CompanyResponse> getCompanyByUserId(@RequestParam("administratorId") UUID administratorId) {
        Company company = service.getFor(administratorId);
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
}
