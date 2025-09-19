package com.legipilot.service.administration.infra.in;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.company.domain.error.InvalidNafCode;
import com.legipilot.service.core.company.domain.error.InvalidSiren;
import com.legipilot.service.core.company.domain.error.InvalidSiret;
import com.legipilot.service.core.company.domain.model.NafCode;
import com.legipilot.service.core.company.domain.model.Siren;
import com.legipilot.service.core.company.domain.model.Siret;
import com.legipilot.service.shared.domain.error.ValidationError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public")
public class ValidationController {

    private final AdministratorRepository administratorRepository;

    public ValidationController(AdministratorRepository administratorRepository) {
        this.administratorRepository = administratorRepository;
    }

    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@RequestBody EmailValidationRequest request) {
        // Vérifier si l'email existe déjà
        var existingAdmin = administratorRepository.findByEmail(request.email());
        if (existingAdmin.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cette adresse email est déjà utilisée."));
        }

        // Vérification basique du format email
        if (!isValidEmailFormat(request.email())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Format d'email invalide."));
        }

        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/validate-company")
    public ResponseEntity<?> validateCompanyInfo(@RequestBody CompanyValidationRequest request) {
        Map<String, String> validationErrors = new HashMap<>();

        try {
            // Validation SIREN
            new Siren(request.siren());
        } catch (InvalidSiren e) {
            validationErrors.put("siren", "Numéro SIREN invalide. Il doit contenir exactement 9 chiffres.");
        }

        try {
            // Validation SIRET
            new Siret(request.siret());
        } catch (InvalidSiret e) {
            validationErrors.put("siret", "Numéro SIRET invalide. Il doit contenir exactement 14 chiffres.");
        }

        try {
            // Validation Code NAF
            new NafCode(request.nafCode());
        } catch (InvalidNafCode e) {
            validationErrors.put("nafCode", "Code NAF invalide. Format attendu : XXXX ou XXXX.X");
        }

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("validationErrors", validationErrors));
        }

        return ResponseEntity.ok(Map.of("valid", true));
    }

    private boolean isValidEmailFormat(String email) {
        return email != null &&
                email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public record EmailValidationRequest(String email) {}

    public record CompanyValidationRequest(String siren, String siret, String nafCode) {}
}