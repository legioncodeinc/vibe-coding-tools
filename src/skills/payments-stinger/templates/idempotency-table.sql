-- payments-stinger, processed_webhook_events table
--
-- Purpose: idempotency for inbound Stripe webhooks. Insert event.id before
-- processing inside a transaction; ON CONFLICT means the event was already
-- handled, return early.
--
-- See guides/06-webhooks-and-provisioning.md and guides/09-security-and-pci-scope.md.
--
-- Hand to db-worker-bee for the actual migration, indexing strategy, and
-- multi-tenant considerations (e.g., per-tenant partitioning if needed).

-- Postgres dialect; adapt for MySQL/SQL Server as needed.

CREATE TABLE IF NOT EXISTS processed_webhook_events (
    -- Stripe event ID, e.g. evt_1Abc123XYZ.
    -- Primary key + unique constraint enforces dedup atomically.
    event_id     text PRIMARY KEY,

    -- Stripe event type, e.g. 'checkout.session.completed'.
    -- Stored so ops queries can group by type without re-parsing payloads.
    event_type   text NOT NULL,

    -- When we received the event (server clock).
    received_at  timestamptz NOT NULL DEFAULT now(),

    -- Set after successful processing. NULL means the handler crashed mid-flight.
    -- An ops query SELECT * WHERE processed_at IS NULL AND received_at < now() - interval '5 minutes'
    -- finds stuck events to investigate.
    processed_at timestamptz,

    -- Optional: capture the raw event payload for forensic replay.
    -- Note: payloads may contain PII (customer email, address). Decide retention
    -- and access controls with security-worker-bee before enabling.
    -- payload   jsonb,

    -- Optional: per-tenant scoping. Required if your account has multiple tenants
    -- sharing one Stripe account (rare; usually each tenant has its own Stripe account).
    -- tenant_id uuid

    CONSTRAINT processed_webhook_events_event_id_format
        CHECK (event_id ~ '^evt_[a-zA-Z0-9]+$')
);

-- Operational index: list recent events by time.
CREATE INDEX IF NOT EXISTS idx_pwe_received_at
    ON processed_webhook_events (received_at DESC);

-- Operational index: find stuck events (processed_at IS NULL).
CREATE INDEX IF NOT EXISTS idx_pwe_unprocessed
    ON processed_webhook_events (received_at)
    WHERE processed_at IS NULL;

-- Retention: Stripe retries for up to 3 days. Keep at least 30 days for audit.
-- Older rows can be archived to cold storage; do NOT delete the table itself.
-- Suggested cron job (run daily):
--
--   DELETE FROM processed_webhook_events
--   WHERE received_at < now() - interval '30 days'
--     AND processed_at IS NOT NULL;
--
-- Or, preferred, copy older rows to an archive table before deletion.

-- ----- Optional: per-consumer dedup for fan-out (see guides/06-webhooks-and-provisioning.md, "Async work after the 200") -----
--
-- When one event triggers multiple downstream consumers, each consumer needs
-- its own dedup row to avoid double side effects.

CREATE TABLE IF NOT EXISTS processed_webhook_events_per_consumer (
    event_id      text NOT NULL,
    consumer_name text NOT NULL,
    processed_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, consumer_name)
);

-- This composite-key table is what each consumer (email job, ERP sync, CRM sync)
-- writes to before performing its side effect. The webhook handler's main
-- dedup table records "this event reached the system once"; this per-consumer
-- table records "this consumer handled this event once".
