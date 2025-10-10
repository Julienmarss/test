-- administrators
ALTER TABLE administrators
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- collaborator_dto_driving_licenses
ALTER TABLE collaborator_dto_driving_licenses
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- collaborators
ALTER TABLE collaborators
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- companies
ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- companies_administrators
ALTER TABLE companies_administrators
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- documents
ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);

-- notes
ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS creation_date  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS creation_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS update_date    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS update_email   VARCHAR(255);
