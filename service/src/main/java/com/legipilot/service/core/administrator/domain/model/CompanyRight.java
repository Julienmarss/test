package com.legipilot.service.core.administrator.domain.model;

import lombok.Getter;

@Getter
public enum CompanyRight {
    OWNER("Owner", "Propriétaire", 3),
    MANAGER("Manager", "Responsable", 2),
    READONLY("ReadOnly", "Observateur", 1);

    private final String dbValue;
    private final String displayName;
    private final int level;

    CompanyRight(String dbValue, String displayName, int level) {
        this.dbValue = dbValue;
        this.displayName = displayName;
        this.level = level;
    }

    public boolean hasPermission(CompanyRight requiredRight) {
        return this.level >= requiredRight.level;
    }

    public boolean isOwner() {
        return this == OWNER;
    }

    public boolean isManager() {
        return this == MANAGER;
    }

    public boolean isReadOnly() {
        return this == READONLY;
    }

    public static CompanyRight fromDbValue(String dbValue) {
        return switch (dbValue) {
            case "Owner" -> OWNER;
            case "Manager" -> MANAGER;
            case "ReadOnly" -> READONLY;
            default -> throw new IllegalArgumentException("Unknown right: " + dbValue);
        };
    }
}