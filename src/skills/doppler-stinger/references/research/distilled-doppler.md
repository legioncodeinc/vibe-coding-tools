# Distilled Doppler research

Dense, cited reference distilled from `raw/`. Every claim ends with `[raw/<file>]`. Research window: sources fetched/searched 2026-08-14, official docs are undated live pages (checked "updatedAt" where the page exposed it, ranging May-October 2025 and May 2026), blog/changelog posts dated where shown, mostly 2026. Stack context: SvelteKit (Svelte 5) on Vercel, Neon Postgres.

## 1. Project / config / environment model

| Concept | What it is | Notes |
| --- | --- | --- |
| Project | Top-level container, assumed 1:1 with a single application/service | Max 1000 projects per workplace [raw/doppler--project-config--workplace-structure-naming.md] |
| Environment / Root Config | A deployment stage. Default three: `dev`, `stg`, `prd` | Max 15 environments per project; custom environments (e.g. `ci`, `GitHub`) can be added [raw/doppler--project-config--root-configs-and-branch-configs.md, raw/doppler--project-config--workplace-structure-naming.md] |
| Branch Config | Overrides/forks off a root config | Naming prefixed by environment, e.g. `dev_stripe_billing`; can be locked, shared by name, promoted into the root config [raw/doppler--project-config--root-configs-and-branch-configs.md] |
| Personal Config | Auto-created private branch per user with write access to `dev` (default `dev_personal`) | Enabled by default on new projects' `dev` environment only; toggle-able per environment by an Admin [raw/doppler--project-config--root-configs-and-branch-configs.md] |

Doppler assumes environments within one project are logically related deployment stages of the *same* app - not a way to represent unrelated services. Access control cascades from Environment down to every Branch Config under it (Personal Configs excepted). Large secret sets spread across many environments incur real cryptographic-operation cost, and Doppler flags this as a reason NOT to model separate services as environments of one project [raw/doppler--project-config--workplace-structure-naming.md].

**Recommended naming convention for this stack** (`myapp` project with `dev`/`stg`/`prd` configs, matching the mission brief): use the "Monolith" pattern from Doppler's own worked examples - single project per SvelteKit app, plain `dev`/`stg`/`prd` root configs, no service-splitting branch configs unless a genuine second deployable emerges (e.g. a worker) [raw/doppler--project-config--workplace-structure-naming.md]. This is the simplest pattern Doppler itself documents and fits a single-service SvelteKit/Vercel app; it is a judgment call applying the source's own comparison table to this specific stack, not a direct Doppler recommendation for SvelteKit apps specifically.

Anti-pattern, stated directly: one project per team with services modeled as Environments instead of `dev`/`stg`/`prd` - hits the 15-environment cap fast and triggers the expensive-comparison behavior described above [raw/doppler--project-config--workplace-structure-naming.md].

Shared secrets used by multiple projects (e.g. a Neon connection string reused by a web app and a worker) should live in a dedicated shared project referenced cross-project (`${project.config.SECRET_NAME}`, paid plans only) rather than duplicated [raw/doppler--project-config--workplace-structure-naming.md, raw/doppler--cli--cli-guide-reference.md].

## 2. Secret injection: runtime vs. build time

Doppler's only supported runtime-injection mechanism is environment variables, delivered via `doppler run -- <command>` wrapping the process, or `doppler secrets download`/`get`/mount for file-based consumption [raw/doppler--cli--cli-guide-reference.md]. There is no evidence in the archived research of a first-party "build-time bake secrets into the bundle" workflow - and the Vite/Svelte guide explicitly warns the opposite: only variables intentionally prefixed `VITE_` (Vite's client-exposure convention) should ever reach the browser bundle; everything else must stay server-only [raw/doppler--cli--install-and-local-dev-workflow.md]. For a SvelteKit app specifically, this maps onto SvelteKit's own public/private env module boundary (`$env/dynamic/public` vs `$env/dynamic/private`) - this specific SvelteKit-module mapping is this skill's inference from the general Vite convention documented in the source, not a Doppler-authored SvelteKit statement, flagged as such [raw/doppler--cli--install-and-local-dev-workflow.md].

Doppler explicitly and strongly recommends AGAINST writing secrets to plaintext files on disk (including a downloaded `.env`); prefer the mount feature (ephemeral named pipe, auto-cleaned on process exit) or `doppler run` env-var injection [raw/doppler--cli--cli-guide-reference.md].

## 3. The CLI

