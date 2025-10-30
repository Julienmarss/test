package com.legipilot.service.core.collaborator.infra.out;

import com.legipilot.service.core.collaborator.domain.CollaboratorRepository;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.company.infra.out.CollaboratorDto;
import com.legipilot.service.shared.domain.error.RessourceNotFound;
import com.legipilot.service.shared.domain.error.TechnicalError;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseCollaboratorRepository implements CollaboratorRepository {

    private final JpaCollaboratorRepository repository;

    @Override
    @Transactional
    public Collaborator get(CollaboratorId id) {
        return repository.findById(id.value())
                .map(CollaboratorDto::toDomain)
                .orElseThrow(() -> new RessourceNotFound("Désolé, nous n'avons pas trouvé le collaborateur."));
    }

    @Override
    @Transactional
    public List<Collaborator> getFromCompany(UUID companyId) {
        return repository.findAllByCompanyId(companyId)
                .stream()
                .map(CollaboratorDto::toDomainWithoutCompany)
                .toList();
    }

    @Override
    public void delete(CollaboratorId id) {
        try {
            repository.deleteById(id.value());
        } catch (RessourceNotFound e) {
            throw new RessourceNotFound("Désolé, nous n'avons pas trouvé ce collaborateur.");
        }
    }

    @Override
    @Transactional
    public Collaborator save(Collaborator collaborator) {
        try {
            return repository.save(CollaboratorDto.from(collaborator))
                    .toDomainWithoutCompany();
        } catch (Exception ignored) {
            throw new TechnicalError("Désolé, nous n'avons pas réussi à sauvegarder votre collaborateur.");
        }
    }

    @Override
    @Transactional
    public List<Collaborator> saveAll(List<Collaborator> collaborators) {
        try {
            return repository.saveAll(collaborators.stream().map(CollaboratorDto::from).toList())
                    .stream()
                    .map(CollaboratorDto::toDomainWithoutCompany)
                    .toList();
        } catch (Exception ignored) {
            throw new TechnicalError("Désolé, nous n'avons pas réussi à sauvegarder les collaborateurs.");
        }
    }

}
