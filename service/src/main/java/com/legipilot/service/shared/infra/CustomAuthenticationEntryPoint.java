package com.legipilot.service.shared.infra;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest requete, HttpServletResponse response,
                         org.springframework.security.core.AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");

        Map<String, String> reponse = Map.of(
                "filename", "Erreur lors de la connexion",
                "message", "Les informations (email et mot de passe) fournies pour la connexion sont incorrectes."
        );

        response.getWriter().write(objectMapper.writeValueAsString(reponse));
    }
}