| Command | Purpose |
| --- | --- |
| `doppler login` | Browser-based auth for local development, once per workplace [raw/doppler--cli--install-and-local-dev-workflow.md] |
| `doppler setup` | Scopes current directory to a project+config so `-p`/`-c` flags aren't needed; supports non-interactive mode via `doppler.yaml` [raw/doppler--cli--cli-guide-reference.md] |
| `doppler run -- <cmd>` | Injects latest secrets as env vars into the wrapped process [raw/doppler--cli--cli-guide-reference.md] |
| `doppler run --watch -- <cmd>` | Team-plan feature: auto-restarts the wrapped process when secrets change [raw/doppler--cli--install-and-local-dev-workflow.md] |
| `doppler secrets set KEY=value` | Create/update one or more secrets; supports stdin for multi-line values [raw/doppler--cli--cli-guide-reference.md] |
| `doppler secrets upload <file>` | Bulk-import from an existing `.env`/`.json` [raw/doppler--cli--cli-guide-reference.md] |
| `doppler secrets get KEY --plain` | Single value to stdout [raw/doppler--cli--cli-guide-reference.md] |
| `doppler secrets download --no-file --format=<fmt>` | All secrets in `json`/`yaml`/`env`/`env-no-quotes`/`docker`/`dotnet-json` [raw/doppler--cli--cli-guide-reference.md] |
| `doppler configs tokens create` | Generate a Service Token (optionally ephemeral via `--max-age`) [raw/doppler--tokens--service-tokens-and-token-formats.md] |
| `doppler oidc login` | Authenticate via OIDC identity exchange instead of a static token [raw/doppler--tokens--service-tokens-and-token-formats.md] |

Project/config resolution precedence when the CLI runs: (1) a supplied Service Token's own bound project/config always wins, (2) explicit `-p`/`-c` flags, (3) exact match in `~/.doppler/.doppler.yaml` for the current directory, (4) nearest parent-directory match. Moving a project directory silently loses its Doppler config (no auto-update of the yaml file) [raw/doppler--cli--install-and-local-dev-workflow.md].

Secret references: `${SECRET_NAME}` (same config), `${config.SECRET_NAME}` (same project), `${project.config.SECRET_NAME}` (cross-project, paid plans only, requires the referencing user to have access to the target). References resolve at read time; a deleted/renamed target leaves the literal `${...}` string as the value until the path becomes resolvable again, which then silently starts injecting - a real "dangling reference" risk that must be actively tracked, not assumed safe [raw/doppler--cli--cli-guide-reference.md].

## 4. Local development, replacing `.env`

Doppler's own install guide states directly: once secrets are injected via the CLI, remove both `.env` files AND any application code that reads them - stated reasons are removing unencrypted secrets from the filesystem and eliminating ambiguity about the source of truth [raw/doppler--cli--install-and-local-dev-workflow.md].

Workflow for a SvelteKit app (adapting the documented Vite/Svelte guide): `doppler login` once, `doppler setup` in the repo root (or commit a `doppler.yaml` targeting `dev_personal` so teammates get a zero-prompt setup), then replace `npm run dev` / `vite` invocations with `doppler run -- npm run dev` [raw/doppler--cli--install-and-local-dev-workflow.md]. `doppler import .env` can migrate an existing file's contents in one step if one already exists [raw/doppler--cli--install-and-local-dev-workflow.md].

The CLI auto-creates encrypted local fallback files so development continues offline, refreshing automatically once connectivity returns - this is different from, and safer than, a manually downloaded plaintext `.env` [raw/doppler--cli--install-and-local-dev-workflow.md].

Each developer gets an isolated Personal Config (`dev_personal`) by default so local experimentation doesn't leak to teammates until explicitly promoted to the root `dev` config [raw/doppler--project-config--root-configs-and-branch-configs.md].

## 5. Service tokens vs. personal tokens vs. OIDC identities

| Token type | Scope | Where used |
| --- | --- | --- |
| Personal Token (`dp.pt.*`) | Read/write to everything the creating user can access | Never in a live/production environment - Doppler's own docs state this plainly [raw/doppler--tokens--service-tokens-and-token-formats.md] |
| CLI Token | Same permission as the authenticating user (set via `doppler login`) | Local development only, same caution as Personal Token [raw/doppler--tokens--service-tokens-and-token-formats.md] |
| Service Token (`dp.st.<config>.*`) | Read-only (or optionally read/write) to ONE config in ONE project | The correct credential for live/production environments and most CI jobs [raw/doppler--tokens--service-tokens-and-token-formats.md] |
| Service Account Token / Identity (OIDC) | Granular, attached to a Service Account; Identity variant is exchanged via OIDC, no static secret stored | Preferred for CI/CD (GitHub Actions, CircleCI, etc.) where the platform can mint an OIDC token [raw/doppler--tokens--service-tokens-and-token-formats.md] |

