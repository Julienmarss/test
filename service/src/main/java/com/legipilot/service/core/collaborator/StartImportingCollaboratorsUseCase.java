package com.legipilot.service.core.collaborator;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.collaborator.domain.command.ImportCollaborators;
import com.legipilot.service.core.collaborator.domain.event.ImportCollaboratorsStarted;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.DocumentReaderPort;
import com.legipilot.service.shared.domain.EventBus;
import com.legipilot.service.shared.domain.model.DocumentText;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StartImportingCollaboratorsUseCase {

    private final AdministratorRepository adminRepository;
    private final DocumentReaderPort documentReaderPort;
    private final CompanyRepository companyRepository;
    private final EventBus eventBus;

    public void execute(ImportCollaborators command) {
        Administrator administrator = adminRepository.get(command.adminEmail());
        Company company = companyRepository.get(command.companyId());
        DocumentText document = documentReaderPort.read(command.file());
        eventBus.publish(new ImportCollaboratorsStarted(administrator, document, company));
    }

}
