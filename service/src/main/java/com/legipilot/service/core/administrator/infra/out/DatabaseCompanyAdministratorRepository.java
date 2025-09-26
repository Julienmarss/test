package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.CompanyAdministratorRepository;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.company.infra.out.JpaCompanyRepository;
import com.legipilot.service.shared.domain.error.NotAllowed;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseCompanyAdministratorRepository implements CompanyAdministratorRepository {

    private final JpaCompanyAdministratorRepository jpaRepository;
    private final JpaAdministratorRepository administratorRepository;
    private final JpaCompanyRepository companyRepository;

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
    public void addAdministratorToCompany(UUID companyId, UUID administratorId, CompanyRight rights) {
        CompanyAdministratorDto dto = CompanyAdministratorDto.builder()
                .companyId(companyId)
                .administratorId(administratorId)
                .rights(rights.getDbValue())
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
    @Transactional
    public long countOwnersByCompany(UUID companyId) {
        return jpaRepository.countByCompanyIdAndRights(companyId, "Owner");
    }

    @Override
    @Transactional
    public List<CompanyAdministratorInfo> findAdministratorsByCompany(UUID companyId) {
        List<CompanyAdministratorDto> associations = jpaRepository.findByCompanyId(companyId);

        return associations.stream()
                .map(dto -> {
                    AdministratorDto admin = administratorRepository.findById(dto.administratorId())
                            .orElseThrow(() -> new RuntimeException("Admin not found"));

                    return CompanyAdministratorInfo.builder()
                            .administratorId(dto.administratorId())
                            .rights(dto.getRightsEnum())
                            .firstname(admin.firstname())
                            .lastname(admin.lastname())
                            .email(admin.email())
                            .build();
                })
                .sorted(Comparator
                        .comparing((CompanyAdministratorInfo info) -> info.getRights().getLevel())
                        .reversed()
                        .thenComparing(CompanyAdministratorInfo::getFirstname)
                        .thenComparing(CompanyAdministratorInfo::getLastname))
                .toList();
    }

    @Override
    @Transactional
    public List<CompanyInfo> findCompaniesByAdministrator(UUID administratorId) {
        List<CompanyAdministratorDto> associations = jpaRepository.findByAdministratorId(administratorId);

        return associations.stream()
                .map(dto -> {
                    var company = companyRepository.findById(dto.companyId())
                            .orElseThrow(() -> new RuntimeException("Company not found"));

                    return CompanyInfo.builder()
                            .companyId(dto.companyId())
                            .rights(dto.getRightsEnum())
                            .companyName(company.name())
                            .build();
                })
                .sorted(Comparator
                        .comparing((CompanyInfo info) -> info.getRights().getLevel())
                        .reversed()
                        .thenComparing(CompanyInfo::getCompanyName))
                .toList();
    }
}