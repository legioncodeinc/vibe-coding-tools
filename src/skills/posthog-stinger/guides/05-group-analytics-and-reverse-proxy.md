# 05. Group analytics (B2B) and the Vercel reverse proxy

## Group analytics - billing gotcha comes before implementation

Group analytics is a **paid add-on**, and once enabled it bills against **all** identified events in the project, not just the ones carrying group properties - because turning it on activates infrastructure that processes every identified event for group-level aggregation. Billing starts the moment the add-on is enabled on the billing page, not when group code ships in the app, and stops only when unsubscribed from the billing page (removing the code does not stop billing) [raw/posthog--group-analytics--b2b-frontend-backend.md]. Surface this cost implication to whoever owns the billing decision before wiring group code into a B2B app - it is easy to enable accidentally while exploring the feature and forget it's now billing against the entire identified-event volume.

Up to 5 group types per project (e.g. `company`, `project`, `channel`), unlimited groups within each type. Groups differ from cohorts: groups aggregate events and require app code; cohorts are user sets defined inside PostHog with zero code - use cohorts if the need is just "a list of users sharing a trait" [raw/posthog--group-analytics--b2b-frontend-backend.md].

## Frontend vs backend group association - genuinely different mechanics, not just syntax

| | Frontend (`posthog-js`) | Backend (`posthog-node`) |
| --- | --- | --- |
| Association model | `posthog.group(type, key)` called once; the SDK is stateful (session-based) and auto-associates every subsequent event in that session | Stateless - every relevant `capture()` call needs an explicit `groups: { type: key }` |
| Property updates | Side effect of calling `group()` again with new properties | Only via a separate `groupIdentify()` call - cannot be updated from `capture()` |
| Cleanup on logout | `posthog.reset()` (unlinks user + group) or `posthog.resetGroup()` (group only, keeps the user identity) | Not needed - there's no session state to reset |

This asymmetry exists because PostHog models everything as events tied to an identity, and only the frontend SDK is stateful enough to implicitly carry a "current group" across calls within one browser session [raw/posthog--group-analytics--b2b-frontend-backend.md]. SvelteKit server-side code (load functions, form actions, `hooks.server.ts`) always follows the backend pattern - pass `groups` explicitly on every capture. Full snippet: `references/server-capture-hooks-server.md`.

Events must be identified (`$process_person_profile` not `false`) to link to a group at all - an anonymous event with group data attached still won't associate with the group [raw/posthog--group-analytics--b2b-frontend-backend.md]. One event can carry only one group per group **type** (can't attach two different `company` IDs to one event), but can carry multiple different group **types** simultaneously (`company` + `channel` on the same event is fine) [raw/posthog--group-analytics--b2b-frontend-backend.md].

## Reverse proxy on Vercel - pick managed or self-hosted, not both

Two options, full setup detail in `references/vercel-reverse-proxy.md`:

1. **Managed reverse proxy** (recommended default) - free, PostHog-hosted through Cloudflare, no Vercel egress cost, SSL/DNS handled by PostHog. Not HIPAA-compliant.
2. **Self-hosted via `vercel.json` rewrites** - three ordered rules (static asset rule and remote-config `array` rule must precede the catch-all rule, since Vercel evaluates rewrites top-to-bottom), counts against Vercel's Fast Data Transfer/Edge Requests billing, with session recordings as the dominant driver of that cost [raw/posthog--reverse-proxy--vercel-and-managed.md].

Either way, never use an obvious analytics-sounding path/subdomain (`/analytics`, `/tracking`, `/posthog`) - ad blockers specifically target those literal strings, defeating the point of proxying [raw/posthog--reverse-proxy--vercel-and-managed.md].

## Why a proxy at all - the actual mechanism, not just "it helps"

Ad blockers work off static domain blocklists that catalog well-known analytics domains like `posthog.com` subdomains. Routing PostHog traffic through the app's own domain instead sidesteps that blocklist entirely, since the app's domain was never cataloged as an analytics endpoint - PostHog's own stated effect is "typically increases event capture by 10-30% depending on your user base" [raw/posthog--reverse-proxy--vercel-and-managed.md]. The gap: DNS-level "uncloaking" resolvers (not browser extensions) can follow a CNAME chain back to a known target and block anyway, but this only affects users on specific privacy-focused DNS setups, not the general population blocked by browser extension blocklists.

## Region consistency is the #1 proxy failure mode

Every endpoint touched by the integration - client `api_host`, server `host`, both `ui_host` values, and any proxy rewrite destinations - must consistently target the same PostHog region (US or EU). A region mismatch produces 401 errors that otherwise look like an auth/token problem [raw/posthog--reverse-proxy--vercel-and-managed.md]. Checklist: `references/env-var-checklist.md`.
