# CRM Sync Code Audit Checklist

*Template for `guides/07-implementation-review.md`. Produces a pass/fail audit report.*

**Product:** {product name}
**CRM(s):** {CRM name(s)}
**Audit date:** {YYYY-MM-DD}
**Auditor:** crm-integration-worker-bee
**Sync direction:** {read-only | write-only | bi-directional}

---

## Section 1: Webhook security

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 1.1 | HubSpot v3 HMAC-SHA256 signature validated (not v1) | Critical | [ ] Pass / [ ] Fail | |
| 1.2 | Timestamp anti-replay within 5 minutes | High | [ ] Pass / [ ] Fail | |
| 1.3 | Constant-time comparison for HMAC (not `==`) | High | [ ] Pass / [ ] Fail | |
| 1.4 | HTTP 200 returned before processing | Medium | [ ] Pass / [ ] Fail | |
| 1.5 | Attio `Idempotency-Key` captured (if Attio) | High | [ ] Pass / [ ] N/A | |
| 1.6 | HMAC validation before any DB write | Critical | [ ] Pass / [ ] Fail | |

## Section 2: Idempotency

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 2.1 | Every write has an idempotency key | Critical | [ ] Pass / [ ] Fail | |
| 2.2 | Idempotency key stored and checked before write | Critical | [ ] Pass / [ ] Fail | |
| 2.3 | Idempotency key uses correct scheme (not HubSpot `eventId`) | High | [ ] Pass / [ ] Fail | |

## Section 3: Rate limit handling

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 3.1 | 429 responses handled with exponential backoff | High | [ ] Pass / [ ] Fail | |
| 3.2 | Rate limit math documented for peak volume | High | [ ] Pass / [ ] Fail | |
| 3.3 | No N+1 CRM API calls in sync loops | High | [ ] Pass / [ ] Fail | |

## Section 4: Conflict resolution (bi-directional only)

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 4.1 | Conflict resolution policy documented | Critical | [ ] Pass / [ ] Fail / [ ] N/A | |
| 4.2 | Conflict detection uses payload `updated_at` (not delivery time) | High | [ ] Pass / [ ] Fail / [ ] N/A | |
| 4.3 | Echo prevention implemented | Critical | [ ] Pass / [ ] Fail / [ ] N/A | |
| 4.4 | Consent/opt-out flags use "most restrictive wins" | Critical | [ ] Pass / [ ] Fail / [ ] N/A | |

## Section 5: Deduplication

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 5.1 | Email normalized before dedup check | High | [ ] Pass / [ ] Fail | |
| 5.2 | Dedup check runs before CRM record creation | High | [ ] Pass / [ ] Fail | |
| 5.3 | External ID alias maintained post-merge | Medium | [ ] Pass / [ ] Fail | |

## Section 6: Error handling

| # | Check | Severity | Status | Finding |
|---|---|---|---|---|
| 6.1 | CRM API errors logged with full request payload | High | [ ] Pass / [ ] Fail | |
| 6.2 | Failed sync events retried with backoff (not dropped) | High | [ ] Pass / [ ] Fail | |
| 6.3 | Reconciliation job exists and is scheduled | High | [ ] Pass / [ ] Fail | |
| 6.4 | CRM downtime handled gracefully (queue buffers events) | Medium | [ ] Pass / [ ] Fail | |

---

## Summary

| Severity | Pass | Fail | N/A |
|---|---|---|---|
| Critical | | | |
| High | | | |
| Medium | | | |

**Deployment recommendation:**
- [ ] **Block:** Critical failures present. Do not deploy.
- [ ] **Conditional:** High failures present. Fix before high-volume traffic.
- [ ] **Proceed:** No Critical or High failures.

**Priority findings:**
1. {finding 1 with file location and line number}
2. {finding 2}

---

*See `guides/07-implementation-review.md` for severity definitions and remediation guidance.*
