package com.legipilot.service.core.authorization.infra.out;

import com.legipilot.service.core.administrator.infra.out.AdministratorDto;
import com.legipilot.service.core.authorization.domain.CompanyAdministratorInfo;
import com.legipilot.service.core.authorization.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.authorization.domain.CompanyInfo;
import com.legipilot.service.core.authorization.domain.model.CompanyRight;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseCompanyAdministratorRepository implements CompanyAdministratorRepository {

    private final JpaCompanyAdministratorRepository jpaRepository;

    @Override
    @Transactional
    public Optional<CompanyRight> findRightByAdministratorAndCompany(UUID administratorId, UUID companyId) {
        return jpaRepository.findByAdministratorIdAndCompanyId(administratorId, companyId)
                .map(CompanyAdministratorDto::getRightsEnum);
    }

    @Override
    @Transactional
    public void updateRights(UUID companyId, UUID administratorId, CompanyRight rights) {
        CompanyAdministratorDto dto = jpaRepository.findByAdministratorIdAndCompanyId(administratorId, companyId)
                .orElseThrow(() -> new NotAllowed("Administrateur non trouvé dans cette entreprise"));

        dto.setRightsEnum(rights);
        jpaRepository.save(dto);
    }

    @Override
    @Transactional
    public void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight right) {
        CompanyAdministratorDto dto = CompanyAdministratorDto.builder()
                .companyId(companyId)
                .administratorId(administratorId)
                .rights(right.getDbValue())
                .build();

        jpaRepository.save(dto);
    }

    @Override
    @Transactional
    public void removeAdministratorFromCompany(UUID companyId, UUID administratorId) {
        CompanyAdministratorId id = new CompanyAdministratorId(companyId, administratorId);

        if (!jpaRepository.existsById(id)) {
            throw new NotAllowed("Administrateur non trouvé dans cette entreprise");
        }

        jpaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyAdministratorInfo> findAdministratorsByCompany(UUID companyId) {
        List<CompanyAdministratorDto> associations = jpaRepository.findByCompanyIdWithAdministrator(companyId);

        return associations.stream()
                .map(dto -> {
                    AdministratorDto admin = dto.administrator();

                    return CompanyAdministratorInfo.builder()
                            .administratorId(dto.administratorId())
                            .rights(dto.getRightsEnum())
                            .firstname(admin.firstname())
                            .lastname(admin.lastname())
                            .email(admin.email())
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyInfo> findCompaniesByAdministrator(UUID administratorId) {
        List<CompanyAdministratorDto> associations = jpaRepository.findByAdministratorIdWithCompany(administratorId);

        return associations.stream()
                .map(dto -> {
                    var company = dto.company();

                    return CompanyInfo.builder()
                            .companyId(dto.companyId())
                            .rights(dto.getRightsEnum())
                            .companyName(company.name())
                            .picture(company.picture())
                            .build();
                })
                .toList();
    }
}