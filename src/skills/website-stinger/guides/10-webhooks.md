# 10: Webhook & Outbound Integration System

Source PRD: `research/source-prds/prd-phase-10-webhook-integration-system.md`

---

## Goal

Event-driven outbound webhooks with HMAC signing, exponential-backoff retry, delivery log, and admin-accessible delivery history. In Payload mode, Payload `afterChange` hooks trigger content-driven webhook events. Business events (lead captured, user registered) are triggered from SvelteKit `+page.server.ts` actions.

---

## Database tables (in public schema)

```sql
CREATE TABLE public.webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  secret text NOT NULL,           -- HMAC signing secret
  events text[] NOT NULL,         -- e.g. {'lead.created', 'post.published'}
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id uuid REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',  -- pending | success | failed | retrying
  response_status int,
  response_body text,
  attempts int DEFAULT 0,
  next_retry_at timestamptz,
  created_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);
```

RLS: only admin role can read webhook tables. No anon access.

---

## Webhook notification Edge Function

```ts
// supabase/functions/notify-webhook/index.ts
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'node:crypto';

serve(async (req) => {
  const { event_type, payload } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Get all active endpoints subscribed to this event
  const { data: endpoints } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .eq('is_active', true)
    .contains('events', [event_type]);

  for (const endpoint of endpoints ?? []) {
    const signature = createHmac('sha256', endpoint.secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    // Create delivery record
    const { data: delivery } = await supabase.from('webhook_deliveries').insert({
      endpoint_id: endpoint.id,
      event_type,
      payload,
      status: 'pending',
    }).select().single();

    // Attempt delivery
    try {
      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': `sha256=${signature}`,
          'X-Webhook-Event': event_type,
          'User-Agent': `Site-Webhook/1.0`,  // Configurable via app_settings
        },
        body: JSON.stringify({ event: event_type, data: payload, delivery_id: delivery?.id }),
        signal: AbortSignal.timeout(15000),
      });

      await supabase.from('webhook_deliveries').update({
        status: res.ok ? 'success' : 'failed',
        response_status: res.status,
        attempts: 1,
        delivered_at: res.ok ? new Date().toISOString() : null,
      }).eq('id', delivery?.id);
    } catch (err) {
      // Schedule retry via exponential backoff
      await supabase.from('webhook_deliveries').update({
        status: 'retrying',
        attempts: 1,
        next_retry_at: new Date(Date.now() + 60_000).toISOString(), // 1min first retry
      }).eq('id', delivery?.id);
    }
  }

  return new Response(null, { status: 204 });
});
```

---

## Triggering webhooks from SvelteKit

In a `+page.server.ts` action, after successful lead insert:

```ts
// After leads insert in actions.submit:
await fetch(`${SUPABASE_URL}/functions/v1/notify-webhook`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event_type: 'lead.created',
    payload: { ...form.data, created_at: new Date().toISOString() },
  }),
});
```

---

## Payload afterChange hooks (content-driven events)

In Payload mode, published posts trigger a webhook:

```ts
// In apps/cms/src/collections/Posts.ts
hooks: {
  afterChange: [
    async ({ doc, previousDoc, operation }) => {
      const justPublished =
        operation === 'update' &&
        doc.status === 'published' &&
        previousDoc?.status !== 'published';

      if (justPublished) {
        await fetch(`${process.env.SUPABASE_URL}/functions/v1/notify-webhook`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'post.published',
            payload: { id: doc.id, title: doc.title, slug: doc.slug, publishedAt: doc.publishedAt },
          }),
        });
      }
    },
  ],
},
```

---

## Webhook admin UI (SvelteKit)

A simple admin page in `apps/web` (gated by admin role) shows delivery history:

```ts
// apps/web/src/routes/admin/webhooks/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: deliveries } = await locals.supabase
    .from('webhook_deliveries')
    .select('*, webhook_endpoints(name, url)')
    .order('created_at', { ascending: false })
    .limit(100);

  return { deliveries: deliveries ?? [] };
};
```

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 10.1 | `webhook_endpoints` and `webhook_deliveries` tables in Supabase |
| 10.2 | `notify-webhook` Edge Function deployed |
| 10.3 | Endpoint delivery includes `X-Webhook-Signature` header |
| 10.4 | Signature verified on receiving end (test with webhook.site) |
| 10.5 | Lead created → delivery record created in `webhook_deliveries` |
| 10.6 (Payload mode) | Post published in Payload → `post.published` delivery record created |
| 10.7 | Admin delivery history page lists last 100 deliveries |
| 10.8 | User-Agent header is configurable via `app_settings` (not hardcoded domain name) |
