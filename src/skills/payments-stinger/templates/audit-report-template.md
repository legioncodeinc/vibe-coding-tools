# Stripe payments audit, `<repo-or-feature-name>`

**Auditor:** payments-worker-bee
**Date:** YYYY-MM-DD
**Stripe SDK version:** `<from package.json>`
**Pinned API version:** `<from new Stripe(..., { apiVersion: '...' })>`
**Scope:** `<paths reviewed>`

---

## Executive summary

`<2-3 sentences. What's the state of the integration? Is it shippable? What's the biggest risk?>`

| Severity | Count |
|---|---|
| Must-fix | N |
| Should-refactor | N |
| Style | N |

---

## Must-fix findings

### M1. `<Short title, e.g., "Webhook handler does not verify Stripe-Signature">`

- **File:** `src/api/stripe/webhook.ts:42`
- **Failure mode:** `<Number from guides/10-production-failure-modes.md, e.g., #5, raw body broken before signature verification>`
- **Citation:** `guides/06-webhooks-and-provisioning.md §"The contract, in order"`; [Stripe webhook docs](https://docs.stripe.com/webhooks); `references/research/raw/stripe--webhooks--receive-and-verify.md`
- **Impact:** `<money loss / double-charge / missed provisioning / security>`
- **Fix:**

  ```ts
  // Before
  const event = JSON.parse(body); // NO verification

  // After
  const event = stripe.webhooks.constructEvent(rawBody, sig, WHSEC);
  ```

- **Verification:** `<how the team confirms the fix, e.g., stripe trigger checkout.session.completed and observe the request returns 200 with the correct event.id in processed_webhook_events>`

### M2. ...

---

## Should-refactor findings

### S1. `<title>`

- **File:** `<path:line>`
- **Citation:** `<guide section + research note>`
- **Why it matters:** `<accumulating cost over the next N sprints>`
- **Recommended fix:** `<short>`
- **Acceptance criteria:** `<how to verify>`

---

## Style suggestions

(Optional. Never blocks a PR.)

---

## Cross-Bee handoffs

`<Findings to surface to other Bees with file:line.>`

- **`security-worker-bee`:** `<e.g., webhook secret stored in plaintext .env committed to repo at infra/dev.env:3>`
- **`db-worker-bee`:** `<e.g., processed_webhook_events table missing or not indexed>`
- **`react-worker-bee`:** `<e.g., publishable key embedded as raw string in src/components/Pricing.tsx:5 instead of env var>`
- **`library-worker-bee`:** `<e.g., no PRD covers what happens on failed dunning at day 21, needs scoping>`
- **`quality-worker-bee`:** `<post-fix verification needed for items M1, M3, S2>`

---

## What's NOT covered in this audit

- `<e.g., Stripe Connect, out of scope; flag a separate engagement>`
- `<e.g., PCI-DSS attestation paperwork, out of scope; talk to compliance>`
- `<e.g., tax engine selection beyond Stripe Tax, out of scope v1>`

---

## Acceptance checklist (hand to quality-worker-bee)

- [ ] All Must-fix items resolved.
- [ ] Should-refactor items have follow-up tickets.
- [ ] `processed_webhook_events` table exists and is being written to.
- [ ] Webhook handler returns 2xx in < 2 seconds p95.
- [ ] `stripe trigger checkout.session.completed` produces the expected DB state.
- [ ] No `sk_live_*` in repo, CI, or any env file committed to git.
- [ ] `lookup_keys` used everywhere, no hardcoded `price_*`.

---

## Appendix: where to look next

- `guides/09-security-and-pci-scope.md`, the non-negotiables + severity rubric.
- `guides/10-production-failure-modes.md`, catalog this audit pulled from.
- `examples/saas-subscription-end-to-end.md`, what a clean implementation looks like.
