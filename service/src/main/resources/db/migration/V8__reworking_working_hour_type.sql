-- 1. Ajout de la colonne temporaire avec le nouveau type VARCHAR(30)
ALTER TABLE collaborators
    ADD COLUMN work_hours_type_tmp VARCHAR(30);

-- 2. Remplacement des anciennes valeurs par les nouvelles conventions
UPDATE collaborators
SET work_hours_type_tmp =
        CASE work_hours_type
            WHEN 'H' THEN 'HEURES'
            WHEN 'FH' THEN 'FORFAIT_HEURES'
            WHEN 'FJ' THEN 'FORFAIT_JOURS'
            ELSE NULL
            END;

-- 3. Suppression de l'ancienne colonne
ALTER TABLE collaborators
DROP COLUMN work_hours_type;

-- 4. Renommage de la nouvelle colonne pour garder le nom d'origine
ALTER TABLE collaborators
    RENAME COLUMN work_hours_type_tmp TO work_hours_type;
