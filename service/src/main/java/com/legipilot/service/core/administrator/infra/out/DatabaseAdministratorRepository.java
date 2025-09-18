package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.error.AdministratorNotFound;
import com.legipilot.service.core.administrator.domain.error.IncorrectPassword;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseAdministratorRepository implements AdministratorRepository {

    private final PasswordEncoder passwordEncoder;
    private final JpaAdministratorRepository repository;

    @Override
    public Optional<AuthenticatedAdministratorDetails> getConnected(String email) {
        return repository.findByEmail(email)
                .map(AdministratorDto::toAuthenticatedAdministrator);
    }

    @Override
    @Transactional
    public Administrator get(String username, String password) {
        return repository.findByEmail(username)
                .map(administratorDto -> {
                    String expectedPassword = administratorDto.encodedPassword();
                    if (passwordEncoder.matches(password, expectedPassword)) {
                        return administratorDto.toDomain();
                    }
                    throw new IncorrectPassword();
                })
                .orElseThrow(() -> new AdministratorNotFound(username));
    }

    @Override
    @Transactional
    public Administrator get(String username) {
        return repository.findByEmail(username)
                .map(AdministratorDto::toDomain)
                .orElseThrow(() -> new AdministratorNotFound(username));
    }

    @Override
    @Transactional
    public Administrator get(UUID id) {
        return repository.findById(id)
                .map(AdministratorDto::toDomain)
                .orElseThrow(() -> new AdministratorNotFound(id.toString()));
    }

    @Override
    @Transactional
    public Administrator save(Administrator administrator) {
        return repository.save(AdministratorDto.from(administrator))
                .toDomain();
    }

    @Override
    public void remove(UUID id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public List<Administrator> getAll() {
        return repository.findAll()
                .stream()
                .map(AdministratorDto::toDomain)
                .toList();
    }

}
