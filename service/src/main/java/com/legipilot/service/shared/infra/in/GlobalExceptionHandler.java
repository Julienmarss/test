package com.legipilot.service.shared.infra.in;

import com.legipilot.service.shared.domain.error.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@ControllerAdvice(annotations = RestController.class)
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.BAD_REQUEST, "Erreur dans la requête", e, requete);
    }

    @ExceptionHandler(RessourceNotFound.class)
    public ResponseEntity<?> handleRessourceNotFound(RessourceNotFound e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.NOT_FOUND, "Elément introuvable", e, requete);
    }

    @ExceptionHandler(ValidationError.class)
    public ResponseEntity<?> handleValidationError(ValidationError e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.UNPROCESSABLE_ENTITY, "Erreur de validation", e, requete);
    }

    @ExceptionHandler(TechnicalError.class)
    public ResponseEntity<?> handleTechnicalError(TechnicalError e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.INTERNAL_SERVER_ERROR, "Désolé, une erreur technique est survenue", e, requete);
    }

    @ExceptionHandler(NotAllowed.class)
    public ResponseEntity<?> handleNotAllowed(NotAllowed e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.FORBIDDEN, "Non authorisé", e, requete);
    }

    @ExceptionHandler(AbonnementExpire.class)
    public ResponseEntity<?> handleAbonnementExpire(AbonnementExpire e, HttpServletRequest requete) {
        return handleProblem(HttpStatus.PAYMENT_REQUIRED, "Votre abonnement a expiré", e, requete);
    }

    private ResponseEntity<?> handleProblem(HttpStatus status, String titre, Exception e, HttpServletRequest requete) {
        URI requestURI = UriComponentsBuilder
                .fromUriString(requete.getRequestURL().toString())
                .build()
                .toUri();

        HttpErrorBody erreur = HttpErrorBody.create(titre, e.getMessage(), status, requestURI);

        return ResponseEntity
                .status(status)
                .body(erreur);
    }
}
