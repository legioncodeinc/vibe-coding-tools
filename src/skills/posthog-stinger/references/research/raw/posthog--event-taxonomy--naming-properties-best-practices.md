# PostHog event naming taxonomy and property design (official recommended conventions)

- URL: https://posthog.com/docs/product-analytics/best-practices ; https://posthog.com/docs/product-analytics/capture-events ; https://posthog.com/docs/product-analytics/schema-management
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Product analytics

## Content

### 1. Start with growth events

Track signup/subscription/purchase events explicitly - do not rely on autocapture for these. Track from both frontend and backend:

```javascript
posthog.capture('user_signed_up', {
  signup_method: 'email',
  referral_source: 'google',
  plan: 'free',
})
```

### 2. Naming convention (the official "suggested naming guide")

- Lowercase letters only.
- Present-tense verbs ("submit"/"create", not "submitted"/"created").
- Snake case, e.g. `signup_button_click`.
- Maintain a dedicated allowed-verb list; common ones: `click, submit, create, view, add, invite, update, delete, remove, start, end, cancel, fail, generate, send`.
- **Event names**: `category:object_action` framework - category = context (`account_settings`, `signup_flow`), object = the noun/component/location (`forgot_password_button`, `pricing_page`), action = verb (`click`, `submit`, `create`). Combined: `account_settings:forgot_password_button_click`, `signup_flow:pricing_page_view`.
- **Property names**: `object_adjective` pattern (`user_id`, `item_price`, `member_count`). Boolean properties get `is_`/`has_` prefixes (`is_subscribed`, `has_seen_upsell`). Date/timestamp values get `_date`/`_timestamp` suffix (`user_creation_date`, `last_login_timestamp`).

Note: elsewhere in the docs (capture-events, send-events, Node SDK) PostHog's own snippets consistently use a **separate, simpler convention**: `[object] [verb]` in plain words - `project created`, `user signed up`, `invite sent`. This is the pattern used pervasively across every SDK's own code samples for event names, distinct from the `category:object_action` snake_case framework in the best-practices guide. **Conflict/overlap, stated plainly**: the best-practices article's `category:object_action` snake_case guidance and the pervasive `[object] [verb]` plain-English pattern used in every other doc's own examples are two different recommended shapes from official PostHog sources. Prefer `category:object_action` (or a single consistent snake_case scheme) for a from-scratch taxonomy since it's the dedicated best-practices guidance, but note that PostHog's own SDK docs default to the simpler plain-English form throughout - either is "officially" modeled somewhere; what matters most per the same guide is picking ONE convention and enforcing it project-wide.

### 3. Prefer backend to frontend tracking

Backend analytics are more reliable: (1) many users have client-side tracking blocked, (2) frontend JS execution can be interrupted (network/CORS/browser settings), (3) full control over backend implementation. Guidance:
- Use frontend for: user journeys/page sequences, click/scroll/form interactions, client-side performance timing (partial data acceptable).
- Use backend (or query the DB) for: precise counts (e.g. signups this week), analysis alongside other business metrics.
- General rule: **track on both frontend and backend whenever possible**, using **different event names for frontend vs backend** to avoid double counting (e.g. backend `user created`, frontend `user signed up`), optionally filtered via a `source` property.

### 4. Design distinct IDs carefully

Common mistakes: catch-all IDs (`"system"`, `"backend"`) funnel unrelated events into one person profile, risk a per-distinct-ID rate limit (~5,000 events/min) after which ordering and profile updates degrade, and cost more (identified events cost more, see cost-control raw file); inconsistent ID formats across platforms (`"user-456"` vs `"USER-456"`) create two separate people; failing to call `identify()` at the right time leaves pre-login events unlinked. Full guidance lives in identity resolution (see identify raw file).

### 5. Version your events

When an event's meaning changes materially (e.g. registration flow revamp), introduce a new event name with a version suffix (`registration_v2:sign_up_button_click`) rather than silently redefining the old one - preserves historical continuity and enables clean before/after comparison.

### 6. Keep event and property names static (do not interpolate)

```javascript
// Bad - creates a new event definition for every page
posthog.capture(`page_viewed_${pageName}`)

// Good - one event, filterable by page name
posthog.capture('page_viewed', { page_name: pageName })
```

Same applies to property names: `feature_${featureName}_used` creates unbounded property definitions. Use a static property name with a dynamic value instead. Projects with too many unique property names can have new property definitions rate-limited, meaning new properties stop appearing in filters/breakdowns.

### 7. Client-side event buffering / ordering guarantees

PostHog guarantees ordering only for: same `distinct_id` within one API call, and same `distinct_id` across sequential calls where you await each response before sending the next (SDKs handle this internally for a single instance). Beyond that, ordering is not guaranteed - most web/server events ingest within 60s, but mobile can delay hours/days (backgrounded, offline, OS-deferred). Design analysis around event timestamps, not ingestion order; `$set` reflects the last-ingested value (not last-by-timestamp), `$set_once` is claimed by the first-ingested event.

### 8. Filter out internal users

Filter by internal email domain, an `is_employee`/`is_test_user` property, internal IP exclusion, host/domain filtering (exclude `localhost:3000`, `staging.yourapp.com`), or disabling tracking entirely in dev via a config check.

### 9. Recommended tip repeated across docs: `[object] [verb]` event name format

"We recommend using a `[object] [verb]` format for your event names, where `[object]` is the entity the behavior relates to, and `[verb]` is the behavior itself. For example, `project created`, `user signed up`, or `invite sent`." [capture-events, send-events - repeated verbatim across every SDK's docs page]

### Schema management (optional typed layer)

PostHog supports defining event schemas with typed property groups before any events are captured: Data Management > Events > Create event (name, description, owner, tags - **event names cannot be changed after creation**), and Data Management > Property Groups (reusable typed property collections: String/Number/Boolean/Object, required flag, description) attached to one or more events. Generates typed code for autocomplete/type-safety; `posthog.json` and generated types should be committed to version control. Best practices: define critical conversion events' schemas first; don't over-schema every event.

### Setting event properties (mechanics)

```javascript
posthog.capture('plan_purchased', {
  price: 100,
  plan_frequency: 'monthly',
  features: { SSO: true, 'Custom branding': true, 'Custom domains': false },
})
```

No limit on the number of properties per event; recommendation is to include more properties than strictly needed at capture time since they can't be added retroactively to already-sent events.
