package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.command.DeleteAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministrator;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteAdministratorUseCase {

    private final AdministratorRepository repository;

    public void execute(DeleteAdministrator command) {
        repository.remove(command.id());
    }
}
