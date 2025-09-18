package com.legipilot.service.core.administrator.authentication.domain;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Tokens;

public record AuthenticatedAdministrator(Administrator administrator, Tokens tokens) {

    public static AuthenticatedAdministrator from(Administrator administrator, Tokens tokens) {
        return new AuthenticatedAdministrator(administrator, tokens);
    }

}
