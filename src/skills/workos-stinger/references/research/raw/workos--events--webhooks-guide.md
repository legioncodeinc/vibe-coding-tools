# Webhooks: delivery, signature verification, idempotency, event catalog

- URL: https://workos.com/docs/events/data-syncing/webhooks ; https://workos-workos-node.mintlify.app/guides/handling-webhooks ; https://hookdeck.com/webhooks/platforms/guide-to-workos-webhooks-features-and-best-practices ; https://workos.com/docs/reference/webhooks/create ; https://workos.com/docs/events/data-syncing
- Fetched: 2026-08-14
- Source type: Official docs + official Node SDK guide (mintlify-hosted) + third-party (Hookdeck) webhook platform guide
- Component: Webhooks / Events

## Content

### Delivery contract

- Endpoint must be public, HTTPS, accepting POST requests.
- Set the webhook URL in WorkOS Dashboard > Webhooks; **subscribe only to the event types actually needed** - receiving everything creates unnecessary load.
- WorkOS recommends two concurrent processes: one to receive+acknowledge, one to process, so acknowledgment isn't blocked on processing.
- Respond `HTTP 200 OK` immediately on receipt. A non-2xx response is treated as delivery failure.
- **Retries: production** - up to 6 retries with exponential backoff over 3 days. **Staging** - retried for only "several minutes." Acknowledging success does not require the event to have finished processing successfully, just received.
- After the retry window elapses with no success, WorkOS stops retrying that event. Directory Sync data can be reconciled after the fact via the Directory Sync API even if a webhook was permanently dropped (Audit Logs have **no** webhook event type - not available by webhook, per the Hookdeck guide).

### Signature verification

Header: **`WorkOS-Signature`** (no `X-` prefix). Composite value format: `t=<issued_timestamp_ms>,v1=<hmac_hex>` (comma-delimited, Stripe-style).

- `issued_timestamp` - ms since epoch when the event was issued, prefixed `t=`.
- `signature_hash` - HMAC-SHA256 hex digest, prefixed `v1=`.

Expected signature is computed as: HMAC-SHA256, key = webhook secret (generated when the endpoint is configured in the dashboard, store as an env var), message = `<issued_timestamp> + "." + <raw_request_body_utf8>`. Compare hex digests; WorkOS suggests also validating that `issued_timestamp` isn't too far from current time to prevent replay attacks (SDK default tolerance ~3-5 minutes, an SDK parameter not a server-enforced rule).

Node SDK usage (`@workos-inc/node`, method `workos.webhooks.constructEvent`):

```typescript
app.post("/webhooks/workos", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const event = await workos.webhooks.constructEvent({
      payload: req.body.toString("utf8"), // raw body - do not JSON.parse before this call
      sigHeader: req.headers["workos-signature"],
      secret: process.env.WORKOS_WEBHOOK_SECRET,
      tolerance: 180000, // optional, ms, default ~180s
    });
    res.sendStatus(200); // acknowledge fast
    processQueue.add(event); // branch on event.event, async
  } catch {
    res.sendStatus(401); // invalid signature or stale timestamp
  }
});
```

`constructEvent` verifies the signature hash, checks the timestamp is within tolerance, deserializes the payload, and throws `SignatureVerificationException` on failure. Manual verification (e.g. Python) is documented in the SDK's own examples - split the header on `,`, extract `t=` and `v1=`, rebuild `<timestamp>.<raw_body>`, HMAC-SHA256 with the secret, compare in constant time.

**Common bug**: comparing the whole `WorkOS-Signature` header value (instead of splitting out `v1=`) never matches, since the header carries both the timestamp and the hash together. Also: some proxies lowercase header names, so look it up case-insensitively.

### Event envelope shape

Top-level fields: `event` (the event type string, dotted, e.g. `dsync.user.created` - **not** `type`, which is what many other providers use), `id`, `data`, `created_at`, `context`.

### Representative event catalog (not exhaustive)

| Event | Fires when |
| --- | --- |
| `dsync.user.created` / `.updated` / `.deleted` | Directory-sync user changes |
| `dsync.group.user_added` / `.user_removed` | Group membership changes |
| `connection.activated` / `.deactivated` | SSO connection state changes |
| `user.created` | A WorkOS user is created |
| `authentication.sso_succeeded` | An SSO authentication succeeds |
| `session.revoked` | A session is revoked |
| `organization.created` / `organization_membership.created` | Org or membership lifecycle |

### Idempotency

Webhook delivery is **at-least-once**, not exactly-once, and **not ordered**. WorkOS explicitly recommends idempotent processing keyed on the event `id`:

```typescript
async function processWebhook(webhook) {
  if (processedEvents.has(webhook.id)) {
    console.log('Duplicate event:', webhook.id);
    return;
  }
  processedEvents.add(webhook.id);
  switch (webhook.event) {
    case 'dsync.user.created':
      await db.users.create({ directoryUserId: webhook.data.id, /* ... */ });
      break;
    // ...
  }
}
```

In practice, log/persist processed event IDs (not just an in-memory Set, which won't survive a restart or scale past one process) and upsert rather than insert on `*.created` handlers, since a duplicate delivery of a "created" event should not fail as a constraint violation.

### Webhooks vs. Events API

| Aspect | Events API | Webhooks |
| --- | --- | --- |
| Timing | Pull, app controls pace | Push, real-time |
| Order | Guaranteed consistent order | No ordering guarantee (timestamps let you reconstruct order) |
| Reconciliation | Replayable from a point in time | Failed deliveries retried with backoff up to 3 days, then dropped |
| Security | Auth/confidentiality/integrity by default (it's an authenticated API pull) | Requires a public endpoint + manual signature validation |

WorkOS's own recommendation: prefer the **Events API** for user and directory sync events specifically, since it guarantees order and lets the app control ingestion pace; webhooks remain a valid choice when real-time push is more valuable than ordering guarantees.

### Webhook Endpoint object / management API

`POST /webhook_endpoints` - `endpoint_url` (required, HTTPS), `events` (required array of event-type strings to subscribe to). Response object: `id`, `endpoint_url`, `secret`, `status` (`enabled`|`disabled`), `events`, `created_at`, `updated_at`.
