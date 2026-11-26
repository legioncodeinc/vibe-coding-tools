---
name: "pest-controller-suit"
description: "Route Wasp Nest tasks to the right Drone, arm its Stinger, and enforce the Ship Gate. Use before multi-Drone work. Read README.md for the guide map."
license: AGPL-3.0-or-later
metadata:
  hive-tier: orchestrator
---

# Pest-Controller-Suit

Start with [README.md](README.md) for the workflow map and detailed references.

Pest Controller-suit is the routing skill for The Wasp Nest, the agentic development system distributed by Vibe Coding Tools. The Wasp Nest works across Claude Code, Cursor, ChatGPT Codex, and Claude Cowork. It is built from Drones (subagents, one per domain) and Stingers (the paired skill each Drone reads before it touches anything). Pest Controller-suit does not do the work itself. Given a request, it names the Drone that owns it, makes sure that Drone arms itself with its Stinger, and enforces the Ship Gate before anything gets committed or pushed.

The application stack this colony serves is SvelteKit with Svelte 5, Payload CMS, Vercel, Neon Postgres with Drizzle, WorkOS auth, Stripe with custom Elements, Doppler for secrets, PostHog for analytics, Sentry for error tracking, Tailscale for private networking, and GoHighLevel for CRM integration. Most of the roster below speaks that stack directly. The rest handles the process around it: documentation, git hygiene, project management, CI, and other platforms a client project might touch (Discord, Slack, Telegram, mobile app stores).

A small number of Drones still carry description or body text from a prior product this repo does not run anymore. They stay in the roster, because an unregistered Drone is a Drone the orchestrator can't find, but they are marked below and logged in full in [`PAIRING-AUDIT.md`](PAIRING-AUDIT.md).

---

## The pairing law

Every Drone pairs with exactly one Stinger: `<base>-wasp-drone` to `<base>-stinger`. No exceptions inside the roster below; every row checks out.

Core has three orchestrator skills without paired Drones. Skill-only capabilities are also allowed when their frontmatter explicitly declares `metadata.hive-tier: standalone`; the validator checks this for every pack. A standalone skill does not claim a specialist Drone exists.

- `pest-controller-suit` (this file, the router)
- `queen-wasp-stinger` (the forge that creates and validates new Drones and Stingers)
- `get-started-stinger` (repository initialization and hardening)

---

## Installed capability prerequisites

Read Core's `plugin-catalog.json` before selecting a specialist. Every component has one plugin owner. Core remains required; Website Audit also requires Browser and App Testing. Full KB Refresh additionally requires Code Audit.

For local installed plugins, run Core's `hooks/resolve-component.py` with the paired skill name. It reads `~/.wasp-nest/installed-plugins.json`, or Claude Code's own `~/.claude/plugins/installed_plugins.json` after a `/plugin install` when that file is absent, and returns the checked installed path. Load that path before dispatch. If no shell is available, inspect the installed capability list and manifests to verify the same prerequisites. Stop a dependent workflow when its owner or prerequisite is missing; do not follow a source-repository link as an installed runtime substitute.

## Roster

For a user asking which capability fits a desired result, use [outcome discovery](guides/outcome-discovery.md). Its packaged shortlist keeps proposed gaps distinct from existing scope and verified installed availability.

172 Drones routed across Core and optional plugins, sorted into domain groups. Website Audit dispatches its separate twenty-Drone engagement. The Domain column is a one-line summary of the Drone's own frontmatter description. Trigger keywords are pulled from that same description, not invented.

### Stack and frameworks

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `svelte-wasp-drone` | Svelte language/runtime and accessible form contracts: runes, actions, progressive enhancement, server validation and version-qualified behavior | "runes", "SvelteKit form actions", "accessible forms", "robust validation" | `svelte-stinger` |
| `shadcn-svelte-wasp-drone` | shadcn-svelte component library: CLI, copy-in-repo model, registry system, theming, Superforms and Formsnap, accessibility via Bits UI | "install shadcn-svelte", "add a shadcn-svelte component", "theme shadcn-svelte", "build a shadcn-svelte registry" | `shadcn-svelte-stinger` |
| `tailwind-wasp-drone` | Tailwind v4 framework and component fit: CSS-first config, source detection, tokens and selected shadcn/framework boundaries | "migrate to Tailwind v4", "use Tailwind and shadcn", "component framework fit", "source detection" | `tailwind-stinger` |
| `tanstack-wasp-drone` | TanStack inside SvelteKit: Query SSR/caching/mutations, runes-native Table, Form snippet validation, Virtual | "add TanStack Query", "set up svelte-query", "build a data table", "virtualize this list" | `tanstack-stinger` |
| `preact-wasp-drone` | Preact 11: signals API, preact/compat migration from React, embed widgets, Astro islands, Fresh 2.x | "Preact vs React", "migrate a React codebase to Preact", "embed a widget on third-party pages", "Astro island" | `preact-stinger` |
| `react-wasp-drone` | React architecture and separate-backend Vite apps: state ownership, component extraction, request ordering and explicit emitted-bundle measurement | "review React architecture", "build React Vite with a backend", "split a giant component", "measure bundle weight", "simplify state" | `react-stinger` |
| `xyflow-wasp-drone` | React Flow and Svelte Flow (xyflow) node editors and diagram canvases: setup, flow state, custom nodes, edges and handles, layout engines, sub flows, theming, React Flow UI, SSR, performance, accessibility, tests, and v11 or 0.x migrations | "build a workflow builder", "add a React Flow node editor", "custom Svelte Flow node", "auto layout this graph with dagre", "migrate reactflow to @xyflow/react" | `xyflow-stinger` |
| `typescript-node-wasp-drone` | TypeScript/Node code review and conventions: strict config, module resolution, test suites, boundary validation (body still cites a legacy package's specifics; see PAIRING-AUDIT.md) | "review this TypeScript code", "audit this Node code", "write a Vitest suite", "tighten the tsconfig" | `typescript-node-stinger` |
| `python-wasp-drone` | Python architecture and measured ORM access: Django/FastAPI, typed boundaries, jobs, migrations, authorization and N+1 characterization | "review Django code", "audit ORM patterns", "eliminate N+1 queries", "set up Celery" | `python-stinger` |
| `rust-wasp-drone` | Rust architecture and native background boundaries: bounded admission, errors, cooperative cancellation, shutdown and observed compiler/platform proof | "implement Rust", "native background work", "bounded Rust worker", "review Cargo" | `rust-stinger` |
| `tauri-wasp-drone` | Tauri native boundaries: sidecar credentials, local data migration, secure update/data compatibility, OS integrations and qualified native test evidence | "build Tauri app", "sidecar credentials", "desktop storage", "native update", "native app tests" | `tauri-stinger` |
| `electron-app-wasp-drone` | Electron desktop applications: main, preload, renderer, IPC, sandbox, permissions, packaging, and native verification | "build an Electron app", "Electron preload", "Electron IPC", "package Electron" | `electron-app-stinger` |
| `ux-ui-svelte-wasp-drone` | Enforces a project's SvelteKit UI standard (OSPRY's ADR-007 is the worked example): shadcn-svelte on Bits UI plus Melt UI, Tailwind v4 token bridge, white-label brand contract. Impeccable remains the primary router for UI/design implementation | "add a Button", "copy in this shadcn-svelte component", "convert this bespoke style to Tailwind", "does the white-label still work" | `ux-ui-svelte-stinger` |
| `dark-mode-theming-wasp-drone` | Dark-mode theming: CSS variable token architecture, theme-provider wiring, FOWT prevention, SSR hydration safety, Tailwind v4 dark variant | "set up dark mode", "dark mode on SSR", "multi-brand theming", "FOWT fix" | `dark-mode-theming-stinger` |
| `modal-toast-dialog-wasp-drone` | Accessible overlay primitives: dialog, alert dialog, drawer, toast, command menu; focus trap, escape, scroll lock, aria contract | "choosing between overlay primitives", "debugging focus trap regressions", "building a command palette" | `modal-toast-dialog-stinger` |
| `icon-system-wasp-drone` | Icon library selection and delivery: tree-shake vs sprite, dynamic-import-by-name, custom SVG components, icon accessibility contract | "choosing an icon library", "bundle-size regressions from icon imports", "icon accessibility" | `icon-system-stinger` |
| `typography-font-wasp-drone` | Typography system: variable fonts, font source selection, the FOIT/FOUT/FOFT story, fluid type scales, type-token architecture | "set up fonts", "audit our typography", "fix FOIT/FOUT", "build a type scale" | `typography-font-stinger` |
| `font-loading-wasp-drone` | Font loading pipeline: font-display strategy, preload/crossorigin correctness, variable-font subsetting, CLS-from-font-swap elimination | "audit font loading", "fix FOIT", "CLS from font swap", "subset variable font" | `font-loading-stinger` |
| `markdown-mdx-content-pipeline-wasp-drone` | Markdown/MDX pipeline: compiler selection, remark/rehype chains, syntax highlighting, AST manipulation, XSS sanitization | "set up MDX", "configure Shiki", "write a remark plugin", "sanitize user markdown" | `markdown-mdx-content-pipeline-stinger` |
| `csv-xlsx-import-export-wasp-drone` | Spreadsheet upload and export feature: CSV/XLSX parsing, large-file streaming, column-mapping wizard, row validation, CSV injection prevention | "build a CSV import", "add XLSX upload", "column-mapping wizard", "CSV injection safe" | `csv-xlsx-import-export-stinger` |
| `design-system-wasp-drone` | Bootstraps a complete design system from scratch: tokens, utility layer, per-component and per-screen specs, static HTML examples. Impeccable owns frontend UI/UX/design implementation and uses DESIGN.md drift rules plus its detector gate to make enforcement mechanical | "build a design system for X", "bootstrap UI for product Y", "create tokens and utilities for this product" | `design-system-stinger` |
| `impeccable-wasp-drone` | Frontend-design operating system for all UI/UX/design implementation, redesign, refinement, new surfaces, components, and design-system capture. Runs Start -> Iterate -> Polish -> Maintain, the context contract, motion/keyboard evidence and the deterministic detector gate | "polish the pricing page", "build a dashboard", "redo this hero", "make this not look like AI slop", "design a settings screen", "audit this UI" | `impeccable-stinger` |
| `http-rest-fundamentals-wasp-drone` | HTTP/REST protocol correctness: method safety and idempotency, status-code honesty, headers, conditional and range requests | "is this status code correct", "why is CORS failing", "explain preflight", "PUT vs PATCH" | `http-rest-fundamentals-stinger` |
| `image-optimization-wasp-drone` | Image delivery: AVIF/WebP format selection, responsive srcset/sizes, blur placeholders, remote image config, CLI tooling | "optimize my images", "convert to AVIF", "fix layout shift from images", "audit our images" | `image-optimization-stinger` |
| `go-wasp-drone` | Go implementation drone for modules, toolchains, vendoring/fork freezes, cgo .so plugin builds, and project layout | "go" | `go-stinger` |
| `react-to-svelte-wasp-drone` | Port-wave drone converting React surfaces to Svelte 5 against an immutable API contract - contract extraction, behavior inventory, runes/snippets port, per-row verification | "react to svelte" | `react-to-svelte-stinger` |
| `ux-ui-wasp-drone` | Product system and UI contract guidance: governing inputs, React primitives, mobile task priorities and exact manual/device evidence; Impeccable owns implementation | "design system", "React primitive contract", "mobile task flows", "UI review" | `ux-ui-stinger` |


