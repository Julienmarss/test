CREATE TABLE IF NOT EXISTS triggered_event_actions
(
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    triggered_event_id UUID NOT NULL REFERENCES triggered_events (id) ON DELETE CASCADE,
    action_id          UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_triggered_event_actions_triggered_event_id
    ON triggered_event_actions (triggered_event_id);

CREATE TABLE IF NOT EXISTS triggered_event_action_field_values
(
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    triggered_event_action_id UUID NOT NULL REFERENCES triggered_event_actions (id) ON DELETE CASCADE,
    field_id                  VARCHAR(255) NOT NULL,
    value                     JSONB
);

CREATE INDEX IF NOT EXISTS idx_triggered_event_action_field_values_action_id
    ON triggered_event_action_field_values (triggered_event_action_id);
