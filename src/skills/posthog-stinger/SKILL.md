---
name: "posthog-stinger"
description: "PostHog for SvelteKit: install, pageview tracking, autocapture vs manual events, identify/alias, feature flags, experiments, replay, surveys, groups, Vercel proxy, EU/US residency, cost control."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: posthog-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: posthog-js + posthog-node
---

# PostHog Stinger

You are equipping **posthog-worker-bee**, the Hive's PostHog specialist. This skill covers PostHog end to end for a SvelteKit (Svelte 5) app on Vercel: client and server SDK install, pageview tracking under SvelteKit's router, autocapture vs manual events, event/property naming, identify/alias identity stitching, feature flags (client, server, local evaluation, bootstrapping), experiments, session replay privacy and cost, surveys, group analytics for B2B, the Vercel reverse proxy, EU/US data residency, and cost control.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a PostHog fact from training data - if it is not in the archive, it is not a fact yet. Where the research surfaced a conflict or a gap (event-naming convention conflict, no confirmed sampling feature, SvelteKit-specific middleware interaction unconfirmed), it is stated plainly in `references/research/distilled-posthog.md` rather than smoothed into a guess.

## When to use this skill

- Installing PostHog into a SvelteKit app: client (`posthog-js`) init, server (`posthog-node`) init, CSP requirements
- Getting pageview tracking working correctly under SvelteKit's client-side router (the classic "SPA pageviews are broken" problem)
- Deciding autocapture vs manual events, or tuning/disabling autocapture
- Designing an event and property naming taxonomy
- Wiring `identify()`/`alias()` and reasoning about anonymous-to-identified user stitching
- Feature flags: client-side, server-side, local evaluation, or bootstrapping to avoid flicker
- Setting up or reading results from an experiment/A-B test
- Session replay: privacy masking configuration, or reasoning about replay cost
- Surveys: targeting, display conditions, response capture
- Group analytics for a B2B product (company/org/team-level analysis)
- Setting up a reverse proxy on Vercel to avoid ad-blocker interference
- Choosing EU vs US PostHog Cloud, or reasoning about GDPR/data-residency posture
- Reducing PostHog cost: event volume, autocapture tuning, billing limits

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-posthog.md` | Verifying any PostHog claim fast, or resolving a conflict (see its Gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-install-and-pageview-tracking.md` | First-time SvelteKit install, or SPA pageview tracking isn't working |
| `guides/02-events-and-identify-alias.md` | Event/property naming, or identify/alias/anonymous-user stitching |
| `guides/03-feature-flags-and-experiments.md` | Feature flags (client/server/local eval/bootstrap) or experiments |
| `guides/04-session-replay-and-surveys.md` | Session replay privacy/cost, or surveys |
| `guides/05-group-analytics-and-reverse-proxy.md` | B2B group analytics, or the Vercel reverse proxy |
| `guides/06-cost-control-and-data-residency.md` | EU vs US cloud, GDPR, or reducing PostHog cost |
| `references/client-init-and-pageview-tracking.md` | Copy-paste `+layout.js` init + pageview tracking |
| `references/server-capture-hooks-server.md` | Copy-paste `posthog-node` server capture pattern |
| `references/vercel-reverse-proxy.md` | Copy-paste `vercel.json` rewrites (managed vs self-hosted) |
| `references/feature-flag-bootstrap.md` | Copy-paste server-evaluate-then-bootstrap pattern to avoid flag flicker |
| `references/property-naming-table.md` | Event/property naming field tables |
| `references/env-var-checklist.md` | Full env var table and region-consistency checklist |

## Known gaps - read before claiming these facts

- **Event-naming convention conflict**: PostHog's dedicated best-practices guide recommends `category:object_action` snake_case, but every other SDK doc's own code samples use `[object] [verb]` plain English. Not reconciled by PostHog itself. Full comparison: `references/research/distilled-posthog.md` §5.
- **No confirmed PostHog-native sampling feature.** Do not claim one exists. See `references/research/distilled-posthog.md` §14 and `guides/06-cost-control-and-data-residency.md`.
- **SvelteKit `hooks.server.ts` interaction with `vercel.json` rewrites** was not directly confirmed in research (only the Next.js `middleware.ts` case was documented). Treat as likely-fine, verify empirically. See `references/research/distilled-posthog.md` §12.

## Quality bar

A PostHog task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, region consistency (EU/US) was checked across every endpoint touched, and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [sentry-stinger](../sentry-stinger) - Error and exception tracking, performance tracing, and error-context session replay. PostHog owns product analytics, feature flags, experiments, and product-behavior session replay; Sentry owns crashes, unhandled exceptions, and performance traces. Both ship a replay feature: PostHog's is for understanding product usage, Sentry's is for reproducing a bug. Do not conflate the two.
  - [devops-stinger](../devops-stinger) - Vercel reverse proxy rewrites, CI/CD, and general deployment pipeline concerns. Consult when the reverse proxy setup needs to be wired into the app's broader deployment/CI configuration, not just PostHog's own `vercel.json` block.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline below.
  - [auth-stinger](../auth-stinger) - Provider-agnostic authentication implementation. Consult when `identify()`/`alias()` timing needs to line up with the app's actual login/session flow, since PostHog's identity model assumes a stable ID sourced from auth.
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Svelte 5 + SvelteKit UI enforcement. Consult when building a custom survey UI, a feature-flag-gated UI variant, or reasoning about where `afterNavigate` pageview-tracking code belongs in the component tree.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
