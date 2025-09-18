package com.legipilot.service.core.company;

import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository repository;

    public Company getFor(UUID administratorId) {
        return repository.getOfAdministrator(administratorId);
    }

}
