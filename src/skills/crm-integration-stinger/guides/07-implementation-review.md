# Implementation Review: CRM Sync Code Audit

Use this guide when auditing existing CRM sync code. Each check is pass/fail. Blocking findings (severity: critical or high) must be resolved before production deployment.

## Pre-audit checklist

Before running the audit, confirm:
- [ ] Which CRM(s) are integrated (HubSpot / Salesforce / Attio / other)
- [ ] Sync direction (read-only / write-only / bi-directional)
- [ ] Whether webhooks or polling is used
- [ ] Whether a conflict resolution policy has been defined (if bi-directional)
- [ ] Whether a reconciliation job exists

---

## Section 1: Webhook security (critical)

### HubSpot webhook security

- [ ] **v3 HMAC-SHA256 signature validation implemented.** The v1 signature header is deprecated. Look for `X-HubSpot-Signature-v3` header validation (not `X-HubSpot-Signature`). [CRITICAL]
- [ ] **Timestamp anti-replay check implemented.** The webhook payload includes `X-HubSpot-Request-Timestamp`. Reject any request with a timestamp more than 5 minutes old. Without this, signature reuse attacks are possible. [HIGH]
- [ ] **Constant-time string comparison used.** String comparison for HMAC values must use a constant-time function (e.g., `crypto.timingSafeEqual` in Node.js, `hmac.compare_digest` in Python). Standard string `==` comparison is vulnerable to timing attacks. [HIGH]
- [ ] **HTTP 200 returned before processing.** If the endpoint blocks on processing before responding, HubSpot will time out at 5 seconds and retry. [MEDIUM]

### Attio webhook security

- [ ] **`Idempotency-Key` header captured and stored.** Used for deduplication when Attio retries on delivery failure. [HIGH]
- [ ] **Attio webhook signature validated.** See Attio docs for current signing mechanism. [HIGH]
- [ ] **Response returned within 5 seconds.** Attio's at-least-once delivery means slow responses generate duplicate deliveries. [MEDIUM]

### General webhook security

- [ ] **HMAC validation occurs before any database write.** If the signature validation is after processing, invalid payloads can still cause state changes. [CRITICAL]
- [ ] **Webhook endpoint is not publicly guessable.** URL should include a random secret suffix or rely entirely on HMAC validation. [MEDIUM]

---

## Section 2: Idempotency (critical)

- [ ] **Every write operation has an idempotency key.** A sync worker that processes the same event twice must produce the same outcome, not a duplicate write. [CRITICAL]
- [ ] **Idempotency key is stored and checked before processing.** The key must be persisted (Redis, database) and checked before the write, not after. [CRITICAL]
- [ ] **Idempotency key scope is correct.** For HubSpot: `(portalId, objectId, event_type, occurredAt)`. For Attio: `Idempotency-Key` header value. Using `eventId` from HubSpot webhooks as the idempotency key is incorrect -- HubSpot `eventId` is not globally unique. [HIGH]

---

## Section 3: Rate limit handling (high)

- [ ] **Rate limit responses (429) are handled with exponential backoff.** Without backoff, a rate-limited sync loop will hammer the CRM API and be rate-limited indefinitely. [HIGH]
- [ ] **Rate limit math has been run before committing to polling.** For HubSpot Free/Starter at 100 requests/10 seconds: document the maximum contact volume the sync can handle within limits. [HIGH]
- [ ] **N+1 CRM API calls are absent.** A sync loop that makes one API call per record when batch endpoints are available is an N+1 pattern. Use HubSpot batch endpoints (`/crm/v3/objects/contacts/batch/read`), Salesforce composite API, or Attio batch reads where available. [HIGH]
- [ ] **Attio: rate limit is respected per webhook target URL.** Attio enforces 25 requests/second per webhook target URL, not 100/second globally. [MEDIUM]

---

## Section 4: Conflict resolution (critical for bi-directional sync)

- [ ] **A conflict resolution policy is documented.** If bi-directional, one of the four policies (last-write-wins, CRM-authoritative, product-authoritative, human-review queue) must be explicitly chosen and documented. [CRITICAL]
- [ ] **Conflict detection uses payload `updated_at`, not delivery timestamp.** The webhook delivery timestamp is not the record modification time. Always use the record's `updatedAt` field from the payload. [HIGH]
- [ ] **Echo prevention is implemented.** Without echo prevention, a write from the product to the CRM triggers a webhook that writes back to the product, creating an infinite loop. [CRITICAL]
- [ ] **Consent and Do Not Contact flags apply "most restrictive wins" policy.** A sync that overwrites a `do_not_contact: true` with `false` from the other side is a GDPR/CAN-SPAM violation. [CRITICAL]

---

## Section 5: Deduplication (high)

- [ ] **Email normalization (lowercase) applied before dedup check.** [HIGH]
- [ ] **Dedup check runs before CRM record creation.** The sync should query for an existing record by email before creating a new one. [HIGH]
- [ ] **External ID alias table is maintained post-merge.** Any merged record should have its non-surviving IDs recorded as aliases. [MEDIUM]

---

## Section 6: Error handling (high)

- [ ] **CRM API errors are logged with the full request payload.** Required for debugging and incident reconstruction. [HIGH]
- [ ] **Failed sync events are retried with backoff, not silently dropped.** A queue with dead-letter handling is the correct pattern. [HIGH]
- [ ] **Reconciliation job exists and is scheduled.** The nightly reconciliation job is the safety net for all dropped webhook events. [HIGH]
- [ ] **CRM API downtime is handled gracefully.** The sync queue should buffer events during CRM outages and drain on recovery, not lose them. [MEDIUM]

---

## Severity guide

| Severity | Definition | Required action |
|---|---|---|
| Critical | Can cause data corruption, security vulnerability, or GDPR violation | Block deployment. Fix before any production traffic. |
| High | Can cause data loss, duplicate records, or sync failures at scale | Fix before high-volume production traffic. |
| Medium | Degrades reliability or maintainability | Schedule for next sprint. |
| Low | Code quality issue with no operational impact | Backlog. |

---

*Sources: `research/external/2026-05-20-hubspot-api-rate-limits-webhooks.md`, `research/external/2026-05-20-attio-api-v2-rate-limits-stability.md`, `research/external/2026-05-20-bidirectional-sync-architecture.md`*
*Template: `templates/code-audit-checklist.md`*