Service Tokens embed their config slug in the token string itself (`dp.st.prd.xxxx`), which is a useful visual/grep signal when auditing where a token lives or was logged [raw/doppler--tokens--service-tokens-and-token-formats.md]. Revocation is immediate and irreversible, though a process already holding a locally-cached fallback file continues serving the last-fetched value until its next fetch attempt is denied [raw/doppler--tokens--service-tokens-and-token-formats.md]. Ephemeral Service Tokens (`--max-age`) auto-delete after a set duration, well suited to short-lived CI jobs or one-off container runs [raw/doppler--tokens--service-tokens-and-token-formats.md].

## 6. The Vercel integration

Setup requires **one separate Doppler sync per Vercel environment** (Development, Preview, Production are Vercel's three, each independently authorized/configured) [raw/doppler--vercel--integration-and-marketplace.md]. Reserved variable names (AWS/Lambda runtime internals like `AWS_REGION`, `TZ`, `LAMBDA_TASK_ROOT`, etc.) cannot be synced through Doppler into Vercel - full list in `references/vercel-doppler-comparison.md` [raw/doppler--vercel--integration-and-marketplace.md].

Doppler defaults new Vercel syncs to Vercel's **Sensitive** variable type (unreadable back via Vercel's own dashboard/API after being set, which Vercel itself recommends for all secrets); syncs created before Vercel shipped Sensitive support may still be on the older Encrypted type and require a manual delete-and-recreate to upgrade [raw/doppler--vercel--integration-and-marketplace.md].

