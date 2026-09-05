# Secure-by-default code snippets

Copy-paste starting points, grounded in [research/distilled-security.md](research/distilled-security.md). Adapt names/types to the actual schema; do not paste blind.

## `hooks.server.ts` authorization chokepoint

```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const user = await getUserFromSession(event); // your session/WorkOS lookup
  event.locals.user = user;

  if (event.route.id?.includes('/(protected)/') && !user) {
    throw error(401, 'authentication required');
  }
  if (event.route.id?.includes('/(admin)/') && user?.role !== 'admin') {
    throw error(403, 'admin role required');
  }

  return resolve(event);
};
```
Rationale: `handle` is the only point guaranteed to run on every server request; `+layout.server.ts` `load` is not middleware. [research/distilled-security.md §2]

## Tenant-scoped Drizzle transaction wrapper (RLS-backed)

```ts
// src/lib/server/db/with-tenant.ts
import { db } from './client';
import { sql } from 'drizzle-orm';

// Do NOT export `db` directly from this module - force every tenant-scoped
// query through this wrapper so the RLS GUC is always set.
export async function withTenant<T>(tenantId: string, work: (tx: typeof db) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
    return work(tx);
  });
}
```

```sql
-- migration
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_select ON invoices FOR SELECT
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY tenant_isolation_write ON invoices FOR ALL
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```
Rationale: `set_config(..., true)` scopes the GUC to the transaction so pooled connections never leak tenant context; `current_setting(..., true)` fails closed to zero rows if the GUC was never set. [research/distilled-security.md §3]

## Stripe webhook route

```ts
// src/routes/webhooks/stripe/+server.ts
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text(); // raw bytes BEFORE any JSON parsing
  if (!signature) return new Response('missing signature', { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response('invalid signature', { status: 400 });
  }

  try {
    await db.execute(/* INSERT INTO processed_webhooks (event_id, ...) unique on event_id */);
  } catch (err) {
    if (isUniqueViolation(err)) return new Response(null, { status: 200 }); // already processed
    throw err;
  }

  queueMicrotask(() => processStripeEvent(event)); // ack fast, work async
  return new Response(null, { status: 200 });
};
```
Rationale: raw body reaches the verifier before any parsing; idempotency insert happens before any side effect; 2xx returned fast. [research/distilled-security.md §6]

## GoHighLevel webhook route

```ts
// src/routes/webhooks/gohighlevel/+server.ts
import type { RequestHandler } from './$types';
import crypto from 'node:crypto';

const GHL_PUBLIC_KEY = /* Ed25519 public key from GHL marketplace docs */ '';

function verifyGhl(payload: string, signature: string): boolean {
  try {
    const payloadBuffer = Buffer.from(payload, 'utf8');
    const signatureBuffer = Buffer.from(signature, 'base64');
    return crypto.verify(null, payloadBuffer, GHL_PUBLIC_KEY, signatureBuffer);
  } catch {
    return false;
  }
}

export const POST: RequestHandler = async ({ request }) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-ghl-signature');
  if (!signature || !verifyGhl(rawBody, signature)) {
    return new Response('invalid signature', { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  if (await alreadyProcessed(payload.webhookId)) {
    return new Response(null, { status: 200 }); // duplicate, ack anyway per GHL contract
  }

  queueMicrotask(() => processGhlWebhook(payload).catch(reportFailureInternally));
  return new Response(null, { status: 200 }); // GHL wants 2xx even on internal failure
};
```
Rationale: prefer `X-GHL-Signature` (Ed25519); verify raw bytes; always 2xx to GHL while still tracking/alerting on internal failures. [research/distilled-security.md §8]

## `{@html}` with sanitization

```svelte
<script lang="ts">
  import DOMPurify from 'isomorphic-dompurify';
  export let rawContent: string;
  $: safeContent = DOMPurify.sanitize(rawContent);
</script>

<article>{@html safeContent}</article>
```
Rationale: never render unsanitized content, per Svelte's own docs. [research/distilled-security.md §2]

## Session cookie flags

```ts
cookies.set('__Host-session', sessionValue, {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7,
});
```
Rationale: `__Host-` prefix plus `Secure`/`HttpOnly`/`SameSite=Strict` is the OWASP-recommended baseline for a session cookie. [research/distilled-security.md §2]

## Sentry PII scrub

```ts
Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.user) delete event.user.email;
    if (event.request?.cookies) delete event.request.cookies;
    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'console') return null; // avoid logging PII via console breadcrumbs
    return breadcrumb;
  },
});
```
Rationale: scrub before transmission rather than relying solely on Sentry's server-side pattern-match backstop. [research/distilled-security.md §12]
