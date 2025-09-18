package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollaboratorService {

    private final CollaboratorRepository repository;

    public Collaborator get(UUID id) {
        return repository.get(id);
    }

    public List<Collaborator> getFromCompany(UUID companyId) {
        return repository.getFromCompany(companyId);
    }
}
