# Event and property naming reference

Grounded in [raw/posthog--event-taxonomy--naming-properties-best-practices.md]. Two official patterns exist in PostHog's own docs (see distilled-posthog.md §5 for the full conflict discussion) - pick one and enforce it project-wide; do not mix.

## Pattern A: `category:object_action` (dedicated best-practices guide, recommended for a from-scratch taxonomy)

| Element | Rule | Example |
| --- | --- | --- |
| Case | lowercase only | `signup_flow` not `SignupFlow` |
| Verb tense | present tense | `click`/`submit`/`create`, not `clicked`/`submitted`/`created` |
| Separator | snake_case | `signup_button_click` |
| Event shape | `category:object_action` | `account_settings:forgot_password_button_click`, `signup_flow:pricing_page_view` |
| Allowed verb list (maintain a fixed list, don't deviate) | click, submit, create, view, add, invite, update, delete, remove, start, end, cancel, fail, generate, send | |

## Pattern B: `[object] [verb]` plain English (used throughout every SDK's own code samples)

| Example | Notes |
| --- | --- |
| `project created` | backend CRUD event |
| `user signed up` | frontend growth event |
| `invite sent` | |

This is the pattern that appears in essentially every PostHog SDK doc's own capture examples (`posthog.capture('user_signed_up', ...)` in send-events, capture-events, and every language's Node/Python/PHP/Ruby/Go sample). Simpler to write, less structured for large event catalogs.

## Property naming (applies under either event-name pattern)

| Property type | Rule | Example |
| --- | --- | --- |
| General | `object_adjective` pattern | `user_id`, `item_price`, `member_count` |
| Boolean | `is_`/`has_` prefix | `is_subscribed`, `has_seen_upsell` |
| Date/timestamp | `_date`/`_timestamp` suffix | `user_creation_date`, `last_login_timestamp` |

## Frontend vs backend event names for the same action

Use **different** event names for the same real-world action captured on both sides, to avoid double-counting; typically the CRUD-shaped name on the backend and the user-facing name on the frontend, optionally disambiguated with a `source` property:

| Layer | Event name |
| --- | --- |
| Backend | `user created` |
| Frontend | `user signed up` |

[raw/posthog--event-taxonomy--naming-properties-best-practices.md]

## Hard rules (apply regardless of naming scheme chosen)

- Never interpolate a variable into an event or property **name** - use a static name plus a property **value** instead (`page_viewed` + `{ page_name: pageName }`, never `` `page_viewed_${pageName}` ``). Interpolated names create unbounded event/property definitions and can trigger rate limiting on new property definitions.
- Version an event's name when its meaning changes materially (`registration_v2:sign_up_button_click`) rather than silently redefining the old event.
- Growth events (signup, purchase, activation) are always explicit custom events, never left to autocapture.
- `distinct_id` values must be stable, unique, and consistent in format across web/mobile/backend - see identify raw file for the full blocked-ID list and merge-failure modes.

## Group type naming (B2B / group analytics)

| Rule | Example |
| --- | --- |
| Singular group type names | `company`, not `companies` |
| Unique IDs (not display names) as group keys | a UUID or database ID, not `"Acme Corp"` |
| Max 5 group types per project | `company`, `project`, `channel`, ... |

[raw/posthog--group-analytics--b2b-frontend-backend.md]
