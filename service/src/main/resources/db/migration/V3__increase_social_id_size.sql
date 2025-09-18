ALTER TABLE collaborators
    ALTER COLUMN social_security_number TYPE VARCHAR(30);

ALTER TABLE collaborators
    ADD COLUMN responsible VARCHAR(100);