# 06, Webhooks and provisioning

The webhook handler is the only writer of payment and subscription state. Nothing client-side, not a redirect, not a `succeeded` status in the browser, not a return-page URL param, ever grants access.

Source: [raw/stripe--webhooks--receive-and-verify.md], [raw/stripe--webhooks--signature-errors-raw-body.md], [raw/stripe--sveltekit--raw-body-webhook-community.md], [raw/stripe--sveltekit--stripe-integration-tutorial.md], [raw/stripe--production-failures--webhook-race-conditions.md], [raw/stripe--customer-portal--vs-custom-billing-ui.md].

## The contract, in order

1. Read the **raw body**, `await request.text()`, never `request.json()` first. A `Request` body stream can only be consumed once; calling `.json()` then `.text()` throws `TypeError: Body is unusable`, and any re-serialization of a parsed body changes the bytes enough to break the HMAC even though "the data is the same" [raw/stripe--sveltekit--raw-body-webhook-community.md].
2. Verify with `stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`. This also enforces the SDK's default replay-tolerance window.
3. Dedup on `event.id` **before** doing any work.
4. Process, persisting the canonical state change.
5. Mark the event processed **only after** side effects succeed, not before.
6. Return 2xx fast; heavy async work (email, CRM sync) goes to a queue, not inline.

Full handler: `references/webhook-handler-sveltekit.ts`.

## SvelteKit-specific raw body handling

```ts
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text(); // confirmed-working pattern, portable across adapters
  const signature = request.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, signature!, STRIPE_WEBHOOK_SECRET);
  // ...
};
```

This is the same underlying gotcha Express hits with `express.json()` ordering, SvelteKit's version is that any earlier `.json()` call on the same `Request` (in a hook, in shared middleware) permanently breaks the body for this handler [raw/stripe--webhooks--signature-errors-raw-body.md] [raw/stripe--sveltekit--raw-body-webhook-community.md].

## Wrong secret is still the most common failure

Test-mode CLI (`stripe listen`) and every Dashboard-registered production endpoint each hand out a **different** `whsec_*`, even against the same URL. Cross-verifying one against the other produces the exact same "no signatures found matching" error as a genuinely broken raw body. Check which secret source your environment is actually using before assuming the body-handling is broken [raw/stripe--webhooks--receive-and-verify.md].

## Which events actually matter for provisioning

| Event | Action | Note |
|---|---|---|
| `checkout.session.completed` | Primary provisioning hook for one-time payments and subscription signup | Check `session.payment_status === 'paid'` before provisioning |
| `customer.subscription.updated` | Plan change, status change, **cancel-requested** (`cancel_at_period_end: true`) | Send cancellation confirmation here, not on `.deleted` |
| `customer.subscription.deleted` | Subscription actually ended | Access revocation happens here, can be up to a full billing cycle after the cancel request |
| `invoice.paid` | Successful renewal | Extend access through the new period |
| `invoice.payment_failed` | Dunning starts | Notify; do NOT revoke immediately, Stripe retries the charge |

Pick **exactly one** event as the source of truth per business action. Reacting to two events (e.g. both `checkout.session.completed` and `payment_intent.succeeded`) for what your integration considers "the same" completion causes double-provisioning even with perfect per-event dedup, dedup keys on `event.id`, and these are two different IDs [raw/stripe--production-failures--webhook-race-conditions.md].

## Dedup pattern

```ts
const already = await db.processedWebhookEvent.findUnique({ where: { id: event.id } });
if (already) return json({ received: true, duplicate: true });

try {
  await handle(event);
  await db.processedWebhookEvent.create({ data: { id: event.id, type: event.type } });
  return json({ received: true });
} catch (err) {
  // Do NOT mark processed. Stripe retries, and the retry is your free second attempt.
  throw error(500, 'handler failed');
}
```

Marking "processed" only on success (not before) is counterintuitive but load-bearing: a crash mid-handler leaves no processed row, so Stripe's own retry mechanism becomes your free retry for transient failures, at the cost of a small race window where two near-simultaneous retries could both pass the dedup check before either commits. Add a secondary object-level guard (e.g. "refuse to re-finalize an already-finalized order") to catch that residual window [raw/stripe--production-failures--webhook-race-conditions.md].

## Async work after the 200

If the handler enqueues a background job (email, CRM sync) after returning 200, that enqueue is **not** protected by the dedup row unless it happens in the same DB transaction as marking the event processed. Use an outbox table: write the job into the outbox in the same transaction, have a separate worker drain it. A queue's own dedup (e.g. a job-ID check) only holds while the completed job record still exists in the queue's backing store, set retention to match or exceed Stripe's redelivery window (documented as up to 3 days) [raw/stripe--production-failures--webhook-race-conditions.md].

## Client/webhook race

Never let a return-page ("eager sync") write the same state the webhook is about to write. Both can read "not processed yet" before either commits, producing a duplicate credit or fulfillment. The webhook is the only writer; the client's return page only reads (poll your own DB, which only the webhook ever writes to) [raw/stripe--production-failures--webhook-race-conditions.md].

## Idempotency-key table (SQL)

`templates/idempotency-table.sql` ships a `processed_webhook_events` table with `event_id` as primary key, insert-before-work, `processed_at` set on success. Hand schema/migration decisions to a database specialist; this skill specifies the columns.
