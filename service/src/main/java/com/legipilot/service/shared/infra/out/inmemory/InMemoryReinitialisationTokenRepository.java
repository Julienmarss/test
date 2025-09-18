package com.legipilot.service.shared.infra.out.inmemory;

import com.legipilot.service.shared.domain.ReinitialisationTokenRepository;
import com.legipilot.service.shared.domain.error.ModificationTokenMotDePasseInvalid;
import com.legipilot.service.shared.domain.model.ReinitialisationToken;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryReinitialisationTokenRepository implements ReinitialisationTokenRepository {

    private static final Duration TOKEN_VALIDITY_DURATION = Duration.ofMinutes(30);

    private final Map<ReinitialisationToken, TokenInfo> tokens = new ConcurrentHashMap<>();

    @Override
    public ReinitialisationToken generateToken(String email) {
        ReinitialisationToken token = ReinitialisationToken.generate();
        tokens.put(token, new TokenInfo(email, Instant.now().plus(TOKEN_VALIDITY_DURATION)));
        return token;
    }

    @Override
    public void validateToken(ReinitialisationToken token, String email) {
        if (token == null) {
            throw new ModificationTokenMotDePasseInvalid();
        }
        TokenInfo tokenInfo = tokens.get(token);
        if (tokenInfo == null || tokenInfo.estExpire() || !tokenInfo.email.equals(email)) {
            throw new ModificationTokenMotDePasseInvalid();
        }
    }

    @Override
    public void deleteToken(String email) {
        if (email != null) {
            tokens.entrySet().removeIf(entry -> entry.getValue().email.equals(email));
        }
    }

    private record TokenInfo(String email, Instant expiration) {
        boolean estExpire() {
            return Instant.now().isAfter(expiration);
        }
    }
}