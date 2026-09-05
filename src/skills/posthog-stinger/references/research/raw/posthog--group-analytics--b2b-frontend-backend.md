# PostHog group analytics for B2B products: setup, frontend vs backend implementation, billing

- URL: https://posthog.com/docs/product-analytics/group-analytics ; https://posthog.com/tutorials/frontend-vs-backend-group-analytics
- Fetched: 2026-08-14
- Source type: Official docs / official tutorial
- Component: Group analytics (paid add-on)

## Content

### What it is

Group analytics aggregates events by an entity (company, organization, project, channel) instead of individual users - useful for B2B activation/retention analysis, project-level rollouts, or any "team as the unit of analysis" question. Group types (categories like "company") are capped at **5 per project**; individual groups within a type are unlimited. Enables: feature flags targeted at an entire org, group-level experiments, metrics like daily active companies / company churn rate.

### Billing (important cost gotcha)

Group analytics is a **paid add-on**. Once subscribed, billing applies to **all identified events in the project**, not just events carrying group properties - because enabling it turns on infrastructure that processes every identified event for group-level analysis. Billing starts the moment the add-on is enabled from the billing page (not when group code is added to the app), and stops only when unsubscribed from the billing page (removing the code from the app does not stop billing).

### Groups vs cohorts

Groups aggregate events and don't have to be connected to users; they require app code to set up. Cohorts are user sets defined inside PostHog with no code. Use cohorts if the only need is "a list of users sharing a trait" - simpler and faster.

### Setup: create group types and identify groups

```javascript
// Web (JS) - creates the group type if it doesn't exist, sends $groupidentify
posthog.group('company', 'company_id_in_your_db')
posthog.capture('user_signed_up') // associated with the company above

// Or, manually attach to a specific capture without relying on session state:
posthog.capture('user_signed_up', { '$groups': { company: 'company_id_in_your_db' } })
```

```javascript
// Node.js - no session concept, so groupIdentify + explicit groups on every capture
posthog.groupIdentify({
  distinctId: 'user_distinct_id',
  groupType: 'company',
  groupKey: 'company_id_in_your_db',
})
posthog.capture({
  event: 'user_signed_up',
  distinctId: 'user_distinct_id',
  groups: { company: 'company_id_in_your_db' },
})
```

Group key tips: use singular type names (`"company"` not `"companies"`); use unique IDs (not display names, which can collide) as group keys; max 5 group types per project; unlimited groups per type.

### Setting group properties

```javascript
// Web - option 1 (recommended): via group(), also links the session to the group
posthog.group('company', 'company_id_in_your_db', {
  name: 'PostHog', // special: used as display name in the UI, falls back to the key if absent
  subscription: 'premium',
  date_joined: '2020-01-23',
})

// Node.js
posthog.groupIdentify({
  groupType: 'company',
  groupKey: 'company_id_in_your_db',
  properties: { name: 'PostHog', subscription: 'premium', date_joined: '2020-01-23' },
})
```

A group needs at least one property set to appear in the People and groups tab. Group properties behave like person properties: usable in experiments and feature-flag targeting.

### Multiple groups per event

An event can be linked to only ONE individual group per group **type**, but to multiple group **types** simultaneously:

```javascript
// Not possible - two different companies on one event
posthog.group('company', 'company_id_in_your_db')
posthog.group('company', 'another_company_id_in_your_db')

// Allowed - different group types
posthog.group('company', 'company_id_in_your_db')
posthog.group('channel', 'channel_id_in_your_db')
posthog.capture('user_signed_up')
```

### Events must be identified to link to a group

If `$process_person_profile` is `false` on an event (i.e. anonymous), the event will NOT link to a group even if group data is attached - group linkage requires an identified event.

### Frontend vs backend implementation differences (why they diverge)

Core framing: PostHog thinks of a group as "a set of events related to a group identity," the same way a person is "a set of events related to a person identity" - this reframing explains the frontend/backend asymmetry.

- **Frontend (stateful/session-based)**: `posthog.group()` is called once and the JS SDK automatically associates every subsequent event in that browser session with the group - an abstraction the frontend SDK provides. Because sessions link users and groups together, you must call `posthog.reset()` on logout (or `posthog.resetGroup()` to reset only the group, keeping the user) so the next session doesn't inherit the prior user's group association.
- **Backend (stateless, no session concept)**: every single `capture()` call must explicitly pass the group info via the `groups` parameter (transformed to the API-level `$groups` property) - there is no "call once, applies to everything after" behavior server-side. No `reset()` is needed on the backend since there's no session state to reset; group data can be attached ad hoc wherever/whenever needed per request.
- Group **properties** cannot be updated from a `capture()` call on the backend - only via the separate `group_identify` call. (Frontend can update properties as a side effect of `posthog.group(...)` itself.) Because PostHog currently stores groups separately from events (a migration to merge them is anticipated but not yet shipped per this tutorial), calling `group_identify` does NOT retroactively update the group details attached to past events - call it whenever group properties actually change to keep future events accurate.

### Cross-product use of groups (once configured)

| Product | Group functionality |
| --- | --- |
| Product analytics | Aggregate trends/funnels/retention/stickiness by group |
| Feature flags | Release conditions targeted by group |
| Experiments | Evaluate results at group-level aggregation (group-targeted experiments) |
| Data warehouse | Join/enrich SQL queries with groups data |

### Limitations (explicit)

Max 5 group types per project; group types can be deleted but individual groups cannot; a group type isn't supported for Lifecycle insights or user paths; only groups with at least one known property show in the People/groups tab; one event cannot carry two individual groups of the same type simultaneously.
