# 06. Rate limits and reliability

## Limits

| Environment | Burst | Daily |
|---|---|---|
| Production OAuth app | 100 requests / 10s per app per resource (Location or Company) | 200,000 requests / day per app per resource |
| Sandbox PIT | 25 requests / 10s | 10,000 requests / day, per location, does not multiply with more PITs |

[raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--auth--sandbox-private-integration-tokens.md]

Limits apply **per app, per resource (Location or Company)** -- an app installed on two sub-accounts gets a full independent allowance for each one, not a shared pool [raw/ghl--versioning--v3-status-and-rate-limits-official.md].

## Track usage from response headers

- `X-RateLimit-Limit-Daily` -- your daily cap
- `X-RateLimit-Daily-Remaining` -- remaining today
- `X-RateLimit-Interval-Milliseconds` -- burst window length
- `X-RateLimit-Max` -- max requests in that window
- `X-RateLimit-Remaining` -- remaining in the current burst window

[raw/ghl--versioning--v3-status-and-rate-limits-official.md]

## Handling 429s

Honor the `Retry-After` header when present; back off with jitter rather than retrying immediately. Both the official SDK and third-party sources treat `429` as a first-class error code to branch on, not an unexpected failure [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md, raw/ghl--contacts--create-update-upsert-recipes.md].

## Pagination

No single official page in this research documents a uniform pagination model across every resource. Cursor-style pagination (`startAfter` timestamp) is used in SDK examples for lists like contacts. **At least one resource (payment transactions, per a secondary source) is known to paginate by offset instead** -- verify per-endpoint behavior; do not assume one model platform-wide. Confirm returned record IDs actually differ between pages rather than trusting a 200 status alone [raw/ghl--versioning--v3-announcement-and-resource-catalog.md -- GAP].

## Idempotency

No `Idempotency-Key` header or equivalent mechanism is documented anywhere in the research archive for this stinger. A retried `POST /contacts` outside of `/contacts/upsert` can create a duplicate record [raw/ghl--contacts--create-update-upsert-recipes.md -- GAP]. Practical mitigation: route retriable contact writes through `/contacts/upsert` (matches on email/phone, returns `new: true|false`) instead of raw `POST /contacts`, and design your own application-layer dedupe (e.g. a processed-event-ID table) for webhook consumers.

## Error codes to design around

| Code | Meaning | Typical cause |
|---|---|---|
| 401 | Unauthorized | Token missing, expired, or lacking the required scope |
| 404 | Not found | Record doesn't exist, or belongs to a different location than the token is scoped to |
| 422 | Unprocessable | Missing required field (e.g. neither email nor phone), or an unknown custom field ID |
| 429 | Rate limited | Burst or daily cap exceeded; honor `Retry-After` |

[raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]

## Token refresh reliability

Automatic-refresh SDKs retry on `401` if a valid refresh token and client credentials are configured [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]. Building your own client: refresh proactively a safety margin before the confirmed ~24-hour access-token expiry (`expires_in: 86399`), and treat a failed refresh (revoked install, rotated refresh token used twice) as a hard stop requiring re-authorization, not a retry loop [raw/ghl--auth--agency-vs-location-access-tokens.md].

## Webhook delivery reliability

No first-party retry-count/backoff schedule for outbound webhook delivery was found in this research (a documented gap). Design webhook handlers to be idempotent (dedupe on `webhookId`) and to return a fast `2xx` before doing slow downstream work, since delivery is presumed at-least-once absent a documented guarantee otherwise.