Known failure mode: a Vercel-side manually-added variable with the same name as one in the syncing Doppler config blocks the sync ("Another Environment Variable... exists") until the non-Doppler-managed variable (no Doppler logo in Vercel's UI) is removed [raw/doppler--vercel--integration-and-marketplace.md].

Doppler's own marketing claims for what it adds beyond Vercel's native env var store: cross-project variable referencing, environment-specific webhook-triggered redeploys on variable change, Git-style activity logs with rollback. These are vendor claims, not independently verified in this research pass - flagged as such [raw/doppler--vercel--integration-and-marketplace.md].

## 7. Secret rotation

Requires Team or Enterprise plan [raw/doppler--rotation--secrets-rotation-engine.md]. Core mechanism is the **two-secret strategy**: every rotated secret has an active and inactive instance; Doppler only ever serves the active one; at the midpoint of each rotation interval the roles swap and the about-to-be-active instance's value is rotated first - so each credential stays valid for two full intervals, giving consumers a safety window as long as they re-fetch at least that often [raw/doppler--rotation--secrets-rotation-engine.md].

Two rotation types: **Issuer** (create new instance, delete/inactivate old - Doppler's own stated preference, "makes auditability easier") and **Updater** (rotate the existing instance's value in place, used for e.g. Postgres password rotation where the DB users already exist) [raw/doppler--rotation--secrets-rotation-engine.md]. Two delivery models: **Proxied** (AWS Lambda deployed into the customer's own account, open-source rotation agents, target service never exposed to the internet) and **API** (direct calls to the target service's own management API) [raw/doppler--rotation--secrets-rotation-engine.md].

**Neon-specific gap, stated plainly**: the archived research covers AWS Postgres and GCP Cloud SQL Postgres rotation in detail, but no source in this research pass named Neon specifically as a supported rotation target. A team on this stack wanting automated rotation of a Neon connection string should verify current first-party support directly against Doppler's live integrations list before assuming the AWS/GCP Postgres pattern applies unmodified [raw/doppler--rotation--secrets-rotation-engine.md].

Rotation interval should be set to at least as long as the slowest-redeploying consumer of that credential takes to restart, plus buffer, to avoid downtime [raw/doppler--rotation--secrets-rotation-engine.md]. Every rotated secret has a dedicated "managing user" credential that Doppler uses to perform the rotation, which Doppler strongly recommends using for nothing else [raw/doppler--rotation--secrets-rotation-engine.md]. Manually mutating a rotated secret's state outside Doppler desyncs Doppler's records and pauses rotation until reconciled - Doppler considers itself the owner of that secret's state once configured [raw/doppler--rotation--secrets-rotation-engine.md].

## 8. Access control and audit logs

Two-tier role model: **Workplace role** (Owner/Admin get automatic full access to everything; Collaborator needs explicit per-project, per-environment grants; Team/Enterprise plan required for role-based access at all) and **Project role** (Viewer/Collaborator/Admin/None) [raw/doppler--access-control--permissions-and-custom-roles.md]. **Custom Roles** allow finer-grained permission sets than the built-ins, at Workplace or Project scope; a user's effective permission across overlapping group memberships is the union/most-permissive set, which is the documented mechanism for composing asymmetric per-environment access (e.g. write on `dev`/`ci`, read-only on `stg`, no-secrets-visibility on `prd`) via three custom roles + three groups rather than one blunt project-role assignment [raw/doppler--access-control--permissions-and-custom-roles.md].

Doppler splits audit data into two distinct systems, easy to conflate:

| System | Tracks | Gating permission |
| --- | --- | --- |
| Access Logs | WHO READ a secret's value, first/most-recent access time, access method (user, Service Token, PAT, CLI Token, Terraform, K8s Operator, API) | `enclave_config_access_logs` (depends on View Secrets) [raw/doppler--audit--access-logs-and-activity-logs.md] |
| Activity Logs / Config Logs | WHO CHANGED something (any team action; config-specific changes get a rollback-capable "commit style" Config Log) | `logs` (own-visible) / `logs_audit` (workplace-wide) [raw/doppler--audit--access-logs-and-activity-logs.md] |

Access is defined strictly as a request that actually returned a payload containing the value - a "no update" response (e.g. Kubernetes Operator polling with nothing changed) does not count as an access event [raw/doppler--audit--access-logs-and-activity-logs.md]. Activity Log forwarding to external systems (Slack, Discord, MS Teams, Generic HTTPS, AWS SQS for Enterprise) supports multiple independent destinations per type as of the April/June 2026 changelog, the mechanism for piping Doppler's audit trail into an external SIEM [raw/doppler--audit--access-logs-and-activity-logs.md, raw/doppler--changelog--2026-product-updates.md].

## 9. CI/CD in GitHub Actions - three methods, not one default

| Method | How | Auto-masks logs? | Trade-off |
| --- | --- | --- | --- |
| 1. Native sync integration | Doppler GitHub App pushes secrets into real GitHub Secrets on every change | Yes (native GitHub Secrets) | Cannot import existing GitHub secrets back into Doppler (API can't read values); requires a dedicated Doppler "GitHub" environment; Doppler's own recommended default [raw/doppler--github-actions--sync-fetch-action-oidc.md] |
| 2. `dopplerhq/secrets-fetch-action` | In-workflow step, Service Token or OIDC (Service Account Identity), exposes secrets as step `outputs` or injected env vars | Yes (action registers masking automatically) | Live API call per run (rate-limit exposure at very high frequency); OIDC variant avoids storing/rotating any static token [raw/doppler--github-actions--sync-fetch-action-oidc.md] |
| 3. Raw `doppler run` in a step | Install CLI, wrap the command, auth via `DOPPLER_TOKEN` or `doppler oidc login` | **No** - must hand-mask every sensitive value with `::add-mask::` | Doppler's own blog calls this out as the biggest drawback of the three; reserve for a specific, well-understood need [raw/doppler--github-actions--sync-fetch-action-oidc.md] |

Doppler's own stated preference order, directly: sync integration first, Secrets Fetch Action as the reliable alternative, raw `doppler run` only when the other two genuinely don't fit and manual masking will be done rigorously [raw/doppler--github-actions--sync-fetch-action-oidc.md].

## 10. Doppler vs. raw Vercel env vars alone

Full comparison table: `references/vercel-doppler-comparison.md`. Summary of the grounded differences (all traced to raw sources, vendor content flagged where applicable):

- **Multi-environment sync**: Vercel's own env var store is per-project-per-environment (Dev/Preview/Prod) with no cross-project referencing; Doppler adds cross-project secret references and a single control plane that fans out to Vercel plus every other synced destination (GitHub Actions, AWS, GCP, etc.) [raw/doppler--vercel--integration-and-marketplace.md, raw/doppler--project-config--workplace-structure-naming.md].
- **Audit log**: Vercel-native env vars carry no first-party per-secret access log; Doppler's Access Logs + Activity/Config Logs (see §8) are a Doppler-side capability layered on top, regardless of destination platform [raw/doppler--audit--access-logs-and-activity-logs.md].
- **Rotation**: Vercel has no native secret-rotation engine; Doppler's rotation (§7) operates upstream of the Vercel sync, so a rotated value propagates to Vercel automatically on the same sync mechanism as any other secret edit [raw/doppler--rotation--secrets-rotation-engine.md].
- **Secret referencing across projects**: not a Vercel-native concept; Doppler-specific (§1, §6) [raw/doppler--project-config--workplace-structure-naming.md].
- **Dashboard vs. CLI-only**: both Vercel and Doppler offer a dashboard and a CLI; the distinguishing factor from the research is not UI-vs-CLI but scope - Vercel's UI/CLI only ever govern Vercel-hosted env vars, while Doppler's governs every synced destination from one place [raw/doppler--vercel--integration-and-marketplace.md].
- **When Doppler earns its place over Vercel env vars alone** (this skill's synthesis, grounded in the above, not a direct Doppler quote): once the app needs secrets to reach more than just Vercel (e.g. a GitHub Actions CI job, a Neon connection string also used by a local script or a separate worker), needs a rotation story for any credential, needs a real per-secret access audit trail, or needs environment-scoped access control finer than "who can open the Vercel project settings page" - Doppler's centralizing model earns the extra setup. For a single-service SvelteKit app that only ever needs Vercel-hosted env vars, with no CI secret usage and no compliance audit requirement, raw Vercel env vars alone remain a legitimate, simpler choice; this trade-off judgment is this skill's synthesis of the sourced facts, not a claim from Doppler's own materials [raw/doppler--comparison--env-files-vs-secrets-manager.md, raw/doppler--vercel--integration-and-marketplace.md].

## 11. Recent platform direction (last ~6 months, Feb-Jun 2026)

- Official **Doppler MCP Server** (Feb 2026) - reuses existing API/CLI auth and RBAC, no new control plane; the sanctioned path for an AI agent to touch Doppler rather than shelling raw CLI with an over-scoped token [raw/doppler--changelog--2026-product-updates.md].
- Azure joined AWS/GCP for automated rotation and gained Dynamic Secrets (Enterprise) (March 2026) [raw/doppler--changelog--2026-product-updates.md].
- Multi-destination Activity Log forwarding + AWS SQS destination (April 2026) - maturing toward real SIEM integration [raw/doppler--changelog--2026-product-updates.md].
- OIDC spreading across surfaces: nested-claim JSON Pointer matching for identity auth (April 2026), Terraform provider OIDC auth (June 2026) - consistent trend away from static long-lived tokens everywhere [raw/doppler--changelog--2026-product-updates.md].
- Doppler On-prem released (June 2026) - no stated relevance to this stack's current requirements, noted for completeness [raw/doppler--changelog--2026-product-updates.md].

## Gaps and open questions (state plainly, do not guess)

1. **No first-party Neon-specific rotation integration confirmed.** Research covered AWS Postgres and GCP Cloud SQL Postgres rotation in depth; Neon was not named as a supported rotation target in any archived source. Verify directly against Doppler's live integrations catalog before promising automated Neon connection-string rotation [raw/doppler--rotation--secrets-rotation-engine.md].
2. **No dedicated first-party SvelteKit quickstart/SDK was found** for Doppler (unlike, say, a documented Next.js-specific guide might exist). The closest official material is the combined Vite.js/Svelte.js guide, which is framework-agnostic Vite guidance, not SvelteKit-server-route-specific guidance. `doppler run -- npm run dev` and standard `$env` module usage is a safe, generically-correct pattern, but nothing in the archive addresses SvelteKit server-route or `hooks.server.ts`-specific Doppler wiring directly [raw/doppler--cli--install-and-local-dev-workflow.md].
3. **The April-2026 Vercel breach cited in the "secrets sprawl" post is vendor-sourced** (Doppler's own blog) and was not cross-verified against a second, independent source in this research pass. Treat the specific incident narrative as Doppler's framing, even though the general lesson (don't let a platform integration hold copies of everything) stands on its own logic [raw/doppler--comparison--env-files-vs-secrets-manager.md].
4. **Access History retention limits by plan** are referenced ("bound by the plan you are on") but the actual per-plan day/version counts were not present in the fetched Access Logs page - it points to the pricing page rather than stating numbers inline. Do not assert a specific retention window without checking Doppler's current pricing page directly [raw/doppler--audit--access-logs-and-activity-logs.md].
5. **Whether Doppler's Vercel sync supports Vercel's newer "Environment" and branch-specific preview scoping beyond the three top-level Development/Preview/Production buckets** was not addressed in the fetched Vercel integration doc - it describes exactly three environment-level syncs, not per-branch preview scoping. If a task needs branch-specific preview secrets beyond Vercel's standard Preview bucket, treat this as unconfirmed and verify directly.
