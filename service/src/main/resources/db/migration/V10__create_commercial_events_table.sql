CREATE TABLE IF NOT EXISTS commercial_events
(
    id           UUID PRIMARY KEY         NOT NULL,
    aggregate_id UUID                     NOT NULL,
    action       VARCHAR(255)             NOT NULL,
    actor_id     UUID                     NOT NULL,
    content      jsonb,
    occurred_at  TIMESTAMP WITH TIME ZONE NOT NULL
);

-- administrators
ALTER TABLE administrators
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- collaborator_dto_driving_licenses
ALTER TABLE collaborator_dto_driving_licenses
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- collaborators
ALTER TABLE collaborators
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- companies
ALTER TABLE companies
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- companies_administrators
ALTER TABLE companies_administrators
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- documents
ALTER TABLE documents
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;

-- notes
ALTER TABLE notes
    DROP COLUMN IF EXISTS creation_date,
    DROP COLUMN IF EXISTS creation_email,
    DROP COLUMN IF EXISTS update_date,
    DROP COLUMN IF EXISTS update_email;
