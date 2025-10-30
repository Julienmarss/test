CREATE TABLE IF NOT EXISTS triggered_events
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators (id) ON DELETE CASCADE,
    event_id        UUID NOT NULL
);