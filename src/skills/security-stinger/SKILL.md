---
name: "security-stinger"
description: "Security audit for SvelteKit, Neon/Drizzle, WorkOS, Stripe, Vercel, Doppler, and GoHighLevel. First gate of the Ship Gate - scans, triages, and remediates vulnerabilities before quality-stinger."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: security-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: sveltekit-drizzle-workos-stripe-vercel
---

# Security Stinger

You are equipping **security-worker-bee**, the Hive's application security specialist, and you are the FIRST gate of the Ship Gate. This skill covers this repo's current stack end to end: SvelteKit (Svelte 5) as the framework, Neon Postgres with Drizzle as the datastore, WorkOS for auth, Stripe for payments, Vercel for hosting, Doppler for secrets, and GoHighLevel as the third-party webhook integration. It replaces an earlier version of this skill that was scoped to a different codebase (Hivemind: TypeScript/Deep Lake) - none of that catalog applies here and it has been removed.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a security fact from training data - if it is not in the archive, it is not a fact yet.

## When to use this skill

- Any invocation of `security-worker-bee`, and always as the first step before `quality-stinger`, per the Ship Gate below
- Auditing a branch or diff before commit: authorization, tenant isolation, secrets, webhook intake, dependencies, headers, or AI-generated-code failure patterns
- Reviewing a new `+server.ts` endpoint, form action, or `hooks.server.ts` change for authorization coverage
- Reviewing a Drizzle schema/migration for missing Row Level Security or SQL-injection-prone dynamic identifiers
- Reviewing a new Stripe or GoHighLevel webhook handler for signature verification and idempotency
- Checking Doppler/Vercel environment variable routing, or scanning for secrets that leaked into the client bundle or git history
- Reviewing Sentry/PostHog configuration for PII scrubbing and masking coverage

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-security.md` | Verifying any security claim fast, or resolving where a fact came from |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-audit-procedure.md` | Running a full pass end to end, and understanding the Ship Gate ordering contract |
| `guides/02-sveltekit-attack-surface.md` | CSRF, endpoint authz, load-function leakage, env vars, `hooks.server.ts`, `{@html}` XSS, cookies |
| `guides/03-authorization-and-tenancy.md` | RLS on Neon/Drizzle, the "forgot the WHERE clause" class, what leaving Supabase costs |
| `guides/04-secrets-and-env.md` | Drizzle SQL injection, Doppler/Vercel secrets, git history, push protection |
| `guides/05-webhooks-and-third-party-intake.md` | Stripe and GoHighLevel webhook signature verification, idempotency, replay, SSRF |
| `guides/06-dependencies-and-supply-chain.md` | npm audit, lockfile injection, `npm ci` vs `npm install`, PR review red flags |
| `guides/07-headers-and-transport.md` | CSP nonce/hash strategy, HSTS, frame options, Vercel WAF and rate limiting |
| `guides/08-ai-generated-code-patterns.md` | Why this repo's AI-generated code specifically needs this gate - read before any pass |
| `guides/09-remediation-playbooks.md` | Canonical before/after fixes per vulnerability class |
| `guides/10-report-format.md` | Writing and placing the audit report |
| `references/severity-rubric.md` | Classifying a finding Critical/High/Medium/Low |
| `references/audit-checklist.md` | The per-surface checklist to work through during a pass |
| `references/grep-patterns.md` | Deterministic ripgrep sweeps to run before the manual read-through |
| `references/secure-by-default-snippets.md` | Copy-paste starting points for the common fixes |
| `references/audit-output-format.md` | The report skeleton and its `library/` destination paths |

## Quality bar

A security-stinger pass is done when: the relevant guides were read in order (not skipped), every factual claim used traces to `references/research/raw/`, every finding has a `path/to/file.ts:LINE` citation and an assigned severity, Critical and High findings were remediated in-session with minimal-blast-radius diffs, the report was written to the correct `library/` destination per `guides/10-report-format.md`, and - for any Medium-or-above finding that required a fix - a full re-evaluation pass ran against the updated code before declaring the pass complete.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [quality-stinger](../quality-stinger) - Quality assurance pass, second gate of the Ship Gate, always after security.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Repository hygiene audit, final orchestrator-level gate before commit and push.
  - [workos-stinger](../workos-stinger) - WorkOS AuthKit depth: sealed sessions, JWKS verification, RBAC, SSO. Consult when a WorkOS finding needs implementation-level detail beyond this skill's session-security coverage.
  - [db-stinger](../db-stinger) - PostgreSQL schema, indexing, and migrations. Consult for the tenant-scoped tables this skill's RLS guidance applies to.
  - [dependency-audit-stinger](../dependency-audit-stinger) - Deeper dependency-audit workflows. Consult when a supply-chain finding needs a full audit beyond this skill's lockfile-injection and `npm ci` checks.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
