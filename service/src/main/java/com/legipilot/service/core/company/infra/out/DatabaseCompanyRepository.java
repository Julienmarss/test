package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseCompanyRepository implements CompanyRepository {

    private final JpaCompanyRepository repository;

    @Override
    @Transactional
    public Company save(Company company) {
        return repository.save(CompanyDto.from(company))
                .toDomain();
    }

    @Override
    @Transactional
    public Company getOfAdministrator(UUID administratorId) {
        return repository.findByAdministratorAssociations_AdministratorId(administratorId)
                .stream()
                .map(CompanyDto::toDomain)
                .findFirst()
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé d'entreprise pour cet administrateur."));
    }

    @Override
    @Transactional
    public Company get(UUID id) {
        return repository.findById(id)
                .map(CompanyDto::toDomain)
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé l'entreprise concernée."));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RessourceNotFound("Désolé, nous n'avons pas trouvé l'entreprise concernée.");
        }
        repository.deleteById(id);
    }
}