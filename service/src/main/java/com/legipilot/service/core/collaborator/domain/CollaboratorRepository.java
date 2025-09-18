package com.legipilot.service.core.collaborator.domain;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;

import java.util.List;
import java.util.UUID;

public interface CollaboratorRepository {

    Collaborator get(UUID id);

    void delete(UUID id);

    List<Collaborator> getFromCompany(UUID companyId);

    Collaborator save(Collaborator collaborator);

    List<Collaborator> saveAll(List<Collaborator> collaborators);

}
