# Template: Platform Audit

Use this scoring sheet to audit an existing live chat / helpdesk setup against best practices.

**Date:** _______________  
**Platform:** _______________  
**Auditor:** _______________

---

## Scoring guide

Rate each dimension 0–5:
- 0: Not implemented / critical gap
- 1: Partially implemented, major gaps
- 2: Basic implementation, notable gaps
- 3: Solid implementation, minor gaps
- 4: Strong implementation, marginal improvements possible
- 5: Best practice, no gaps observed

---

## Dimension 1: Identity Verification (0–5)

| Check | Pass / Fail | Notes |
|---|---|---|
| HMAC or JWT identity verification is enabled | | |
| Signing happens server-side (not in browser) | | |
| Secret is NOT in any client-side bundle | | |
| `Cache-Control: no-store` on identity API endpoint | | |
| Session is reset on logout | | |
| Key rotation procedure is documented | | |

**Score:** ___/5

---

## Dimension 2: Conversation Routing (0–5)

| Check | Pass / Fail | Notes |
|---|---|---|
| Paying customers have a dedicated queue / higher priority | | |
| Skills-based or team-based routing is configured | | |
| Catch-all rule exists (no conversation can be unrouted) | | |
| Overflow rule exists (conversation escalates if no response within SLA) | | |
| SLA timers are configured per tier | | |

**Score:** ___/5

---

## Dimension 3: AI Deflection (0–5)

| Check | Pass / Fail | Notes |
|---|---|---|
| AI deflection is configured (or explicitly not needed) | | |
| Human fallback rule is configured | | |
| Escalation rules exist for billing/cancellation/anger | | |
| Knowledge base has ≥20 articles | | |
| AI deflection rate is being measured | | |

**Score:** ___/5 (or N/A if AI deflection not in scope)

---

## Dimension 4: Data Export & GDPR (0–5)

| Check | Pass / Fail | Notes |
|---|---|---|
| Conversation export path is documented | | |
| GDPR Article 20 request procedure is written | | |
| Continuous export or archive is set up | | |
| Data retention policy is defined | | |
| Test GDPR deletion was performed | | |

**Score:** ___/5

---

## Dimension 5: Integration Health (0–5)

| Check | Pass / Fail | Notes |
|---|---|---|
| Widget loads asynchronously | | |
| CSP headers allow widget CDN domains | | |
| Widget is not blocking Core Web Vitals (LCP, CLS) | | |
| Analytics events are being tracked (FRT, TTR, CSAT) | | |

**Score:** ___/5

---

## Overall score

| Dimension | Score | Max |
|---|---|---|
| Identity Verification | | 5 |
| Conversation Routing | | 5 |
| AI Deflection | | 5 |
| Data Export & GDPR | | 5 |
| Integration Health | | 5 |
| **Total** | | **25** |

**Interpretation:**
- 20–25: Production-ready. Monitor for drift.
- 15–19: Functional, notable gaps. Fix within 30 days.
- 10–14: Significant gaps. Address highest-risk items (Identity Verification, Routing) immediately.
- 0–9: Critical gaps. Rebuild before going to production.

---

## Priority findings

| Finding | Severity | Recommended fix | Owner | Due date |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
