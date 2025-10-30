package com.legipilot.service.core.collaborator.domain;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;

import java.util.List;
import java.util.UUID;

public interface CollaboratorRepository {

    Collaborator get(CollaboratorId id);

    void delete(CollaboratorId id);

    List<Collaborator> getFromCompany(UUID companyId);

    Collaborator save(Collaborator collaborator);

    List<Collaborator> saveAll(List<Collaborator> collaborators);

}
