package com.legipilot.service.core.administrator.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.infra.out.AuthenticatedAdministratorDetails;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdministratorRepository {

    Optional<AuthenticatedAdministratorDetails> getConnected(String email);

    Optional<Administrator> findByEmail(String email);

    Administrator get(String username, String password);

    Administrator get(String username);

    Administrator get(UUID id);

    Administrator save(Administrator administrator);

    void remove(UUID id);

    List<Administrator> getAll();

}
