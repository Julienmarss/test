CREATE TABLE IF NOT EXISTS companies_administrators (
                                                        company_id UUID NOT NULL,
                                                        administrator_id UUID NOT NULL,
                                                        rights VARCHAR(50) NOT NULL,
    PRIMARY KEY (company_id, administrator_id),
    CONSTRAINT fk_company
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_administrator
    FOREIGN KEY (administrator_id)
    REFERENCES administrators(id)
    ON DELETE CASCADE
    );

CREATE INDEX idx_companies_administrators_company ON companies_administrators(company_id);
CREATE INDEX idx_companies_administrators_admin ON companies_administrators(administrator_id);