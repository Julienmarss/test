package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.collaborator.domain.error.CollaboratorIdInvalid;

import java.util.Objects;
import java.util.UUID;

public record CollaboratorId(UUID value) {

    public CollaboratorId {
        if(Objects.isNull(value)){
            throw new CollaboratorIdInvalid();
        }
    }

}