### Browser and desktop engineering

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `browser-automation-wasp-drone` | Playwright and Puppeteer automation: browser tests, scripts, traces, screenshots, browser installs, and CI reliability | "write a Playwright test", "Puppeteer script", "browser automation", "Playwright browser install" | `browser-automation-stinger` |
| `chrome-chromium-wasp-drone` | Chrome DevTools Protocol and Chromium engineering: remote debugging, developer profiles, protocol inspection, source builds, and browser-engine diagnosis | "Chrome DevTools Protocol", "remote debugging Chrome", "Chromium build", "debug Chromium" | `chrome-chromium-stinger` |
| `webapp-capture-wasp-drone` | Capture a running web app as demos, screenshots, component inventory, design tokens, and visual/code inconsistency reports | "record a walkthrough", "screenshot every page", "capture our component library", "audit UI drift" | `webapp-capture-stinger` |

`webapp-capture-wasp-drone` and its Stinger live in the optional `browser-and-app-testing-tools` plugin. Confirm the pack is installed before dispatch; a core-only install cannot run its capture scripts.

### Data and persistence

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `db-wasp-drone` | PostgreSQL architecture, live-schema migration and tenant-boundary evidence: provenance, mixed writers, constraints, owner/bypass/session and query/data denial checks | "design this schema", "migrate live schema", "no guessed backfill", "multi-tenant data boundaries" | `db-stinger` |
| `neon-drizzle-wasp-drone` | Neon Postgres plus Drizzle ORM for this SvelteKit/Vercel stack: connection driver choice, schema/migration review, pgvector wiring, RLS-without-Supabase | "set up Neon", "pick a connection driver for Vercel", "review this Drizzle schema/migration", "wire pgvector" | `neon-drizzle-stinger` |
| `deeplake-dataset-wasp-drone` | Deep Lake data architecture specialist for Hivemind - the 7-table ColumnDef schema, `USING deeplake` DDL, FLOAT4[768] embeddings, additive schema healing, append-only version-bump writes, indexing (deeplake_index... | "design this table", "review this ColumnDef", "should this be JSONB or a column?", "is this index right?" | `deeplake-dataset-stinger` |


### Auth and security

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `auth-wasp-drone` | Authentication and takeover-resistant recovery: provider/application boundaries, MFA preservation, token scope, revocation and approved support policy | "set up auth", "account recovery", "reset token", "MFA recovery" | `auth-stinger` |
| `workos-wasp-drone` | WorkOS specialist: AuthKit, sealed sessions, JWT/JWKS verification, User Management, RBAC, SSO, Directory Sync, MFA/passkeys, webhooks | "set up WorkOS", "wire up AuthKit", "AuthKit in SvelteKit", "WorkOS SCIM" | `workos-stinger` |
| `security-wasp-drone` | Risk-bounded security design/review: threat and tenant/data boundaries, durable verified webhooks, browser/log secrets and exact candidate verification | "security review", "threat model", "tenant data responses", "webhook replay", "secret exposure" | `security-stinger` |
| `dependency-audit-wasp-drone` | Supply-chain hygiene, artifact-bound SBOM, safe major upgrades and manifest reading with exact source/consumer proof | "audit dependencies", "artifact SBOM", "upgrade major versions", "lockfile discipline" | `dependency-audit-stinger` |
| `lovable-audit-wasp-drone` | Empirical security audit of Lovable-built Supabase apps: row-level-security denial verification, role-differential visibility probes, Edge Function gating checks, auth-posture readout, client-bundle key and endpoint... | "audit this Supabase app", "pentest the Lovable build", "check the RLS on this project", "probe the Edge Functions" | `lovable-audit-stinger` |


### Payments and integrations

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `payments-wasp-drone` | Stripe Elements and server billing/access contracts: durable webhook intake, independent entitlements, trials/access states and approved refund/cancel preparation | "integrate Stripe", "server entitlements", "trial access", "refund cancellation workflow" | `payments-stinger` |
| `gohighlevel-wasp-drone` | GoHighLevel API integration: OAuth vs Private Integration Tokens, contacts/opportunities/pipelines, webhooks, workflows, Marketplace apps | "integrate GoHighLevel", "wire up a GHL webhook", "push leads into GoHighLevel", "GoHighLevel OAuth" | `gohighlevel-stinger` |
| `ghl-to-mermaid-wasp-drone` | Offline HighLevel export conversion into per-workflow JSON and Mermaid diagrams | "turn this GHL export into a flowchart", "map HighLevel automations", "split a location export" | `ghl-to-mermaid-stinger` |
| `elevenlabs-api-wasp-drone` | ElevenLabs API integration: speech, voices, streaming, usage metadata, and safe server boundaries | "integrate ElevenLabs", "ElevenLabs text to speech", "ElevenLabs streaming", "ElevenLabs API key" | `elevenlabs-api-stinger` |
| `heygen-api-wasp-drone` | HeyGen API integration: asynchronous video jobs, avatars, assets, webhooks, limits, and safe delivery | "integrate HeyGen", "HeyGen API", "HeyGen video generation", "HeyGen webhook" | `heygen-api-stinger` |
| `highlevel-ai-studio-wasp-drone` | HighLevel AI Studio and AI creation: Vibe sites, Content AI selection, Visual Edits, Code Editor, forms, calendars, publishing, domains, SEO, and troubleshooting | "HighLevel AI Studio", "AI Content Studio", "AI website builder", "HighLevel vibe code", "AI Studio form" | `highlevel-ai-studio-stinger` |
| `crm-integration-wasp-drone` | CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper | "integrate with HubSpot", "bi-directional CRM sync", "CRM field mapping", "Merge.dev or native API?" | `crm-integration-stinger` |
| `tawk-to-api-wasp-drone` | Reference for the tawk.to REST API v1.1.0 (https://api.tawk.to/v1) | "tawk to api" | `tawk-to-api-stinger` |

The `gohighlevel`, `highlevel-ai-studio`, and `ghl-to-mermaid` pairs above live in the optional `highlevel` pack. A core-only install can identify the request but cannot dispatch those Drones. Confirm that `highlevel` is installed before arming one; if absent, tell the user to install that pack rather than pretending the Drone or Stinger is available.


### Communication and bots

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `discord-bot-wasp-drone` | Discord bot development: slash commands, interactive components, voice playback, gateway architecture, rate limits, verification checklist | "add a slash command", "set up voice", "my bot hits 100 servers", "wire up a modal" | `discord-bot-stinger` |
| `slack-app-wasp-drone` | Slack app development on the Bolt SDK: slash commands, modals, Events API, multi-workspace OAuth, Marketplace submission | "build a Slack app", "create a Slack modal", "set up Slack Events API" | `slack-app-stinger` |
| `telegram-bot-wasp-drone` | Telegram bot development: Bot API, grammY/aiogram, webhook vs long-polling, Mini App initData validation, Stars payments | "building a new Telegram bot", "debugging webhook delivery failures", "wiring a Mini App" | `telegram-bot-stinger` |
| `lifecycle-email-wasp-drone` | Evidence-grounded lead follow-up emails: classification, sequences, cadence, suppression, QA, and handoff records | "write a lead follow-up email", "build a nurture sequence", "what should this prospect receive next" | `lifecycle-email-stinger` |
| `customer-support-tooling-wasp-drone` | Support stack, first-customer launch readiness and pre-sale obligations: actual coverage, promises, escalation, AI defaults, renewal and offboarding | "customer support tooling", "support before paying users", "support obligations", "renewal readiness", "service hours" | `customer-support-tooling-stinger` |
| `live-chat-support-wasp-drone` | Customer support surface specialist  -  Intercom, Crisp, Plain, Pylon, Help Scout  -  widget integration, HMAC/JWT identity verification, conversation routing, AI deflection (Fin 2.0, Ari, Crisp Bot), and the data-export... | "integrate live chat", "add a support widget", "set up Intercom", "configure Fin AI" | `live-chat-support-stinger` |


### AI and cognitive layer

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `mind-wasp-drone` | AI feature boundaries: untrusted source data, explicit tool authority, interruptible streams, consent/lineage memory and task-grounded multimodal evidence | "review AI code", "untrusted document instructions", "stream interruption", "memory consent", "tool authority" | `mind-stinger` |
| `vector-store-wasp-drone` | Vector and embedding storage: schema/column design, index selection (HNSW vs IVFFlat), hybrid storage-layer search, migrations, dataset versioning. Neon plus pgvector plus Drizzle is the default for this stack; Deep Lake, Qdrant, and managed services are documented alternatives with a selection matrix | "design this vector table", "which index should this use", "pgvector or Deep Lake or Qdrant", "wire pgvector into this Drizzle schema" | `vector-store-stinger` |
| `embeddings-runtime-wasp-drone` | Embedding model selection generally (OpenAI, Cohere, Voyage, open-weight local), dimension/cost tradeoffs, batching, caching, local vs hosted inference; keeps the local nomic-embed daemon as the self-hosted option | "should I turn embeddings on", "swap the embedding model", "local vs hosted embeddings", "the embed daemon is stuck" | `embeddings-runtime-stinger` |
| `retrieval-wasp-drone` | Retrieval for an app on Neon Postgres: full-text search, pgvector similarity, hybrid fusion (RRF), reranking, chunking strategy, retrieval quality evaluation; keeps Deep Lake BM25/vector hybrid recall as a documented implementation | "tune recall", "why did this query miss", "semantic vs lexical here", "recall is noisy" | `retrieval-stinger` |
| `bifrost-wasp-drone` | Bifrost gateway implementation drone for maximhq/bifrost trees - freeze and upgrade execution, admin API changes, plugin wiring, semantic cache config, contract extraction from docs/openapi | "bifrost" | `bifrost-stinger` |


### Infrastructure and delivery

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `vercel-wasp-drone` | Vercel deployment for SvelteKit plus Neon: adapter-vercel config, runtime choice, ISR/cache precedence, cron, image optimization, WAF | "deploy to Vercel", "set up adapter-vercel", "why is my Vercel bill high", "roll back this deployment" | `vercel-stinger` |
| `devops-wasp-drone` | Container build and CI/CD pipeline: Dockerfile hygiene, Compose for dev, GitHub Actions architecture, image scanning, local-CI parity | "review my Dockerfile", "design our CI pipeline", "audit our workflow security", "this build is slow" | `devops-stinger` |
| `doppler-wasp-drone` | Doppler secrets management: project/config model, CLI, Vercel sync, service tokens, secret rotation, audit logs | "set up Doppler", "sync secrets to Vercel", "rotate this secret", "scope a service token" | `doppler-stinger` |
| `tailscale-wasp-drone` | Tailscale networking: tailnets, MagicDNS, ACLs, SSH, subnet routers, reaching a private Neon database, Funnel/Serve, ephemeral CI nodes | "set up Tailscale", "write an ACL policy", "connect to the private database from my laptop" | `tailscale-stinger` |
| `cron-scheduling-wasp-drone` | Scheduled-job design: cron expression authoring, platform limits, distributed-cron correctness, timezone/DST safety, retry patterns | "write a cron expression", "set up Vercel Cron", "my cron job runs twice" | `cron-scheduling-stinger` |
| `git-wasp-drone` | Git mastery: interactive rebase, conflict resolution, history rewriting, reset/reflog recovery, worktrees, hooks, LFS, sparse checkout | "squash my commits", "I accidentally pushed a secret", "undo that rebase", "set up Git hooks" | `git-stinger` |
| `github-repo-health-wasp-drone` | Read-only local/remote hygiene with coverage limits: source workflow permissions, trust boundaries, candidate proof and actual enforced settings | "repo health", "automation permissions", "workflow trust review", "branch protection" | `github-repo-health-stinger` |
| `ci-release-wasp-drone` | Project-classified CI/release proof: actual duplicate work, candidate identity, trigger/consumer coverage, migration and artifact preservation | "improve CI", "duplicate builds", "review release pipeline", "candidate proof" | `ci-release-stinger` |
| `changelog-release-notes-wasp-drone` | Public changelogs and release notes: tool selection, impact-first copy, honest scope, multi-channel distribution | "write my changelog entry", "set up a changelog tool", "we just shipped X" | `changelog-release-notes-stinger` |
| `app-store-submission-wasp-drone` | Store-submission preparation: artifact and signing identity, data-flow privacy answers, current storefront rules and entitlement evidence | "submit my app", "prepare store evidence", "privacy declarations", "subscription readiness" | `app-store-submission-stinger` |

### Platform and harness

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `cursor-ide-wasp-drone` | Cursor IDE platform: project rules authoring, MCP server registration, SDK for programmatic agent automation, custom modes, Cloud Agents | "review my rules", "migrate my .cursorrules", "add an MCP tool", "create a custom mode" | `cursor-ide-stinger` |
| `ai-coding-tools-wasp-drone` | AI coding tool advisor: recommends and compares Cursor, Claude Code, Aider, Cline, Windsurf, Continue.dev, Replit Agent, Devin, Bolt | "which AI coding tool should I use", "Cursor vs Claude Code vs Aider", "how do I reduce AI coding costs" | `ai-coding-tools-stinger` |
| `ai-tools-platform-wasp-drone` | Provider/model infrastructure with evidence: request/token/retry/fallback reservations, feature costs and artifact/runtime/workload-bound local hardware fit | "AI provider", "request budgets", "local model fit", "feature margin" | `ai-tools-platform-stinger` |
| `terminal-bash-wasp-drone` | Terminal productivity: Bash/Zsh/Fish config, modern CLI tools, shell scripting, dotfile architecture, tmux/Zellij, task automation | "improve my dotfiles", "review this shell script", "set up tmux", "just vs make" | `terminal-bash-stinger` |
| `harness-integration-wasp-drone` | Cross-harness integration and capability receipts: task pack closure, hook payload contracts, command coverage, actual capacity, selected installation, direct-skill fallback and native release proof | "wire a harness", "select task packs", "prove hook payload", "audit installed commands", "installed availability", "no native agent tool" | `harness-integration-stinger` |
| `mcp-protocol-wasp-drone` | MCP server and tool-contract design: tool vs resource vs prompt, schema validation, transport choice, JSON-RPC error semantics (body still cites a legacy product's tool names; see PAIRING-AUDIT.md) | "audit this MCP server", "is this tool schema right", "stdio or HTTP transport" | `mcp-protocol-stinger` |

### Observability

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `posthog-wasp-drone` | PostHog event and flag lifecycle: exact contexts/configuration, server authority, rollout/cache failures, privacy and code/deploy/provider retirement | "set up PostHog", "flag lifecycle", "rollout and retire flags", "experiments" | `posthog-stinger` |
| `sentry-wasp-drone` | Sentry and actionable alert evidence: actual signals, windows, owners, recipient policy, trigger compatibility, privacy and recovery acceptance | "set up Sentry", "actionable alerts", "alert noise", "error tracking" | `sentry-stinger` |
| `lighthouse-pagespeed-wasp-drone` | Lighthouse and PageSpeed audits: local vs CI runs, all four audit categories, score/performance budgets, lab-vs-field data gap | "set up Lighthouse CI", "add a performance budget to CI", "my Lighthouse score is 90 but CrUX says I'm failing" | `lighthouse-pagespeed-stinger` |
| `status-page-wasp-drone` | Public status page: platform selection, component tree, incident communication templates, subscriber notifications, compliance | "set up a status page", "write an incident communication template", "configure subscriber notifications" | `status-page-stinger` |

### Website and growth

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `website-wasp-drone` | Scope quick websites and build SvelteKit/Payload sites: version-aware architecture, CMS contracts, public access and sourced readiness | "build a quick website", "build a website", "add Payload CMS", "independent CMS" | `website-stinger` |
| `seo-aeo-wasp-drone` | SvelteKit plus Payload CMS plus Vercel SEO and Answer Engine Optimization: metadata, JSON-LD, Payload SEO fields, Core Web Vitals, llms.txt | "audit SEO on this SvelteKit site", "optimize for AI Overviews", "fix Core Web Vitals" | `seo-aeo-stinger` |
| `product-tour-onboarding-ui-wasp-drone` | In-app product tour and onboarding UI: tool selection, tooltip/modal/hotspot/checklist components, segment-based triggers | "set up a product tour", "build an onboarding checklist", "our tours keep breaking after deploys" | `product-tour-onboarding-ui-stinger` |
| `competitive-research-wasp-drone` | Competitor and dated evidence research: actual source captures, claim ledgers, unknowns, reach scenarios and chosen output packet | "research competitors", "dated research ledger", "evidence packet", "market scenarios" | `competitive-research-stinger` |
| `icp-research-wasp-drone` | Ideal Customer Profile research from a company domain: seed from its site, fan out with Exa or Firecrawl across customers, market, hiring, reviews, news, and technographic lanes, grade stated vs revealed evidence, deliver an ICP dossier (account and role level only) | "find the ICP for example.com", "who are this company's ideal customers", "reverse-engineer this competitor's ICP", "build segments and a buying committee from public research" | `icp-research-stinger` |
| `affiliate-referral-program-wasp-drone` | Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate-vs-referral distinction, cookie-based and server-side... | "set up an affiliate program", "which affiliate platform should I use", "Rewardful vs FirstPromoter", "my attribution is broken in Safari" | `affiliate-referral-program-stinger` |
| `alt-ads-platforms-wasp-drone` | Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search  -  LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (Smart+ 2026 default, CAPI), Reddit Ads (community... | "which ad platform beyond Meta/Google for my ICP", "set up LinkedIn Ads for B2B SaaS", "TikTok CAPI setup", "Reddit Ads for developers" | `alt-ads-platforms-stinger` |
| `blogging-content-strategy-wasp-drone` | Editorial blogging strategy specialist  -  cluster + pillar topical authority architecture, post-length decisions by search intent, title + H1 + meta description craft, keyword research scoping without obsession,... | "map our blog content", "what should we write about", "review this post before publishing", "set a blog cadence" | `blogging-content-strategy-stinger` |
| `cold-outreach-wasp-drone` | Outbound sales specialist for founders running cold email | "set up cold outreach", "my cold email lands in spam", "write a cold email sequence", "set up Clay personalization" | `cold-outreach-stinger` |
| `newsletter-platform-wasp-drone` | Newsletter-as-channel specialist for product builders and founders  -  platform selection (Beehiiv, ConvertKit/Kit, Loops, Substack, Resend Audiences, Ghost), embedded newsletter signup integration for Next.js,... | "which newsletter platform should I use", "embed a newsletter signup", "migrate from Substack to Beehiiv", "how do I monetize my newsletter" | `newsletter-platform-stinger` |
| `product-feedback-roadmap-wasp-drone` | Customer-feedback-to-roadmap loop specialist  -  Userback, Canny, Featurebase, Productboard, Frill, Productlane  -  in-app-widget vs portal vs voting-board taxonomy, status transitions, public vs private roadmaps,... | "set up a feedback system", "which feedback tool should I use", "Canny vs Featurebase", "our feature requests are a mess" | `product-feedback-roadmap-stinger` |
| `review-funnels-wasp-drone` | Review collection and online-reputation specialist for SaaS products | "set up G2", "get more reviews", "Product Hunt launch", "is this incentive compliant" | `review-funnels-stinger` |
| `social-media-marketing-organic-wasp-drone` | Genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people) | "help me with social media", "which platform should I focus on", "I want to build in public", "my social is inconsistent or dead" | `social-media-marketing-organic-stinger` |


### Documentation and knowledge

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `adr-writing-wasp-drone` | Architecture Decision Records: Nygard format, MADR template, Y-statement framing, supersession lifecycle | "write an ADR", "record this decision", "supersede ADR-NNN", "set up our ADR log" | `adr-writing-stinger` |
| `api-docs-wasp-drone` | API documentation and contract-bound SDK guidance: pinned specs, generator/config/runtime, public exports, compatibility and actual consumer characterization | "API docs", "reusable SDK", "consumer contract", "stable API" | `api-docs-stinger` |
| `asset-wasp-drone` | Owns the Universal Asset Registry: the platform-owned catalog of features, pages, routes, controls, tokens, and other first-class assets | "registering a new asset", "auditing drift between code and DB", "generating registry migrations" | `asset-stinger` |
| `archivist-wasp-drone` | Acquired-repository archival: provenance and license intake, attribution and PII scrub, documentation consolidation, research-object preparation | "archive this acquired repo", "strip attribution and PII", "prepare this repository as a research object" | `archivist-stinger` |
| `contract-writing-wasp-drone` | Stable shared interface agreements before parallel PRDs: identify, document, accept, revise, and audit cross-PRD contracts | "write a shared contract", "freeze the interface", "identify stable contracts across our PRDs", "audit contract drift" | `contract-writing-stinger` |
| `docs-site-wasp-drone` | Documentation-site infrastructure: platform selection, the Diataxis content pyramid, docs-as-code CI, search | "pick a docs platform", "set up Docusaurus", "add search to docs" | `docs-site-stinger` |
| `library-packets-wasp-drone` | Source-grounded audience packets from any library: Markdown, Word, branded PDF, citations, coverage and every-page review | "turn this library into documents", "branded document packet", "Markdown Word PDF briefs", "run library-packets" | `library-packets-stinger` |
| `knowledge-wasp-drone` | Source-grounded knowledge, behavior-preserving diagrams and meeting decision/action drafts: exact facts, uncertainty, authority and evidence-preserving handoff | "document architecture", "diagram actual behavior", "explain repository", "meeting decisions", "action drafts" | `knowledge-stinger` |
| `library-wasp-drone` | Owns Library lifecycle, PRDs/IRDs and reuse of templates from source-pinned workflows; preserves adaptations, authority and evidence status | "initialize library", "ingest new issues", "write a PRD for X", "reuse workflow template", "backwards-PRD this module" | `library-stinger` |
| `mcp-tool-docs-wasp-drone` | Documentation for MCP tools, CLI surfaces, and generated API references (body still cites a legacy npm package; see PAIRING-AUDIT.md) | "document the MCP tools", "generate TypeDoc from the TS source", "document the CLI" | `mcp-tool-docs-stinger` |
| `readme-writing-wasp-drone` | Authors and audits README files as a conversion surface: canonical section order, badge discipline, OSS vs internal register | "write a README", "audit my README", "README-driven development" | `readme-writing-stinger` |
| `runbook-writing-wasp-drone` | Operational runbook authorship: canonical templates, no-implied-context audit, exact-command discipline, escalation paths, rollback standards | "write a runbook", "audit this runbook", "we need a runbook for this alert" | `runbook-writing-stinger` |
| `technical-writing-craft-wasp-drone` | Documentation writing quality: Diataxis framework, inverted-pyramid prose, code-example discipline, voice and tone consistency | "review this document", "is this doc well-written", "apply Diataxis" | `technical-writing-craft-stinger` |
| `wiki-wasp-drone` | Extracts code entities and architectural concepts into atomic, backlinked wiki pages; infers ADRs from commit messages | "extract entities from a file or directory", "document this module's exports", "add this to the knowledge graph" | `wiki-stinger` |
| `knowledge-base-help-center-wasp-drone` | Customer-facing knowledge base specialist  -  platform selection (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide), search-first architecture, AI deflection (chat-with-your-docs,... | "pick a KB platform", "set up a help center", "migrate Zendesk Guide", "add AI deflection to our docs" | `knowledge-base-help-center-stinger` |


### Process and quality

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `agile-scrum-wasp-drone` | Scrum methodology: audits whether teams actually practice Scrum, coaches ceremonies, writes Definition of Done, diagnoses anti-patterns | "audit our Scrum process", "is this Scrum", "write our DoD", "our retros don't produce anything" | `agile-scrum-stinger` |
| `branching-strategy-wasp-drone` | Branching strategy advisor: model selection, release/hotfix patterns, merge-vs-rebase, feature-flag vs feature-branch decision | "which branching model should we use", "GitFlow or trunk-based", "merge or rebase" | `branching-strategy-stinger` |
| `code-review-pr-wasp-drone` | Code review culture and PR lifecycle: PR description audits, review checklists, PR-size evaluation, rubber-stamp diagnosis | "audit our PR culture", "write a PR description", "create a review checklist" | `code-review-pr-stinger` |
| `estimation-wasp-drone` | Software estimation and forecasting: relative-sizing frameworks, the NoEstimates movement, planning-fallacy literature, probabilistic forecasting | "our story points mean nothing", "should we use NoEstimates", "we need a 90% confidence delivery date" | `estimation-stinger` |
| `kanban-flow-wasp-drone` | Kanban method: WIP limit design, flow-metric calculation, Little's Law diagnostics, visual-board design, class-of-service policies | "set up WIP limits", "calculate cycle time", "apply Little's Law" | `kanban-flow-stinger` |
| `quality-wasp-drone` | Independent Quality reviewer: plan traceability, exact candidate identity, actual check receipts and evidence-limited findings | "QA this", "bind verification evidence", "audit the implementation", "check the plan against the code" | `quality-stinger` |
| `retrospective-wasp-drone` | Retrospective facilitation: format selection, psychological safety pre-check, time-boxed facilitation plan, action-item follow-through | "run a retro", "plan our retrospective", "our retros produce no change" | `retrospective-stinger` |
| `swarm-audit-wasp-drone` | Swarm audits of a repository: scouts and briefs a Workflow fleet of single-lens investigators, adversarial refuters, Opus interpreters and critic; runs the 10-minute check-ins, kills and respawns stalls, guarantees nothing goes unreviewed; assembles the master report | "swarm audit", "state of the union", "audit every branch local and remote", "where did the team screw up", "launch an ultracode fleet" | `swarm-audit-stinger` |
| `tars-wasp-drone` | Session manager for the Claude Code desktop app: turns asks into chips, manages every session to merged and deployed, fields questions, decides within manager authority, launches every chip through `/smoke-it` or the pest-controller command, negotiates with CASE (adviser and read-only systems and CI watcher) and routes ideas to KIPP (idea factory and PRD writer), runs a 10-minute tick and a 1-minute CI watch; does no implementation work | "be TARS", "manage these sessions", "spawn chips for this", "run the swarm" | `tars-stinger` |
| `code-forensics-wasp-drone` | Conducts forensic investigations of software-development and agency-services engagements to support fee-clawback, breach-of-contract, fraud, and gross-negligence claims | "code forensics" | `code-forensics-stinger` |
| `discovery-research-wasp-drone` | Continuous product discovery coach  -  Teresa Torres interview cadence, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interviews, assumption mapping, and prototype experiment design | "run a discovery session", "build an OST", "write an interview script", "map our assumptions" | `discovery-research-stinger` |
| `okr-goal-setting-wasp-drone` | OKR methodology specialist  -  writes, grades, and iterates on Objectives and Key Results | "write OKRs", "audit our OKRs", "are these KRs measurable?", "set up a quarterly goal cycle" | `okr-goal-setting-stinger` |

### Code audit (`code-audit-tools` plugin)

These Drones serve `/audit-my-code`. The `audit-my-code-stinger` orchestrator dispatches them by tier; route to one directly only for a single-dimension request. All of them are read-only against the audited repository and write to the run workspace defined in `audit-my-code-stinger/references/audit-contract.md`. `kb-refresh-wasp-drone` serves `/kb-refresh` instead and is dispatched by that command directly; it writes documentation, never code.

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `code-foundation-wasp-drone` | Foundation health: Library and agent readiness (get-started in assess mode), CI, tests, lint, typecheck, lockfiles, secrets hygiene, governance | "is this repo set up right", "foundation audit", "repo health check for agents" | `code-foundation-stinger` |
| `code-bloat-wasp-drone` | Duplication (jscpd), unused code (knip and language equivalents), line counts (cloc/scc), giant files and functions, split plans | "is this codebase bloated", "how much copy-paste", "find dead code", "jscpd", "knip" | `code-bloat-stinger` |
| `react-security-wasp-drone` | React 18/19 security: XSS sinks, RSC and Server Functions advisories, client trust, bundle secrets | "React security audit", "is our React app vulnerable", "React2Shell" | `react-security-stinger` |
| `nextjs-security-wasp-drone` | Next.js security: advisories by version, proxy and middleware auth, Server Actions, route handlers, data exposure, caching, config | "Next.js security audit", "are our server actions safe", "middleware bypass" | `nextjs-security-stinger` |
| `sveltekit-security-wasp-drone` | Svelte and SvelteKit security: load data exposure, actions and remote functions, hooks authorization, CSRF, CSP, cookies | "SvelteKit security audit", "are our form actions safe", "Svelte XSS" | `sveltekit-security-stinger` |
| `polyglot-security-wasp-drone` | Multi-ecosystem security: Node servers, Python, Go, Rust, Ruby, PHP, Java/Kotlin, .NET, plus secrets, dependencies, static analysis, CI/CD | "security audit this Django/Go/Rails/Spring app", "osv-scanner", "multi-language security review" | `polyglot-security-stinger` |
| `code-audit-brief-wasp-drone` | Renders the Legion Code Inc. branded HTML brief from an audit workspace | "render the audit brief", "rebuild the brief" | `code-audit-brief-stinger` |
| `remediation-planning-wasp-drone` | Turns audit findings into a Now/Next/Later roadmap and, with approval, Library PRDs, IRDs, knowledge docs, and CTR drafts | "plan the remediation", "turn these findings into PRDs" | `remediation-planning-stinger` |
| `kb-refresh-wasp-drone` | Scoped documentation refresh with exact claim receipts, source/runtime/proposal distinctions, missing proof and existing gate/consumer boundaries | "refresh the docs", "kb refresh", "documentation freshness", "missing proof" | `kb-refresh-stinger` |

Confirm each row's actual owner is installed before dispatch. The audit lenses above use `code-audit-tools`; KB Refresh uses `documentation-tools` and requires Code Audit for its full discovery route. Website leaves live in `website-audit-tools` and are dispatched by `master-website-auditor`.

---

### Product planning (`product-studio` plugin)

These three Drones run in order under `/product-studio:plan-product`: strategy, then design, then planning, each ending at an owner approval gate. They plan; they never write PRDs, CTRs or application code. New feature ideas that arrive mid-build go to KIPP in the TARS desk instead.

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `product-strategy-wasp-drone` | Interview-first product strategy: problem, ICP summary, job, positioning, 2 to 4 bets, north star plus 3 inputs, v1 and NOT-in-v1, riskiest assumption; writes `library/knowledge/private/product/` | "plan a new product", "product strategy", "what should v1 be", "who is this for", "positioning" | `product-strategy-stinger` |
| `product-design-wasp-drone` | Product strategy to UX package: journeys, IA, Mermaid flows, screen states, WCAG 2.2 AA, light/dark HTML prototypes, scored critique, Claude Design brief and import | "design the product", "UX for this app", "prototype the screens", "Claude Design handoff", "bring in my Claude Design export" | `product-design-stinger` |
| `product-planning-wasp-drone` | Plans the build from approved strategy and UX: PRD map, saved wave plan with Mermaid graph, project Definition of Done, handoff to Library and contract-writing | "plan the build", "wave plan", "definition of done", "what order do we build in", "break this into PRDs" | `product-planning-stinger` |

---

### Interstellar Coding crew (`interstellar-coding` plugin)

These eight Drones are one development team led by TARS, entered with `/interstellar-coding:interstellar`. Each loads its own role skill, whose first steps are to read the shared `crew-protocol` contract and then load the existing skill it is armed with. Route to one directly only when the owner names the role; otherwise TARS boots and routes the crew. The plugin also needs `data-and-ai-tools` (TARS) and `code-audit-tools` (LADY). `/tars` remains plain TARS without the crew.

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `crew-tars-wasp-drone` | Crew lead and orchestrator: boots the crew, only spawner, routes work, reports every update to OWEL's ledger; armed with `tars-stinger`; no product code | "run the Interstellar crew", "be TARS and lead the team", "boot the crew" | `crew-tars-stinger` |
| `crew-kipp-wasp-drone` | Product team and librarian: feature intake, PRDs and IRDs and their numbers, library invariants; armed with `library-stinger` | "KIPP, I have a feature idea", "write the PRD with the crew", "reserve the next PRD number" | `crew-kipp-stinger` |
| `crew-case-wasp-drone` | Consultant and contrarian: structured dissent, one verdict line per question, read-only, disagree and commit | "ask CASE", "contrarian view", "poke holes in this plan", "premortem this" | `crew-case-stinger` |
| `crew-lady-wasp-drone` | Deep independent investigation: audits, root cause, incidents, due diligence; dispatches the code-audit Drones; armed with `audit-my-code-stinger` | "have LADY investigate", "find the real root cause", "independent audit" | `crew-lady-stinger` |
| `crew-moon-wasp-drone` | Operating efficiency: running record of each agent's output, dormancy and repeated attempts; pauses or terminates only after work is preserved; armed with `time-blocked-turns` | "who is stuck", "watch the agents for loops", "pause that agent" | `crew-moon-stinger` |
| `crew-owel-wasp-drone` | Documentarian and ledger keeper: append-only ledger, `library/knowledge/`, ADRs written unprompted; armed with `knowledge-stinger` | "OWEL, record this", "put that in the ledger", "document what we decided" | `crew-owel-stinger` |
| `crew-coop-wasp-drone` | Build engineer: one chip, one branch, one PR; attempt log, checkpoint on request; armed with `/smoke-it` or the routed specialist | "COOP, build this chip", "implement this PRD as a crew chip" | `crew-coop-stinger` |
| `crew-murph-wasp-drone` | Verification and release gate: Security then Quality on every candidate, PASS or FAIL, shipped means verified; armed with `/ship-gate` | "MURPH, gate this", "run the ship gate on the chip", "is this actually shipped" | `crew-murph-stinger` |

---

### Business and operations

| Drone | Domain | Trigger keywords | Paired Stinger |
| --- | --- | --- | --- |
| `hiring-ats-wasp-drone` | Applicant Tracking Systems authority for recruiting-tech stacks | "which ATS should we use", "audit our scorecards", "our take-home test is too long", "Gem vs hireEZ" | `hiring-ats-stinger` |
| `hr-payroll-wasp-drone` | HR infrastructure and payroll decision specialist for software startups  -  domestic payroll platform selection (Gusto, Rippling, Justworks), international contractor management and EOR (Deel, Remote.com, Oyster,... | "Gusto vs Rippling", "set up payroll", "EOR for international hire", "contractor vs employee" | `hr-payroll-stinger` |
| `incorporation-startup-stack-wasp-drone` | Company formation advisor for software startup founders | "incorporate my startup", "Stripe Atlas vs Clerky", "Delaware C-Corp or LLC", "how do I get an EIN" | `incorporation-startup-stack-stinger` |
| `investor-cap-table-wasp-drone` | Cap-table management and fundraising paperwork specialist for startup founders | "set up our cap table", "Carta vs Pulley", "how does a SAFE work?", "term sheet provisions" | `investor-cap-table-stinger` |
| `legal-docs-wasp-drone` | SaaS legal document preparation and bounded international pricing fact handoffs for qualified review; no tax-adviser determination | "privacy policy", "DPA", "Terms of Service", "international pricing review packet" | `legal-docs-stinger` |

### Media and creative

| Drone | Domain | Trigger keywords | Paired Stinger |
| --- | --- | --- | --- |
| `natural-photography-wasp-drone` | Photographic generation and retouching specialist for consented model work | "generate a photo of <model>", "retouch this frame", "make this look like a real phone photo", "ingest a new model" | `natural-photography-stinger` |

## Outcome decisions and preparation

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `technical-explainer-wasp-drone` | Explain technical sources, error messages and AI-generated code at grade 8 with faithful claims, one safe next check, bounded analogies and teach-back. | explain this; eighth grade; error message; understand generated code; analogy | `technical-explainer-stinger` |
| `unit-economics-wasp-drone` | Model supplied prices and costs, free/trial cohorts and abuse sensitivities with explicit allocation and held-volume limits. | unit economics; free trial costs; trial abuse costs; break even; refund sensitivity | `unit-economics-stinger` |
| `operating-cost-wasp-drone` | Estimate operating costs from supplied workload and dated provider rate assumptions. | operating cost; infrastructure budget; monthly bill; cost scenarios | `operating-cost-stinger` |
| `launch-assets-wasp-drone` | Prepare account, asset and platform dependency readiness without implicit setup actions. | prepare assets; launch readiness; what accounts do I need; signing prerequisites | `launch-assets-stinger` |
| `services-quoting-wasp-drone` | Prepare scoped services quotes, pricing arithmetic, commercial SOW drafts and change proposals. | quote project; agency statement of work; margin vs markup; maintenance price | `services-quoting-stinger` |
| `infrastructure-fit-wasp-drone` | Recommend one topology from workload, budget, operator skills and sourced constraints. | choose infrastructure; managed vs VPS; hosting fit; operator responsibilities | `infrastructure-fit-stinger` |
| `saas-pricing-wasp-drone` | Recommend provisional SaaS pricing and interpret supplied pricing experiment revenue/contribution evidence. | price my SaaS; pricing experiment results; seats vs usage; initial product price | `saas-pricing-stinger` |
| `web-stack-selection-wasp-drone` | Recommend one supported web framework from product, team and rendering constraints. | choose web stack; React Vite vs SvelteKit; Next.js vs Vue; framework fit | `web-stack-selection-stinger` |
| `builder-readiness-wasp-drone` | Prepare novice builder expectations, product form, security responsibilities and the next bounded learning/build slice. | prepare to build; choose product form; beginner security responsibilities; novice builder | `builder-readiness-stinger` |
| `project-learning-wasp-drone` | Read-only web fundamentals tutor: baseline, one small project, prediction, practice, feedback and observed learning evidence | "learn HTML CSS JavaScript", "teach me through a project", "what should I learn next" | `project-learning-stinger` |
| `go-to-market-wasp-drone` | Buyer-specific acquisition-channel selection and falsifiable experiment drafts; channel execution stays with its owners | choose acquisition channel; where are buyers; paid organic outbound partners | `go-to-market-stinger` |
| `capacity-planning-wasp-drone` | Hire or buy-services capacity decisions from demand, skill gaps, calendar/review/support load and dated quotes | hire versus services; staffing capacity; review bottleneck | `capacity-planning-stinger` |
| `product-demo-wasp-drone` | Evidence-bound product demo/tutorial storyboard, claims, captions and production handoff; actual capture stays with selected owners | honest product demo; tutorial storyboard; unsupported demo claims | `product-demo-stinger` |
| `testing-coach-wasp-drone` | Read-only testing tutor: requirement-derived assertions, observed attempts, changed conditions and honest failure evidence | practice tests; tests copying implementation; learn assertions | `testing-coach-stinger` |
| `build-buy-analysis-wasp-drone` | Compare bespoke, licensed vendor and partner sourcing for one functional slice with proof, lifecycle costs, responsibility and exit | build buy partner; vendor sourcing; compare buying software | `build-buy-analysis-stinger` |
| `software-licensing-wasp-drone` | Software license literacy, artifact evidence and distribution-boundary review; actual rights and legal compatibility retain their reviewers | software licenses; copyleft; AGPL network use; commercial or open source | `software-licensing-stinger` |
| `network-boundaries-wasp-drone` | Plan network firewall, HTTP WAF and application rate-limit placement from actual flows and trust boundaries | firewall WAF layers; network boundaries; trusted proxy rate limits | `network-boundaries-stinger` |
| `digitalocean-platform-wasp-drone` | Assess DigitalOcean service fit and dated cost/readiness inputs; App Platform, Droplet and managed-service constraints | DigitalOcean workload fit; App Platform versus Droplet; DigitalOcean costs | `digitalocean-platform-stinger` |

## Dispatch and arming contract

Spawn every Drone at the top level. Do not nest a Drone inside another Drone.

Every dispatch prompt must arm the Drone before it does anything else:

> You are `<drone-name>`. Before doing anything else, read your paired Stinger in full at `<resolved-stinger-path>` and follow it as your operating manual. Then: [scoped task, exact files in scope, definition of done, how the work will be verified].

Resolve `<stinger-name>` from the Paired Stinger column above, or apply the convention directly: `<base>-wasp-drone` to `<base>-stinger`.

For every row, read the catalog owner and resolve the paired skill from that selected plugin. Core owns fourteen specialist pairs; the other routed pairs belong to optional plugins. Never substitute a Core sibling path for an optional skill.

A Drone dispatched without its Stinger armed is a failed dispatch. Terminate it and re-dispatch with the arming line present. Do not let a Drone proceed on partial knowledge of its own procedure.

When a Claude Drone declares `isolation: worktree` and its Cursor projection is used, ask Cursor for an isolated project copy at dispatch before parallel edits. Cursor does not support that frontmatter field; the generated agent prompt cannot create isolation after the agent starts.

---

## Ship Gate

Every development-focused dispatch closes with the same three gates, in this order, no exceptions:

1. `security-stinger`, armed on `security-wasp-drone`, audits the change first. Security fixes can invalidate a QA pass, so security always runs before quality.
2. `quality-stinger`, armed on `quality-wasp-drone`, verifies the implementation against its source plan, after security fixes have landed.
3. The orchestrator itself, not a dispatched Drone, loads `github-repo-health-stinger` directly and runs the repo-health check.

Never run quality before security. If quality already ran out of order for a cycle, do not run it again; flag the ordering violation, let security run and land fixes, then re-run quality.

After all three gates pass, the user reviews the findings and the diff and gives explicit approval before anything is committed or pushed. No Drone and no orchestrator commits or pushes without that approval.

---

## Library packet routing

Use [the Library Packets guide](guides/library-packets-wasp-drone.md) for reader-specific packet production. Keep source authoring with Library/Knowledge and separately scoped competitive work with Competitive Research. The packet owner integrates facts and preserves audience boundaries.

## Multi-Drone orchestration

Real sequences for this stack. Every sequence below closes with the Ship Gate; it isn't repeated in each entry.

### Coordinate parallel workers

1. Load [Harness Integration](../harness-integration-stinger/SKILL.md) for the actual host/capacity and coordination guide. Resolve its `worker-coordination` prerequisite key before loading selected App Primer's existing worker/wave templates and helper.
2. Record the actual tool availability and capacity, including the parent/integrator. Preserve current settings and the user's task-specific authority. Exclusive paths and shared owners must be explicit before dispatch.
3. Refuse overlapping leases or unverified implementation capacity. Shared Draft/disputed contracts block the affected boundary; route exact terms through Contract Writing and Library before treating provider/consumer work as independent.
4. Arm specialists from their selected owners. Review actual output at the applicable cadence, stop stalled/drifting workers, and preserve a concrete handoff. A validator PASS is structural evidence, not launch authority or a native execution receipt.
5. Integrate against the final candidate identity and run the existing Security then Quality then orchestrator Repository Health close-out. User approval remains required for any commit or push.

### Parallel PRD contract handoff

1. `library-wasp-drone` maps proposed PRD scopes and shared boundaries before assigning independent PRD authors.
2. `contract-writing-wasp-drone` reuses or drafts one `CTR` record per shared boundary and asks the owner to accept the exact normative terms. Draft or disputed boundaries block completion of affected PRDs.
3. `library-wasp-drone` gives each PRD author an accepted revision and separate file ownership. Authors write their PRDs in parallel, pin the revision in each affected index or sub-PRD, and verify their acceptance criteria against the shared terms.
4. The relevant engineering Drones later implement against that revision and run the provider and consumer checks named by the contract. Changed terms return to the contract-writing Drone for impact and acceptance before PRDs are repinned.
5. For `/smoke-it` on existing PRDs, repeat the inventory and check every `## Contract dependencies` pin before forming parallel implementation waves. Run the contract Stinger's read-only validator after Library changes links. Put missing, Draft, disputed, or stale boundaries in the execution ledger with the exact decision needed; independent criteria can continue, but the affected provider and consumer work cannot be declared ready or VERIFIED.

### Plan execution loop

1. `pest-controller-suit` selects the narrowest implementation Drone for the approved plan. Use `rust-wasp-drone` for Rust and Cargo work, `tauri-wasp-drone` for the Tauri application boundary, `impeccable-wasp-drone` for frontend design implementation, or the matching domain Drone for other work.
2. The implementation Drone completes the bounded scope and records fresh verification evidence.
3. `security-wasp-drone` audits the completed change first and every medium-or-higher finding is resolved.
4. The implementation owner reruns every affected check after security fixes.
5. `quality-wasp-drone` independently verifies the final implementation against its source plan.
6. The orchestrator loads `github-repo-health-stinger` and completes the repository-health gate.
7. The user reviews the reports and diff before the authorized commit or push.

### Build a website

1. `website-wasp-drone` scaffolds or extends the site from the brief.
2. `svelte-wasp-drone` for SvelteKit/Svelte 5 structure and runes.
3. `tailwind-wasp-drone` for utility and token work.
4. `shadcn-svelte-wasp-drone` for component installs.
5. `seo-aeo-wasp-drone` for metadata, JSON-LD, and Core Web Vitals.
6. Ship Gate.

### Frontend design / UI implementation

1. **`impeccable-wasp-drone`** is the single router for all frontend UI/UX/design implementation, redesign, refinement, new-surface, component, and design-system-capture work. It runs Start -> Iterate -> Polish -> Maintain, including the pre-flight sync check and deterministic `npx impeccable detect <target>` gate.
2. **`design-system-wasp-drone`** and **`ux-ui-svelte-wasp-drone`** own product-specific token, component-library, and accessibility enforcement on established systems. Impeccable makes that enforcement mechanical via DESIGN.md drift rules and the detector gate.
3. **`security-wasp-drone`** then **`quality-wasp-drone`** close out under the Plan execution loop.

### Research an ICP

1. `icp-research-wasp-drone` runs the seed lane from the domain and writes the seed brief.
2. The orchestrator dispatches one `icp-research-wasp-drone` per off-site lane (customers, market, hiring, voice, news, technographic) in parallel from the top level, using the Stinger's lane brief template.
3. One `icp-research-wasp-drone` merges and grades the ledger and writes the dossier.
4. Hand-offs as needed: `competitive-research-wasp-drone`, `cold-outreach-wasp-drone`, `crm-integration-wasp-drone`, `discovery-research-wasp-drone`. Research-only: no Ship Gate unless code changes follow.

### Plan a product

1. The owner runs `/product-studio:plan-product`. `product-strategy-wasp-drone` interviews the owner and writes the Product Strategy. The owner approves it.
2. `product-design-wasp-drone` turns the approved strategy into the UX package and prototypes, scores it with its critique rubric, and offers the Claude Design brief and import. The owner approves it. `design-system-wasp-drone`, `impeccable-wasp-drone` and `ux-ui-wasp-drone` are optional hand-offs.
3. `product-planning-wasp-drone` writes the PRD map, `library/requirements/plans/wave-plan.md`, the project Definition of Done and the handoff packet. The owner approves them.
4. `library-wasp-drone` writes the listed PRDs; `contract-writing-wasp-drone` drafts the listed CTRs, which stay Draft until the owner accepts each exact revision.
5. `/smoke-it` or TARS runs the approved wave plan. Planning is research-only: no Ship Gate unless code changes follow.

### Manage parallel sessions (TARS)

1. The owner runs `/tars` in the Claude Code desktop app, which loads `tars-stinger` into that session. TARS needs the desktop app: a terminal session has no chip or session tools.
2. TARS spawns CASE first (the adviser, which also watches systems and CI read-only and reports to TARS), then KIPP (the idea factory, which plans and writes PRDs after loading `library-stinger`), arms the 10-minute tick and the 1-minute CI poller, then spawns one small chip per ask. Each chip brief names the command the chip runs through (`/smoke-it` for a PRD-driven build, `/wasp-nest-core:source-command-pest-controller` for everything else) and the Drone the chip should arm itself with from this roster. Anything bigger than one small PR goes through a CASE review before chips spawn.
3. Chips do the work under their own Ship Gate; TARS answers their questions, merges green PRs it is allowed to merge, and watches deploys. TARS does no implementation work and never launches a Workflow unless the owner asks.

### Run the Interstellar Coding crew

1. The owner runs `/interstellar-coding:interstellar`. That session becomes TARS: it loads `crew-tars-stinger`, the `crew-protocol` contract, then `tars-stinger`. The crew hook records the role so a resume or compaction reloads the skill.
2. TARS stands up OWEL first so the ledger is live, then MOON, CASE and KIPP, each started with its own command (`/owel`, `/moon`, `/case`, `/kipp`). LADY and MURPH start on demand. Only TARS spawns.
3. KIPP turns owner ideas into PRDs; CASE challenges anything bigger than one small change; TARS splits approved work into COOP build chips, each arming the specialist Drone from this roster that its work needs.
4. COOP builds on its own branch and sends `GATE` to MURPH, who runs Security then Quality and answers PASS or FAIL. COOP carries the Ship Gate; MURPH runs it.
5. MOON records each agent's real progress. A dormant, looping or stuck agent is checkpointed, its work verified as preserved, then paused or terminated; TARS spawns the inbound agent from the handoff packet. A problem nobody can crack goes to LADY.
6. Every role sends its updates to OWEL as `LEDGER` lines. OWEL appends them, never edits or deletes one, and writes knowledge docs and ADRs from what it observes.

### Build a node editor

1. `impeccable-wasp-drone` sets the editor's visual language when design work is in scope.
2. `xyflow-wasp-drone` builds the React Flow or Svelte Flow canvas: nodes, edges, handles, connection rules, layout, and flow state.
3. `react-wasp-drone` or `svelte-wasp-drone` owns the surrounding app structure; `db-wasp-drone` owns storage of saved flows.
4. `browser-automation-wasp-drone` adds drag and connect tests when required.
5. Ship Gate.

### Add auth

1. `workos-wasp-drone` wires AuthKit, sessions, and SSO.
2. `security-wasp-drone` audits the implementation (session handling, token storage).
3. `neon-drizzle-wasp-drone` (or `db-wasp-drone` for generic Postgres theory) reviews the users/organizations schema.
4. Ship Gate.

### Take payments

1. `payments-wasp-drone` builds the Stripe Elements checkout and webhook handling.
2. `security-wasp-drone` audits webhook signature verification and secret handling.
3. `neon-drizzle-wasp-drone` reviews the schema that stores customer and subscription state.
4. Ship Gate.

### Ship a release

1. `ci-release-wasp-drone` drives the build and the CI workflows.
2. `changelog-release-notes-wasp-drone` writes the changelog entry and release notes.
3. `github-repo-health-wasp-drone`, or the orchestrator loading `github-repo-health-stinger` directly per the Ship Gate, confirms repo health before tagging.

### Instrument the product

1. `posthog-wasp-drone` wires product analytics, feature flags, or experiments.
2. `sentry-wasp-drone` wires error tracking and performance tracing.
3. Ship Gate.

### Data-layer change

1. `neon-drizzle-wasp-drone` designs or reviews the Drizzle schema and migration.
2. `db-wasp-drone` weighs in when the question is generic Postgres indexing or partitioning theory, not Neon- or Drizzle-specific.
3. `security-wasp-drone` audits tenant isolation and PII handling.
4. Ship Gate.

### Audit a codebase

1. Run `/audit-my-code <tier>`; `audit-my-code-stinger` dispatches the tier's Drones in waves (foundation, bloat, and security in parallel, then quality, then remediation, then the brief).
2. Execute the Mario tier's PRDs with `/smoke-it` and its IRDs with `/pest-controller`.
3. Re-run the same tier to prove the fixes landed.

Add a sequence here whenever a recurring multi-Drone pattern emerges in practice.

---

## Adding a new Drone

Don't hand-roll a new Drone. Walk [`../queen-wasp-stinger/guides/pest-controller-registration.md`](../queen-wasp-stinger/guides/pest-controller-registration.md), the forge's registration guide, start to finish. It covers naming the pair, writing the agent frontmatter, writing the paired Stinger, and registering both here.

---

**172 Drones routed: 14 in Core and 158 in optional plugins. Website Audit dispatches its 20 additional Drones through its own orchestrator.** Installed Drones have a paired Stinger. See [`PAIRING-AUDIT.md`](PAIRING-AUDIT.md) for the last full pairing audit; the source validator checks the current routed roster against the filesystem.

---

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [queen-wasp-stinger](../queen-wasp-stinger) - The forge. Creates and validates new rules, plugins, commands, Drones, and Stingers across all four harnesses.
  - [get-started-stinger](../get-started-stinger) - Repository initialization and hardening. Orchestrator level.
  - [security-stinger](../security-stinger) - First gate of the Ship Gate.
  - [quality-stinger](../quality-stinger) - Second gate of the Ship Gate.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Final orchestrator-level gate before commit and push.

## Additional selected owners

| Drone | Scope | Triggers | Paired Stinger |
| --- | --- | --- | --- |
| `railway-platform-wasp-drone` | Railway workload fit, costs and readiness; no provisioning | Railway service fit; Railway volumes and billing | `railway-platform-stinger` |
| `vultr-platform-wasp-drone` | Vultr workload fit and dated provider constraints; no provisioning | Vultr service fit; Vultr billing conflicts | `vultr-platform-stinger` |
| `nextjs-wasp-drone` | Next.js App Router implementation with server/client, data, mutation and cache boundaries | build Next.js app; App Router data and actions | `nextjs-stinger` |
| `vue-wasp-drone` | Vue component/state/form/router architecture and bounded implementation | build vue; vue implementation | `vue-stinger` |
| `nuxt-wasp-drone` | Nuxt SSR/hybrid, request data, hydration and server/cache boundaries | build nuxt; nuxt implementation | `nuxt-stinger` |
| `pwa-wasp-drone` | Browser offline, reviewed public assets, worker lifecycle and private-data exclusions | build pwa; pwa implementation | `pwa-stinger` |
| `localization-wasp-drone` | Locale/resources/plurals/formatting and accessible RTL implementation | build localization; localization implementation | `localization-stinger` |
| `component-vendoring-wasp-drone` | Component selection, authorized source-copy provenance, notice preservation and fork maintenance | choose niche component; vendor MIT component; preserve notices | `component-vendoring-stinger` |
| `traffic-capacity-wasp-drone` | Measured traffic-spike capacity, SLO/cost and admission/recovery proposals | traffic spikes; concurrency capacity; queue overload | `traffic-capacity-stinger` |
| `go-desktop-wasp-drone` | Explicitly selected Wails v2 Go desktop bridge, lifecycle, storage and native qualification | build Wails; Wails bindings; Go desktop app | `go-desktop-stinger` |
| `flaky-test-repair-wasp-drone` | Observed flaky failure diagnosis, bounded causal repair and preserved assertion evidence | fix flaky tests; observed intermittent test failure | `flaky-test-repair-stinger` |
