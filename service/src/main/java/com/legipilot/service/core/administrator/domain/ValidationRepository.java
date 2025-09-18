package com.legipilot.service.core.administrator.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;

import java.util.UUID;

public interface ValidationRepository {

    UUID createToken(Administrator admin);

    UUID validateToken(Administrator administrator, UUID token);

    void deleteTokenOf(UUID token);

}
