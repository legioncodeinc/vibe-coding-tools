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

A small number of Drones still carry description or body text from a prior product this repo does not run anymore. They stay in the roster, because an unregistered Drone is a Drone the orchestrator can't find, but they are marked below and logged in full in [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md).

---

## The pairing law

Every Drone pairs with exactly one Stinger: `<base>-wasp-drone` to `<base>-stinger`. No exceptions inside the roster below; every row checks out.

Core has three orchestrator skills without paired Drones. Skill-only capabilities are also allowed when their frontmatter explicitly declares `metadata.hive-tier: standalone`; the validator checks this for every pack. A standalone skill does not claim a specialist Drone exists.

- `pest-controller-suit` (this file, the router)
- `queen-wasp-stinger` (the forge that creates and validates new Drones and Stingers)
- `get-started-stinger` (repository initialization and hardening)

---

## Roster

119 Drones registered across core and the optional HighLevel and Webapp Capture packs, sorted into domain groups. The Domain column is a one-line summary of the Drone's own frontmatter description. Trigger keywords are pulled from that same description, not invented.

### Stack and frameworks

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `svelte-wasp-drone` | Svelte 5 language and SvelteKit 2 runtime: runes, snippets, lifecycle, universal reactivity, Svelte 4-to-5 migration, load functions and form actions | "runes", "migrate to Svelte 5", "$state vs $effect", "SvelteKit remote function", "snippet vs slot" | `svelte-stinger` |
| `shadcn-svelte-wasp-drone` | shadcn-svelte component library: CLI, copy-in-repo model, registry system, theming, Superforms and Formsnap, accessibility via Bits UI | "install shadcn-svelte", "add a shadcn-svelte component", "theme shadcn-svelte", "build a shadcn-svelte registry" | `shadcn-svelte-stinger` |
| `tailwind-wasp-drone` | Tailwind CSS v4: CSS-first config, @theme mechanics, Vite plugin, v3-to-v4 migration, dark mode variants, container queries | "migrate to Tailwind v4", "set up @theme", "wire up the Tailwind Vite plugin", "sort my Tailwind classes" | `tailwind-stinger` |
| `tanstack-wasp-drone` | TanStack inside SvelteKit: Query SSR/caching/mutations, runes-native Table, Form snippet validation, Virtual | "add TanStack Query", "set up svelte-query", "build a data table", "virtualize this list" | `tanstack-stinger` |
| `preact-wasp-drone` | Preact 11: signals API, preact/compat migration from React, embed widgets, Astro islands, Fresh 2.x | "Preact vs React", "migrate a React codebase to Preact", "embed a widget on third-party pages", "Astro island" | `preact-stinger` |
| `react-wasp-drone` | React 18/19 architecture: bulletproof-react patterns, Server Components, Suspense, Actions, Compiler, state layering | "review React architecture", "state management decision", "Server Components boundary", "React 19 patterns" | `react-stinger` |
| `typescript-node-wasp-drone` | TypeScript/Node code review and conventions: strict config, module resolution, test suites, boundary validation (body still cites a legacy package's specifics; see PAIRING-AUDIT.md) | "review this TypeScript code", "audit this Node code", "write a Vitest suite", "tighten the tsconfig" | `typescript-node-stinger` |
| `python-wasp-drone` | Python architecture: Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv, ORM discipline, migrations, typed adoption | "review this Django code", "audit ORM patterns", "migrate DRF to Django Ninja", "set up Celery" | `python-stinger` |
| `rust-wasp-drone` | Rust implementation and code review for production Cargo workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, Rust tests, and local packaging evidence | "implement this in Rust", "review this Cargo workspace", "fix this Tokio or SQLx service", "audit this SQLx transaction", "build the approved Rust PRD slice" | `rust-stinger` |
| `tauri-wasp-drone` | Tauri 2 application boundary: update reviews, v1 migration, typed IPC, capabilities, plugins, sidecars, updater behavior, and desktop/mobile AI integration | "build a Tauri 2 desktop app", "what changed in Tauri 2", "migrate Tauri v1 to v2", "bundle a local model sidecar" | `tauri-stinger` |
| `electron-app-wasp-drone` | Electron desktop applications: main, preload, renderer, IPC, sandbox, permissions, packaging, and native verification | "build an Electron app", "Electron preload", "Electron IPC", "package Electron" | `electron-app-stinger` |
| `ux-ui-svelte-wasp-drone` | Enforces this repo's SvelteKit UI standard: shadcn-svelte on Bits UI plus Melt UI, Tailwind v4 token bridge, white-label brand contract. Impeccable remains the primary router for UI/design implementation | "add a Button", "copy in this shadcn-svelte component", "convert this bespoke style to Tailwind", "does the white-label still work" | `ux-ui-svelte-stinger` |
| `dark-mode-theming-wasp-drone` | Dark-mode theming: CSS variable token architecture, theme-provider wiring, FOWT prevention, SSR hydration safety, Tailwind v4 dark variant | "set up dark mode", "dark mode on SSR", "multi-brand theming", "FOWT fix" | `dark-mode-theming-stinger` |
| `modal-toast-dialog-wasp-drone` | Accessible overlay primitives: dialog, alert dialog, drawer, toast, command menu; focus trap, escape, scroll lock, aria contract | "choosing between overlay primitives", "debugging focus trap regressions", "building a command palette" | `modal-toast-dialog-stinger` |
| `icon-system-wasp-drone` | Icon library selection and delivery: tree-shake vs sprite, dynamic-import-by-name, custom SVG components, icon accessibility contract | "choosing an icon library", "bundle-size regressions from icon imports", "icon accessibility" | `icon-system-stinger` |
| `typography-font-wasp-drone` | Typography system: variable fonts, font source selection, the FOIT/FOUT/FOFT story, fluid type scales, type-token architecture | "set up fonts", "audit our typography", "fix FOIT/FOUT", "build a type scale" | `typography-font-stinger` |
| `font-loading-wasp-drone` | Font loading pipeline: font-display strategy, preload/crossorigin correctness, variable-font subsetting, CLS-from-font-swap elimination | "audit font loading", "fix FOIT", "CLS from font swap", "subset variable font" | `font-loading-stinger` |
| `markdown-mdx-content-pipeline-wasp-drone` | Markdown/MDX pipeline: compiler selection, remark/rehype chains, syntax highlighting, AST manipulation, XSS sanitization | "set up MDX", "configure Shiki", "write a remark plugin", "sanitize user markdown" | `markdown-mdx-content-pipeline-stinger` |
| `csv-xlsx-import-export-wasp-drone` | Spreadsheet upload and export feature: CSV/XLSX parsing, large-file streaming, column-mapping wizard, row validation, CSV injection prevention | "build a CSV import", "add XLSX upload", "column-mapping wizard", "CSV injection safe" | `csv-xlsx-import-export-stinger` |
| `design-system-wasp-drone` | Bootstraps a complete design system from scratch: tokens, utility layer, per-component and per-screen specs, static HTML examples. Impeccable owns frontend UI/UX/design implementation and uses DESIGN.md drift rules plus its detector gate to make enforcement mechanical | "build a design system for X", "bootstrap UI for product Y", "create tokens and utilities for this product" | `design-system-stinger` |
| `impeccable-wasp-drone` | Frontend-design operating system for all UI/UX/design implementation, redesign, refinement, new surfaces, components, and design-system capture. Runs Start -> Iterate -> Polish -> Maintain, the context contract, and the deterministic detector gate | "polish the pricing page", "build a dashboard", "redo this hero", "make this not look like AI slop", "design a settings screen", "audit this UI" | `impeccable-stinger` |
| `http-rest-fundamentals-wasp-drone` | HTTP/REST protocol correctness: method safety and idempotency, status-code honesty, headers, conditional and range requests | "is this status code correct", "why is CORS failing", "explain preflight", "PUT vs PATCH" | `http-rest-fundamentals-stinger` |
| `image-optimization-wasp-drone` | Image delivery: AVIF/WebP format selection, responsive srcset/sizes, blur placeholders, remote image config, CLI tooling | "optimize my images", "convert to AVIF", "fix layout shift from images", "audit our images" | `image-optimization-stinger` |
| `go-wasp-drone` | Go implementation drone for modules, toolchains, vendoring/fork freezes, cgo .so plugin builds, and project layout | "go" | `go-stinger` |
| `react-to-svelte-wasp-drone` | Port-wave drone converting React surfaces to Svelte 5 against an immutable API contract - contract extraction, behavior inventory, runes/snippets port, per-row verification | "react to svelte" | `react-to-svelte-stinger` |
| `ux-ui-wasp-drone` | Enforces a product's design system from its source-of-truth folder (tokens, utilities, components, screens) and governs integration with shadcn/ui, Mantine, Lucide-react, and Framer Motion | "review this UI", "is this on-brief?", "which component library for X?", "wrap this shadcn primitive" | `ux-ui-stinger` |


### Browser and desktop engineering

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `browser-automation-wasp-drone` | Playwright and Puppeteer automation: browser tests, scripts, traces, screenshots, browser installs, and CI reliability | "write a Playwright test", "Puppeteer script", "browser automation", "Playwright browser install" | `browser-automation-stinger` |
| `chrome-chromium-wasp-drone` | Chrome DevTools Protocol and Chromium engineering: remote debugging, developer profiles, protocol inspection, source builds, and browser-engine diagnosis | "Chrome DevTools Protocol", "remote debugging Chrome", "Chromium build", "debug Chromium" | `chrome-chromium-stinger` |
| `webapp-capture-wasp-drone` | Capture a running web app as demos, screenshots, component inventory, design tokens, and visual/code inconsistency reports | "record a walkthrough", "screenshot every page", "capture our component library", "audit UI drift" | `webapp-capture-stinger` |

`webapp-capture-wasp-drone` and its Stinger live in the optional `webapp-capture` pack. Confirm the pack is installed before dispatch; a core-only install cannot run its capture scripts.

### Data and persistence

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `db-wasp-drone` | PostgreSQL data architecture: schema design, indexing strategy, zero-downtime migrations, ORM choice, serverless DB platform selection | "design this schema", "review this migration", "should this be jsonb or columns", "production query is slow" | `db-stinger` |
| `neon-drizzle-wasp-drone` | Neon Postgres plus Drizzle ORM for this SvelteKit/Vercel stack: connection driver choice, schema/migration review, pgvector wiring, RLS-without-Supabase | "set up Neon", "pick a connection driver for Vercel", "review this Drizzle schema/migration", "wire pgvector" | `neon-drizzle-stinger` |
| `deeplake-dataset-wasp-drone` | Deep Lake data architecture specialist for Hivemind - the 7-table ColumnDef schema, `USING deeplake` DDL, FLOAT4[768] embeddings, additive schema healing, append-only version-bump writes, indexing (deeplake_index... | "design this table", "review this ColumnDef", "should this be JSONB or a column?", "is this index right?" | `deeplake-dataset-stinger` |


### Auth and security

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `auth-wasp-drone` | End-to-end auth implementation: provider selection, OAuth flows, MFA/passkeys, RBAC, session storage, B2B SSO | "set up auth", "pick an auth provider", "wire up Google sign-in", "RBAC for multi-tenant" | `auth-stinger` |
| `workos-wasp-drone` | WorkOS specialist: AuthKit, sealed sessions, JWT/JWKS verification, User Management, RBAC, SSO, Directory Sync, MFA/passkeys, webhooks | "set up WorkOS", "wire up AuthKit", "AuthKit in SvelteKit", "WorkOS SCIM" | `workos-stinger` |
| `security-wasp-drone` | Security audit and remediation for this repo's stack: OWASP Top 10, SvelteKit attack surface, tenant isolation, webhook security, supply chain | "security audit this branch", "scan for vulnerabilities", "check the webhook handler", "audit the tenant isolation" | `security-stinger` |
| `dependency-audit-wasp-drone` | Supply-chain hygiene: scanner selection, CVE triage, SBOM generation, lockfile discipline, provenance verification | "audit our dependencies", "set up Renovate", "generate an SBOM", "supply chain security" | `dependency-audit-stinger` |
| `lovable-audit-wasp-drone` | Empirical security audit of Lovable-built Supabase apps: row-level-security denial verification, role-differential visibility probes, Edge Function gating checks, auth-posture readout, client-bundle key and endpoint... | "audit this Supabase app", "pentest the Lovable build", "check the RLS on this project", "probe the Edge Functions" | `lovable-audit-stinger` |


### Payments and integrations

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `payments-wasp-drone` | Stripe integration for SvelteKit on Vercel: custom checkout via Elements, Payment Intents, subscriptions, webhook verification | "integrate Stripe", "build a custom checkout", "add the Payment Element", "webhook isn't firing" | `payments-stinger` |
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
| `customer-support-tooling-wasp-drone` | Support stack specialist for SaaS products | "customer support tooling" | `customer-support-tooling-stinger` |
| `live-chat-support-wasp-drone` | Customer support surface specialist — Intercom, Crisp, Plain, Pylon, Help Scout — widget integration, HMAC/JWT identity verification, conversation routing, AI deflection (Fin 2.0, Ari, Crisp Bot), and the data-export... | "integrate live chat", "add a support widget", "set up Intercom", "configure Fin AI" | `live-chat-support-stinger` |


### AI and cognitive layer

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `mind-wasp-drone` | Cognitive-layer architecture for an AI feature: coach/agent routing, prompt cascade, RAG, three-tier memory, observability, evaluation | "review this AI code", "audit RAG", "add a coach", "change the prompt cascade" | `mind-stinger` |
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
| `github-repo-health-wasp-drone` | Repository hygiene audit: branching strategy, branch protection, PR culture, commit quality, CI density, CODEOWNERS, repo settings | "audit this repo", "repo health check", "check branch protection", "CODEOWNERS audit" | `github-repo-health-stinger` |
| `ci-release-wasp-drone` | CI pipeline, build, and package-release discipline: workflow architecture, version sync, quality gates, publish-time secret hygiene (body still describes a legacy build target; see PAIRING-AUDIT.md) | "review our build", "design our CI", "audit our workflows", "cut a release" | `ci-release-stinger` |
| `changelog-release-notes-wasp-drone` | Public changelogs and release notes: tool selection, impact-first copy, honest scope, multi-channel distribution | "write my changelog entry", "set up a changelog tool", "we just shipped X" | `changelog-release-notes-stinger` |
| `app-store-submission-wasp-drone` | App store publication for iOS and Android: ASO, privacy compliance, rejection diagnosis, age ratings, IAP configuration | "submit my app", "App Store rejection", "ASO strategy", "set up IAP" | `app-store-submission-stinger` |

### Platform and harness

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `cursor-ide-wasp-drone` | Cursor IDE platform: project rules authoring, MCP server registration, SDK for programmatic agent automation, custom modes, Cloud Agents | "review my rules", "migrate my .cursorrules", "add an MCP tool", "create a custom mode" | `cursor-ide-stinger` |
| `ai-coding-tools-wasp-drone` | AI coding tool advisor: recommends and compares Cursor, Claude Code, Aider, Cline, Windsurf, Continue.dev, Replit Agent, Devin, Bolt | "which AI coding tool should I use", "Cursor vs Claude Code vs Aider", "how do I reduce AI coding costs" | `ai-coding-tools-stinger` |
| `ai-tools-platform-wasp-drone` | AI toolbox: gateways, cloud providers, frontier model selection, cheap-fallback routes, local LLMs, GPU cloud, MCP servers, IDE plugins | "which AI provider should I use", "set up Portkey", "configure OpenRouter", "LLM spend is too high" | `ai-tools-platform-stinger` |
| `terminal-bash-wasp-drone` | Terminal productivity: Bash/Zsh/Fish config, modern CLI tools, shell scripting, dotfile architecture, tmux/Zellij, task automation | "improve my dotfiles", "review this shell script", "set up tmux", "just vs make" | `terminal-bash-stinger` |
| `harness-integration-wasp-drone` | Per-host adapter design for plugging a tool into multiple AI coding harnesses (body targets a different set of harnesses than this repo's four; see PAIRING-AUDIT.md) | "wire a new harness", "add a hook event", "register the MCP server", "audit a harness adapter" | `harness-integration-stinger` |
| `mcp-protocol-wasp-drone` | MCP server and tool-contract design: tool vs resource vs prompt, schema validation, transport choice, JSON-RPC error semantics (body still cites a legacy product's tool names; see PAIRING-AUDIT.md) | "audit this MCP server", "is this tool schema right", "stdio or HTTP transport" | `mcp-protocol-stinger` |

### Observability

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `posthog-wasp-drone` | PostHog: SvelteKit install, pageview tracking, event/property naming, feature flags, experiments, session replay, group analytics | "set up PostHog", "add a feature flag", "instrument analytics events", "PostHog session replay" | `posthog-stinger` |
| `sentry-wasp-drone` | Sentry for SvelteKit on Vercel: client/server SDK setup, source map upload, release association, performance tracing, PII scrubbing | "set up Sentry", "wire up error tracking", "upload source maps", "tune alert rules" | `sentry-stinger` |
| `lighthouse-pagespeed-wasp-drone` | Lighthouse and PageSpeed audits: local vs CI runs, all four audit categories, score/performance budgets, lab-vs-field data gap | "set up Lighthouse CI", "add a performance budget to CI", "my Lighthouse score is 90 but CrUX says I'm failing" | `lighthouse-pagespeed-stinger` |
| `status-page-wasp-drone` | Public status page: platform selection, component tree, incident communication templates, subscriber notifications, compliance | "set up a status page", "write an incident communication template", "configure subscriber notifications" | `status-page-stinger` |

### Website and growth

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `website-wasp-drone` | Builds production-grade SvelteKit plus Payload CMS websites end to end from a brief: architecture, SEO, auth, admin, lead capture, blog | "build a website", "scaffold a SvelteKit site", "ship a website from scratch" | `website-stinger` |
| `seo-aeo-wasp-drone` | SvelteKit plus Payload CMS plus Vercel SEO and Answer Engine Optimization: metadata, JSON-LD, Payload SEO fields, Core Web Vitals, llms.txt | "audit SEO on this SvelteKit site", "optimize for AI Overviews", "fix Core Web Vitals" | `seo-aeo-stinger` |
| `product-tour-onboarding-ui-wasp-drone` | In-app product tour and onboarding UI: tool selection, tooltip/modal/hotspot/checklist components, segment-based triggers | "set up a product tour", "build an onboarding checklist", "our tours keep breaking after deploys" | `product-tour-onboarding-ui-stinger` |
| `competitive-research-wasp-drone` | Competitor-landscape research: XLSX workbook and brand-matched PDF report, category taxonomy, feature-gap analysis, computed market-pattern insights, sales battlecards | "build a competitor comparison spreadsheet", "research our competitors", "make a battlecard deck", "competitive landscape report" | `competitive-research-stinger` |
| `affiliate-referral-program-wasp-drone` | Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate-vs-referral distinction, cookie-based and server-side... | "set up an affiliate program", "which affiliate platform should I use", "Rewardful vs FirstPromoter", "my attribution is broken in Safari" | `affiliate-referral-program-stinger` |
| `alt-ads-platforms-wasp-drone` | Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search — LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (Smart+ 2026 default, CAPI), Reddit Ads (community... | "which ad platform beyond Meta/Google for my ICP", "set up LinkedIn Ads for B2B SaaS", "TikTok CAPI setup", "Reddit Ads for developers" | `alt-ads-platforms-stinger` |
| `blogging-content-strategy-wasp-drone` | Editorial blogging strategy specialist — cluster + pillar topical authority architecture, post-length decisions by search intent, title + H1 + meta description craft, keyword research scoping without obsession,... | "map our blog content", "what should we write about", "review this post before publishing", "set a blog cadence" | `blogging-content-strategy-stinger` |
| `cold-outreach-wasp-drone` | Outbound sales specialist for founders running cold email | "set up cold outreach", "my cold email lands in spam", "write a cold email sequence", "set up Clay personalization" | `cold-outreach-stinger` |
| `newsletter-platform-wasp-drone` | Newsletter-as-channel specialist for product builders and founders — platform selection (Beehiiv, ConvertKit/Kit, Loops, Substack, Resend Audiences, Ghost), embedded newsletter signup integration for Next.js,... | "which newsletter platform should I use", "embed a newsletter signup", "migrate from Substack to Beehiiv", "how do I monetize my newsletter" | `newsletter-platform-stinger` |
| `product-feedback-roadmap-wasp-drone` | Customer-feedback-to-roadmap loop specialist — Userback, Canny, Featurebase, Productboard, Frill, Productlane — in-app-widget vs portal vs voting-board taxonomy, status transitions, public vs private roadmaps,... | "set up a feedback system", "which feedback tool should I use", "Canny vs Featurebase", "our feature requests are a mess" | `product-feedback-roadmap-stinger` |
| `review-funnels-wasp-drone` | Review collection and online-reputation specialist for SaaS products | "set up G2", "get more reviews", "Product Hunt launch", "is this incentive compliant" | `review-funnels-stinger` |
| `social-media-marketing-organic-wasp-drone` | Genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people) | "help me with social media", "which platform should I focus on", "I want to build in public", "my social is inconsistent or dead" | `social-media-marketing-organic-stinger` |


### Documentation and knowledge

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `adr-writing-wasp-drone` | Architecture Decision Records: Nygard format, MADR template, Y-statement framing, supersession lifecycle | "write an ADR", "record this decision", "supersede ADR-NNN", "set up our ADR log" | `adr-writing-stinger` |
| `api-docs-wasp-drone` | API documentation: docs-renderer selection, OpenAPI spec enrichment with examples, hosted/self-hosted deployment, SDK generation | "set up API docs", "which docs renderer should I use", "generate a TypeScript SDK from my spec" | `api-docs-stinger` |
| `asset-wasp-drone` | Owns the Universal Asset Registry: the platform-owned catalog of features, pages, routes, controls, tokens, and other first-class assets | "registering a new asset", "auditing drift between code and DB", "generating registry migrations" | `asset-stinger` |
| `archivist-wasp-drone` | Acquired-repository archival: provenance and license intake, attribution and PII scrub, documentation consolidation, research-object preparation | "archive this acquired repo", "strip attribution and PII", "prepare this repository as a research object" | `archivist-stinger` |
| `contract-writing-wasp-drone` | Stable shared interface agreements before parallel PRDs: identify, document, accept, revise, and audit cross-PRD contracts | "write a shared contract", "freeze the interface", "identify stable contracts across our PRDs", "audit contract drift" | `contract-writing-stinger` |
| `docs-site-wasp-drone` | Documentation-site infrastructure: platform selection, the Diataxis content pyramid, docs-as-code CI, search | "pick a docs platform", "set up Docusaurus", "add search to docs" | `docs-site-stinger` |
| `knowledge-wasp-drone` | Authors narrative knowledge documentation: system overviews, architecture docs with diagrams, schema references, coding standards | "document the auth architecture", "write the system overview", "create knowledge docs for this repo" | `knowledge-stinger` |
| `library-wasp-drone` | Owns the full documentation lifecycle for the repo's library/: scaffolds structure, ingests issues into IRDs, generates PRDs, backwards-PRDs | "initialize library", "ingest new issues", "write a PRD for X", "backwards-PRD this module" | `library-stinger` |
| `mcp-tool-docs-wasp-drone` | Documentation for MCP tools, CLI surfaces, and generated API references (body still cites a legacy npm package; see PAIRING-AUDIT.md) | "document the MCP tools", "generate TypeDoc from the TS source", "document the CLI" | `mcp-tool-docs-stinger` |
| `readme-writing-wasp-drone` | Authors and audits README files as a conversion surface: canonical section order, badge discipline, OSS vs internal register | "write a README", "audit my README", "README-driven development" | `readme-writing-stinger` |
| `runbook-writing-wasp-drone` | Operational runbook authorship: canonical templates, no-implied-context audit, exact-command discipline, escalation paths, rollback standards | "write a runbook", "audit this runbook", "we need a runbook for this alert" | `runbook-writing-stinger` |
| `technical-writing-craft-wasp-drone` | Documentation writing quality: Diataxis framework, inverted-pyramid prose, code-example discipline, voice and tone consistency | "review this document", "is this doc well-written", "apply Diataxis" | `technical-writing-craft-stinger` |
| `wiki-wasp-drone` | Extracts code entities and architectural concepts into atomic, backlinked wiki pages; infers ADRs from commit messages | "extract entities from a file or directory", "document this module's exports", "add this to the knowledge graph" | `wiki-stinger` |
| `knowledge-base-help-center-wasp-drone` | Customer-facing knowledge base specialist — platform selection (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide), search-first architecture, AI deflection (chat-with-your-docs,... | "pick a KB platform", "set up a help center", "migrate Zendesk Guide", "add AI deflection to our docs" | `knowledge-base-help-center-stinger` |


### Process and quality

| Drone | Domain | Trigger keywords | Paired Stinger |
|---|---|---|---|
| `agile-scrum-wasp-drone` | Scrum methodology: audits whether teams actually practice Scrum, coaches ceremonies, writes Definition of Done, diagnoses anti-patterns | "audit our Scrum process", "is this Scrum", "write our DoD", "our retros don't produce anything" | `agile-scrum-stinger` |
| `branching-strategy-wasp-drone` | Branching strategy advisor: model selection, release/hotfix patterns, merge-vs-rebase, feature-flag vs feature-branch decision | "which branching model should we use", "GitFlow or trunk-based", "merge or rebase" | `branching-strategy-stinger` |
| `code-review-pr-wasp-drone` | Code review culture and PR lifecycle: PR description audits, review checklists, PR-size evaluation, rubber-stamp diagnosis | "audit our PR culture", "write a PR description", "create a review checklist" | `code-review-pr-stinger` |
| `estimation-wasp-drone` | Software estimation and forecasting: relative-sizing frameworks, the NoEstimates movement, planning-fallacy literature, probabilistic forecasting | "our story points mean nothing", "should we use NoEstimates", "we need a 90% confidence delivery date" | `estimation-stinger` |
| `kanban-flow-wasp-drone` | Kanban method: WIP limit design, flow-metric calculation, Little's Law diagnostics, visual-board design, class-of-service policies | "set up WIP limits", "calculate cycle time", "apply Little's Law" | `kanban-flow-stinger` |
| `quality-wasp-drone` | Quality-assurance reviewer that audits a completed implementation against its source plan document and produces findings | "QA this", "audit the implementation", "check the plan against the code" | `quality-stinger` |
| `retrospective-wasp-drone` | Retrospective facilitation: format selection, psychological safety pre-check, time-boxed facilitation plan, action-item follow-through | "run a retro", "plan our retrospective", "our retros produce no change" | `retrospective-stinger` |
| `swarm-audit-wasp-drone` | Swarm audits of a repository: scouts and briefs a Workflow fleet of single-lens investigators, adversarial refuters, Opus interpreters and critic; runs the 10-minute check-ins, kills and respawns stalls, guarantees nothing goes unreviewed; assembles the master report | "swarm audit", "state of the union", "audit every branch local and remote", "where did the team screw up", "launch an ultracode fleet" | `swarm-audit-stinger` |
| `code-forensics-wasp-drone` | Conducts forensic investigations of software-development and agency-services engagements to support fee-clawback, breach-of-contract, fraud, and gross-negligence claims | "code forensics" | `code-forensics-stinger` |
| `discovery-research-wasp-drone` | Continuous product discovery coach — Teresa Torres interview cadence, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interviews, assumption mapping, and prototype experiment design | "run a discovery session", "build an OST", "write an interview script", "map our assumptions" | `discovery-research-stinger` |
| `okr-goal-setting-wasp-drone` | OKR methodology specialist — writes, grades, and iterates on Objectives and Key Results | "write OKRs", "audit our OKRs", "are these KRs measurable?", "set up a quarterly goal cycle" | `okr-goal-setting-stinger` |

---

### Business and operations

| Drone | Domain | Trigger keywords | Paired Stinger |
| --- | --- | --- | --- |
| `hiring-ats-wasp-drone` | Applicant Tracking Systems authority for recruiting-tech stacks | "which ATS should we use", "audit our scorecards", "our take-home test is too long", "Gem vs hireEZ" | `hiring-ats-stinger` |
| `hr-payroll-wasp-drone` | HR infrastructure and payroll decision specialist for software startups — domestic payroll platform selection (Gusto, Rippling, Justworks), international contractor management and EOR (Deel, Remote.com, Oyster,... | "Gusto vs Rippling", "set up payroll", "EOR for international hire", "contractor vs employee" | `hr-payroll-stinger` |
| `incorporation-startup-stack-wasp-drone` | Company formation advisor for software startup founders | "incorporate my startup", "Stripe Atlas vs Clerky", "Delaware C-Corp or LLC", "how do I get an EIN" | `incorporation-startup-stack-stinger` |
| `investor-cap-table-wasp-drone` | Cap-table management and fundraising paperwork specialist for startup founders | "set up our cap table", "Carta vs Pulley", "how does a SAFE work?", "term sheet provisions" | `investor-cap-table-stinger` |
| `legal-docs-wasp-drone` | SaaS legal documentation specialist for Terms of Service, Privacy Policy, DPA, MSA, and Cookie Notice | "generate a privacy policy", "draft a DPA", "review a customer DPA redline", "set up Terms of Service" | `legal-docs-stinger` |

### Media and creative

| Drone | Domain | Trigger keywords | Paired Stinger |
| --- | --- | --- | --- |
| `natural-photography-wasp-drone` | Photographic generation and retouching specialist for consented model work | "generate a photo of <model>", "retouch this frame", "make this look like a real phone photo", "ingest a new model" | `natural-photography-stinger` |

## Dispatch and arming contract

Spawn every Drone at the top level. Do not nest a Drone inside another Drone.

Every dispatch prompt must arm the Drone before it does anything else:

> You are `<drone-name>`. Before doing anything else, read your paired Stinger in full at `../<stinger-name>/SKILL.md` and follow it as your operating manual. Then: [scoped task, exact files in scope, definition of done, how the work will be verified].

Resolve `<stinger-name>` from the Paired Stinger column above, or apply the convention directly: `<base>-wasp-drone` to `<base>-stinger`.

For a HighLevel or Webapp Capture row, resolve its Stinger from the installed optional pack. Never use a core skill path for those pairs; they are not part of core.

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

## Multi-Drone orchestration

Real sequences for this stack. Every sequence below closes with the Ship Gate; it isn't repeated in each entry.

### Parallel PRD contract handoff

1. `library-wasp-drone` maps proposed PRD scopes and shared boundaries before assigning independent PRD authors.
2. `contract-writing-wasp-drone` reuses or drafts one `CTR` record per shared boundary and asks Mario to accept the exact normative terms. Draft or disputed boundaries block completion of affected PRDs.
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

Add a sequence here whenever a recurring multi-Drone pattern emerges in practice.

---

## Adding a new Drone

Don't hand-roll a new Drone. Walk [`../queen-wasp-stinger/guides/pest-controller-registration.md`](../queen-wasp-stinger/guides/pest-controller-registration.md), the forge's registration guide, start to finish. It covers naming the pair, writing the agent frontmatter, writing the paired Stinger, and registering both here.

---

**119 Drones registered: 115 core, 3 in `highlevel`, and 1 in `webapp-capture`.** Installed Drones have a paired Stinger. See [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md) for the last full pairing audit; the source validator checks the current routed roster against the filesystem.

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
