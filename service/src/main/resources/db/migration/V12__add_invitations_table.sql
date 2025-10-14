CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    rights VARCHAR(50) NOT NULL,
    company_id UUID NOT NULL,
    administrator_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,

    CONSTRAINT fk_invitations_company
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_invitations_administrator
    FOREIGN KEY (administrator_id)
    REFERENCES administrators(id)
    ON DELETE CASCADE,
