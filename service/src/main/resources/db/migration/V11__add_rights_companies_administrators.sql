ALTER TABLE companies_administrators
    ADD COLUMN IF NOT EXISTS rights VARCHAR(50) NOT NULL DEFAULT 'Owner';
