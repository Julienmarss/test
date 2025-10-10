ALTER TABLE collaborators
    ADD COLUMN IF NOT EXISTS stay_type VARCHAR(255),
    ADD COLUMN IF NOT EXISTS stay_number VARCHAR(255),
    ADD COLUMN IF NOT EXISTS stay_validity_date DATE;
