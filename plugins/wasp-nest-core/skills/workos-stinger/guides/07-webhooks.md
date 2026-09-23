# 07. Webhooks

Full handler: `references/webhook-handler-example.md`. This guide is the procedure and the gotchas.

## Events API vs. webhooks - pick deliberately

WorkOS's own stated preference is the **Events API** (pull, ordered, replayable) over webhooks specifically for user and directory-sync data, since the app controls ingestion pace and gets a guaranteed order. Webhooks remain the right choice when real-time push matters more than ordering guarantees [raw/workos--events--webhooks-guide.md]. If you're building a straightforward "keep our directory-managed users in sync" pipeline, seriously consider the Events API before defaulting to webhooks.

## Setting up a webhook endpoint

1. Deploy a public HTTPS endpoint that accepts POST (e.g. `/webhooks/workos`).
2. WorkOS Dashboard > Webhooks > register the endpoint URL.
3. **Subscribe only to the specific event types your handler branches on** - WorkOS explicitly warns that subscribing to everything creates unnecessary load on your endpoint [raw/workos--events--webhooks-guide.md].
4. Copy the generated secret into `WORKOS_WEBHOOK_SECRET` (staging and production have separate endpoints and separate secrets, per `references/env-var-checklist.md`).

## The three things that break a first implementation

1. **Using the parsed body instead of the raw body.** The signature is an HMAC over `<timestamp>.<raw_body>`; if any middleware JSON-parses (and thus re-serializes or reorders keys) before your handler reads the raw bytes, verification fails. Use `request.text()` in SvelteKit and pass that string straight to `constructEvent` [raw/workos--events--webhooks-guide.md].
2. **Branching on `type` instead of `event`.** WorkOS's envelope uses a top-level `event` field, not `type` - a handler ported from a Stripe-shaped integration that switches on `type` silently matches nothing [raw/workos--events--webhooks-guide.md].
3. **Treating delivery as ordered and exactly-once.** It's neither. Production retries up to 6 times with exponential backoff over 3 days on non-2xx responses; delivery can duplicate. Dedupe on the event `id`, persisted durably (a database table or Redis set, not an in-memory `Set` that resets on deploy), and make `*.created` handlers upsert rather than insert-only [raw/workos--events--webhooks-guide.md].

## Signature verification (Node SDK)

```typescript
const webhookEvent = await workos.webhooks.constructEvent({
  payload: rawBody,      // string, NOT parsed JSON
  sigHeader: request.headers.get('workos-signature'),
  secret: env.WORKOS_WEBHOOK_SECRET,
});
```

`constructEvent` verifies the `WorkOS-Signature` header's `t=...,v1=...` composite, checks the timestamp is within tolerance (~3-5 minutes by default), deserializes the payload, and throws `SignatureVerificationException` on any failure [raw/workos--events--webhooks-guide.md]. Respond `401` on that failure, not `400` - it's specifically an authentication failure.

## Respond fast, process async

Acknowledge with `200` as soon as the signature is verified; do the actual database writes afterward (fire-and-forget with logged errors, or hand off to a queue). WorkOS's retry clock starts from "didn't see a 2xx quickly enough," not from "processing didn't finish" [raw/workos--events--webhooks-guide.md].

## What's NOT available by webhook

Audit Logs have no webhook event type - if you need audit log data in your app, you need the Audit Logs API, not a webhook subscription [raw/workos--events--webhooks-guide.md].

## Next

`08-migration-and-environments.md` covers moving an existing user base onto WorkOS and the staging-to-production cutover.
