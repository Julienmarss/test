package com.legipilot.service.core.administrator.authentication.infra.in;

import com.legipilot.service.core.administrator.authentication.ChangePasswordUseCase;
import com.legipilot.service.core.administrator.authentication.PasswordForgottenUseCase;
import com.legipilot.service.core.administrator.authentication.infra.in.request.ForgottenPasswordRequest;
import com.legipilot.service.core.administrator.authentication.infra.in.request.ChangePasswordRequest;
import com.legipilot.service.core.administrator.authentication.infra.in.response.ReinitialisationMotDePasseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/authentification")
@RequiredArgsConstructor
public class PasswordReinitialisationController {

    private final PasswordForgottenUseCase passwordForgottenUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/forgotten-password")
    public ResponseEntity<ReinitialisationMotDePasseResponse> forgottenPassword(@RequestBody ForgottenPasswordRequest request) {
        passwordForgottenUseCase.execute(request.toDomain());
        return ResponseEntity.ok(ReinitialisationMotDePasseResponse.demandeEnvoyee());
    }

    @PutMapping("/modify-password")
    public ResponseEntity<ReinitialisationMotDePasseResponse> modifyPassword(@RequestBody ChangePasswordRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());
        changePasswordUseCase.execute(request.toDomain(encodedPassword));
        return ResponseEntity.ok(ReinitialisationMotDePasseResponse.motDePasseReinitialise());
    }
}