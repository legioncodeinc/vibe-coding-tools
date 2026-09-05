# 02. Events, autocapture, identify, and alias

## Autocapture vs manual events - the default posture

Leave autocapture on for broad, zero-effort coverage (clicks, form submits, pageviews, dead clicks, rage clicks), but never rely on it for growth-critical events - it "won't give you a reliable `user_signed_up` event." Explicitly instrument signup, purchase, and key feature-usage events as custom events regardless of autocapture status [raw/posthog--autocapture--config-vs-manual-events.md]. Turn autocapture off (fully, or scoped via `url_allowlist`/`css_selector_ignorelist`/etc.) when: cost matters at scale, the UI's DOM/copy changes often enough that autocapture's element-text-based naming drifts underneath you, or the product is backend-heavy where UI clicks aren't the meaningful signal. Config surface and disable pattern: `references/../references/research/raw/posthog--autocapture--config-vs-manual-events.md`.

## Event and property naming - pick one convention, enforce it

Two official patterns exist in PostHog's own docs and are not reconciled by PostHog itself - `category:object_action` snake_case (the dedicated best-practices guide) vs `[object] [verb]` plain English (used throughout every SDK's own code samples). Full comparison and the recommended reading: `references/property-naming-table.md` and `references/research/distilled-posthog.md` §5. Hard rules regardless of which convention: never interpolate a variable into an event/property **name** (unbounded event definitions, possible rate limiting); version an event's name when its meaning changes materially rather than silently redefining it; use a static `[object] [verb]`-or-`category:object_action` name with the variable data as a property **value** instead [raw/posthog--event-taxonomy--naming-properties-best-practices.md].

## Backend vs frontend tracking for the same action

Prefer backend tracking wherever precision matters (signup counts, revenue events) since frontend capture can be blocked or interrupted; when tracking the same real action from both layers, use **different event names** (`user created` backend, `user signed up` frontend) to avoid double-counting, optionally disambiguated with a `source` property [raw/posthog--event-taxonomy--naming-properties-best-practices.md].

## identify() - required, not optional

```javascript
posthog.identify(user.id, { email: user.email, name: user.name })
```

Call as soon as the signed-in user is known (every app load once known, and directly after login). This merges the anonymous pre-login person into the identified person, so events before and after login stay on one profile. Redundant `identify()` calls with unchanged data are no-ops (no extra `$identify` fired); a call with changed properties fires only a `$set` event, not a duplicate `$identify` [raw/posthog--identify--alias-identity-resolution.md, raw/posthog--cost-control--billing-sampling-estimation.md].

Carry the same `distinct_id` to every backend `capture()` call for that user - backend SDKs have no session/anonymous concept, so there's no automatic merge server-side; the ID has to be passed through explicitly (via auth session, request header, or an argument) [raw/posthog--identify--alias-identity-resolution.md].

Reset on logout, always: `posthog.reset()` - prevents the next user of a shared device from inheriting the prior user's identity via shared cookies.

## alias() - when the primary ID isn't available in a given context

```javascript
posthog.alias('alias_id', 'distinct_id')
```

Use when a distinct ID used in one context (e.g. frontend) isn't accessible in another (e.g. a specific backend job) and the two need to resolve to the same person. Constraints: an alias ID cannot already map to more than one `distinct_id`, and cannot have been used as a prior `identify()`/`alias()` distinct_id argument - violating either fails the merge silently [raw/posthog--identify--alias-identity-resolution.md].

## The blocked-ID list - a real, silent failure mode

PostHog rejects certain distinct ID values during merges with no error surfaced: `null, undefined, None, 0, anonymous, guest, distinct_id, id, email, true, false, [object Object], NaN`, empty strings, and quoted variants of all of these. If application code could ever generate one of these as a literal ID (e.g. the string `"null"`), person merges fail silently and identities fragment with no error message anywhere. Use UUIDs, or validate against this list before calling `identify()`/`alias()` [raw/posthog--identify--alias-identity-resolution.md].

## Verifying identity is wired correctly

On any real test user's PostHog person profile, confirm: exactly one person record (search by email - two records means a merge never happened); every expected distinct ID (anonymous + identified) under the Distinct IDs tab; events from both browser and server SDKs on the same timeline; a `$identify` event showing both the anonymous and identified IDs. Two separate person records for one human means an `identify()`/`alias()` call is missing or fired too late somewhere in the flow [raw/posthog--identify--alias-identity-resolution.md].

## Anonymous vs identified - a cost and capability tradeoff, not just a philosophical one

Identified events cost up to 4x more than anonymous events, but unlock person properties, cohorts, Lifecycle insights, person-property targeting for flags/experiments/surveys, and group analytics. Default config `person_profiles: 'identified_only'` captures anonymous by default and only becomes identified once `identify()`/`alias()`/`group()`/`setPersonProperties()` fires - the one exception is `setPersonPropertiesForFlags()`, which does NOT create a profile, letting flag targeting use person properties on a still-anonymous user [raw/posthog--identify--alias-identity-resolution.md, raw/posthog--cost-control--billing-sampling-estimation.md]. Server-side system/cron/background events should almost never be identified against a shared literal distinct ID (`"system"`, `"cron"`) - set `$process_person_profile: false` on those events instead, both for cost and to avoid a single profile absorbing unrelated automated-job events (which also risks the ~5,000 events/min per-distinct-ID rate limit) [raw/posthog--identify--alias-identity-resolution.md].
