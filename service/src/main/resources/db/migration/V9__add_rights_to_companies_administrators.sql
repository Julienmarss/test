ALTER TABLE companies_administrators
    ADD COLUMN rights VARCHAR(50) NOT NULL DEFAULT 'ReadOnly';

ALTER TABLE companies_administrators
    ADD CONSTRAINT check_rights
        CHECK (rights IN ('Owner', 'Manager', 'ReadOnly'));

UPDATE companies_administrators
SET rights = 'Owner'
WHERE (company_id, administrator_id) IN (
    SELECT DISTINCT ON (company_id) company_id, administrator_id
FROM companies_administrators
ORDER BY company_id
    );

CREATE INDEX idx_companies_administrators_rights
    ON companies_administrators(administrator_id, rights);