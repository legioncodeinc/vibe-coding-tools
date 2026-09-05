---
name: "vercel-stinger"
description: "Vercel deployment for SvelteKit (Svelte 5) + Neon - adapter-vercel config, runtimes, ISR/caching, env vars, cron, image optimization, middleware, WAF/rate limiting, cost control, rollbacks."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: vercel-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: adapter-vercel + Vercel platform
---

# Vercel Stinger

You are equipping **vercel-worker-bee**, the Hive's Vercel deployment specialist. This skill covers deploying and operating a SvelteKit (Svelte 5) app on Vercel with a Neon Postgres database: `@sveltejs/adapter-vercel` configuration, Node.js vs Edge runtime choice, ISR and Cache-Control precedence, environment variables per environment, cron jobs, image optimization (SvelteKit has no built-in Image component, unlike Next.js/Nuxt), Routing Middleware, WAF and rate limiting, the Vercel cost model and how to keep it from running away, `vercel.json`/Build Output API, Turborepo monorepo deploys, Instant Rollback, and the Vercel-Neon integration.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a Vercel fact from training data - if it is not in the archive, it is not a fact yet.

## When to use this skill

- Setting up or auditing `svelte.config.js` and `adapter-vercel` options
- Deciding Node.js vs Edge runtime for a route or the whole app
- Configuring ISR, reading `x-vercel-cache` values, or resolving Cache-Control header precedence conflicts
- Setting environment variables correctly across Production/Preview/Development, or diagnosing an env-var mismatch
- Scheduling cron jobs and understanding Hobby-plan restrictions
- Serving images on a SvelteKit app deployed to Vercel (there is no `next/image` equivalent - see the gap flagged in the research)
- Wiring Routing Middleware, or distinguishing it from SvelteKit's own `hooks.server.ts`
- Setting up WAF custom rules or rate limiting (dashboard or `@vercel/firewall`)
- Auditing or forecasting Vercel spend, or setting a Spend Limit
- Writing or reviewing `vercel.json`
- Deploying inside a Turborepo monorepo
- Connecting Neon Postgres to Vercel (Vercel-Managed vs Neon-Managed vs Manual) and preview branching
- Performing or recovering from an Instant Rollback
- Setting up custom domains and DNS

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-vercel.md` | Verifying any Vercel claim fast, or resolving a conflict (see its gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-adapter-setup-and-runtime-choice.md` | First-time `svelte.config.js`/`adapter-vercel` setup, or Node.js vs Edge decisions |
| `guides/02-caching-and-isr.md` | ISR config, Cache-Control precedence, or reading `x-vercel-cache` |
| `guides/03-environment-variables-and-secrets.md` | Adding, auditing, or debugging env vars across environments |
| `guides/04-cron-jobs-and-background-work.md` | Scheduling recurring functions |
| `guides/05-image-optimization.md` | Serving images - dynamic vs static source decision |
| `guides/06-middleware-and-firewall.md` | Routing Middleware, WAF custom rules, rate limiting |
| `guides/07-neon-integration-and-preview-branching.md` | Connecting Neon, choosing an integration path, preview branch behavior |
| `guides/08-deploys-domains-rollbacks-and-cost-control.md` | Domains/DNS, Instant Rollback, spend limits, Turborepo monorepo deploys |
| `references/svelte-config-templates.md` | Copy-paste `svelte.config.js` and `vercel.json` starting points |
| `references/env-var-checklist.md` | Full env var field table for this stack |
| `references/image-optimization-helper.md` | Copy-paste image optimization helper code |

## Known gaps - read before scaffolding

The research archive does not cover the exact current npm import paths for `@vercel/speed-insights` and `@vercel/analytics` in a SvelteKit app - verify against live docs before scaffolding rather than guessing an import path. It also does not cover Vercel Blob or Edge Config, which were out of scope for this pass. Full gap list: `references/research/distilled-vercel.md`, final section.

## Quality bar

A Vercel task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, a cost/spend-limit check ran for anything with variable-cost surfaces (Guide 8), and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [db-stinger](../db-stinger) - PostgreSQL schema, indexing, and migrations. Consult for the Neon database schema this skill's integration patterns connect to.
  - [cron-scheduling-stinger](../cron-scheduling-stinger) - Cron scheduling patterns beyond Vercel's own cron jobs. Consult when a scheduling need outgrows Vercel's plan limits.
  - [image-optimization-stinger](../image-optimization-stinger) - Broader image optimization practice. Consult alongside Guide 5 for non-Vercel-specific image pipeline decisions.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline below.
  - [tanstack-stinger](../tanstack-stinger) - TanStack library usage in the same SvelteKit stack. Consult when a Vercel-deployed route also uses TanStack Query or Table.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
