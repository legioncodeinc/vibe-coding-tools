# 10, Production failure modes

Catalog of the bugs that actually show up in Stripe integrations. Each entry: symptom, root cause, fix, severity.

Source: [raw/stripe--production-failures--webhook-race-conditions.md], [raw/stripe--webhooks--signature-errors-raw-body.md], [raw/stripe--sveltekit--raw-body-webhook-community.md], [raw/stripe--customer-portal--vs-custom-billing-ui.md], [raw/stripe--idempotency--api-requests.md].

## 1. Double provisioning from two events, one business action

**Symptom:** A customer is charged once but gets two welcome emails, or two entitlement grants.

**Root cause:** The handler reacts to more than one Stripe event for what it considers "the same" completion, e.g. both `checkout.session.completed` and `payment_intent.succeeded`. Per-event dedup on `event.id` doesn't catch this, because these are two genuinely different event IDs.

**Fix:** Pick exactly one event as the source of truth per business action and document why. If a second listener exists as a "safety net," verify it can't fire for the same outcome the primary listener already covers.

**Severity:** Must-fix.

---

## 2. Missing or mis-ordered dedup (mark-processed timing)

**Symptom:** A retried webhook delivery (Stripe retries on any 5xx/timeout, escalating over up to 3 days) processes the same event twice.

**Root cause:** The dedup row is written before the side effects run, so a crash mid-handler leaves a "processed" row for work that never actually completed, the opposite failure of missing dedup entirely.

**Fix:** Mark the event processed only after side effects succeed. A crash mid-handler then leaves no processed row, and Stripe's retry becomes a free second attempt. Add a secondary object-level guard (e.g. "an already-finalized order refuses to re-finalize") to catch the residual race where two near-simultaneous retries both pass the dedup check before either commits.

**Severity:** Must-fix.

---

## 3. Client/webhook race ("eager sync")

**Symptom:** A duplicate credit or fulfillment appears, correlated with the customer's return-page load timing, not with Stripe's retry schedule.

**Root cause:** The return page checks/writes state immediately on load, racing the async webhook handler for the same object. Both can read "not yet processed" before either commits.

**Fix:** Webhooks are the only writer of payment/subscription state. The return page only reads (poll your own DB, populated exclusively by the webhook handler).

**Severity:** Must-fix.

---

## 4. Async side effect after the 200 isn't protected

**Symptom:** An email or CRM sync fires twice even though the dedup table shows the event was only "processed" once.

**Root cause:** The side effect was enqueued to a background job/queue outside the same DB transaction that marks the event processed, the enqueue itself has no dedup guarantee.

**Fix:** Outbox pattern, write the job into an outbox table in the same transaction as marking the event processed; a separate worker drains the outbox. If using a job queue's own dedup (e.g. a job-ID check), set its retention window to match or exceed Stripe's redelivery window (up to 3 days); a completed-and-garbage-collected job ID can be re-enqueued and will run again.

**Severity:** Must-fix.

---

## 5. Raw body broken before signature verification

**Symptom:** Every webhook 400s with a signature verification error; the secret is confirmed correct.

**Root cause:** `request.json()` (or any body-consuming call) ran before the raw-body read, or the body was re-serialized (`JSON.stringify(parsedBody)`) before being passed to `constructEvent`. In SvelteKit specifically, a `Request` body stream can only be consumed once, calling `.json()` then `.text()` throws `TypeError: Body is unusable`.

**Fix:** `const body = await request.text();` as the very first thing done with the request in the webhook route, before any other body access, and pass that string directly to `constructEvent`.

**Severity:** Must-fix.

---

## 6. Wrong endpoint secret (CLI vs Dashboard)

**Symptom:** Signature verification fails intermittently or entirely after moving from local dev to staging/production, or vice versa.

**Root cause:** The Stripe CLI's `stripe listen` session secret and each Dashboard-registered endpoint's secret are different `whsec_*` values, even against the same URL. A deploy that reuses the CLI secret, or a local `.env` that still has a stale production secret, will 400 every event.

**Fix:** Confirm which secret source the running environment is actually using. Never reuse the CLI secret in a deployed `STRIPE_WEBHOOK_SECRET`.

**Severity:** Must-fix.

---

## 7. Trusting the redirect/return page for provisioning

**Symptom:** A customer is occasionally provisioned without a completed payment, or audit logs show provisioning happened before the webhook fired.

**Root cause:** Code on the return page (`/checkout/return?session_id=...`) grants entitlements based on the session ID being present in the URL, rather than waiting for the webhook.

**Fix:** The return page may re-fetch the session by ID to display a status, or poll the local DB (populated by the webhook) to show a loading state, but it must never write entitlements itself.

**Severity:** Must-fix.

---

## 8. Late or missing cancellation confirmation

**Symptom:** A customer cancels their subscription and reports never receiving a confirmation, or the confirmation arrives weeks after the request.

**Root cause:** The handler only listens for `customer.subscription.deleted`, which fires at the end of the current billing period, potentially a full billing cycle after the cancellation was actually requested.

**Fix:** Listen for `customer.subscription.updated` with `cancel_at_period_end: true` for the confirmation moment; reserve `customer.subscription.deleted` for access revocation. These are two distinct actions on two distinct events. See `guides/05-subscriptions-with-custom-ui.md`.

**Severity:** Must-fix (customer-facing trust issue, even though nothing is charged incorrectly).

---

## 9. Missing idempotency key on retryable writes

**Symptom:** A flaky network retry creates two Customers, two Refunds, or double-charges a saved payment method.

**Root cause:** A server-side `POST` that could be retried under a timeout (`customers.create`, `refunds.create`, an off-session `paymentIntents.create`) has no `Idempotency-Key`.

**Fix:** Pass a deterministic `idempotencyKey` (not `Math.random()` or `Date.now()`, those defeat the purpose entirely) scoped to the specific operation, e.g. `refund:${paymentIntentId}:${amount}`.

**Severity:** Must-fix.

---

## 10. Guard logic assumes a single upstream flow

**Symptom:** A "skip this event, another handler already covers it" guard silently drops legitimate processing for a code path the guard's author didn't anticipate.

**Root cause:** A guard added to prevent double-processing between two events (see #1) assumed every PaymentIntent reaching the handler came through Checkout Sessions. A second, direct-PaymentIntent flow (no Checkout Session at all, see `guides/01-choose-your-integration.md`'s raw-Payment-Intents fallback) hits the same guard and gets silently skipped, because the guard's condition matches metadata that flow also happens to carry.

**Fix:** Any "skip because another path handles this" guard must account for every actual origin that can reach the guarded code, not assume a single upstream integration shape, especially in a codebase (like this skill's default) that may use both Custom Checkout Sessions and raw Payment Intents for different flows.

**Severity:** Must-fix once discovered; treat as a design review item before shipping any dedup guard spanning two integration paths.

---

## How to use this catalog in an audit

For each finding in a codebase, cite: (1) the numbered failure mode here, (2) the file:line where it lives, (3) the fix from this catalog or the linked guide, (4) the severity. `templates/audit-report-template.md` ships this shape.
