# Idempotent requests (API v1 and v2)

- URL: https://docs.stripe.com/api/idempotent_requests ; https://docs.stripe.com/error-low-level ; https://docs.stripe.com/api-v2-overview
- Fetched: 2026-08-14
- Source type: official docs
- Component: Idempotency keys

## Facts

- Pass an `Idempotency-Key` header on any `POST` request to safely retry it without risk of double-executing the operation (e.g., double-creating a customer, double-charging a PaymentIntent confirm).
- Mechanics (v1): Stripe saves the resulting status code and body of the *first* request made for a given key, regardless of success or failure, and returns that identical saved result, including a saved `500`, for any retry using the same key within 24 hours. Retrying after a `4xx` should generate a *new* key once you've fixed the request, not reuse the old one, since the old key is now permanently bound to the failed response.
- Keys are client-generated, up to 255 characters; Stripe recommends V4 UUIDs or another string with enough entropy to avoid accidental collisions. Do not use sensitive data (emails, personal identifiers) as the key itself.
- Only `POST` requests need/benefit from idempotency keys. `GET` and `DELETE` are idempotent by definition in API v1; sending a key on them has no effect.
- Important edge case: Stripe only saves an idempotent result *after* an API endpoint actually begins executing. If the request is rejected for parameter validation or hits a concurrent-request conflict (`409`) before execution starts, no result is cached, you can and should retry those with the same key.
- Rate-limit (`429`) and unauthenticated (`401`) responses are explicitly called out as exceptions: because rate limiting and auth checks run *before* the idempotency layer, retrying with the same key after a `429`/`401` can produce a genuinely different result on retry (not a replay), the safest blanket strategy for any `4xx` is to mint a fresh key.
- API v2 (`/v2` namespace) changes the semantics: supports idempotent replay on `POST` and `DELETE` (v1 only covers `POST`); replay window widens from 24 hours to 30 days; and on retry of a *failed* first attempt, v2 re-executes rather than replaying the cached failure, it "retries any failed requests without producing side effects" instead of returning the same error forever. Treat v1 and v2 idempotency semantics as genuinely different, not just a syntax change, if a codebase mixes both.
- A replayed (not re-executed) response from the server carries an `Idempotent-Replayed: true` response header, useful for logging/debugging to confirm your dedup actually worked rather than the operation silently running twice.
