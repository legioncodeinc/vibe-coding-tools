---
name: "sentry-stinger"
description: "Sentry error tracking for SvelteKit on Vercel - client/server hooks, source maps and releases, tracing sampling, session replay, PII scrubbing, alert tuning, and cost control."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: sentry-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: SvelteKit SDK
---

# Sentry Stinger

You are equipping **sentry-worker-bee**, the Hive's Sentry specialist. This skill covers Sentry error and performance monitoring end to end for the Hive's default stack: SvelteKit (Svelte 5) deployed on Vercel, with Neon Postgres as the database. It is weighted toward the practical wiring a SvelteKit app actually needs: client/server SDK setup, source maps and releases on Vercel, tracing sampling strategy, session replay with its privacy defaults, PII scrubbing, alert tuning, and cost control.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a Sentry fact from training data - if it is not in the archive, it is not a fact yet. Where the research is thin or a source conflicts with another, the distillation says so explicitly - read `references/research/distilled-sentry.md`'s Gaps section before treating any single guide as exhaustive.

## When to use this skill

- Setting up Sentry in a SvelteKit app for the first time - client hooks, server hooks, and the Vite plugin
- Wiring source map upload and release/commit association into a Vercel build
- Deciding `tracesSampleRate` vs. `tracesSampler`, and what a specific number should actually be
- Turning on Session Replay and setting its sample rates and privacy/masking configuration
- Writing or auditing a `beforeSend` PII-scrubbing function
- Tuning issue alert rules so they don't turn into ignorable noise
- Deciding whether to use Sentry's Vercel "Releases and Source Map Integration" or the newer Vercel Marketplace integration
- Distinguishing handled vs. unhandled errors for triage and alert severity
- Managing event quota, Spike Protection, and the tradeoff between SDK sample rate and server-side rate limits

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-sentry.md` | Verifying any Sentry claim fast, or resolving a conflict (see its Gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-sveltekit-sdk-setup.md` | First-time SDK install: client hooks, server hooks, the runtime constraint on Vercel Edge |
| `guides/02-sourcemaps-and-releases-vercel.md` | Source map upload, the Vercel-integration auth-token failure mode, release/commit association |
| `guides/03-performance-tracing-and-sampling.md` | Choosing `tracesSampleRate` vs. `tracesSampler`, and an actual number |
| `guides/04-session-replay-and-pii-scrubbing.md` | Turning on Session Replay, its privacy defaults, and PII scrubbing generally |
| `guides/05-alerting-without-noise.md` | Tuning issue alert rules so they stay actionable |
| `guides/06-cost-control-and-triage.md` | Event quota, Spike Protection, sample-rate-vs-rate-limit tradeoffs, handled vs. unhandled triage |
| `references/hooks-server-pattern.md` | Copy-paste `hooks.server.ts` + `instrumentation.server.ts` + `svelte.config.js` |
| `references/hooks-client-pattern.md` | Copy-paste `hooks.client.ts` |
| `references/vite-config-sourcemaps.md` | Copy-paste `vite.config.ts` with the Sentry Vite plugin |
| `references/before-send-pii-scrubbing.md` | Copy-paste `beforeSend` scrubbing function + PII audit checklist |
| `references/sampling-rate-decision-table.md` | Traces/replay/profiles sampling numbers by traffic tier |
| `references/env-var-checklist.md` | Full env var table, including the Vercel-integration auto-injected set |
| `references/release-commit-association-vercel.md` | Release/commit association snippet for a Vercel build |

## Known gap - read before promising exhaustive coverage

Profiling (`profilesSampleRate` and related configuration) was not researched for this skill and is explicitly not covered - `references/sampling-rate-decision-table.md` flags this rather than inventing a number. If a task needs profiling configuration, treat it as a fresh research gap, not an extension of the traces/replay guidance here. Full list of gaps: `references/research/distilled-sentry.md`'s closing section.

## Quality bar

A Sentry task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, sampling and PII-scrubbing decisions were made deliberately against `references/sampling-rate-decision-table.md` and `references/before-send-pii-scrubbing.md` rather than defaulted blindly, and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [posthog-stinger](../posthog-stinger) - Product analytics, feature flags, experiments, and product-behavior session replay. Sentry owns crashes, unhandled exceptions, and performance traces; both ship a replay feature, but Sentry's is for reproducing a bug and PostHog's is for understanding product usage. Do not conflate the two.
  - [devops-stinger](../devops-stinger) - Vercel build pipeline and CI/CD architecture. Consult for the general build/deploy pipeline this skill's Vite plugin step and source-map upload plug into.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline below, and the authority on PII-scrubbing policy questions this skill's `beforeSend` guidance surfaces but does not decide unilaterally.
  - [quality-stinger](../quality-stinger) - Quality assurance pass, second gate of the Ship Gate pipeline below.
  - [db-stinger](../db-stinger) - PostgreSQL schema, indexing, and migrations. Consult when a Sentry-surfaced error traces back to a query or schema issue in the Neon database.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
