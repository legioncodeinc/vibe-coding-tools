# Stripe CLI: listen, forward webhooks locally, test clocks, test cards

- URL: https://docs.stripe.com/cli/listen ; https://docs.stripe.com/api/test_clocks ; https://docs.stripe.com/testing
- Fetched: 2026-08-14
- Source type: official docs
- Component: Local dev testing, Stripe CLI, test clocks, test cards

## Facts

- `stripe listen` receives webhook events from Stripe on your local machine via a direct connection to Stripe's API, no Dashboard-configured webhook endpoint is required to use it.
- `stripe listen --forward-to http://localhost:4242/webhook` forwards events to your local server; the CLI prints a webhook signing secret (`whsec_...`) each time, and this secret does not change between restarts of the same `listen` session.
- `--events <comma-separated-list>` filters which event types get forwarded; default is all events (`[*]`).
- Snapshot events (the traditional full-object webhook payloads) and "thin" events (newer, smaller payloads referencing an object to re-fetch) are forwarded via separate flags: `--forward-to` for snapshot, `--forward-thin-to` + `--thin-events` for thin.
- `--load-from-webhooks-api` loads your already-registered Dashboard/API webhook endpoints and mirrors their configured event filters to your local forwarding target, useful for matching local dev to what production actually receives.
- `stripe trigger <event-name>` (companion command, e.g. `stripe trigger payment_intent.succeeded`) fires a realistic test event; the doc notes triggering one event can cascade related events (e.g., triggering `payment_intent.succeeded` also triggers `payment_intent.created`).
- `stripe events resend --webhook-endpoint=we_123456` resends a previously-received event (must be within the last 30 days) to a specific webhook endpoint, useful for reproducing a production bug locally without waiting for a fresh real event.
- Test Clocks (`/v1/test_helpers/test_clocks`) let you freeze and advance time in test mode: create objects (subscriptions, invoices) at a simulated point in time, then advance the clock forward to deterministically observe trial-end, renewal, and dunning webhooks without waiting real days/weeks. Emits `test_helpers.test_clock.advancing` and `.ready` events you can use to gate assertions in automated tests.
- Test cards (docs.stripe.com/testing): `4242 4242 4242 4242` is the baseline successful Visa card for interactive testing. Declines are simulated via specific card numbers mapped to specific decline codes, e.g. `4000000000000002` → generic decline, `4000000000009995` → insufficient funds, `4000000000009987` → lost card, `4000000000009979` → stolen card, `4000000000000069` → expired card, `4000000000000127` → incorrect CVC, `4000000000000119` → processing error.
- CVC checks are skipped entirely if you omit a CVC in a test, you must supply a 3-digit CVC to actually exercise the "incorrect CVC decline" test card's failure path.
- Regulatory/3DS test cards exist separately under "regulatory cards" for exercising SCA/3DS challenge flows; EEA-region test cards in the general table simulate a payment that succeeds *without* triggering authentication, so don't mistake those for full SCA coverage, use the dedicated 3DS test cards for that.
- Cards that simulate issuer declines (e.g. lost/stolen) cannot be attached to a `Customer` object directly for later off-session testing; use the dedicated "Decline after attaching" test card to simulate a saved card that fails later.
