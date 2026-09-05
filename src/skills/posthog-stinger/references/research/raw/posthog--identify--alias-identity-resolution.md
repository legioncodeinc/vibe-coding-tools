# PostHog identify/alias and anonymous-to-identified user stitching

- URL: https://posthog.com/docs/product-analytics/identify ; https://posthog.com/docs/product-analytics/identity-resolution ; https://posthog.com/docs/data/anonymous-vs-identified-events
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Identify / Person profiles

## Content

### How identification works (layered model)

1. **Anonymous** - first visit assigns an anonymous ID, stored locally; events captured anonymously; tracked across sessions if the user opted into tracking.
2. **Identified on the frontend** - calling `identify(distinct_id, properties)` (typically at login/account creation) merges the anonymous person into the identified person, linking both IDs; looking up by either ID surfaces the full history from before and after login.
3. **Carried to the backend** - pass the same `distinct_id` into server-side capture calls. Backend SDKs have no concept of an anonymous session, so there's nothing to merge server-side; some backend SDKs expose `identify`, others set person properties via `$set` on a `capture` call.

```javascript
// Web
posthog.identify(
  'distinct_id', // stable ID: UID, database ID, or (fallback) email
  { email: 'max@hedgehogmail.com', name: 'Max Hedgehog' } // optional person properties
)
```

```javascript
// Node.js - carry the same distinct_id used on the frontend
client.capture({
  distinctId: 'distinct_id',
  event: 'event_name',
  properties: {
    $set: { email: 'max@hedgehogmail.com', name: 'Max Hedgehog' },
  },
})
```

`$set`/`$set_once` are NOT stored on the event itself - they only tell PostHog how to update person data during ingestion. You cannot filter/breakdown/query events by `$set` values; use person properties for that.

### Reset on logout

```javascript
posthog.reset()       // unlink events on this device from this person
posthog.reset(true)   // also reset device_id, treating the device as new
```

Strongly recommended even if users are not expected to share a computer - prevents cross-user data pollution on shared machines.

### Best practices for identify

1. Call `identify` as soon as possible - typically on every app load once the signed-in user is known, and directly after login. Only needs to be called once per session; redundant calls with unchanged data are ignored (idempotent no-op on the `$identify` event, though a `$set` fires if properties changed).
2. Use unique, stable distinct IDs - collisions (weak ID generation, or bugs producing generic IDs like `null`/`true`/`distinctId`) merge unrelated users. PostHog blocks known-bad literal distinct IDs during merges (see below).
3. Pass all available person properties on each `identify` call so the profile stays current.

### Alias: multiple distinct IDs for one user

Use when the frontend's distinct ID isn't available in a given backend context:

```javascript
// Web
posthog.alias('alias_id', 'distinct_id')

// Node.js
client.alias({ distinctId: 'distinct_id', alias: 'alias_id' })
```

Constraints: an alias ID cannot already be associated with more than one distinct_id, and it must not have been previously used as the `distinct_id` argument of a prior `identify()`/`alias()` call. Frontend `alias()` calls also merge any properties already set on the anonymous user into the target user.

### Cross-platform stitching (web to mobile deep link pattern)

1. `posthog.get_distinct_id()` on web returns the current (possibly anonymous) distinct ID.
2. Append it to a deep link as a query param.
3. On mobile: if already authenticated, call `posthog.alias(webDistinctId)` to associate the two IDs to one person; if unauthenticated, call `posthog.identify(webDistinctId)` to reuse the web ID until the user logs in on mobile, then call `identify(canonicalUserId)`.

### Illegal / blocked distinct IDs

PostHog silently rejects these values during person merges: `null, undefined, None, 0, anonymous, guest, distinct_id, id, email, true, false, [object Object], NaN`, empty strings, and quoted variants of all of these. If your app could generate an ID colliding with one of these (e.g. the literal string `"null"`), merges fail **silently** with no error - use UUIDs or validate against this blocklist. This directly overlaps with the taxonomy guide's "design distinct IDs carefully" warning.

### Identity resolution - core engineering framing

"Identity resolution is your engineering problem - PostHog consumes what you give it. If your identity data is incoherent, every downstream feature inherits that incoherence." [identity-resolution]

Golden path: assign a stable ID early, mint it in one place, pass it to every environment (web, mobile, server) unchanged. Link IDs explicitly - PostHog can merge what you tell it to merge; it cannot infer two IDs belong to the same person.

### Symptom -> root cause table (identity bugs)

| Symptom | Root cause |
| --- | --- |
| Feature flag value differs before/after login | Hash input (distinct ID) changed |
| Experiment: user appears in both control and test | Two unlinked persons, each independently assigned a variant |
| Experiment: exposure recorded but conversion missing | Exposure logged on the anonymous ID, conversion logged on the identified ID (no merge in between) |
| Session replay recording breaks mid-session | `distinct_id` changed mid-session without a linking `identify()`/`alias()` call |
| Funnels attribute conversion to the wrong user | Events split across unlinked persons |
| Error tracking shows many "phantom" one-error users | Transient/regenerated IDs creating a new person per error instead of a stable ID |

Fix in every case is upstream: link IDs before the events that need to be connected.

### Catch-all distinct IDs are a cost and correctness problem

Sending server-side system/cron/background-job events under a shared distinct ID (`"system"`, `"backend"`) with person processing enabled funnels everything into a single person profile, which: crosses the per-distinct-ID rate limit under sustained volume (events aren't dropped, but ordering and profile updates degrade for the spike duration); costs up to 4x more per event (identified vs anonymous, see cost-control raw file); and produces an unusable, cross-contaminated profile. Fix: set `$process_person_profile: false` on these events so no person lookup/profile happens:

```javascript
posthog.capture('batch_job_completed', {
  job_name: 'nightly_sync',
  duration_ms: 4500,
  $process_person_profile: false,
})
```

If the event should attach to a real user (e.g. a job running on a user's behalf), use that user's actual distinct ID instead of a shared literal.

### How to verify identity implementation is correct

On a given real user's PostHog person profile: (1) exactly one person record, not two (search by email); (2) all expected distinct IDs (anonymous + identified) appear under the Distinct IDs tab; (3) events from every SDK (browser + server) appear on one timeline; (4) a `$identify` event exists showing both the anonymous and identified distinct IDs, confirming the merge fired. Two separate person records for one real human means an `identify()`/`alias()` call is missing or fired too late.

### Anonymous vs identified events - cost and capability matrix

| | Anonymous | Identified |
| --- | --- | --- |
| Person profile created | No | Yes |
| Relative cost | Baseline (up to 4x cheaper) | Up to 4x anonymous cost |
| Can set person properties / build cohorts / use Lifecycle insights / target flags-experiments-surveys on person properties / query persons table / use group analytics | No | Yes |
| Best use case | Marketing/content sites, logged-out B2C | B2B/B2C SaaS logged-in users, growth/marketing conversion analysis |

Client `person_profiles` config: `'identified_only'` (default, recommended) captures anonymous by default, only creates identified events once a profile exists (via `identify()`, `alias()`, `group()`, `setPersonProperties()`, `setGroupPropertiesForFlags()` - note `setPersonPropertiesForFlags()` is the one exception that does NOT create a profile, letting you target flags on anonymous-user properties); `'always'` captures every event as identified. Backend SDKs/API capture identified events by default; set `$process_person_profile: false` per-event to force anonymous.

Once identified, ALL future events for that distinct ID are identified and billed as such; past (pre-identify) events stay billed as anonymous. `reset()` unlinks the profile and creates a new anonymous distinct ID going forward; reusing the old identified distinct ID after `reset()` still counts as identified.
