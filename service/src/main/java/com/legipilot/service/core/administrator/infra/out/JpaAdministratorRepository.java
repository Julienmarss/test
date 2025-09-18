package com.legipilot.service.core.administrator.infra.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaAdministratorRepository extends JpaRepository<AdministratorDto, UUID> {

    Optional<AdministratorDto> findByEmail(String email);

    Optional<AdministratorDto> findByEmailAndEncodedPassword(String encryptedEmail, String encodedPassword);

}
