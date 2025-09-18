package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.command.CreateCollaborator;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateCollaboratorUseCase {

    private final CompanyRepository companyRepository;
    private final CollaboratorRepository repository;

    public Collaborator execute(CreateCollaborator command) {
        Company company = companyRepository.get(command.companyId());
        Collaborator collaborator = Collaborator.create(command, company);
        return repository.save(collaborator);
    }

}
