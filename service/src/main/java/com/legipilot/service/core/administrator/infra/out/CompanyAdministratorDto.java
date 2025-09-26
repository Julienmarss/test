package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.core.company.infra.out.CompanyDto;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;
import java.util.UUID;

@Entity
@Table(name = "companies_administrators")
@Getter
@Setter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(CompanyAdministratorId.class)
public class CompanyAdministratorDto {

    @Id
    @Column(name = "company_id")
    private UUID companyId;

    @Id
    @Column(name = "administrator_id")
    private UUID administratorId;

    @Column(name = "rights")
    private String rights;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrator_id", insertable = false, updatable = false)
    private AdministratorDto administrator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    private CompanyDto company;

    public CompanyRight getRightsEnum() {
        return CompanyRight.fromDbValue(this.rights);
    }

    public void setRightsEnum(CompanyRight right) {
        this.rights = right.getDbValue();
    }
}