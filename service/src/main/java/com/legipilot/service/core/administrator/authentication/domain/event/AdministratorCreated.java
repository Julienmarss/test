package com.legipilot.service.core.administrator.authentication.domain.event;

import com.legipilot.service.commercial.domain.CommercialEvent;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EqualsAndHashCode(callSuper = false)
@ToString
public class AdministratorCreated extends CommercialEvent {

    public AdministratorCreated(Administrator createdAdministrator) {
        super(
                createdAdministrator.id(),
                "ADMINISTRATOR_CREATED",
                createdAdministrator.id(),
                createdAdministrator
        );
    }

}
