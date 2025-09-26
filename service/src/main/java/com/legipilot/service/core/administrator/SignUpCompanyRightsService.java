package com.legipilot.service.core.administrator;

import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignUpCompanyRightsService {

    private final CompanyAdministratorRepository companyAdminRepository;

    @Transactional
    public void assignOwnerRights(Administrator administrator, Company company) {
        log.info("Attribution des droits OWNER à l'administrateur {} pour la société {}",
                administrator.id(), company.id());
        companyAdminRepository.addAdministratorToCompany(
                company.id(),
                administrator.id(),
                CompanyRight.OWNER
        );
        log.info("Droits OWNER attribués avec succès à l'administrateur {} pour la société {}",
                administrator.id(), company.id());
    }
}