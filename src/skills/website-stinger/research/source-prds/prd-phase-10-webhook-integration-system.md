# Phase 10: Webhook & Outbound Integration System

> **Site Template Guide**: PRD Phase 10 of 12

---

## Phase Overview

### Goals

Event-driven outbound webhooks with HMAC-SHA256 signing, exponential-backoff retry, delivery log, and an admin-accessible delivery history page. In Payload CMS mode, Payload `afterChange` hooks trigger content-driven events (e.g., `post.published`). Business events (e.g., `lead.created`) are triggered from SvelteKit form actions.

### Scope

**In scope:**
- `public.webhook_endpoints` and `public.webhook_deliveries` tables
- `supabase/functions/notify-webhook/`: delivery + HMAC signature
- Payload `afterChange` hook for `post.published` event (Payload mode only)
- `src/routes/admin/webhooks/+page.server.ts`: delivery history UI
- User-Agent header value configurable via `app_settings` (not hardcoded)

**Out of scope:**
- Inbound webhook processing (add separately if needed)
- Retry cron job (mentioned as a future enhancement, manual retry via admin UI is sufficient at launch)

### Dependencies

- Phase 5: `public` schema tables established; RLS in place
- Phase 6: Admin route protection for `/admin/webhooks`
- Phase 7 (Payload mode): Payload `posts` collection with `afterChange` hook support

---

## User Stories

### Story 1: Admin: Register a Webhook Endpoint

> As an **Admin**, I want to register an outbound webhook URL that receives events when leads are captured or posts are published, so that I can trigger downstream automation.

**Acceptance criteria:**
- `/admin/webhooks` page allows creating endpoints with: name, URL, secret (auto-generated), event subscriptions
- Saved endpoint visible in the Supabase `webhook_endpoints` table
- Admin can deactivate an endpoint without deleting it

### Story 2: System: Deliver a Signed Webhook

> As the **System**, I want each webhook delivery to include an HMAC-SHA256 signature so that the receiving endpoint can verify authenticity.

**Acceptance criteria:**
- `X-Webhook-Signature: sha256=<hex>` header present on every delivery
- Signature is `HMAC-SHA256(endpoint.secret, JSON.stringify(payload))`
- `X-Webhook-Event: <event_type>` header also present
- User-Agent configurable via `app_settings.webhooks.user_agent` (default `Site-Webhook/1.0`, no hardcoded brand name)

### Story 3: Admin: View Delivery History

> As an **Admin**, I want to view the last 100 webhook deliveries with their status, event type, and response code so that I can diagnose integration failures.

**Acceptance criteria:**
- `/admin/webhooks` (or `/admin/webhooks/deliveries`) lists deliveries ordered by `created_at` desc
- Each row shows: endpoint name, event type, status (pending/success/failed/retrying), HTTP response code, timestamp
- Admin can retry a failed delivery manually

---

## Data Model

### public.webhook_endpoints

```sql
CREATE TABLE public.webhook_endpoints (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  url        text NOT NULL,
  secret     text NOT NULL,
  events     text[] NOT NULL,  -- e.g. {'lead.created', 'post.published'}
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### public.webhook_deliveries

```sql
CREATE TABLE public.webhook_deliveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id     uuid REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  event_type      text NOT NULL,
  payload         jsonb NOT NULL,
  status          text NOT NULL DEFAULT 'pending',  -- pending|success|failed|retrying
  response_status int,
  response_body   text,
  attempts        int DEFAULT 0,
  next_retry_at   timestamptz,
  created_at      timestamptz DEFAULT now(),
  delivered_at    timestamptz
);
```

---

## Event Types

| Event | Trigger | Payload |
|---|---|---|
| `lead.created` | SvelteKit form action (Phase 8) | Lead data (name, email, source, UTM) |
| `post.published` | Payload `afterChange` hook (Payload mode) | Post title, slug, publishedAt |
| `user.registered` | Supabase Auth `INSERT` trigger | User email, created_at |

Custom event types are configurable by adding to the `events` array on a webhook endpoint.

---

## HMAC Signature

```ts
import { createHmac } from 'node:crypto';

const signature = createHmac('sha256', endpoint.secret)
  .update(JSON.stringify(payload))
  .digest('hex');

// Header value: `sha256=${signature}`
```

Receiving endpoint verification (Node.js example):
```ts
const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
if (received !== expected) throw new Error('Invalid signature');
```

---

## User-Agent Configuration

The `notify-webhook` Edge Function reads the User-Agent from `app_settings`:

```ts
const { data } = await supabase
  .from('app_settings')
  .select('value')
  .eq('category', 'webhooks')
  .eq('key', 'user_agent')
  .single();

const userAgent = (data?.value as string) ?? 'Site-Webhook/1.0';
```

Default seed in `app-settings-seed.sql`:
```sql
INSERT INTO public.app_settings (category, key, value)
VALUES ('webhooks', 'user_agent', '"Site-Webhook/1.0"');
```

No brand name or domain is hardcoded in the Edge Function.

---

## Risks and Open Questions

- **R-1:** The `notify-webhook` function has no retry cron job in this phase. Failed deliveries sit at `status = 'failed'` until manually retried from the admin UI. Add a Supabase cron job (via `pg_cron` extension) for automated retry in a follow-up phase.
- **R-2:** Webhook delivery is fire-and-forget from the SvelteKit form action's perspective. If the Edge Function is slow (Supabase cold start), the user's form submission response is not delayed, but the webhook may be dropped if the Edge Function times out. Consider a Supabase database trigger instead of an HTTP call from the form action.
- **Q-1:** Should webhook secrets be auto-generated (UUID-based) at endpoint creation, or should admins provide their own? Auto-generation is safer (consistent entropy) but means secrets are not memorable. Auto-generate and display once on creation.
