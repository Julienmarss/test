package com.legipilot.service.core.company.domain.error;


import com.legipilot.service.shared.domain.error.NotAllowed;

public class InvalidRightsError extends NotAllowed {

    public InvalidRightsError(String message) {
        super(message);
    }

    public static InvalidRightsError notEnoughRights() {
        return new InvalidRightsError("Vous ne pouvez pas accéder à cette entreprise");
    }

}
