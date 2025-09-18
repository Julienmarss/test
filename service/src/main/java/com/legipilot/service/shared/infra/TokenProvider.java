package com.legipilot.service.shared.infra;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Role;
import com.legipilot.service.core.administrator.domain.model.Tokens;
import com.legipilot.service.core.administrator.infra.out.AuthenticatedAdministratorDetails;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenProvider {

    private final SecretKey accessTokenKey;

    @Value("${app.access_token.expiration}")
    private Long accessTokenExpiration;

    public Instant getExpiration() {
        return ZonedDateTime.now()
                .plusHours(accessTokenExpiration)
                .toInstant();
    }

    public String generateAccessToken(Authentication authentication) {
        AuthenticatedAdministratorDetails user = (AuthenticatedAdministratorDetails) authentication.getPrincipal();

        List<String> roles = user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .header().add("typ", TOKEN_TYPE)
                .and()
                .signWith(accessTokenKey, Jwts.SIG.HS256)
                .expiration(Date.from(ZonedDateTime.now().plusHours(accessTokenExpiration).toInstant()))
                .issuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .id(UUID.randomUUID().toString())
                .issuer(TOKEN_ISSUER)
                .audience().add(TOKEN_AUDIENCE)
                .and()
                .subject(user.getUsername())
                .claim("rol", roles)
                .claim("name", user.getName())
                .claim("preferred_username", user.getUsername())
                .claim("email", user.getEmail())
                .compact();
    }

    private String generateAccessToken(Administrator administrator) {
        List<String> roles = administrator.roles().stream().map(Role::name).toList();

        return Jwts.builder()
                .header().add("typ", TOKEN_TYPE)
                .and()
                .signWith(accessTokenKey, Jwts.SIG.HS256)
                .expiration(Date.from(ZonedDateTime.now().plusHours(accessTokenExpiration).toInstant()))
                .issuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .id(UUID.randomUUID().toString())
                .issuer(TOKEN_ISSUER)
                .audience().add(TOKEN_AUDIENCE)
                .and()
                .subject(administrator.email())
                .claim("rol", roles)
                .claim("name", administrator.firstname() + ' ' + administrator.lastname())
                .claim("preferred_username", administrator.email())
                .claim("email", administrator.email())
                .compact();
    }

    public static final String TOKEN_TYPE = "JWT";
    public static final String TOKEN_ISSUER = "legipilot-api";
    public static final String TOKEN_AUDIENCE = "legipilot-web-app";

    public Tokens getTokens(Authentication authentication) {
        return Tokens.aPartirDe(
                generateAccessToken(authentication),
                getExpiration()
        );
    }

    public Tokens getTokens(Administrator administrator) {
        return Tokens.aPartirDe(
                generateAccessToken(administrator),
                getExpiration()
        );
    }
}