-- Create companies table
CREATE TABLE companies
(
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 VARCHAR(255) NOT NULL,
    siren                VARCHAR(9)   NOT NULL,
    siret                VARCHAR(14)  NOT NULL,
    legal_form           VARCHAR(255) NOT NULL,
    naf_code             VARCHAR(7)   NOT NULL,
    activity_domain      VARCHAR(255) NOT NULL,
    idcc                 VARCHAR(255) NOT NULL,
    collective_agreement VARCHAR(255) NOT NULL
);

CREATE TABLE administrators
(
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant           VARCHAR(255) NOT NULL,
    sub              VARCHAR(255) UNIQUE,
    email            VARCHAR(255) UNIQUE,
    firstname        VARCHAR(255) NOT NULL,
    lastname         VARCHAR(255) NOT NULL,
    fonction         VARCHAR(50)  NOT NULL,
    phone            VARCHAR(30)  NOT NULL,
    account_state    VARCHAR(30)  NOT NULL,
    encoded_password VARCHAR(255),
    picture          VARCHAR,
    roles            VARCHAR(255)
);

-- Create companies_administrators join table
CREATE TABLE companies_administrators
(
    company_id       UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    administrator_id UUID NOT NULL REFERENCES administrators (id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, administrator_id)
);

-- Create collaborators table
CREATE TABLE collaborators
(
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname              VARCHAR(255) NOT NULL,
    lastname               VARCHAR(255) NOT NULL,
    picture                VARCHAR,
    civility               VARCHAR(20),
    birth_date             DATE,
    birth_place            VARCHAR(255),
    nationality            VARCHAR(255),
    social_security_number VARCHAR(15),
    status                 VARCHAR(30),

    job_title              VARCHAR(100),
    contract_type          VARCHAR(50),
    hire_date              DATE,
    end_date               DATE,
    work_hours_per_week    INTEGER,
    location               VARCHAR(50),

    category               VARCHAR(255),
    classification         VARCHAR(255),
    annual_salary          DECIMAL,
    variable_compensation  DECIMAL,
    total_compensation     DECIMAL,
    benefits_in_kind       DECIMAL,
    trial_period           VARCHAR(255),
    non_compete_clause     BOOLEAN,

    personal_phone         VARCHAR(21),
    personal_email         VARCHAR(50),
    personal_address       VARCHAR(255),
    emergency_civility     VARCHAR(20),
    emergency_lastname     VARCHAR(50),
    emergency_firstname    VARCHAR(50),
    emergency_phone        VARCHAR(21),
    emergency_email        VARCHAR(50),
    professional_email     VARCHAR(50),
    professional_phone     VARCHAR(21),

    marital_status         VARCHAR(50),
    number_of_children     INTEGER,
    education_level        VARCHAR(50),
    driving_licenses       VARCHAR(255),
    rqth                   BOOLEAN,

    company_id             UUID REFERENCES companies (id)
);

-- Table for the @ElementCollection driving licenses
CREATE TABLE collaborator_dto_driving_licenses
(
    collaborator_dto_id UUID        NOT NULL REFERENCES collaborators (id) ON DELETE CASCADE,
    type                VARCHAR(50) NOT NULL,
    issued_date         DATE
);

CREATE TABLE documents
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url             VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    filename        VARCHAR(255) NOT NULL,
    type            VARCHAR(100),
    content_type    VARCHAR(100),
    uploaded_at     DATE,
    collaborator_id UUID         REFERENCES collaborators (id) ON DELETE SET NULL
);

CREATE TABLE notes
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content         TEXT         NOT NULL,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255) NOT NULL,
    date            DATE         NOT NULL,
    collaborator_id UUID REFERENCES collaborators (id) ON DELETE CASCADE,
    author_id       UUID REFERENCES administrators (id) ON DELETE CASCADE
);