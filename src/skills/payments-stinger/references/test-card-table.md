# Test card table

Grounded in [raw/stripe--cli--listen-testing-test-clocks.md].

## Baseline

| Card number | Behavior |
|---|---|
| `4242 4242 4242 4242` | Successful Visa charge, the default card for interactive testing |

## Declines

| Description | Number | Error code | Decline code |
|---|---|---|---|
| Generic decline | `4000000000000002` | `card_declined` | `generic_decline` |
| Insufficient funds | `4000000000009995` | `card_declined` | `insufficient_funds` |
| Lost card | `4000000000009987` | `card_declined` | `lost_card` |
| Stolen card | `4000000000009979` | `card_declined` | `stolen_card` |
| Expired card | `4000000000000069` | `expired_card` | n/a |
| Incorrect CVC | `4000000000000127` | `incorrect_cvc` | n/a |
| Processing error | `4000000000000119` | `processing_error` | n/a |
| Incorrect number | `4242424242424241` | `incorrect_number` | n/a |
| Velocity limit exceeded | `4000000000006975` | `card_declined` | `card_velocity_exceeded` |

Notes:

- CVC checks are **skipped entirely** if you omit a CVC during testing, Stripe can't fail a check it never ran. Supply any 3-digit CVC to actually exercise the "Incorrect CVC decline" card's failure path.
- Cards that simulate issuer declines (lost/stolen/etc.) cannot be attached to a `Customer` object for later off-session testing. Use the dedicated "Decline after attaching" test card to simulate a saved card that fails on a later off-session charge.

## 3D Secure / SCA

- The general EEA test cards succeed **without** triggering 3DS authentication, don't mistake those for SCA coverage.
- Use the dedicated regulatory/3DS test cards (see current `docs.stripe.com/testing` for the live list) to actually exercise a 3DS challenge and verify your `requires_action` / `confirmPayment` handling.

## Test Clocks

Freeze and advance simulated time in test mode to deterministically exercise trial-end, renewal, and dunning webhooks without waiting real days. Create objects (subscriptions, invoices) at a frozen point in time, advance the clock, then assert on the resulting webhook sequence. Emits `test_helpers.test_clock.advancing` / `.ready` events you can gate assertions on.

## Stripe CLI loop

```bash
# Terminal 1
npm run dev

# Terminal 2, forward events, prints a session-scoped whsec_* (differs from
# any Dashboard-registered endpoint's secret)
stripe listen --forward-to localhost:5173/api/webhooks/stripe

# Terminal 3, fire a specific event
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed

# Replay a real past event (within 30 days) against a specific endpoint
stripe events resend evt_1AbC123 --webhook-endpoint=we_123456
```
