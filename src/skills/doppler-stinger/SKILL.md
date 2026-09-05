---
name: "doppler-stinger"
description: "Doppler secrets manager for SvelteKit on Vercel - doppler run/secrets CLI, project/config model, Vercel sync, service tokens, rotation, audit logs, GitHub Actions CI, replacing .env files."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: doppler-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: CLI + Vercel integration
---

# Doppler Stinger

You are equipping **doppler-worker-bee**, the Hive's Doppler specialist. This skill covers Doppler end to end for this Hive's stack: the project/config/environment model, the CLI (`doppler run`, `doppler secrets`), the Vercel integration and sync, service tokens and access control, secret rotation, audit logs, and CI/CD usage in GitHub Actions. Target stack context is SvelteKit (Svelte 5) on Vercel with Neon Postgres - guides favor that stack's runtime-injection model over build-time or vendor-SDK patterns.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a Doppler fact from training data - if it is not in the archive, it is not a fact yet.

## When to use this skill

- Setting up Doppler for a new SvelteKit project: project/config layout, `doppler login`, `doppler setup`
- Replacing `.env` files with `doppler run --` for local development
- Syncing secrets to Vercel (Development/Preview/Production) via the Doppler-Vercel integration
- Scoping a Service Token, choosing between a Service Token and OIDC for CI, or deciding when a Personal Token is (never) appropriate
- Wiring Doppler into a GitHub Actions workflow: native sync, the Secrets Fetch Action, or raw `doppler run` in a step
- Rotating a secret (database credential, third-party API key) on a schedule or immediately after a suspected leak
- Reviewing who accessed or changed a secret (Access Logs vs. Activity Logs)
- Deciding whether Doppler earns its place over raw Vercel environment variables for a given project

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-doppler.md` | Verifying any Doppler claim fast, or resolving a gap (see its Gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-project-config-environment-model.md` | Deciding project/config layout, root vs. branch configs, Personal Configs |
| `guides/02-cli-and-local-dev-workflow.md` | Installing the CLI, `doppler setup`, replacing `.env` with `doppler run --` |
| `guides/03-vercel-integration-and-sync.md` | Setting up or debugging the Doppler-to-Vercel sync |
| `guides/04-service-tokens-scoping-access-control.md` | Scoping a Service Token, choosing OIDC, workplace/project roles, Custom Roles |
| `guides/05-cicd-in-github-actions.md` | Wiring secrets into a GitHub Actions workflow |
| `guides/06-rotation-audit-logs-and-when-doppler-earns-its-place.md` | Rotation setup, Access vs. Activity Logs, Doppler-vs-Vercel-alone decision |
| `references/sveltekit-local-dev-workflow.md` | Copy-paste `doppler setup` + `doppler run --` local-dev wiring for a SvelteKit app |
| `references/github-actions-service-token-example.md` | Copy-paste service-token-scoped and OIDC GitHub Actions workflow steps |
| `references/vercel-doppler-comparison.md` | Full Doppler-vs-raw-Vercel-env-vars comparison table |
| `references/project-config-naming-example.md` | Worked `myapp` project/config naming example (`dev`/`stg`/`prd`) |

## Known research gaps - read before promising these

Stated plainly rather than guessed at: no source confirmed a first-party Neon-specific rotation integration (AWS/GCP Postgres rotation is documented in depth; Neon was not named), and no dedicated first-party SvelteKit quickstart/SDK was found (the closest official material is a framework-agnostic Vite.js/Svelte.js guide). Full list: `references/research/distilled-doppler.md` Gaps section.

## Quality bar

A Doppler task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, the Doppler-vs-Vercel-alone trade-off in `guides/06-rotation-audit-logs-and-when-doppler-earns-its-place.md` was actually weighed rather than defaulted to "add Doppler," and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [devops-stinger](../devops-stinger) - CI/CD pipeline wiring and GitHub Actions beyond the secret-injection step. Consult for the surrounding workflow architecture this skill's secrets plug into.
  - [security-stinger](../security-stinger) - Secret-leak forensics and auditing that no secret ever reaches logs, commits, or client bundles. This skill owns where secrets live and how they sync/inject; security-stinger owns proving none of them leaked.
  - [db-stinger](../db-stinger) - PostgreSQL/Neon schema and connection conventions. Consult for the shape of the connection string this skill's Doppler config stores and rotates.
  - [auth-stinger](../auth-stinger) - Provider-agnostic auth implementation. Consult for the API keys and client secrets (WorkOS, Clerk, etc.) this skill's Doppler config manages.
  - [ci-release-stinger](../ci-release-stinger) - Release and versioning pipeline. Consult when a Doppler-managed secret's rotation needs to coordinate with a release cutover.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
