package com.legipilot.service.core.administrator.authentication.infra.in;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.authentication.domain.AuthenticatedAdministrator;
import com.legipilot.service.core.administrator.authentication.SignUpUseCase;
import com.legipilot.service.core.administrator.authentication.ValidateAccountUseCase;
import com.legipilot.service.core.administrator.domain.command.ValidateAccount;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.authentication.infra.in.request.LoginOauthRequest;
import com.legipilot.service.core.administrator.authentication.infra.in.request.LoginRequest;
import com.legipilot.service.core.administrator.authentication.infra.in.request.SignUpRequest;
import com.legipilot.service.core.administrator.infra.in.response.AdministratorResponse;
import com.legipilot.service.core.administrator.authentication.infra.in.response.AuthenticatedAdministratorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class AuthenticationController {

    private final PasswordEncoder passwordEncoder;
    private final SignUpUseCase signUpUseCase;
    private final ValidateAccountUseCase validateAccountUseCase;
    private final AdministratorService service;

    @PostMapping("/signin")
    public ResponseEntity<AuthenticatedAdministratorResponse> signin(@Valid @RequestBody LoginRequest request) {
        AuthenticatedAdministrator authenticatedAdministrator = service.getAuthenticated(request.username(), request.password());
        return ResponseEntity.ok(
                AuthenticatedAdministratorResponse.from(authenticatedAdministrator)
        );
    }

    @PostMapping("/oauth-signin")
    public ResponseEntity<AuthenticatedAdministratorResponse> signinWithOauth(@Valid @RequestBody LoginOauthRequest request) {
        AuthenticatedAdministrator authenticatedAdministrator = service.getAuthenticated(request.username());
        return ResponseEntity.ok(
                AuthenticatedAdministratorResponse.from(authenticatedAdministrator)
        );
    }

    // TODO: ADD CHECKS
    @PostMapping("/signup")
    public ResponseEntity<AdministratorResponse> signup(@RequestBody SignUpRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());
        Administrator administrator = signUpUseCase.execute(request.toDomain(encodedPassword));
        return ResponseEntity.ok(
                AdministratorResponse.from(administrator)
        );
    }

    @PostMapping("/validate-account/{id}")
    public ResponseEntity<AuthenticatedAdministratorResponse> validateAccount(@PathVariable UUID id,
                                                                              @RequestParam UUID token) {
        validateAccountUseCase.execute(ValidateAccount.builder()
                .administratorId(id)
                .token(token)
                .build());
        return ResponseEntity.noContent().build();
    }
}
