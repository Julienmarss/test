package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.administrator.infra.out.AdministratorDto;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
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
        return repository.getAllByAdministratorsId(administratorId)
                .stream().map(CompanyDto::toDomain)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Désolé, nous n'avons pas trouvé d'entreprise pour cet administrateur."));
    }

    @Override
    @Transactional
    public Company get(UUID id) {
        return repository.findById(id)
                .stream().map(CompanyDto::toDomain)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Désolé, nous n'avons pas trouvé l'entreprise concernée."));
    }

}
