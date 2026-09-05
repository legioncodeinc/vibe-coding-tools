---
name: "tanstack-stinger"
description: "TanStack libraries in SvelteKit (Svelte 5) - Query SSR/caching/mutations, Table runes state, Form snippet validation, Virtual; states plainly that Router and Start have no official Svelte support."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: tanstack-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: TanStack Svelte adapters
---

# TanStack Stinger

You are equipping **tanstack-worker-bee**, the Hive's TanStack-in-SvelteKit specialist. This skill covers which TanStack libraries have real Svelte 5 support and how to use them correctly: TanStack Query (SSR setup, prefetching, mutations, optimistic updates, invalidation), TanStack Table (runes-native state, feature registration), TanStack Form (snippet-based field validation), and TanStack Virtual. It also covers, with equal rigor, which TanStack libraries do **not** have real Svelte support (Router, Start) and when SvelteKit's own `load` functions and remote functions (`query`/`form`/`command`) already solve the problem without adding a TanStack dependency at all.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a TanStack fact from training data - if it is not in the archive, it is not a fact yet. Where a library has no real Svelte 5 support, this skill says so plainly rather than inventing usage.

## When to use this skill

- Deciding which TanStack library (if any) fits a SvelteKit data-fetching, table, form, or large-list need
- Setting up `@tanstack/svelte-query`: `QueryClient` construction, SSR-safe config, prefetching in `load` functions, hydration
- Writing mutations, optimistic updates, or cache invalidation with TanStack Query
- Building a data table with `@tanstack/svelte-table`, choosing between API generations, registering features
- Building a form with `@tanstack/svelte-form`, field-level or async validation
- Virtualizing a large list or table with `@tanstack/svelte-virtual`
- Someone asks about TanStack Router or TanStack Start for a SvelteKit project
- Deciding whether a page's data needs actually justify TanStack Query over SvelteKit's native `load`/remote functions
- Auditing bundle size impact of TanStack libraries already in a project

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-tanstack.md` | Verifying any TanStack-Svelte claim fast, especially the support-status table |
| `references/research/raw/` | Tracing a claim to its primary source |
| `references/svelte-5-support-matrix.md` | Quick lookup: does library X have real Svelte 5 support |
| `guides/01-svelte5-support-matrix-and-decisions.md` | First move on any TanStack question - confirm support status before writing code |
| `guides/02-query-client-setup-and-ssr.md` | First-time Query setup, SSR/prefetch configuration |
| `guides/03-query-mutations-and-invalidation.md` | Writing mutations, optimistic updates, invalidation |
| `guides/04-table-setup-and-features.md` | Building a data table, choosing an API generation, registering features |
| `guides/05-form-validation.md` | Building a form, deciding TanStack Form vs SvelteKit's native `form` |
| `guides/06-virtualization.md` | Large list/table performance, pairing Virtual with Table |
| `guides/07-when-not-to-use-tanstack.md` | Deciding whether TanStack Query is justified vs SvelteKit's native `load`/remote functions |
| `guides/08-performance-and-bundle-budget.md` | Bundle size audits, weighing added dependency cost |
| `references/query-client-setup-template.md` | Copy-paste Query client + prefetch code |
| `references/table-setup-template.md` | Copy-paste Table setup code |
| `references/form-setup-template.md` | Copy-paste Form setup code |

## The one fact to lead with

**TanStack Router and TanStack Start have no official Svelte support.** Query, Table, Form, and Virtual do, and Table/Form's current major versions specifically require Svelte 5. Full status table: `references/svelte-5-support-matrix.md`.

## Known gaps - read before scaffolding

No full worked Svelte code example was archived for `createVirtualizer`/`createWindowVirtualizer` - confirm the option shape live before scaffolding. TanStack Form's Standard Schema (Zod/Valibot) integration on the Svelte adapter specifically was not independently confirmed. Full gap list: `references/research/distilled-tanstack.md`, final section.

## Quality bar

A TanStack task run through this skill is done when: the library's Svelte 5 support status was confirmed against `references/svelte-5-support-matrix.md` before any code was written, the relevant guide(s) were read in order, every factual claim used in the output traces to `references/research/raw/`, Guide 7's "when not to use TanStack" decision rule was actually applied rather than skipped, and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [vercel-stinger](../vercel-stinger) - Vercel deployment for the same SvelteKit stack. Consult when a TanStack Query prefetch or SSR pattern interacts with Vercel's caching/ISR behavior.
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Svelte 5 + SvelteKit UI enforcement. Consult for the surrounding component/markup patterns TanStack Table and Form render into.
  - [db-stinger](../db-stinger) - PostgreSQL schema and migrations. Consult for the data source behind TanStack Query's query functions and TanStack Table's row data.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
