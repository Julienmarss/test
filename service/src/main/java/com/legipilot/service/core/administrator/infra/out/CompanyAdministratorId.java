package com.legipilot.service.core.administrator.infra.out;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAdministratorId implements Serializable {
    private UUID companyId;
    private UUID administratorId;
}