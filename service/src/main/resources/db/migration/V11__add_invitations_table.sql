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

    CONSTRAINT chk_invitations_status
    CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED')),

    CONSTRAINT chk_invitations_rights
    CHECK (rights IN ('Owner', 'Manager', 'ReadOnly')),

    CONSTRAINT chk_invitations_expires_at
    CHECK (expires_at > created_at)
    );

CREATE INDEX IF NOT EXISTS idx_invitations_token
    ON invitations(token);

CREATE INDEX IF NOT EXISTS idx_invitations_email
    ON invitations(email);

CREATE INDEX IF NOT EXISTS idx_invitations_company_id
    ON invitations(company_id);

CREATE INDEX IF NOT EXISTS idx_invitations_status
    ON invitations(status);

CREATE INDEX IF NOT EXISTS idx_invitations_email_company
    ON invitations(email, company_id);

CREATE INDEX IF NOT EXISTS idx_invitations_company_status
    ON invitations(company_id, status);

CREATE INDEX IF NOT EXISTS idx_invitations_administrator_id
    ON invitations(administrator_id);

CREATE INDEX IF NOT EXISTS idx_invitations_expires_at
    ON invitations(expires_at);