package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorPicture;
import com.legipilot.service.core.administrator.domain.error.AdministratorRightsErrors.CannotModifyOtherProfileError;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.ExposedFile;
import com.legipilot.service.core.collaborator.documents.domain.DocumentStoragePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModifyAdministratorUseCase {

    private final AdministratorRepository repository;
    private final DocumentStoragePort documentStoragePort;

    public Administrator execute(ModifyAdministrator command, UUID currentUserId) {
        if (!command.id().equals(currentUserId)) {
            throw new CannotModifyOtherProfileError();
        }

        Administrator administrator = repository.get(command.id());
        administrator.modify(command);
        return repository.save(administrator);
    }

    public Administrator execute(ModifyAdministratorPicture command, UUID currentUserId) {
        if (!command.id().equals(currentUserId)) {
            throw new CannotModifyOtherProfileError();
        }

        Administrator administrator = repository.get(command.id());
        ExposedFile file = documentStoragePort.storeAndExpose(administrator, command.picture());
        administrator.modifyPicture(file);
        return repository.save(administrator);
    }
}