package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.shared.domain.error.NotAllowed;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.UUID;

@Repository
public class InMemoryValidationRepository implements ValidationRepository {

    private final HashMap<UUID, UUID> Tokens = new HashMap<>();

    @Override
    public UUID createToken(Administrator admin) {
        UUID token = UUID.randomUUID();
        Tokens.put(admin.id(), token);
        return token;
    }

    @Override
    public UUID validateToken(Administrator administrator, UUID token) {
        if (Tokens.containsKey(administrator.id())) {
            if (Tokens.get(administrator.id()).equals(token)) {
                return token;
            }
        }
        throw new NotAllowed(", votre token n'est pas correct");
    }

    @Override
    public void deleteTokenOf(UUID token) {
        this.Tokens.remove(token);
    }
}
