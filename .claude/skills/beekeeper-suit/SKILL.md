---
name: "beekeeper-suit"
description: "Routes a request to the right Bee in The Hive for this repo (SvelteKit, Payload, Neon, WorkOS, Stripe, Vercel), arms it with its paired Stinger, and enforces the Ship Gate before anything ships."
license: MIT
---

# Beekeeper-Suit

Beekeeper-suit is the routing skill for The Hive, the agentic development system distributed by Vibe Coding Tools. The Hive works across Claude Code, Cursor, ChatGPT Codex, and Claude Cowork. It is built from Bees (subagents, one per domain) and Stingers (the paired skill each Bee reads before it touches anything). Beekeeper-suit does not do the work itself. Given a request, it names the Bee that owns it, makes sure that Bee arms itself with its Stinger, and enforces the Ship Gate before anything gets committed or pushed.

The application stack this colony serves is SvelteKit with Svelte 5, Payload CMS, Vercel, Neon Postgres with Drizzle, WorkOS auth, Stripe with custom Elements, Doppler for secrets, PostHog for analytics, Sentry for error tracking, Tailscale for private networking, and GoHighLevel for CRM integration. Most of the roster below speaks that stack directly. The rest handles the process around it: documentation, git hygiene, project management, CI, and other platforms a client project might touch (Discord, Slack, Telegram, mobile app stores).

A small number of Bees still carry description or body text from a prior product this repo does not run anymore. They stay in the roster, because an unregistered Bee is a Bee the orchestrator can't find, but they are marked below and logged in full in [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md).

---

## The pairing law

Every Bee pairs with exactly one Stinger: `<base>-worker-bee` to `<base>-stinger`. No exceptions inside the roster below; every row checks out.

Three skills sit above the pairing law because they are orchestrator level, not Bees, and carry no paired Bee of their own:

- `beekeeper-suit` (this file, the router)
- `queen-bee-stinger` (the forge that creates and validates new Bees and Stingers)
- `get-started-stinger` (repository initialization and hardening)

---

## Roster

76 Bees registered, sorted into domain groups. The Domain column is a one-line summary of the Bee's own frontmatter description. Trigger keywords are pulled from that same description, not invented.

