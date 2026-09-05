---
name: "workos-stinger"
description: "WorkOS AuthKit for SvelteKit - hosted/headless flows, sealed sessions, JWT verification, orgs, RBAC, SSO/SCIM, MFA/passkeys/Magic Auth, webhooks, and staging-to-prod cutover."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: workos-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: AuthKit
---

# WorkOS Stinger

You are equipping **workos-worker-bee**, the Hive's WorkOS specialist. This skill covers WorkOS end to end, weighted hard toward **AuthKit** since that is the primary surface most Hive apps touch: the hosted UI, sessions, RBAC, SSO/SCIM, MFA/passkeys/Magic Auth, webhooks, and the Node SDK. Target stack context is SvelteKit (Svelte 5) on Vercel - guides favor framework-agnostic and SvelteKit-applicable patterns over Next.js-only material, though Next.js/Remix facts are noted where the research surfaced them.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a WorkOS fact from training data - if it is not in the archive, it is not a fact yet.

## When to use this skill

- Choosing between AuthKit's hosted UI and the headless Authentication API
- Wiring AuthKit into a SvelteKit app: `hooks.server.ts`, callback/sign-in routes, protected load functions and API routes
- Session handling: sealed sessions, refresh, logout, or raw JWT/JWKS verification for a downstream service
- User Management: users, organizations, organization memberships, invitations
- RBAC: roles, permissions, environment vs. custom roles, IdP role-mapping precedence
- SSO (SAML/OIDC) or Directory Sync (SCIM) for a B2B app, and deciding whether a customer needs one, both, or neither
- MFA (TOTP/SMS), passkeys, or Magic Auth
- Webhooks: signature verification, event handling, idempotency
- Migrating an existing user base from Supabase Auth or Clerk onto WorkOS
- Staging-to-production environment cutover and the env var checklist

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-workos.md` | Verifying any WorkOS claim fast, or resolving a conflict (see its Gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-choose-your-authkit-mode.md` | Deciding hosted UI vs. headless vs. standalone SSO |
| `guides/02-authkit-integration-sveltekit.md` | Wiring AuthKit into a SvelteKit app for the first time |
| `guides/03-sessions-and-jwt-verification.md` | Session refresh/logout behavior, or raw JWT verification for a separate service |
| `guides/04-user-management-and-orgs.md` | Users, organizations, memberships, invitations |
| `guides/05-rbac-roles-permissions.md` | Roles, permissions, IdP precedence rules |
| `guides/06-sso-and-directory-sync.md` | SAML/OIDC and SCIM setup, deciding what a B2B customer actually needs |
| `guides/07-webhooks.md` | Webhook signature verification and idempotent handling |
| `guides/08-migration-and-environments.md` | Migrating off Supabase Auth/Clerk, or staging-to-production cutover |
| `guides/09-security-checklist.md` | Pre-ship pass across every topic above |
| `references/authkit-flow-diagram.md` | Need the mermaid sequence diagram for sign-in, callback, refresh, or logout |
| `references/hooks-server-session-pattern.md` | Copy-paste `hooks.server.ts` + route files for SvelteKit |
| `references/jwt-verification.md` | Copy-paste JWKS verification snippet |
| `references/env-var-checklist.md` | Full env var table and staging/production cutover checklist |
| `references/rbac-model.md` | Role/permission field tables and precedence tables |
| `references/webhook-handler-example.md` | Copy-paste SvelteKit webhook route |

## Known open conflict - read before scaffolding SvelteKit

Two sources both claim to be the official SvelteKit AuthKit SDK, under different npm scopes (`@workos-inc/authkit-sveltekit` vs. `@workos/authkit-sveltekit`). This skill defaults to the CLI-installer-table name but instructs verifying npm directly before install. Full comparison: `references/research/distilled-workos.md` §5 and `references/research/raw/workos--authkit--sveltekit-sdk.md`.

## Quality bar

A WorkOS task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, the security checklist in `guides/09-security-checklist.md` was run, and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [auth-stinger](../auth-stinger) - Provider-agnostic authentication implementation: provider selection, Google OAuth, MFA/passkeys, RBAC, session storage, and B2B SSO across Clerk/Better Auth/Auth.js/Supabase Auth/WorkOS/Stack Auth/Kinde/Stytch. Consult when WorkOS is being compared against alternatives, or when a non-WorkOS auth concern comes up mid-task.
  - [website-stinger](../website-stinger) - Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end. Consult for the surrounding SvelteKit app structure this skill's auth layer plugs into.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline below.
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Svelte 5 + SvelteKit UI enforcement (shadcn-svelte, Tailwind v4). Consult when the AuthKit branding/custom-CSS surface needs to match the app's design system, or when building a custom sign-in screen's markup.
  - [db-stinger](../db-stinger) - PostgreSQL schema, indexing, and migrations. Consult for the `users`/`organizations`/webhook-event-log tables this skill's patterns write to.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
