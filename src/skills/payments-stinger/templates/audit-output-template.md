# Stripe Payments Audit, {{project-name}}

> **This file is a TEMPLATE skeleton, not a real audit.** Copy it, fill the curly-braced placeholders, and write the filled-in version into the host repo's `library/` tree (see `SKILL.md` Output conventions).

**Date:** {{YYYY-MM-DD}}
**Reviewer:** payments-worker-bee
**Scope:** {{repo / diff / module}}
**Stripe SDK:** {{stripe@x.y.z from package.json}}
**Pinned API version:** {{value of new Stripe(..., { apiVersion: '...' })}}

---

## Executive summary

{{2-4 sentence synthesis. Lead with the headline finding. Mention severity counts.}}

| Severity | Count |
|---|---|
| Must-fix | {{n}} |
| Should-refactor | {{n}} |
| Style | {{n}} |

## Surface ratings

Ratings: Solid / Drifting / Needs work

| Surface | Rating | Headline finding |
|---|---|---|
| Product choice (Checkout vs PI vs Links, `guides/01`) | | |
| Webhook contract (`guides/02`) | | |
| Subscriptions (`guides/03`) | | |
| Customer Portal (`guides/04`) | | |
| Idempotency (`guides/05`) | | |
| Testing & operations (`guides/06`) | | |
| API version posture (`guides/07`) | | |
| Event fan-out (`guides/08`) | | |

## Findings

### Must-fix ({{count}})

1. **`{{file:line}}`**, {{one-line summary}}
   - Failure mode: {{number from guides/10-production-failure-modes.md}}
   - Citation: {{guide section + Stripe doc URL + research note}}
   - Impact: {{money loss / double-charge / missed provisioning / security}}
   - Fix: {{how}}
   - Verification: {{how the team confirms the fix}}

2. ...

### Should-refactor ({{count}})

1. **`{{file:line}}`**, ...

### Style ({{count}})

1. **`{{file:line}}`**, ...

## Cross-Bee handoffs

- [ ] `db-worker-bee`, {{schema, indexes, processed_webhook_events table}}
- [ ] `security-worker-bee`, {{secret storage, PII handling, RBAC on portal sessions}}
- [ ] `react-worker-bee`, {{Stripe.js, Elements, EmbeddedCheckout}}
- [ ] `library-worker-bee`, {{PRD scoping for any new payments feature}}
- [ ] `quality-worker-bee`, {{post-fix verification}}

## What's NOT covered in this audit

- {{e.g., Stripe Connect, out of scope; flag a separate engagement}}
- {{e.g., PCI-DSS attestation paperwork, out of scope; talk to compliance}}
- {{e.g., tax engine selection beyond Stripe Tax, out of scope v1}}

## Acceptance checklist (hand to quality-worker-bee)

- [ ] All Must-fix items resolved.
- [ ] Should-refactor items have follow-up tickets.
- [ ] `processed_webhook_events` table exists and is being written to.
- [ ] Webhook handler returns 2xx in < 2 seconds p95.
- [ ] `stripe trigger checkout.session.completed` produces the expected DB state.
- [ ] No `sk_live_*` in repo, CI, or any env file committed to git.
- [ ] `lookup_keys` used everywhere, no hardcoded `price_*`.

## References

- `guides/...` ({{list the guides actually cited in findings}})
- `research/...` ({{list the research notes referenced}})
- {{external Stripe doc URLs}}

---

*Produced by payments-stinger. See `SKILL.md` for methodology.*