### Stack and frameworks

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `svelte-worker-bee` | Svelte 5 language and SvelteKit 2 runtime: runes, snippets, lifecycle, universal reactivity, Svelte 4-to-5 migration, load functions and form actions | "runes", "migrate to Svelte 5", "$state vs $effect", "SvelteKit remote function", "snippet vs slot" | `svelte-stinger` |
| `shadcn-svelte-worker-bee` | shadcn-svelte component library: CLI, copy-in-repo model, registry system, theming, Superforms and Formsnap, accessibility via Bits UI | "install shadcn-svelte", "add a shadcn-svelte component", "theme shadcn-svelte", "build a shadcn-svelte registry" | `shadcn-svelte-stinger` |
| `tailwind-worker-bee` | Tailwind CSS v4: CSS-first config, @theme mechanics, Vite plugin, v3-to-v4 migration, dark mode variants, container queries | "migrate to Tailwind v4", "set up @theme", "wire up the Tailwind Vite plugin", "sort my Tailwind classes" | `tailwind-stinger` |
| `tanstack-worker-bee` | TanStack inside SvelteKit: Query SSR/caching/mutations, runes-native Table, Form snippet validation, Virtual | "add TanStack Query", "set up svelte-query", "build a data table", "virtualize this list" | `tanstack-stinger` |
| `preact-worker-bee` | Preact 11: signals API, preact/compat migration from React, embed widgets, Astro islands, Fresh 2.x | "Preact vs React", "migrate a React codebase to Preact", "embed a widget on third-party pages", "Astro island" | `preact-stinger` |
| `react-worker-bee` | React 18/19 architecture: bulletproof-react patterns, Server Components, Suspense, Actions, Compiler, state layering | "review React architecture", "state management decision", "Server Components boundary", "React 19 patterns" | `react-stinger` |
| `typescript-node-worker-bee` | TypeScript/Node code review and conventions: strict config, module resolution, test suites, boundary validation (body still cites a legacy package's specifics; see PAIRING-AUDIT.md) | "review this TypeScript code", "audit this Node code", "write a Vitest suite", "tighten the tsconfig" | `typescript-node-stinger` |
| `python-worker-bee` | Python architecture: Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv, ORM discipline, migrations, typed adoption | "review this Django code", "audit ORM patterns", "migrate DRF to Django Ninja", "set up Celery" | `python-stinger` |
| `rust-worker-bee` | Rust implementation and code review for production Cargo workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, Rust tests, and local packaging evidence | "implement this in Rust", "review this Cargo workspace", "fix this Tokio or SQLx service", "audit this SQLx transaction", "build the approved Rust PRD slice" | `rust-stinger` |
| `ux-ui-svelte-worker-bee` | Enforces this repo's SvelteKit UI standard: shadcn-svelte on Bits UI plus Melt UI, Tailwind v4 token bridge, white-label brand contract | "add a Button", "copy in this shadcn-svelte component", "convert this bespoke style to Tailwind", "does the white-label still work" | `ux-ui-svelte-stinger` |
| `dark-mode-theming-worker-bee` | Dark-mode theming: CSS variable token architecture, theme-provider wiring, FOWT prevention, SSR hydration safety, Tailwind v4 dark variant | "set up dark mode", "dark mode on SSR", "multi-brand theming", "FOWT fix" | `dark-mode-theming-stinger` |
| `modal-toast-dialog-worker-bee` | Accessible overlay primitives: dialog, alert dialog, drawer, toast, command menu; focus trap, escape, scroll lock, aria contract | "choosing between overlay primitives", "debugging focus trap regressions", "building a command palette" | `modal-toast-dialog-stinger` |
| `icon-system-worker-bee` | Icon library selection and delivery: tree-shake vs sprite, dynamic-import-by-name, custom SVG components, icon accessibility contract | "choosing an icon library", "bundle-size regressions from icon imports", "icon accessibility" | `icon-system-stinger` |
| `typography-font-worker-bee` | Typography system: variable fonts, font source selection, the FOIT/FOUT/FOFT story, fluid type scales, type-token architecture | "set up fonts", "audit our typography", "fix FOIT/FOUT", "build a type scale" | `typography-font-stinger` |
| `font-loading-worker-bee` | Font loading pipeline: font-display strategy, preload/crossorigin correctness, variable-font subsetting, CLS-from-font-swap elimination | "audit font loading", "fix FOIT", "CLS from font swap", "subset variable font" | `font-loading-stinger` |
| `markdown-mdx-content-pipeline-worker-bee` | Markdown/MDX pipeline: compiler selection, remark/rehype chains, syntax highlighting, AST manipulation, XSS sanitization | "set up MDX", "configure Shiki", "write a remark plugin", "sanitize user markdown" | `markdown-mdx-content-pipeline-stinger` |
| `csv-xlsx-import-export-worker-bee` | Spreadsheet upload and export feature: CSV/XLSX parsing, large-file streaming, column-mapping wizard, row validation, CSV injection prevention | "build a CSV import", "add XLSX upload", "column-mapping wizard", "CSV injection safe" | `csv-xlsx-import-export-stinger` |
| `design-system-worker-bee` | Bootstraps a complete design system from scratch: tokens, utility layer, per-component and per-screen specs, static HTML examples | "build a design system for X", "bootstrap UI for product Y", "create tokens and utilities for this product" | `design-system-stinger` |
| `http-rest-fundamentals-worker-bee` | HTTP/REST protocol correctness: method safety and idempotency, status-code honesty, headers, conditional and range requests | "is this status code correct", "why is CORS failing", "explain preflight", "PUT vs PATCH" | `http-rest-fundamentals-stinger` |
| `image-optimization-worker-bee` | Image delivery: AVIF/WebP format selection, responsive srcset/sizes, blur placeholders, remote image config, CLI tooling | "optimize my images", "convert to AVIF", "fix layout shift from images", "audit our images" | `image-optimization-stinger` |

### Data and persistence

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `db-worker-bee` | PostgreSQL data architecture: schema design, indexing strategy, zero-downtime migrations, ORM choice, serverless DB platform selection | "design this schema", "review this migration", "should this be jsonb or columns", "production query is slow" | `db-stinger` |
| `neon-drizzle-worker-bee` | Neon Postgres plus Drizzle ORM for this SvelteKit/Vercel stack: connection driver choice, schema/migration review, pgvector wiring, RLS-without-Supabase | "set up Neon", "pick a connection driver for Vercel", "review this Drizzle schema/migration", "wire pgvector" | `neon-drizzle-stinger` |

### Auth and security

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `auth-worker-bee` | End-to-end auth implementation: provider selection, OAuth flows, MFA/passkeys, RBAC, session storage, B2B SSO | "set up auth", "pick an auth provider", "wire up Google sign-in", "RBAC for multi-tenant" | `auth-stinger` |
| `workos-worker-bee` | WorkOS specialist: AuthKit, sealed sessions, JWT/JWKS verification, User Management, RBAC, SSO, Directory Sync, MFA/passkeys, webhooks | "set up WorkOS", "wire up AuthKit", "AuthKit in SvelteKit", "WorkOS SCIM" | `workos-stinger` |
| `security-worker-bee` | Security audit and remediation for this repo's stack: OWASP Top 10, SvelteKit attack surface, tenant isolation, webhook security, supply chain | "security audit this branch", "scan for vulnerabilities", "check the webhook handler", "audit the tenant isolation" | `security-stinger` |
| `dependency-audit-worker-bee` | Supply-chain hygiene: scanner selection, CVE triage, SBOM generation, lockfile discipline, provenance verification | "audit our dependencies", "set up Renovate", "generate an SBOM", "supply chain security" | `dependency-audit-stinger` |

### Payments and integrations

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `payments-worker-bee` | Stripe integration for SvelteKit on Vercel: custom checkout via Elements, Payment Intents, subscriptions, webhook verification | "integrate Stripe", "build a custom checkout", "add the Payment Element", "webhook isn't firing" | `payments-stinger` |
| `gohighlevel-worker-bee` | GoHighLevel API integration: OAuth vs Private Integration Tokens, contacts/opportunities/pipelines, webhooks, workflows, Marketplace apps | "integrate GoHighLevel", "wire up a GHL webhook", "push leads into GoHighLevel", "GoHighLevel OAuth" | `gohighlevel-stinger` |

### Communication and bots

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `discord-bot-worker-bee` | Discord bot development: slash commands, interactive components, voice playback, gateway architecture, rate limits, verification checklist | "add a slash command", "set up voice", "my bot hits 100 servers", "wire up a modal" | `discord-bot-stinger` |
| `slack-app-worker-bee` | Slack app development on the Bolt SDK: slash commands, modals, Events API, multi-workspace OAuth, Marketplace submission | "build a Slack app", "create a Slack modal", "set up Slack Events API" | `slack-app-stinger` |
| `telegram-bot-worker-bee` | Telegram bot development: Bot API, grammY/aiogram, webhook vs long-polling, Mini App initData validation, Stars payments | "building a new Telegram bot", "debugging webhook delivery failures", "wiring a Mini App" | `telegram-bot-stinger` |

### AI and cognitive layer

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `mind-worker-bee` | Cognitive-layer architecture for an AI feature: coach/agent routing, prompt cascade, RAG, three-tier memory, observability, evaluation | "review this AI code", "audit RAG", "add a coach", "change the prompt cascade" | `mind-stinger` |
| `vector-store-worker-bee` | Vector and embedding storage: schema/column design, index selection (HNSW vs IVFFlat), hybrid storage-layer search, migrations, dataset versioning. Neon plus pgvector plus Drizzle is the default for this stack; Deep Lake, Qdrant, and managed services are documented alternatives with a selection matrix | "design this vector table", "which index should this use", "pgvector or Deep Lake or Qdrant", "wire pgvector into this Drizzle schema" | `vector-store-stinger` |
| `embeddings-runtime-worker-bee` | Embedding model selection generally (OpenAI, Cohere, Voyage, open-weight local), dimension/cost tradeoffs, batching, caching, local vs hosted inference; keeps the local nomic-embed daemon as the self-hosted option | "should I turn embeddings on", "swap the embedding model", "local vs hosted embeddings", "the embed daemon is stuck" | `embeddings-runtime-stinger` |
| `retrieval-worker-bee` | Retrieval for an app on Neon Postgres: full-text search, pgvector similarity, hybrid fusion (RRF), reranking, chunking strategy, retrieval quality evaluation; keeps Deep Lake BM25/vector hybrid recall as a documented implementation | "tune recall", "why did this query miss", "semantic vs lexical here", "recall is noisy" | `retrieval-stinger` |

### Infrastructure and delivery

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `vercel-worker-bee` | Vercel deployment for SvelteKit plus Neon: adapter-vercel config, runtime choice, ISR/cache precedence, cron, image optimization, WAF | "deploy to Vercel", "set up adapter-vercel", "why is my Vercel bill high", "roll back this deployment" | `vercel-stinger` |
| `devops-worker-bee` | Container build and CI/CD pipeline: Dockerfile hygiene, Compose for dev, GitHub Actions architecture, image scanning, local-CI parity | "review my Dockerfile", "design our CI pipeline", "audit our workflow security", "this build is slow" | `devops-stinger` |
| `doppler-worker-bee` | Doppler secrets management: project/config model, CLI, Vercel sync, service tokens, secret rotation, audit logs | "set up Doppler", "sync secrets to Vercel", "rotate this secret", "scope a service token" | `doppler-stinger` |
| `tailscale-worker-bee` | Tailscale networking: tailnets, MagicDNS, ACLs, SSH, subnet routers, reaching a private Neon database, Funnel/Serve, ephemeral CI nodes | "set up Tailscale", "write an ACL policy", "connect to the private database from my laptop" | `tailscale-stinger` |
| `cron-scheduling-worker-bee` | Scheduled-job design: cron expression authoring, platform limits, distributed-cron correctness, timezone/DST safety, retry patterns | "write a cron expression", "set up Vercel Cron", "my cron job runs twice" | `cron-scheduling-stinger` |
| `git-worker-bee` | Git mastery: interactive rebase, conflict resolution, history rewriting, reset/reflog recovery, worktrees, hooks, LFS, sparse checkout | "squash my commits", "I accidentally pushed a secret", "undo that rebase", "set up Git hooks" | `git-stinger` |
| `github-repo-health-worker-bee` | Repository hygiene audit: branching strategy, branch protection, PR culture, commit quality, CI density, CODEOWNERS, repo settings | "audit this repo", "repo health check", "check branch protection", "CODEOWNERS audit" | `github-repo-health-stinger` |
| `ci-release-worker-bee` | CI pipeline, build, and package-release discipline: workflow architecture, version sync, quality gates, publish-time secret hygiene (body still describes a legacy build target; see PAIRING-AUDIT.md) | "review our build", "design our CI", "audit our workflows", "cut a release" | `ci-release-stinger` |
| `changelog-release-notes-worker-bee` | Public changelogs and release notes: tool selection, impact-first copy, honest scope, multi-channel distribution | "write my changelog entry", "set up a changelog tool", "we just shipped X" | `changelog-release-notes-stinger` |
| `app-store-submission-worker-bee` | App store publication for iOS and Android: ASO, privacy compliance, rejection diagnosis, age ratings, IAP configuration | "submit my app", "App Store rejection", "ASO strategy", "set up IAP" | `app-store-submission-stinger` |

### Platform and harness

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `cursor-ide-worker-bee` | Cursor IDE platform: project rules authoring, MCP server registration, SDK for programmatic agent automation, custom modes, Cloud Agents | "review my rules", "migrate my .cursorrules", "add an MCP tool", "create a custom mode" | `cursor-ide-stinger` |
| `ai-coding-tools-worker-bee` | AI coding tool advisor: recommends and compares Cursor, Claude Code, Aider, Cline, Windsurf, Continue.dev, Replit Agent, Devin, Bolt | "which AI coding tool should I use", "Cursor vs Claude Code vs Aider", "how do I reduce AI coding costs" | `ai-coding-tools-stinger` |
| `ai-tools-platform-worker-bee` | AI toolbox: gateways, cloud providers, frontier model selection, cheap-fallback routes, local LLMs, GPU cloud, MCP servers, IDE plugins | "which AI provider should I use", "set up Portkey", "configure OpenRouter", "LLM spend is too high" | `ai-tools-platform-stinger` |
| `terminal-bash-worker-bee` | Terminal productivity: Bash/Zsh/Fish config, modern CLI tools, shell scripting, dotfile architecture, tmux/Zellij, task automation | "improve my dotfiles", "review this shell script", "set up tmux", "just vs make" | `terminal-bash-stinger` |
| `harness-integration-worker-bee` | Per-host adapter design for plugging a tool into multiple AI coding harnesses (body targets a different set of harnesses than this repo's four; see PAIRING-AUDIT.md) | "wire a new harness", "add a hook event", "register the MCP server", "audit a harness adapter" | `harness-integration-stinger` |
| `mcp-protocol-worker-bee` | MCP server and tool-contract design: tool vs resource vs prompt, schema validation, transport choice, JSON-RPC error semantics (body still cites a legacy product's tool names; see PAIRING-AUDIT.md) | "audit this MCP server", "is this tool schema right", "stdio or HTTP transport" | `mcp-protocol-stinger` |

### Observability

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `posthog-worker-bee` | PostHog: SvelteKit install, pageview tracking, event/property naming, feature flags, experiments, session replay, group analytics | "set up PostHog", "add a feature flag", "instrument analytics events", "PostHog session replay" | `posthog-stinger` |
| `sentry-worker-bee` | Sentry for SvelteKit on Vercel: client/server SDK setup, source map upload, release association, performance tracing, PII scrubbing | "set up Sentry", "wire up error tracking", "upload source maps", "tune alert rules" | `sentry-stinger` |
| `lighthouse-pagespeed-worker-bee` | Lighthouse and PageSpeed audits: local vs CI runs, all four audit categories, score/performance budgets, lab-vs-field data gap | "set up Lighthouse CI", "add a performance budget to CI", "my Lighthouse score is 90 but CrUX says I'm failing" | `lighthouse-pagespeed-stinger` |
| `status-page-worker-bee` | Public status page: platform selection, component tree, incident communication templates, subscriber notifications, compliance | "set up a status page", "write an incident communication template", "configure subscriber notifications" | `status-page-stinger` |

### Website and growth

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `website-worker-bee` | Builds production-grade SvelteKit plus Payload CMS websites end to end from a brief: architecture, SEO, auth, admin, lead capture, blog | "build a website", "scaffold a SvelteKit site", "ship a website from scratch" | `website-stinger` |
| `seo-aeo-worker-bee` | SvelteKit plus Payload CMS plus Vercel SEO and Answer Engine Optimization: metadata, JSON-LD, Payload SEO fields, Core Web Vitals, llms.txt | "audit SEO on this SvelteKit site", "optimize for AI Overviews", "fix Core Web Vitals" | `seo-aeo-stinger` |
| `product-tour-onboarding-ui-worker-bee` | In-app product tour and onboarding UI: tool selection, tooltip/modal/hotspot/checklist components, segment-based triggers | "set up a product tour", "build an onboarding checklist", "our tours keep breaking after deploys" | `product-tour-onboarding-ui-stinger` |

### Documentation and knowledge

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `adr-writing-worker-bee` | Architecture Decision Records: Nygard format, MADR template, Y-statement framing, supersession lifecycle | "write an ADR", "record this decision", "supersede ADR-NNN", "set up our ADR log" | `adr-writing-stinger` |
| `api-docs-worker-bee` | API documentation: docs-renderer selection, OpenAPI spec enrichment with examples, hosted/self-hosted deployment, SDK generation | "set up API docs", "which docs renderer should I use", "generate a TypeScript SDK from my spec" | `api-docs-stinger` |
| `asset-worker-bee` | Owns the Universal Asset Registry: the platform-owned catalog of features, pages, routes, controls, tokens, and other first-class assets | "registering a new asset", "auditing drift between code and DB", "generating registry migrations" | `asset-stinger` |
| `docs-site-worker-bee` | Documentation-site infrastructure: platform selection, the Diataxis content pyramid, docs-as-code CI, search | "pick a docs platform", "set up Docusaurus", "add search to docs" | `docs-site-stinger` |
| `knowledge-worker-bee` | Authors narrative knowledge documentation: system overviews, architecture docs with diagrams, schema references, coding standards | "document the auth architecture", "write the system overview", "create knowledge docs for this repo" | `knowledge-stinger` |
| `library-worker-bee` | Owns the full documentation lifecycle for the repo's library/: scaffolds structure, ingests issues into IRDs, generates PRDs, backwards-PRDs | "initialize library", "ingest new issues", "write a PRD for X", "backwards-PRD this module" | `library-stinger` |
| `mcp-tool-docs-worker-bee` | Documentation for MCP tools, CLI surfaces, and generated API references (body still cites a legacy npm package; see PAIRING-AUDIT.md) | "document the MCP tools", "generate TypeDoc from the TS source", "document the CLI" | `mcp-tool-docs-stinger` |
| `readme-writing-worker-bee` | Authors and audits README files as a conversion surface: canonical section order, badge discipline, OSS vs internal register | "write a README", "audit my README", "README-driven development" | `readme-writing-stinger` |
| `runbook-writing-worker-bee` | Operational runbook authorship: canonical templates, no-implied-context audit, exact-command discipline, escalation paths, rollback standards | "write a runbook", "audit this runbook", "we need a runbook for this alert" | `runbook-writing-stinger` |
| `technical-writing-craft-worker-bee` | Documentation writing quality: Diataxis framework, inverted-pyramid prose, code-example discipline, voice and tone consistency | "review this document", "is this doc well-written", "apply Diataxis" | `technical-writing-craft-stinger` |
| `wiki-worker-bee` | Extracts code entities and architectural concepts into atomic, backlinked wiki pages; infers ADRs from commit messages | "extract entities from a file or directory", "document this module's exports", "add this to the knowledge graph" | `wiki-stinger` |

### Process and quality

| Bee | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `agile-scrum-worker-bee` | Scrum methodology: audits whether teams actually practice Scrum, coaches ceremonies, writes Definition of Done, diagnoses anti-patterns | "audit our Scrum process", "is this Scrum", "write our DoD", "our retros don't produce anything" | `agile-scrum-stinger` |
| `branching-strategy-worker-bee` | Branching strategy advisor: model selection, release/hotfix patterns, merge-vs-rebase, feature-flag vs feature-branch decision | "which branching model should we use", "GitFlow or trunk-based", "merge or rebase" | `branching-strategy-stinger` |
| `code-review-pr-worker-bee` | Code review culture and PR lifecycle: PR description audits, review checklists, PR-size evaluation, rubber-stamp diagnosis | "audit our PR culture", "write a PR description", "create a review checklist" | `code-review-pr-stinger` |
| `estimation-worker-bee` | Software estimation and forecasting: relative-sizing frameworks, the NoEstimates movement, planning-fallacy literature, probabilistic forecasting | "our story points mean nothing", "should we use NoEstimates", "we need a 90% confidence delivery date" | `estimation-stinger` |
| `kanban-flow-worker-bee` | Kanban method: WIP limit design, flow-metric calculation, Little's Law diagnostics, visual-board design, class-of-service policies | "set up WIP limits", "calculate cycle time", "apply Little's Law" | `kanban-flow-stinger` |
| `quality-worker-bee` | Quality-assurance reviewer that audits a completed implementation against its source plan document and produces findings | "QA this", "audit the implementation", "check the plan against the code" | `quality-stinger` |
| `retrospective-worker-bee` | Retrospective facilitation: format selection, psychological safety pre-check, time-boxed facilitation plan, action-item follow-through | "run a retro", "plan our retrospective", "our retros produce no change" | `retrospective-stinger` |

---

## Dispatch and arming contract

Spawn every Bee at the top level. Do not nest a Bee inside another Bee.

Every dispatch prompt must arm the Bee before it does anything else:

> You are `<bee-name>`. Before doing anything else, read your paired Stinger in full at `.claude/skills/<stinger-name>/SKILL.md` and follow it as your operating manual. Then: [scoped task, exact files in scope, definition of done, how the work will be verified].

Resolve `<stinger-name>` from the Paired Stinger column above, or apply the convention directly: `<base>-worker-bee` to `<base>-stinger`.

A Bee dispatched without its Stinger armed is a failed dispatch. Terminate it and re-dispatch with the arming line present. Do not let a Bee proceed on partial knowledge of its own procedure.

---

## Ship Gate

Every development-focused dispatch closes with the same three gates, in this order, no exceptions:

1. `security-stinger`, armed on `security-worker-bee`, audits the change first. Security fixes can invalidate a QA pass, so security always runs before quality.
2. `quality-stinger`, armed on `quality-worker-bee`, verifies the implementation against its source plan, after security fixes have landed.
3. The orchestrator itself, not a dispatched Bee, loads `github-repo-health-stinger` directly and runs the repo-health check.

Never run quality before security. If quality already ran out of order for a cycle, do not run it again; flag the ordering violation, let security run and land fixes, then re-run quality.

After all three gates pass, the user reviews the findings and the diff and gives explicit approval before anything is committed or pushed. No Bee and no orchestrator commits or pushes without that approval.

---

## Multi-Bee orchestration

Real sequences for this stack. Every sequence below closes with the Ship Gate; it isn't repeated in each entry.

### Build a website

1. `website-worker-bee` scaffolds or extends the site from the brief.
2. `svelte-worker-bee` for SvelteKit/Svelte 5 structure and runes.
3. `tailwind-worker-bee` for utility and token work.
4. `shadcn-svelte-worker-bee` for component installs.
5. `seo-aeo-worker-bee` for metadata, JSON-LD, and Core Web Vitals.
6. Ship Gate.

### Add auth

1. `workos-worker-bee` wires AuthKit, sessions, and SSO.
2. `security-worker-bee` audits the implementation (session handling, token storage).
3. `neon-drizzle-worker-bee` (or `db-worker-bee` for generic Postgres theory) reviews the users/organizations schema.
4. Ship Gate.

### Take payments

1. `payments-worker-bee` builds the Stripe Elements checkout and webhook handling.
2. `security-worker-bee` audits webhook signature verification and secret handling.
3. `neon-drizzle-worker-bee` reviews the schema that stores customer and subscription state.
4. Ship Gate.

### Ship a release

1. `ci-release-worker-bee` drives the build and the CI workflows.
2. `changelog-release-notes-worker-bee` writes the changelog entry and release notes.
3. `github-repo-health-worker-bee`, or the orchestrator loading `github-repo-health-stinger` directly per the Ship Gate, confirms repo health before tagging.

### Instrument the product

1. `posthog-worker-bee` wires product analytics, feature flags, or experiments.
2. `sentry-worker-bee` wires error tracking and performance tracing.
3. Ship Gate.

### Data-layer change

1. `neon-drizzle-worker-bee` designs or reviews the Drizzle schema and migration.
2. `db-worker-bee` weighs in when the question is generic Postgres indexing or partitioning theory, not Neon- or Drizzle-specific.
3. `security-worker-bee` audits tenant isolation and PII handling.
4. Ship Gate.

Add a sequence here whenever a recurring multi-Bee pattern emerges in practice.

---

## Adding a new Bee

Don't hand-roll a new Bee. Walk [`../queen-bee-stinger/guides/beekeeper-registration.md`](../queen-bee-stinger/guides/beekeeper-registration.md), the forge's registration guide, start to finish. It covers naming the pair, writing the agent frontmatter, writing the paired Stinger, and registering both here.

---

**76 Bees registered.** Every Bee has a spawnable agent in `.claude/agents/` and a paired Stinger in `.claude/skills/`. See [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md) for the full pairing audit, including the handful of Bees whose body content still needs a rewrite pass to match this repo's actual stack.

---

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [queen-bee-stinger](../queen-bee-stinger) - The forge. Creates and validates new rules, plugins, commands, Bees, and Stingers across all four harnesses.
  - [get-started-stinger](../get-started-stinger) - Repository initialization and hardening. Orchestrator level.
  - [security-stinger](../security-stinger) - First gate of the Ship Gate.
  - [quality-stinger](../quality-stinger) - Second gate of the Ship Gate.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Final orchestrator-level gate before commit and push.
