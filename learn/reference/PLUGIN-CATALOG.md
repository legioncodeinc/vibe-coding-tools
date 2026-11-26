# Plugin catalog

Generated from the built Wasp Nest v3.1.0 plugins. This is the complete shipped roster; the [README](../../README.md#what-ships) is the short install guide.

## wasp-nest-core

Version `3.1.0`. 18 Stingers, 14 Drones. [Pack overview](../../plugins/wasp-nest-core/README.md).

### Stingers

- [adr-writing-stinger](../../plugins/wasp-nest-core/skills/adr-writing-stinger/SKILL.md): Write and govern Architecture Decision Records. Use for new ADRs, supersession, log audits, or ADR tooling.
- [branching-strategy-stinger](../../plugins/wasp-nest-core/skills/branching-strategy-stinger/SKILL.md): Choose a Git branching model and release flow. Use for trunk vs GitFlow, hotfixes, merge vs rebase, or feature flags.
- [code-review-pr-stinger](../../plugins/wasp-nest-core/skills/code-review-pr-stinger/SKILL.md): Improve PR descriptions and review practice. Use for checklists, PR size, comment quality, or rubber-stamp diagnosis.
- [contract-writing-stinger](../../plugins/wasp-nest-core/skills/contract-writing-stinger/SKILL.md): Find and write stable shared contracts before parallel PRDs. Use for cross-PRD APIs, events, data shapes, permissions, or state transitions, and for contract drift.
- [dependency-audit-stinger](../../plugins/wasp-nest-core/skills/dependency-audit-stinger/SKILL.md): Audit dependencies for the target repository's ecosystem: lockfiles, vulnerability triage, SBOM and provenance. Use for supply-chain or publish safety; Hivemind is a worked npm example.
- [get-started-stinger](../../plugins/wasp-nest-core/skills/get-started-stinger/SKILL.md): Onboard home instructions and initialize new or existing repos with Library, CI, and knowledge docs. Use for first-session setup or a repo missing wasp-nest.lock.
- [git-stinger](../../plugins/wasp-nest-core/skills/git-stinger/SKILL.md): Teach safe Git basics in disposable practice repositories, or handle rebase, conflicts, recovery, history, worktrees, and hooks.
- [github-repo-health-stinger](../../plugins/wasp-nest-core/skills/github-repo-health-stinger/SKILL.md): Audit GitHub repository hygiene. Use for branch protection, CI checks, CODEOWNERS, templates, README coverage, or commit history.
- [harness-integration-stinger](../../plugins/wasp-nest-core/skills/harness-integration-stinger/SKILL.md): Wire Wasp Nest capabilities across Claude Code, Cursor, Codex, and Cowork. Use for skill, agent, hook, MCP, or plugin portability.
- [knowledge-stinger](../../plugins/wasp-nest-core/skills/knowledge-stinger/SKILL.md): Write narrative knowledge docs for a repository. Use for architecture overviews, diagrams, auth flows, schema references, or coding standards.
- [library-stinger](../../plugins/wasp-nest-core/skills/library-stinger/SKILL.md): Maintain Library Schema v2 docs and reusable workflow templates. Use for PRDs, IRDs, knowledge docs, lifecycle moves, issue ingest or drift audits.
- [pest-controller-suit](../../plugins/wasp-nest-core/skills/pest-controller-suit/SKILL.md): Route Wasp Nest tasks to the right Drone, arm its Stinger, and enforce the Ship Gate. Use before multi-Drone work.
- [quality-stinger](../../plugins/wasp-nest-core/skills/quality-stinger/SKILL.md): Audit a completed implementation against its PRD or IRD. Use after security review for evidence-backed QA findings.
- [queen-wasp-stinger](../../plugins/wasp-nest-core/skills/queen-wasp-stinger/SKILL.md): Forge or update Wasp Nest skills, Drones, rules, commands, and plugins. Use for component creation, validation, packaging, or registration.
- [readme-writing-stinger](../../plugins/wasp-nest-core/skills/readme-writing-stinger/SKILL.md): Write and audit README files as landing pages. Use for value proposition, install flow, badges, structure, or internal tool context.
- [security-stinger](../../plugins/wasp-nest-core/skills/security-stinger/SKILL.md): Security audit for SvelteKit, Neon/Drizzle, WorkOS, Stripe, Vercel, Doppler, and GoHighLevel. First gate of the Ship Gate - scans, triages, and remediates vulnerabilities before quality-stinger.
- [technical-writing-craft-stinger](../../plugins/wasp-nest-core/skills/technical-writing-craft-stinger/SKILL.md): Improve technical documentation. Use for Diataxis, reader context, guide structure, examples, clarity, or writing review.
- [time-blocked-turns](../../plugins/wasp-nest-core/skills/time-blocked-turns/SKILL.md): Follow a requested agent work cadence. Use for timed blocks, retry limits, checkpoints, questions, and handoff reports.

### Drones

- [adr-writing-wasp-drone](../../plugins/wasp-nest-core/agents/adr-writing-wasp-drone.md): Architecture Decision Records specialist: authors, reviews, and governs ADRs in Nygard format (Context / Decision / Consequences / Alternatives Considered), MADR extended template, and Y-statement framing.
- [branching-strategy-wasp-drone](../../plugins/wasp-nest-core/agents/branching-strategy-wasp-drone.md): Branching strategy advisor for Git-based teams.
- [code-review-pr-wasp-drone](../../plugins/wasp-nest-core/agents/code-review-pr-wasp-drone.md): Code review culture and PR lifecycle specialist.
- [contract-writing-wasp-drone](../../plugins/wasp-nest-core/agents/contract-writing-wasp-drone.md): Finds and writes stable shared interface agreements before parallel PRDs.
- [dependency-audit-wasp-drone](../../plugins/wasp-nest-core/agents/dependency-audit-wasp-drone.md): Supply-chain security specialist for open-source dependency hygiene.
- [git-wasp-drone](../../plugins/wasp-nest-core/agents/git-wasp-drone.md): Git basics teaching in disposable practice repositories and Git mastery specialist: interactive rebase (squash, fixup, reword, autosquash), conflict resolution (rerere, mergetool, diff3), history rewriting (git filter-repo, BFG, never filter-branch), reset/reflog recovery (all three reset types, recovering deleted branches and commits), worktrees for parallel branch work, hooks (pre-commit, commit-msg, pre-push; Husky, lefthook), submodules vs subtrees decision, Git LFS, partial clone, and sparse checkout.
- [github-repo-health-wasp-drone](../../plugins/wasp-nest-core/agents/github-repo-health-wasp-drone.md): Repository hygiene auditor for GitHub repositories.
- [harness-integration-wasp-drone](../../plugins/wasp-nest-core/agents/harness-integration-wasp-drone.md): Cross-harness capability integration specialist for The Wasp Nest's four target harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork).
- [knowledge-wasp-drone](../../plugins/wasp-nest-core/agents/knowledge-wasp-drone.md): Authors narrative knowledge documentation for any repository: the human-readable, technically deep domain docs under `library/knowledge/private/<domain>/`.
- [library-wasp-drone](../../plugins/wasp-nest-core/agents/library-wasp-drone.md): Owns the full documentation lifecycle for any repository: scaffolds the canonical `library/` folder on first run, ingests GitHub issues into IRDs, generates feature PRDs from requirements, reverse-engineers existing code into backwards-PRDs, maintains knowledge docs, and enforces folder/naming invariants.
- [quality-wasp-drone](../../plugins/wasp-nest-core/agents/quality-wasp-drone.md): Quality-assurance reviewer that audits a completed implementation against its source plan document (a feature PRD at `library/requirements/<lifecycle>/prd-<###>-<title>/prd-<###>-<title>-index.md` or an issue IRD at `library/issues/<lifecycle>/ird-<###>-<title>/ird-<###>-<title>-index.md`) and produces a structured findings report.
- [readme-writing-wasp-drone](../../plugins/wasp-nest-core/agents/readme-writing-wasp-drone.md): Authors, audits, and restructures README files so they convert visitors into users.
- [security-wasp-drone](../../plugins/wasp-nest-core/agents/security-wasp-drone.md): Security audit and remediation specialist for this repo's stack - SvelteKit (Svelte 5), Neon Postgres with Drizzle, WorkOS auth, Stripe payments, Vercel hosting, Doppler secrets, and GoHighLevel integration.
- [technical-writing-craft-wasp-drone](../../plugins/wasp-nest-core/agents/technical-writing-craft-wasp-drone.md): Reviews and writes technical documentation using the Diataxis framework, inverted-pyramid prose structure, code-example discipline, voice and tone consistency, and the reader-lens diagnostic.

### Commands

- `/wasp-nest-core:choose-outcome` ([procedure](../../plugins/wasp-nest-core/commands/choose-outcome.md)): Find the qualified owner for a desired result. Use for choosing skills or packs; distinguish proposed coverage, source presence and selected installed capabilities.
- `/wasp-nest-core:drift-audit` ([procedure](../../plugins/wasp-nest-core/commands/drift-audit.md)): Validate every Wasp Nest component and diff the pest-controller-suit roster against the filesystem in both directions, check pairing integrity, guide coverage, dead references, stale paths, prose dash violations, and Cowork upload readiness, then produce a findings report with a prioritized fix list. Trigger with "audit the nest", "drift check", "is the roster in sync with the filesystem", "find orphaned drones", "check for unregistered skills".
- `/wasp-nest-core:forge` ([procedure](../../plugins/wasp-nest-core/commands/forge.md)): Run queen-wasp-stinger's seven-stage forge pipeline end to end for a brand-new Wasp Nest component, starting with mandatory topic elicitation before any work begins. Trigger with "forge a new stinger", "build a new drone", "we need a new command for X", "create a skill for Y", "make a new rule for Z".
- `/wasp-nest-core:pest-controller` ([procedure](../../plugins/wasp-nest-core/commands/pest-controller.md)): Orchestrate the Wasp Swarm. Routes a task through the pest-controller-suit roster and dispatches wasp-drone sub-agents, each armed with its paired Stinger skill before it starts.
- `/wasp-nest-core:qualify-wiring` ([procedure](../../plugins/wasp-nest-core/commands/qualify-wiring.md)): Qualify source, generated carriers, selected owners and native proof for skill, agent, command or plugin wiring using existing Wasp Nest tools.
- `/wasp-nest-core:re-research` ([procedure](../../plugins/wasp-nest-core/commands/re-research.md)): Refresh one Stinger's research archive on the six-month window by re-running the forge pipeline's Research and Distillation stages, then flag which guides now rest on claims the refreshed research contradicts or no longer supports. Trigger with "re-research the payments stinger", "refresh research for X-stinger", "is Y-stinger's research stale", "update the research archive for Z", "the six-month window is up on this stinger".
- `/wasp-nest-core:register` ([procedure](../../plugins/wasp-nest-core/commands/register.md)): Walk the pest-controller registration checklist for a finished Drone and Stinger pair, verifying naming and the Critical Directive blocks, adding the roster row, authoring the routing guide, cross-linking related skills, wiring multi-Drone sequences, validating, and regenerating harnesses. Trigger with "register this drone", "register the new stinger pair", "add X to the roster", "finish registering Y", "the pair is built, wire it in".
- `/wasp-nest-core:ship-gate` ([procedure](../../plugins/wasp-nest-core/commands/ship-gate.md)): Run the Ship Gate on demand against the current diff, security-stinger first, then quality-stinger, then a hard reminder to load github-repo-health-stinger. Trigger with "run the ship gate", "gate this before I commit", "security and quality pass on this branch", "is this safe to push", "check my diff before I ship it".
- `/wasp-nest-core:smoke-it` ([procedure](../../plugins/wasp-nest-core/commands/smoke-it.md)): Drive a set of PRDs to 100% completion using the Wasp Swarm. Spawns armed wasp-drone sub-agents in waves, tracks every acceptance criterion to zero open items, runs the security/quality close-out, and prepares the final candidate, committing or pushing only within the approval already given.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-choose-outcome](../../plugins/wasp-nest-core/skills/source-command-choose-outcome/SKILL.md): reads the [choose-outcome procedure](../../plugins/wasp-nest-core/commands/choose-outcome.md) using the installed command wrapper selector.
- [source-command-drift-audit](../../plugins/wasp-nest-core/skills/source-command-drift-audit/SKILL.md): reads the [drift-audit procedure](../../plugins/wasp-nest-core/commands/drift-audit.md) using the installed command wrapper selector.
- [source-command-forge](../../plugins/wasp-nest-core/skills/source-command-forge/SKILL.md): reads the [forge procedure](../../plugins/wasp-nest-core/commands/forge.md) using the installed command wrapper selector.
- [source-command-pest-controller](../../plugins/wasp-nest-core/skills/source-command-pest-controller/SKILL.md): reads the [pest-controller procedure](../../plugins/wasp-nest-core/commands/pest-controller.md) using the installed command wrapper selector.
- [source-command-qualify-wiring](../../plugins/wasp-nest-core/skills/source-command-qualify-wiring/SKILL.md): reads the [qualify-wiring procedure](../../plugins/wasp-nest-core/commands/qualify-wiring.md) using the installed command wrapper selector.
- [source-command-re-research](../../plugins/wasp-nest-core/skills/source-command-re-research/SKILL.md): reads the [re-research procedure](../../plugins/wasp-nest-core/commands/re-research.md) using the installed command wrapper selector.
- [source-command-register](../../plugins/wasp-nest-core/skills/source-command-register/SKILL.md): reads the [register procedure](../../plugins/wasp-nest-core/commands/register.md) using the installed command wrapper selector.
- [source-command-ship-gate](../../plugins/wasp-nest-core/skills/source-command-ship-gate/SKILL.md): reads the [ship-gate procedure](../../plugins/wasp-nest-core/commands/ship-gate.md) using the installed command wrapper selector.
- [source-command-smoke-it](../../plugins/wasp-nest-core/skills/source-command-smoke-it/SKILL.md): reads the [smoke-it procedure](../../plugins/wasp-nest-core/commands/smoke-it.md) using the installed command wrapper selector.

## app-primer-zero

Version `3.1.0`. 1 Stingers, 0 Drones. [Pack overview](../../plugins/app-primer-zero/README.md).

### Stingers

- [app-primer-zero-stinger](../../plugins/app-primer-zero/skills/app-primer-zero-stinger/SKILL.md): Prepare an app's private Library, current state, contracts, complete schema baseline and bounded wave handoff before implementation. Use for app-primer-zero or foundation preparation.

### Commands

- `/app-primer-zero:app-primer-zero` ([procedure](../../plugins/app-primer-zero/commands/app-primer-zero.md)): Prepare an app's Library, contracts, schema and bounded wave-plan handoff before implementation.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-app-primer-zero](../../plugins/app-primer-zero/skills/source-command-app-primer-zero/SKILL.md): reads the [app-primer-zero procedure](../../plugins/app-primer-zero/commands/app-primer-zero.md) using the installed command wrapper selector.

## backend-and-desktop-tools

Version `3.1.0`. 10 Stingers, 10 Drones. [Pack overview](../../plugins/backend-and-desktop-tools/README.md).

### Stingers

- [app-store-submission-stinger](../../plugins/backend-and-desktop-tools/skills/app-store-submission-stinger/SKILL.md): Prepare iOS and Android app submissions. Use for store review, ASO, privacy forms, or rejection remediation.
- [electron-app-stinger](../../plugins/backend-and-desktop-tools/skills/electron-app-stinger/SKILL.md): Electron application engineering for process boundaries, preload APIs, IPC, sandboxing, packaging, updates, and desktop verification. Use for Electron app implementation or review.
- [go-desktop-stinger](../../plugins/backend-and-desktop-tools/skills/go-desktop-stinger/SKILL.md): Build Wails v2 desktop apps around Go backends: typed bindings, lifecycle, storage, native builds and package evidence. Use after Wails is explicitly selected.
- [go-stinger](../../plugins/backend-and-desktop-tools/skills/go-stinger/SKILL.md): Go specialist for modules, toolchains, vendoring and fork-in-tree freezes, cgo .so plugin ABI, project layout, and builds. Use for go.mod, replace directives, vendoring upstream repos, plugin crashes.
- [http-rest-fundamentals-stinger](../../plugins/backend-and-desktop-tools/skills/http-rest-fundamentals-stinger/SKILL.md): Audit HTTP and REST behavior. Use for methods, status codes, headers, caching, CORS, conditional requests, or API semantics.
- [python-stinger](../../plugins/backend-and-desktop-tools/skills/python-stinger/SKILL.md): Python code specialist for Django, FastAPI, Celery, Channels, pytest, uv, and Ruff. Use when reviewing, refactoring, or authoring Python code, or migrating DRF to Ninja.
- [rust-stinger](../../plugins/backend-and-desktop-tools/skills/rust-stinger/SKILL.md): Rust development specialist for Cargo, async services, persistence, CLI/TUI, tests, upgrades, and current toolchains. Use for Rust implementation, review, migration, or release guidance.
- [tauri-stinger](../../plugins/backend-and-desktop-tools/skills/tauri-stinger/SKILL.md): Tauri 2 engineering for desktop and mobile: updates, migration, IPC, capabilities, sidecars, AI runtimes, persistence, signing, updater, testing, and distribution. Use for Tauri-specific work.
- [terminal-bash-stinger](../../plugins/backend-and-desktop-tools/skills/terminal-bash-stinger/SKILL.md): Improve terminal workflows. Use for Bash, Zsh, Fish, modern CLI tools, dotfiles, tmux, or just/make automation.
- [typescript-node-stinger](../../plugins/backend-and-desktop-tools/skills/typescript-node-stinger/SKILL.md): Review TypeScript and Node code. Use for SvelteKit types, tsconfig, ESM, Zod boundaries, testing, or npm package builds.

### Drones

- [app-store-submission-wasp-drone](../../plugins/backend-and-desktop-tools/agents/app-store-submission-wasp-drone.md): App store publication specialist for iOS (App Store Connect + TestFlight) and Android (Google Play Console).
- [electron-app-wasp-drone](../../plugins/backend-and-desktop-tools/agents/electron-app-wasp-drone.md): Electron desktop application specialist for main, preload, renderer, IPC, sandbox, permissions, packaging, and native verification.
- [go-desktop-wasp-drone](../../plugins/backend-and-desktop-tools/agents/go-desktop-wasp-drone.md): Wails v2 desktop application specialist for Go backends, generated web bindings, validated facades, lifecycle, app-local storage and native/package evidence.
- [go-wasp-drone](../../plugins/backend-and-desktop-tools/agents/go-wasp-drone.md): Go implementation drone for modules, toolchains, vendoring/fork freezes, cgo .so plugin builds, and project layout.
- [http-rest-fundamentals-wasp-drone](../../plugins/backend-and-desktop-tools/agents/http-rest-fundamentals-wasp-drone.md): HTTP and REST protocol authority.
- [python-wasp-drone](../../plugins/backend-and-desktop-tools/agents/python-wasp-drone.md): Python architecture specialist for Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv codebases: enforces the canonical stack (Pydantic v2 at boundaries, Ruff + pyright, httpx for outbound HTTP), reviews Django app architecture, audits the ORM (N+1 prevention via select_related/prefetch_related, raw SQL only when justified), polices migrations (expand-backfill-contract; never edit applied migrations), migrates DRF to Django Ninja, sets up Celery jobs (retries, idempotency, acks_late), enables Channels (consumers + Daphne), configures pytest (pytest-django + factory_boy + pytest-asyncio), drives type adoption (pyright basic minimum, strict on new), Ruff config, uv migration, async refactors, settings split, and the Django + React decoupled-architecture surface (CORS, auth handoff, API contract).
- [rust-wasp-drone](../../plugins/backend-and-desktop-tools/agents/rust-wasp-drone.md): Rust implementation and code-review specialist for production `*.rs`, `Cargo.toml`, Cargo workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, Rust tests, and local packaging evidence.
- [tauri-wasp-drone](../../plugins/backend-and-desktop-tools/agents/tauri-wasp-drone.md): Tauri 2 desktop and mobile application engineering specialist.
- [terminal-bash-wasp-drone](../../plugins/backend-and-desktop-tools/agents/terminal-bash-wasp-drone.md): Terminal productivity specialist for Bash/Zsh/Fish configuration, modern CLI tools (ripgrep, fd, fzf, bat, eza, zoxide), shell scripting best practices, dotfile architecture, tmux/Zellij setup, and just/make task automation.
- [typescript-node-wasp-drone](../../plugins/backend-and-desktop-tools/agents/typescript-node-wasp-drone.md): Modern TypeScript/Node specialist for this Wasp Nest's stack - SvelteKit (Svelte 5) on Vercel as the primary case (tsconfig bundler resolution and verbatimModuleSyntax, typed load functions/form actions/+server.ts, Drizzle type-inference patterns, zod vs valibot at boundaries, Vitest plus Playwright, Biome vs ESLint, pnpm and monorepo choice, Node-on-Vercel version policy), with full continued support for the legacy npm library/CLI publishing case this Drone was originally forged for (Hivemind: strict ESM on Node16 resolution, esbuild multi-harness bundling, zod v3/v4 MCP split, jscpd, husky lint-staged as the whole gate).

### Commands

- `/backend-and-desktop-tools:build-desktop-app` ([procedure](../../plugins/backend-and-desktop-tools/commands/build-desktop-app.md)): Scope and build an authorized desktop-app slice with an explicit native boundary and native verification.
- `/backend-and-desktop-tools:build-mobile-backend` ([procedure](../../plugins/backend-and-desktop-tools/commands/build-mobile-backend.md)): Build the server side of a mobile product with accepted identity, API compatibility and unreliable-network contracts.
- `/backend-and-desktop-tools:choose-backend` ([procedure](../../plugins/backend-and-desktop-tools/commands/choose-backend.md)): Recommend one backend language/runtime from workload, integration, operations and actual implementation coverage.
- `/backend-and-desktop-tools:choose-desktop-stack` ([procedure](../../plugins/backend-and-desktop-tools/commands/choose-desktop-stack.md)): Choose one desktop architecture with native boundary, operating-system support, persistence, update and release evidence.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-build-desktop-app](../../plugins/backend-and-desktop-tools/skills/source-command-build-desktop-app/SKILL.md): reads the [build-desktop-app procedure](../../plugins/backend-and-desktop-tools/commands/build-desktop-app.md) using the installed command wrapper selector.
- [source-command-build-mobile-backend](../../plugins/backend-and-desktop-tools/skills/source-command-build-mobile-backend/SKILL.md): reads the [build-mobile-backend procedure](../../plugins/backend-and-desktop-tools/commands/build-mobile-backend.md) using the installed command wrapper selector.
- [source-command-choose-backend](../../plugins/backend-and-desktop-tools/skills/source-command-choose-backend/SKILL.md): reads the [choose-backend procedure](../../plugins/backend-and-desktop-tools/commands/choose-backend.md) using the installed command wrapper selector.
- [source-command-choose-desktop-stack](../../plugins/backend-and-desktop-tools/skills/source-command-choose-desktop-stack/SKILL.md): reads the [choose-desktop-stack procedure](../../plugins/backend-and-desktop-tools/commands/choose-desktop-stack.md) using the installed command wrapper selector.

## browser-and-app-testing-tools

Version `3.1.0`. 4 Stingers, 4 Drones. [Pack overview](../../plugins/browser-and-app-testing-tools/README.md).

### Stingers

- [browser-automation-stinger](../../plugins/browser-and-app-testing-tools/skills/browser-automation-stinger/SKILL.md): Playwright and Puppeteer automation for deterministic browser tests, debugging, downloads, screenshots, and browser lifecycle control. Use for browser automation work.
- [chrome-chromium-stinger](../../plugins/browser-and-app-testing-tools/skills/chrome-chromium-stinger/SKILL.md): Chrome DevTools Protocol and Chromium development for remote debugging, profiles, protocol inspection, source builds, and browser-engine diagnosis. Use for Chrome or Chromium engineering.
- [lighthouse-pagespeed-stinger](../../plugins/browser-and-app-testing-tools/skills/lighthouse-pagespeed-stinger/SKILL.md): Runs Lighthouse and PageSpeed Insights for React/Next.js: CI setup (LHCI), audit categories, performance budgets, lab-vs-CrUX gap. Use when setting up or debugging Lighthouse CI.
- [webapp-capture-stinger](../../plugins/browser-and-app-testing-tools/skills/webapp-capture-stinger/SKILL.md): Capture live web apps. Demo videos and scripts; component library with tokens, a Claude Design handoff zip, and a shadcn/ui map; visual and code audits.

### Drones

- [browser-automation-wasp-drone](../../plugins/browser-and-app-testing-tools/agents/browser-automation-wasp-drone.md): Playwright and Puppeteer automation specialist for browser tests, scripts, traces, screenshots, browser installs, and CI reliability.
- [chrome-chromium-wasp-drone](../../plugins/browser-and-app-testing-tools/agents/chrome-chromium-wasp-drone.md): Chrome DevTools Protocol and Chromium specialist for remote debugging, developer profiles, protocol inspection, source builds, and browser-engine diagnosis.
- [lighthouse-pagespeed-wasp-drone](../../plugins/browser-and-app-testing-tools/agents/lighthouse-pagespeed-wasp-drone.md): Lighthouse + PageSpeed Insights specialist: running audits locally vs in CI (LHCI 0.15.x / GitHub Actions), interpreting all four audit categories (Performance, Accessibility, Best Practices, SEO; PWA removed in LH12), setting score budgets and performance budgets, authoring custom Lighthouse plugins, and navigating the lab-vs-CrUX field-data gap (including the TBT/INP limitation).
- [webapp-capture-wasp-drone](../../plugins/browser-and-app-testing-tools/agents/webapp-capture-wasp-drone.md): Headless capture of live, authenticated web apps.

### Commands

- `/browser-and-app-testing-tools:webapp-capture` ([procedure](../../plugins/browser-and-app-testing-tools/commands/webapp-capture.md)): Capture a live web app. Demo video and script; component library with design tokens, a Claude Design handoff zip, and a shadcn/ui map; UI inconsistency audit.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-webapp-capture](../../plugins/browser-and-app-testing-tools/skills/source-command-webapp-capture/SKILL.md): reads the [webapp-capture procedure](../../plugins/browser-and-app-testing-tools/commands/webapp-capture.md) using the installed command wrapper selector.

## business-and-product-tools

Version `3.1.0`. 15 Stingers, 15 Drones. [Pack overview](../../plugins/business-and-product-tools/README.md).

### Stingers

- [agile-scrum-stinger](../../plugins/business-and-product-tools/skills/agile-scrum-stinger/SKILL.md): Coach Scrum teams. Use for ceremonies, roles, Definition of Done, estimation, or Scrum anti-patterns.
- [build-buy-analysis-stinger](../../plugins/business-and-product-tools/skills/build-buy-analysis-stinger/SKILL.md): Compare build, buy and partner approaches for one defined function using requirements, dated evidence, lifecycle costs, ownership and exit constraints.
- [capacity-planning-stinger](../../plugins/business-and-product-tools/skills/capacity-planning-stinger/SKILL.md): Decide when to hire or buy services from demand, skill gaps, available hours, review capacity and dated quotes. Prepare one provisional staffing recommendation.
- [discovery-research-stinger](../../plugins/business-and-product-tools/skills/discovery-research-stinger/SKILL.md): Run pre-build discovery: interviews, assumption tests, demand evidence, continue/pivot/stop decisions, and first-version scope.
- [estimation-stinger](../../plugins/business-and-product-tools/skills/estimation-stinger/SKILL.md): Forecast software delivery or an AI-assisted solo build at N hours daily. Use for sizing, NoEstimates, cycle-time data, or time/cash scenarios.
- [hiring-ats-stinger](../../plugins/business-and-product-tools/skills/hiring-ats-stinger/SKILL.md): Choose and configure an applicant tracking system. Use for pipeline stages, scorecards, calibration, sourcing, or ATS-to-HRIS handoff.
- [hr-payroll-stinger](../../plugins/business-and-product-tools/skills/hr-payroll-stinger/SKILL.md): Choose payroll and EOR tools. Use for Gusto vs Rippling, contractor classification, international hiring, or benefits.
- [incorporation-startup-stack-stinger](../../plugins/business-and-product-tools/skills/incorporation-startup-stack-stinger/SKILL.md): Set up a software company. Use for entity choice, Atlas vs Clerky, EIN, banking, bookkeeping, or founder paperwork.
- [investor-cap-table-stinger](../../plugins/business-and-product-tools/skills/investor-cap-table-stinger/SKILL.md): Manage startup cap tables and fundraising paperwork. Use for SAFEs, options, 409A, priced rounds, vesting, or data rooms.
- [kanban-flow-stinger](../../plugins/business-and-product-tools/skills/kanban-flow-stinger/SKILL.md): Improve Kanban flow. Use for WIP limits, cycle time, throughput, Little's Law, board design, or cumulative flow.
- [legal-docs-stinger](../../plugins/business-and-product-tools/skills/legal-docs-stinger/SKILL.md): Draft SaaS legal documents with lawyer review. Use for Terms, Privacy Policy, DPA, MSA, cookie notice, or generator choice.
- [okr-goal-setting-stinger](../../plugins/business-and-product-tools/skills/okr-goal-setting-stinger/SKILL.md): Write and audit OKRs. Use for measurable key results, quarterly cadence, grading, or OKR-vs-KPI decisions.
- [product-feedback-roadmap-stinger](../../plugins/business-and-product-tools/skills/product-feedback-roadmap-stinger/SKILL.md): Turn customer feedback into a roadmap. Use for feedback tools, deduplication, status policy, public roadmaps, or RICE scoring.
- [retrospective-stinger](../../plugins/business-and-product-tools/skills/retrospective-stinger/SKILL.md): Facilitate engineering retrospectives. Use for format selection, safety pre-check, facilitation, or action-item follow-through.
- [software-licensing-stinger](../../plugins/business-and-product-tools/skills/software-licensing-stinger/SKILL.md): Explain software licenses and prepare artifact evidence for copyleft or commercial distribution review. Use for license literacy, notices, GPL or AGPL boundary questions.

### Drones

- [agile-scrum-wasp-drone](../../plugins/business-and-product-tools/agents/agile-scrum-wasp-drone.md): Scrum methodology specialist: audits whether teams are actually practising Scrum, coaches Sprint Planning / Daily Scrum / Sprint Review / Retrospective / Backlog Refinement, writes Definition of Done templates (startup to enterprise), diagnoses anti-patterns (Zombie Scrum, HiPPO PO, no Sprint Goal, velocity gaming), coaches estimation (Fibonacci / Planning Poker / #NoEstimates), and recommends framework fit (Scrum vs ScrumBan vs Kanban vs Shape Up).
- [build-buy-analysis-wasp-drone](../../plugins/business-and-product-tools/agents/build-buy-analysis-wasp-drone.md): Compare build, buy and partner sourcing for one bounded function, using requirements, dated evidence, lifecycle costs, ownership and exit constraints.
- [capacity-planning-wasp-drone](../../plugins/business-and-product-tools/agents/capacity-planning-wasp-drone.md): Recommend when to hire or buy services from demand, actual capacity, skill gaps and dated quotes.
- [discovery-research-wasp-drone](../../plugins/business-and-product-tools/agents/discovery-research-wasp-drone.md): Continuous product discovery coach - Teresa Torres interview cadence, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interviews, assumption mapping, and prototype experiment design.
- [estimation-wasp-drone](../../plugins/business-and-product-tools/agents/estimation-wasp-drone.md): Software estimation and forecasting specialist: relative-sizing frameworks (Fibonacci story points, T-shirt sizing, Planning Poker), the NoEstimates movement and its evidence base (Vasco Duarte), the planning-fallacy literature explaining why estimates are systematically wrong, and cycle-time / throughput-based probabilistic forecasting (Monte Carlo simulation, percentile-based delivery predictions).
- [hiring-ats-wasp-drone](../../plugins/business-and-product-tools/agents/hiring-ats-wasp-drone.md): Applicant Tracking Systems authority for recruiting-tech stacks.
- [hr-payroll-wasp-drone](../../plugins/business-and-product-tools/agents/hr-payroll-wasp-drone.md): HR infrastructure and payroll decision specialist for software startups - domestic payroll platform selection (Gusto, Rippling, Justworks), international contractor management and EOR (Deel, Remote.com, Oyster, Rippling Global), the W-2/1099/EOR/PEO classification matrix, equity administration handoff to Carta, and benefits brokerage.
- [incorporation-startup-stack-wasp-drone](../../plugins/business-and-product-tools/agents/incorporation-startup-stack-wasp-drone.md): Company formation advisor for software startup founders.
- [investor-cap-table-wasp-drone](../../plugins/business-and-product-tools/agents/investor-cap-table-wasp-drone.md): Cap-table management and fundraising paperwork specialist for startup founders.
- [kanban-flow-wasp-drone](../../plugins/business-and-product-tools/agents/kanban-flow-wasp-drone.md): Kanban method specialist: WIP limit design and enforcement, flow-metric calculation (cycle time, lead time, throughput, flow efficiency), Little's Law diagnostics, visual-board design, class-of-service policies, cumulative-flow-diagram interpretation, and tool-specific implementation (Linear, Jira, GitHub Projects).
- [legal-docs-wasp-drone](../../plugins/business-and-product-tools/agents/legal-docs-wasp-drone.md): SaaS legal documentation specialist for Terms of Service, Privacy Policy, DPA, MSA, and Cookie Notice.
- [okr-goal-setting-wasp-drone](../../plugins/business-and-product-tools/agents/okr-goal-setting-wasp-drone.md): OKR methodology specialist - writes, grades, and iterates on Objectives and Key Results.
- [product-feedback-roadmap-wasp-drone](../../plugins/business-and-product-tools/agents/product-feedback-roadmap-wasp-drone.md): Customer-feedback-to-roadmap loop specialist - Userback, Canny, Featurebase, Productboard, Frill, Productlane - in-app-widget vs portal vs voting-board taxonomy, status transitions, public vs private roadmaps, de-duplication discipline, and RICE/ICE prioritization.
- [retrospective-wasp-drone](../../plugins/business-and-product-tools/agents/retrospective-wasp-drone.md): Retrospective facilitator and follow-through enforcer for engineering teams.
- [software-licensing-wasp-drone](../../plugins/business-and-product-tools/agents/software-licensing-wasp-drone.md): Explain licenses and prepare exact artifact evidence for copyleft, network-use or commercial distribution review without deciding legal compatibility.

### Commands

- `/business-and-product-tools:assess-product-risk` ([procedure](../../plugins/business-and-product-tools/commands/assess-product-risk.md)): Assess product assumptions, operational/security exposure and unresolved variables before a build decision.
- `/business-and-product-tools:compare-build-buy` ([procedure](../../plugins/business-and-product-tools/commands/compare-build-buy.md)): Compare build, licensed vendor and partner approaches for one bounded functional slice using dated evidence and lifecycle responsibilities.
- `/business-and-product-tools:estimate-build` ([procedure](../../plugins/business-and-product-tools/commands/estimate-build.md)): Forecast one person's AI-assisted software project at N hours daily, with learning, verification, external waits and separate cash/time scenarios.
- `/business-and-product-tools:review-software-license` ([procedure](../../plugins/business-and-product-tools/commands/review-software-license.md)): Explain and inventory software license evidence, distribution boundaries and unresolved review questions without relabeling rights.
- `/business-and-product-tools:scope-first-version` ([procedure](../../plugins/business-and-product-tools/commands/scope-first-version.md)): Turn a validated opportunity into one bounded first-version PRD with measurable acceptance and deferred scope.
- `/business-and-product-tools:validate-idea` ([procedure](../../plugins/business-and-product-tools/commands/validate-idea.md)): Test an app or business idea against customer evidence, current alternatives, and a falsifiable experiment.
- `/business-and-product-tools:work-like-a-team` ([procedure](../../plugins/business-and-product-tools/commands/work-like-a-team.md)): Turn a solo or small-team development goal into a five-area responsibility map, a working queue, a Definition of Done, and a review rhythm.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-assess-product-risk](../../plugins/business-and-product-tools/skills/source-command-assess-product-risk/SKILL.md): reads the [assess-product-risk procedure](../../plugins/business-and-product-tools/commands/assess-product-risk.md) using the installed command wrapper selector.
- [source-command-compare-build-buy](../../plugins/business-and-product-tools/skills/source-command-compare-build-buy/SKILL.md): reads the [compare-build-buy procedure](../../plugins/business-and-product-tools/commands/compare-build-buy.md) using the installed command wrapper selector.
- [source-command-estimate-build](../../plugins/business-and-product-tools/skills/source-command-estimate-build/SKILL.md): reads the [estimate-build procedure](../../plugins/business-and-product-tools/commands/estimate-build.md) using the installed command wrapper selector.
- [source-command-review-software-license](../../plugins/business-and-product-tools/skills/source-command-review-software-license/SKILL.md): reads the [review-software-license procedure](../../plugins/business-and-product-tools/commands/review-software-license.md) using the installed command wrapper selector.
- [source-command-scope-first-version](../../plugins/business-and-product-tools/skills/source-command-scope-first-version/SKILL.md): reads the [scope-first-version procedure](../../plugins/business-and-product-tools/commands/scope-first-version.md) using the installed command wrapper selector.
- [source-command-validate-idea](../../plugins/business-and-product-tools/skills/source-command-validate-idea/SKILL.md): reads the [validate-idea procedure](../../plugins/business-and-product-tools/commands/validate-idea.md) using the installed command wrapper selector.
- [source-command-work-like-a-team](../../plugins/business-and-product-tools/skills/source-command-work-like-a-team/SKILL.md): reads the [work-like-a-team procedure](../../plugins/business-and-product-tools/commands/work-like-a-team.md) using the installed command wrapper selector.

## code-audit-tools

Version `3.1.0`. 12 Stingers, 11 Drones. [Pack overview](../../plugins/code-audit-tools/README.md).

### Stingers

- [audit-my-code-stinger](../../plugins/code-audit-tools/skills/audit-my-code-stinger/SKILL.md): Orchestrates /audit-my-code. Five tiers (foundation, vibe, basic, full, mario) of codebase audits, dispatched to paired Drones and delivered as a Legion Code Inc. brief.
- [code-audit-brief-stinger](../../plugins/code-audit-tools/skills/code-audit-brief-stinger/SKILL.md): Render the Audit My Code brief, one self-contained Field Guide styled HTML file per run, from the workspace only. Escapes repo text, merges duplicates, prints cleanly to PDF.
- [code-bloat-stinger](../../plugins/code-audit-tools/skills/code-bloat-stinger/SKILL.md): Read-only bloat audit of any repo. jscpd duplication, knip or language dead-code tools with a spot-check, cloc size, function and closure structure, split plans, banded verdict.
- [code-forensics-stinger](../../plugins/code-audit-tools/skills/code-forensics-stinger/SKILL.md): Review software vendor engagements using contracts, invoices, messages and delivery records. Produce cited evidence drafts for human or counsel review.
- [code-foundation-stinger](../../plugins/code-audit-tools/skills/code-foundation-stinger/SKILL.md): Read-only repo health audit: Wasp Nest setup, agent readiness, CI, tests, lint, lockfiles, secrets, governance. Writes contract-shaped foundation findings and measures.
- [lovable-audit-stinger](../../plugins/code-audit-tools/skills/lovable-audit-stinger/SKILL.md): Audit Lovable-built Supabase apps: RLS denials, role-differential reads, function gating, auth posture, bundle-forensics key/endpoint extraction, findings triage, reporting.
- [nextjs-security-stinger](../../plugins/code-audit-tools/skills/nextjs-security-stinger/SKILL.md): Deep Next.js security audit (13 to 16, App and Pages Router). Version advisories, proxy and middleware auth, Server Actions, Route Handlers, data exposure, caching, config.
- [polyglot-security-stinger](../../plugins/code-audit-tools/skills/polyglot-security-stinger/SKILL.md): Deep security audit for Node servers, Python, Go, Rust, Rails, PHP, Spring, and .NET, plus secrets, dependencies, SAST, and CI. Read-only, writes Audit My Code findings.
- [react-security-stinger](../../plugins/code-audit-tools/skills/react-security-stinger/SKILL.md): Review React 18/19 security, including Next.js clients. Covers XSS, secrets and client trust.
- [remediation-planning-stinger](../../plugins/code-audit-tools/skills/remediation-planning-stinger/SKILL.md): Plan fixes from audit findings. Clusters findings into work packages, orders Now, Next, Later, and with approval writes Library PRDs, IRDs, knowledge docs, and draft contracts.
- [sveltekit-security-stinger](../../plugins/code-audit-tools/skills/sveltekit-security-stinger/SKILL.md): Evidence-backed, read-only security audit of Svelte 4/5 and SvelteKit 2 apps, any stack. Versions vs advisories, load leaks, actions, remote functions, hooks, XSS, CSRF, adapters.
- [swarm-audit-stinger](../../plugins/code-audit-tools/skills/swarm-audit-stinger/SKILL.md): Swarm audit of a repository: Workflow fleet of single-lens Sonnet investigators, adversarial verification, Opus interpreters and critic, 10-minute check-ins, kill and respawn, nothing unreviewed.

### Drones

- [code-audit-brief-wasp-drone](../../plugins/code-audit-tools/agents/code-audit-brief-wasp-drone.md): Renders the Audit My Code brief, one self-contained Field Guide styled HTML file per run, from the run workspace.
- [code-bloat-wasp-drone](../../plugins/code-audit-tools/agents/code-bloat-wasp-drone.md): Read-only code bloat audit for the bloat dimension of /audit-my-code.
- [code-forensics-wasp-drone](../../plugins/code-audit-tools/agents/code-forensics-wasp-drone.md): Review software and agency engagements from supplied contracts, invoices, communications and delivery evidence.
- [code-foundation-wasp-drone](../../plugins/code-audit-tools/agents/code-foundation-wasp-drone.md): Foundation (health) audit of a code repository for /audit-my-code.
- [lovable-audit-wasp-drone](../../plugins/code-audit-tools/agents/lovable-audit-wasp-drone.md): Empirical security audit of Lovable-built Supabase apps: row-level-security denial verification, role-differential visibility probes, Edge Function gating checks, auth-posture readout, client-bundle key and endpoint forensics, findings triage against an operator risk taxonomy, and grounded reporting.
- [nextjs-security-wasp-drone](../../plugins/code-audit-tools/agents/nextjs-security-wasp-drone.md): Deep, evidence-backed Next.js security audit (versions 13 to 16, App and Pages Router) for an /audit-my-code run.
- [polyglot-security-wasp-drone](../../plugins/code-audit-tools/agents/polyglot-security-wasp-drone.md): Deep, read-only security audit of non-React, non-Next.js, non-SvelteKit code (Node servers, Python, Go, Rust, Rails, PHP, Spring, .NET) plus secrets, dependencies, static analysis, and CI/CD and infrastructure, writing SEC-POLY findings in the Audit My Code contract shape.
- [react-security-wasp-drone](../../plugins/code-audit-tools/agents/react-security-wasp-drone.md): Deep, evidence-backed security audit of React 18 and 19 code for /audit-my-code.
- [remediation-planning-wasp-drone](../../plugins/code-audit-tools/agents/remediation-planning-wasp-drone.md): Turns Mario Audit findings into a remediation roadmap (Now, Next, Later), plan.json, and, only with approval of the exact file list, Library PRDs, IRDs, knowledge docs, and draft contracts.
- [sveltekit-security-wasp-drone](../../plugins/code-audit-tools/agents/sveltekit-security-wasp-drone.md): Deep, evidence-backed, read-only security audit of Svelte 4/5 and SvelteKit 2 apps (and plain Svelte + Vite SPAs) on any stack, for an /audit-my-code run.
- [swarm-audit-wasp-drone](../../plugins/code-audit-tools/agents/swarm-audit-wasp-drone.md): Swarm-audit scout, observer, and assembler.

### Commands

- `/code-audit-tools:audit-my-code` ([procedure](../../plugins/code-audit-tools/commands/audit-my-code.md)): Audit a codebase the way Legion Code Inc. does: foundation health, duplication and dead code, framework-deep security, quality, and a remediation plan, delivered as a branded brief.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-audit-my-code](../../plugins/code-audit-tools/skills/source-command-audit-my-code/SKILL.md): reads the [audit-my-code procedure](../../plugins/code-audit-tools/commands/audit-my-code.md) using the installed command wrapper selector.

## content-intelligence

Version `3.1.0`. 2 Stingers, 0 Drones. [Pack overview](../../plugins/content-intelligence/README.md).

### Stingers

- [repo-radar-stinger](../../plugins/content-intelligence/skills/repo-radar-stinger/SKILL.md): Scan GitHub for repos trending in the last 24 hours (vibe coding, AI coding, AI memory, vulnerabilities) via Exa/Firecrawl MCP, vet ONE, and output post options in the user's voice with receipts.
- [viral-news-stinger](../../plugins/content-intelligence/skills/viral-news-stinger/SKILL.md): Mine the last 24 hours of trending news via Exa/Firecrawl MCP, fact-check ONE topic, and output viral-ready post options in the user's voice with receipts. Use for scheduled news-post Routine runs.

### Commands

- `/content-intelligence:research-content-opportunity` ([procedure](../../plugins/content-intelligence/commands/research-content-opportunity.md)): Vet one fresh content opportunity with receipts, source times, duplicate checks, and honest no-post exits.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-research-content-opportunity](../../plugins/content-intelligence/skills/source-command-research-content-opportunity/SKILL.md): reads the [research-content-opportunity procedure](../../plugins/content-intelligence/commands/research-content-opportunity.md) using the installed command wrapper selector.

## data-and-ai-tools

Version `3.1.0`. 12 Stingers, 12 Drones. [Pack overview](../../plugins/data-and-ai-tools/README.md).

### Stingers

- [ai-coding-tools-stinger](../../plugins/data-and-ai-tools/skills/ai-coding-tools-stinger/SKILL.md): Choose, configure or troubleshoot AI coding tools, and write bounded task briefs. Use for tool comparison, prompt context, task scope, acceptance, ownership and verification.
- [ai-tools-platform-stinger](../../plugins/data-and-ai-tools/skills/ai-tools-platform-stinger/SKILL.md): Choose AI providers, gateways and local models. Use for AI stack setup, retry and spend budgets, feature margin or local hardware fit.
- [bifrost-stinger](../../plugins/data-and-ai-tools/skills/bifrost-stinger/SKILL.md): Bifrost AI gateway specialist: maximhq/bifrost architecture, admin and inference API surface, virtual keys, semantic cache, .so plugins, tags, fork freeze and upgrade policy. Use for any Bifrost work.
- [cursor-ide-stinger](../../plugins/data-and-ai-tools/skills/cursor-ide-stinger/SKILL.md): Configure Cursor agents, rules, hooks, MCP, and SDK automation. Use for Cursor integration or IDE productivity issues.
- [db-stinger](../../plugins/data-and-ai-tools/skills/db-stinger/SKILL.md): Design PostgreSQL data layers. Use for schema, indexes, migrations, query performance, ORM choice, or serverless databases.
- [deeplake-dataset-stinger](../../plugins/data-and-ai-tools/skills/deeplake-dataset-stinger/SKILL.md): Design and maintain Wasp Nestmind Deep Lake datasets. Use for ColumnDef schemas, healing, versioned writes, or hybrid indexing.
- [embeddings-runtime-stinger](../../plugins/data-and-ai-tools/skills/embeddings-runtime-stinger/SKILL.md): Picks and runs embedding models: hosted (OpenAI, Cohere, Voyage) vs self-hosted, cost tradeoffs, batching, caching. Use when choosing, swapping, or debugging an embedding model.
- [mind-stinger](../../plugins/data-and-ai-tools/skills/mind-stinger/SKILL.md): Reviews, audits, and extends the AI cognitive layer: coach routing, prompt cascade, RAG, three-tier memory, observability, evaluation. Use when reviewing AI code or tuning retrieval.
- [neon-drizzle-stinger](../../plugins/data-and-ai-tools/skills/neon-drizzle-stinger/SKILL.md): Neon Postgres and Drizzle ORM on SvelteKit/Vercel: connections, schema, migrations, branching, query patterns, pgvector, RLS, and migrating off Supabase. Use for any Neon or Drizzle task.
- [retrieval-stinger](../../plugins/data-and-ai-tools/skills/retrieval-stinger/SKILL.md): Designs and audits retrieval: full-text search, pgvector recall, hybrid RRF fusion, reranking, chunking, recall quality eval. Use when tuning recall or a search query misses.
- [tars-stinger](../../plugins/data-and-ai-tools/skills/tars-stinger/SKILL.md): Manage Claude Code Desktop sessions. TARS spawns chips through /smoke-it or pest-controller, CASE advises and watches systems, KIPP writes PRDs.
- [vector-store-stinger](../../plugins/data-and-ai-tools/skills/vector-store-stinger/SKILL.md): Design vector storage. Use for pgvector schemas, HNSW/IVFFlat, hybrid indexes, migrations, or storage choice.

### Drones

- [ai-coding-tools-wasp-drone](../../plugins/data-and-ai-tools/agents/ai-coding-tools-wasp-drone.md): The vibe-coder's AI coding tool advisor and bounded coding task brief writer, recommends, compares, and configures Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent, Devin 2.0, and Bolt across four autonomy tiers.
- [ai-tools-platform-wasp-drone](../../plugins/data-and-ai-tools/agents/ai-tools-platform-wasp-drone.md): The vibe coder's AI toolbox specialist: AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Claude, GPT, Gemini), cheap-fallback routes (Haiku, Mini, Flash), local LLMs (Ollama, LM Studio), GPU cloud (Runpod, Modal, Together, Fireworks, Groq), and must-have MCP servers and IDE plugins.
- [bifrost-wasp-drone](../../plugins/data-and-ai-tools/agents/bifrost-wasp-drone.md): Bifrost gateway implementation drone for maximhq/bifrost trees - freeze and upgrade execution, admin API changes, plugin wiring, semantic cache config, contract extraction from docs/openapi.
- [cursor-ide-wasp-drone](../../plugins/data-and-ai-tools/agents/cursor-ide-wasp-drone.md): Cursor IDE platform specialist: project rules (.cursorrules migration, .cursor/rules/*.mdc authoring), MCP server registration and tool authoring, @cursor/sdk API for programmatic agent automation, custom modes, Agents Window and Cloud Agents, and Cursor productivity patterns.
- [db-wasp-drone](../../plugins/data-and-ai-tools/agents/db-wasp-drone.md): PostgreSQL data architecture specialist: schema design, indexing strategy, zero-downtime migrations, ORM choice (Drizzle / Prisma / raw SQL), and serverless DB platform selection (Supabase / Neon / Turso / PlanetScale / CockroachDB / Tiger Data).
- [deeplake-dataset-wasp-drone](../../plugins/data-and-ai-tools/agents/deeplake-dataset-wasp-drone.md): Deep Lake data architecture specialist for Hivemind - the 7-table ColumnDef schema, `USING deeplake` DDL, FLOAT4[768] embeddings, additive schema healing, append-only version-bump writes, indexing (deeplake_index BM25 / `<#>` vector / hybrid), DeeplakeApi querying, SQL guards, dataset versioning, and BYOC storage selection.
- [embeddings-runtime-wasp-drone](../../plugins/data-and-ai-tools/agents/embeddings-runtime-wasp-drone.md): The embedding model selection and runtime specialist.
- [mind-wasp-drone](../../plugins/data-and-ai-tools/agents/mind-wasp-drone.md): Cognitive-layer specialist for the deploying product, covering coach/agent routing, prompt cascade, RAG/GraphRAG, three-tier memory, observability, evaluation, multimodal pipeline, orchestration, matching, and onboarding as stack-neutral architecture, plus SvelteKit +server.ts streaming LLM responses on Vercel.
- [neon-drizzle-wasp-drone](../../plugins/data-and-ai-tools/agents/neon-drizzle-wasp-drone.md): Neon Postgres + Drizzle ORM specialist for the SvelteKit/Vercel stack migrating off Supabase.
- [retrieval-wasp-drone](../../plugins/data-and-ai-tools/agents/retrieval-wasp-drone.md): Retrieval specialist for an app - owns Postgres full-text search (tsvector, websearch_to_tsquery, ts_rank), pgvector semantic recall, Reciprocal Rank Fusion hybrid search, optional cross-encoder reranking, chunking strategy, and recall/precision evaluation with golden query sets.
- [tars-wasp-drone](../../plugins/data-and-ai-tools/agents/tars-wasp-drone.md): TARS, the session manager for the Claude Code desktop app: turns the owner's asks into chips, manages every session to merged and deployed, fields their questions, makes manager-level decisions, launches every chip through /smoke-it or the pest-controller command, uses CASE as adviser and read-only systems and CI watcher, and KIPP as the idea factory and PRD writer, runs a real 10-minute tick and a 1-minute CI poller with a watchdog.
- [vector-store-wasp-drone](../../plugins/data-and-ai-tools/agents/vector-store-wasp-drone.md): Vector and embedding storage specialist - schema and column design, index selection (HNSW vs IVFFlat, distance operators), hybrid lexical+vector search at the storage layer, migrations, and dataset versioning.

### Commands

- `/data-and-ai-tools:build-rag-feature` ([procedure](../../plugins/data-and-ai-tools/commands/build-rag-feature.md)): Build a bounded RAG feature against an accepted corpus, access contract, and measured retrieval and answer evaluation.
- `/data-and-ai-tools:design-data` ([procedure](../../plugins/data-and-ai-tools/commands/design-data.md)): Design a source-grounded data model, access boundaries, indexes and a migration proposal without executing database changes.
- `/data-and-ai-tools:tars` ([procedure](../../plugins/data-and-ai-tools/commands/tars.md)): Make this Claude Code desktop session TARS, the manager. Spawns chips for what you ask, each run through /smoke-it or the pest-controller command, manages every session to done, fields their questions, uses CASE as adviser and read-only systems and CI watcher, and KIPP as the idea factory and PRD writer, runs a real 10-minute tick and a 1-minute CI watch.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-build-rag-feature](../../plugins/data-and-ai-tools/skills/source-command-build-rag-feature/SKILL.md): reads the [build-rag-feature procedure](../../plugins/data-and-ai-tools/commands/build-rag-feature.md) using the installed command wrapper selector.
- [source-command-design-data](../../plugins/data-and-ai-tools/skills/source-command-design-data/SKILL.md): reads the [design-data procedure](../../plugins/data-and-ai-tools/commands/design-data.md) using the installed command wrapper selector.
- [source-command-tars](../../plugins/data-and-ai-tools/skills/source-command-tars/SKILL.md): reads the [tars procedure](../../plugins/data-and-ai-tools/commands/tars.md) using the installed command wrapper selector.

The /tars manager team (TARS, CASE and KIPP) requires Claude Code Desktop; an adapter in Codex, Cursor or Cowork does not make that manager workflow available.

## developer-learning-tools

Version `3.1.0`. 4 Stingers, 4 Drones. [Pack overview](../../plugins/developer-learning-tools/README.md).

### Stingers

- [builder-readiness-stinger](../../plugins/developer-learning-tools/skills/builder-readiness-stinger/SKILL.md): Help new coders prepare to build: clarify one goal, learning prerequisites, roles, expectations, unknowns and a first-slice proposal.
- [project-learning-stinger](../../plugins/developer-learning-tools/skills/project-learning-stinger/SKILL.md): Teach web fundamentals through tiny projects, or prepare an exercise and criterion rubric from one supplied technical source revision. Use attempts, feedback and teach-back.
- [technical-explainer-stinger](../../plugins/developer-learning-tools/skills/technical-explainer-stinger/SKILL.md): Explain technical sources, errors and generated code at grade 8 with bounded analogies, source claims, glossary and teach-back.
- [testing-coach-stinger](../../plugins/developer-learning-tools/skills/testing-coach-stinger/SKILL.md): Teach contract-based testing through tiny exercises, failure interpretation and changed conditions. Use for learning assertions without copying implementation.

### Drones

- [builder-readiness-wasp-drone](../../plugins/developer-learning-tools/agents/builder-readiness-wasp-drone.md): Help a new coder prepare an app, site, desktop app, integration, plugin or tool: one scoped recommendation, prerequisites, roles, unknowns and first-slice proposal.
- [project-learning-wasp-drone](../../plugins/developer-learning-tools/agents/project-learning-wasp-drone.md): Teach web fundamentals through small projects, or prepare an exercise and criterion rubric from one supplied technical source revision.
- [technical-explainer-wasp-drone](../../plugins/developer-learning-tools/agents/technical-explainer-wasp-drone.md): Explain technical documents, posts, messages, errors or generated code at grade 8 with consistent analogies, glossary, source claims and teach-back.
- [testing-coach-wasp-drone](../../plugins/developer-learning-tools/agents/testing-coach-wasp-drone.md): Teach independent contract-based assertions, test failure interpretation and changed-condition practice.

### Commands

- `/developer-learning-tools:explain-this` ([procedure](../../plugins/developer-learning-tools/commands/explain-this.md)): Explain a technical source at grade 8 with a bounded analogy, glossary, evidence and teach-back.
- `/developer-learning-tools:learn-through-project` ([procedure](../../plugins/developer-learning-tools/commands/learn-through-project.md)): Choose a beginner learning path and teach HTML, CSS and JavaScript through one bounded project with observed learning checks.
- `/developer-learning-tools:practice-tests` ([procedure](../../plugins/developer-learning-tools/commands/practice-tests.md)): Teach independent tests from a stated contract with prediction, observed attempts, failure interpretation and changed-condition practice.
- `/developer-learning-tools:prepare-learning-exercise` ([procedure](../../plugins/developer-learning-tools/commands/prepare-learning-exercise.md)): Prepare one source-linked technical exercise, teach-back and criterion-level evidence rubric without assuming mastery.
- `/developer-learning-tools:prepare-to-build` ([procedure](../../plugins/developer-learning-tools/commands/prepare-to-build.md)): Help a new coder prepare one build goal with learning prerequisites, responsibilities, unknowns and a first-slice proposal.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-explain-this](../../plugins/developer-learning-tools/skills/source-command-explain-this/SKILL.md): reads the [explain-this procedure](../../plugins/developer-learning-tools/commands/explain-this.md) using the installed command wrapper selector.
- [source-command-learn-through-project](../../plugins/developer-learning-tools/skills/source-command-learn-through-project/SKILL.md): reads the [learn-through-project procedure](../../plugins/developer-learning-tools/commands/learn-through-project.md) using the installed command wrapper selector.
- [source-command-practice-tests](../../plugins/developer-learning-tools/skills/source-command-practice-tests/SKILL.md): reads the [practice-tests procedure](../../plugins/developer-learning-tools/commands/practice-tests.md) using the installed command wrapper selector.
- [source-command-prepare-learning-exercise](../../plugins/developer-learning-tools/skills/source-command-prepare-learning-exercise/SKILL.md): reads the [prepare-learning-exercise procedure](../../plugins/developer-learning-tools/commands/prepare-learning-exercise.md) using the installed command wrapper selector.
- [source-command-prepare-to-build](../../plugins/developer-learning-tools/skills/source-command-prepare-to-build/SKILL.md): reads the [prepare-to-build procedure](../../plugins/developer-learning-tools/commands/prepare-to-build.md) using the installed command wrapper selector.

## documentation-tools

Version `3.1.0`. 8 Stingers, 8 Drones. [Pack overview](../../plugins/documentation-tools/README.md).

### Stingers

- [api-docs-stinger](../../plugins/documentation-tools/skills/api-docs-stinger/SKILL.md): Build and maintain API docs. Use for OpenAPI examples, renderer choice, hosting, SDK consumer compatibility, or changelogs.
- [archivist-stinger](../../plugins/documentation-tools/skills/archivist-stinger/SKILL.md): Prepares an acquired repository for archival: provenance intake, attribution and PII scrub, docs merge into library/, knowledge-base fleet, identifier rename, verification. Any language or license.
- [docs-site-stinger](../../plugins/documentation-tools/skills/docs-site-stinger/SKILL.md): Select and maintain developer docs sites. Use for Docusaurus, Mintlify, Starlight, Diataxis, search, or docs-as-code CI.
- [kb-refresh-stinger](../../plugins/documentation-tools/skills/kb-refresh-stinger/SKILL.md): Full documentation refresh: inventory, writer fleet, grounded citations, adversarial verification, security and quality gates, one ready PR per unit, PDF plus markdown report, master suspect list.
- [library-packets-stinger](../../plugins/documentation-tools/skills/library-packets-stinger/SKILL.md): Turn a library into cited audience packets in Markdown, Word and branded PDF. Use for executive, public, sales, service or engineering documents grounded in existing sources.
- [markdown-mdx-content-pipeline-stinger](../../plugins/documentation-tools/skills/markdown-mdx-content-pipeline-stinger/SKILL.md): Build Markdown and MDX pipelines. Use for compiler choice, remark/rehype plugins, syntax highlighting, diagrams, or sanitization.
- [mcp-tool-docs-stinger](../../plugins/documentation-tools/skills/mcp-tool-docs-stinger/SKILL.md): Documents MCP tools, TypeScript APIs, and CLIs honestly: schema, output, side effects, examples, doc-to-code sync. Use when writing or auditing tool/API/CLI docs.
- [wiki-stinger](../../plugins/documentation-tools/skills/wiki-stinger/SKILL.md): Extract code entities into the wiki. Use for atomic pages, backlinks, inferred ADRs, contradiction checks, or wiki linting.

### Drones

- [api-docs-wasp-drone](../../plugins/documentation-tools/agents/api-docs-wasp-drone.md): API documentation authority: Swagger UI / Redoc / Scalar / Mintlify / Stoplight / Bump.sh tool selection, OpenAPI spec enrichment with JSON request + response examples, hosted and self-hosted deployment (GitHub Pages / Netlify / Vercel / Docker), SDK generation for TypeScript / Python / Go, and changelog discipline.
- [archivist-wasp-drone](../../plugins/documentation-tools/agents/archivist-wasp-drone.md): Prepares an acquired software repository, any language and any inbound license, for permanent archival as a research object: records the ownership basis and third-party carve-outs, strips the seller's attribution, license grants, and personal identifiers while preserving every third-party notice, merges the legacy docs tree into library/knowledge, prepares the shared brief and assignments for the knowledge-wasp-drone fleet that the orchestrator dispatches, renames the product identifier on request, verifies to zero, and files the archivist report.
- [docs-site-wasp-drone](../../plugins/documentation-tools/agents/docs-site-wasp-drone.md): Documentation-site infrastructure specialist.
- [kb-refresh-wasp-drone](../../plugins/documentation-tools/agents/kb-refresh-wasp-drone.md): Documentation-refresh fleet runner.
- [library-packets-wasp-drone](../../plugins/documentation-tools/agents/library-packets-wasp-drone.md): Produce source-grounded library packets in Markdown, Word, branded PDF and citations for executives, public readers, sales, service and engineers.
- [markdown-mdx-content-pipeline-wasp-drone](../../plugins/documentation-tools/agents/markdown-mdx-content-pipeline-wasp-drone.md): Markdown/MDX content processing specialist.
- [mcp-tool-docs-wasp-drone](../../plugins/documentation-tools/agents/mcp-tool-docs-wasp-drone.md): Tool, API, and CLI documentation authority - documenting MCP (and other schema-selected) tools with honest name/purpose/input-schema/output/side-effects/annotations/examples, TypeScript public API reference generation (TypeDoc, and API Extractor for a reviewable public-API contract), CLI command references, doc-to-code sync, and changelog discipline tied to a released artifact's version.
- [wiki-wasp-drone](../../plugins/documentation-tools/agents/wiki-wasp-drone.md): Extracts code entities (functions, classes, modules, services, endpoints, env vars, config keys, data models, React components, SQL tables, queues, cron jobs, feature flags) and architectural concepts from per-repo source code plus git context, files them as atomic markdown pages with `[[backlinks]]` into `library/knowledge/private/wiki/`, infers ADRs from commit messages that encode decisions, and runs an active four-artifact contradiction protocol when entity contracts change.

### Commands

- `/documentation-tools:explain-repository` ([procedure](../../plugins/documentation-tools/commands/explain-repository.md)): Explain how a supplied repository works using source evidence, an eighth-grade reading level, and bounded analogies.
- `/documentation-tools:kb-refresh` ([procedure](../../plugins/documentation-tools/commands/kb-refresh.md)): Run the full documentation audit and refresh pipeline on a repository: inventory, writer fleet, grounded citations, adversarial verification, security and quality gates, one ready PR per unit, then the work report in PDF plus markdown and the master suspect list. Trigger with "refresh the docs", "kb refresh", "rebuild the knowledge base", "doc swarm".
- `/documentation-tools:library-packets` ([procedure](../../plugins/documentation-tools/commands/library-packets.md)): Produce cited audience documents from a library in Markdown, Word and branded PDF. Check source coverage, public boundaries and every final page.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-explain-repository](../../plugins/documentation-tools/skills/source-command-explain-repository/SKILL.md): reads the [explain-repository procedure](../../plugins/documentation-tools/commands/explain-repository.md) using the installed command wrapper selector.
- [source-command-kb-refresh](../../plugins/documentation-tools/skills/source-command-kb-refresh/SKILL.md): reads the [kb-refresh procedure](../../plugins/documentation-tools/commands/kb-refresh.md) using the installed command wrapper selector.
- [source-command-library-packets](../../plugins/documentation-tools/skills/source-command-library-packets/SKILL.md): reads the [library-packets procedure](../../plugins/documentation-tools/commands/library-packets.md) using the installed command wrapper selector.

## growth-and-customer-tools

Version `3.1.0`. 15 Stingers, 15 Drones. [Pack overview](../../plugins/growth-and-customer-tools/README.md).

### Stingers

- [affiliate-referral-program-stinger](../../plugins/growth-and-customer-tools/skills/affiliate-referral-program-stinger/SKILL.md): Design SaaS affiliate and referral programs. Use for platform choice, attribution, commissions, fraud, or program economics.
- [alt-ads-platforms-stinger](../../plugins/growth-and-customer-tools/skills/alt-ads-platforms-stinger/SKILL.md): Plan paid acquisition beyond Meta and Google Search. Use for LinkedIn, TikTok, Reddit, Bing, Pinterest, Quora, YouTube, or podcasts.
- [blogging-content-strategy-stinger](../../plugins/growth-and-customer-tools/skills/blogging-content-strategy-stinger/SKILL.md): Plan search-led blog content. Use for topic clusters, titles, post structure, cadence, AEO formatting, or calls to action.
- [cold-outreach-stinger](../../plugins/growth-and-customer-tools/skills/cold-outreach-stinger/SKILL.md): Build founder cold-email programs. Use for deliverability, list hygiene, outreach tools, personalization, or sequences.
- [competitive-research-stinger](../../plugins/growth-and-customer-tools/skills/competitive-research-stinger/SKILL.md): Build competitor workbooks and reports. Use for market mapping, feature gaps, or sales battlecards.
- [customer-support-tooling-stinger](../../plugins/growth-and-customer-tools/skills/customer-support-tooling-stinger/SKILL.md): Choose and configure a SaaS support stack. Use for inboxes, AI deflection, SLAs, routing, or founder triage.
- [go-to-market-stinger](../../plugins/growth-and-customer-tools/skills/go-to-market-stinger/SKILL.md): Choose one acquisition channel from dated buyer evidence and team constraints, then draft a falsifiable experiment. Use before paid, organic, outbound or partner execution.
- [icp-research-stinger](../../plugins/growth-and-customer-tools/skills/icp-research-stinger/SKILL.md): Ideal Customer Profile research from a company domain: seed from its site, fan out with Exa or Firecrawl, grade stated vs revealed evidence, and deliver an ICP dossier. Account and role level only.
- [knowledge-base-help-center-stinger](../../plugins/growth-and-customer-tools/skills/knowledge-base-help-center-stinger/SKILL.md): Select and improve customer help centers. Use for KB platforms, search, AI deflection, localization, versioning, or content gaps.
- [lifecycle-email-stinger](../../plugins/growth-and-customer-tools/skills/lifecycle-email-stinger/SKILL.md): Writes evidence-grounded hot and warm lead follow-up emails. Use for lead classification, sequences, cadence, suppression, QA, and measurement.
- [live-chat-support-stinger](../../plugins/growth-and-customer-tools/skills/live-chat-support-stinger/SKILL.md): Choose and wire SaaS live chat. Use for widget identity checks, support routing, AI deflection, or data export.
- [newsletter-platform-stinger](../../plugins/growth-and-customer-tools/skills/newsletter-platform-stinger/SKILL.md): Choose and integrate a newsletter platform. Use for Beehiiv vs Kit, signup forms, deliverability, monetization, or migration.
- [review-funnels-stinger](../../plugins/growth-and-customer-tools/skills/review-funnels-stinger/SKILL.md): Build SaaS review collection. Use for G2, Capterra, Trustpilot, Product Hunt, request timing, incentives, or negative reviews.
- [social-media-marketing-organic-stinger](../../plugins/growth-and-customer-tools/skills/social-media-marketing-organic-stinger/SKILL.md): Plan authentic organic social growth. Use for platform focus, founder voice, build-in-public, calendars, or AI-slop avoidance.
- [tawk-to-api-stinger](../../plugins/growth-and-customer-tools/skills/tawk-to-api-stinger/SKILL.md): Integrate the tawk.to REST API. Use for contacts, chats, tickets, webhooks, metrics, widgets, or knowledge-base articles.

### Drones

- [affiliate-referral-program-wasp-drone](../../plugins/growth-and-customer-tools/agents/affiliate-referral-program-wasp-drone.md): Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate-vs-referral distinction, cookie-based and server-side attribution (post-ITP, post-3PC era), payout automation, fraud detection (self-referral, cookie stuffing, velocity fraud), and EPC/LTV program economics.
- [alt-ads-platforms-wasp-drone](../../plugins/growth-and-customer-tools/agents/alt-ads-platforms-wasp-drone.md): Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search - LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (Smart+ 2026 default, CAPI), Reddit Ads (community targeting, AI citation compound value), Microsoft/Bing Ads (LinkedIn Profile Targeting layer), Pinterest Ads (Shopping Catalogs, 70-90 day attribution), Quora Ads (comparison-intent B2B), YouTube standalone video, Spotify Ad Studio + podcast advertising, and the channel-fit-by-ICP heuristic that selects among them.
- [blogging-content-strategy-wasp-drone](../../plugins/growth-and-customer-tools/agents/blogging-content-strategy-wasp-drone.md): Editorial blogging strategy specialist - cluster + pillar topical authority architecture, post-length decisions by search intent, title + H1 + meta description craft, keyword research scoping without obsession, AEO/answer-engine formatting for AI Overviews and chatbot citations, CTA copy that converts without begging, the 12-point pre-publish review checklist, and realistic publishing-cadence planning for solo founders and small teams.
- [cold-outreach-wasp-drone](../../plugins/growth-and-customer-tools/agents/cold-outreach-wasp-drone.md): Outbound sales specialist for founders running cold email.
- [competitive-research-wasp-drone](../../plugins/growth-and-customer-tools/agents/competitive-research-wasp-drone.md): Builds competitor-landscape XLSX workbooks and brand-matched PDF competitive reports: research sweep, category taxonomy, feature-gap analysis, computed market-pattern insights, sales battlecards.
- [customer-support-tooling-wasp-drone](../../plugins/growth-and-customer-tools/agents/customer-support-tooling-wasp-drone.md): Support stack specialist for SaaS products.
- [go-to-market-wasp-drone](../../plugins/growth-and-customer-tools/agents/go-to-market-wasp-drone.md): Choose one acquisition channel for a specific buyer from evidence and constraints.
- [icp-research-wasp-drone](../../plugins/growth-and-customer-tools/agents/icp-research-wasp-drone.md): Ideal Customer Profile researcher: starts from a company domain, seeds from its site, fans out with Exa or Firecrawl across customers, market, hiring, reviews, news, and technographic lanes, grades stated vs revealed evidence in a validated ledger, and delivers an ICP dossier.
- [knowledge-base-help-center-wasp-drone](../../plugins/growth-and-customer-tools/agents/knowledge-base-help-center-wasp-drone.md): Customer-facing knowledge base specialist - platform selection (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide), search-first architecture, AI deflection (chat-with-your-docs, Fin standalone, Eddy AI, llms.txt), versioning (Document360 branch versioning, ReadMe git-backed), multi-language (50+ language auto-translate, RTL, TMS), and the analytics-driven content-gap loop (CRAVA framework, no-result triage).
- [lifecycle-email-wasp-drone](../../plugins/growth-and-customer-tools/agents/lifecycle-email-wasp-drone.md): Lifecycle lead email specialist.
- [live-chat-support-wasp-drone](../../plugins/growth-and-customer-tools/agents/live-chat-support-wasp-drone.md): Customer support surface specialist - Intercom, Crisp, Plain, Pylon, Help Scout - widget integration, HMAC/JWT identity verification, conversation routing, AI deflection (Fin 2.0, Ari, Crisp Bot), and the data-export discipline.
- [newsletter-platform-wasp-drone](../../plugins/growth-and-customer-tools/agents/newsletter-platform-wasp-drone.md): Newsletter-as-channel specialist for product builders and founders - platform selection (Beehiiv, ConvertKit/Kit, Loops, Substack, Resend Audiences, Ghost), embedded newsletter signup integration for Next.js, deliverability tradeoffs (managed SaaS vs self-hosted), monetization options (ad network, paid subscriptions, sponsorships, referral programs), and platform migration (Substack to Beehiiv).
- [review-funnels-wasp-drone](../../plugins/growth-and-customer-tools/agents/review-funnels-wasp-drone.md): Review collection and online-reputation specialist for SaaS products.
- [social-media-marketing-organic-wasp-drone](../../plugins/growth-and-customer-tools/agents/social-media-marketing-organic-wasp-drone.md): Genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people).
- [tawk-to-api-wasp-drone](../../plugins/growth-and-customer-tools/agents/tawk-to-api-wasp-drone.md): tawk.to REST API v1.1.0 integration specialist: API key Basic Auth and OAuth2, Property/Widgets/Members/Chats/Tickets/Tabs, both webhook directions, Metrics, Contacts, and the Knowledge-Base content-block model (header, paragraph, image, code, video, divider, table) plus the markdown-to-KB workflow (host images on Cloudflare R2 or DigitalOcean Spaces, then reference by URL).

### Commands

- `/growth-and-customer-tools:choose-acquisition-channel` ([procedure](../../plugins/growth-and-customer-tools/commands/choose-acquisition-channel.md)): Choose one acquisition channel from dated buyer evidence, operating constraints and a falsifiable experiment draft.
- `/growth-and-customer-tools:launch-product` ([procedure](../../plugins/growth-and-customer-tools/commands/launch-product.md)): Prepare an evidence-based product launch with customer fit, channel focus, review readiness, and measurable follow-up.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-choose-acquisition-channel](../../plugins/growth-and-customer-tools/skills/source-command-choose-acquisition-channel/SKILL.md): reads the [choose-acquisition-channel procedure](../../plugins/growth-and-customer-tools/commands/choose-acquisition-channel.md) using the installed command wrapper selector.
- [source-command-launch-product](../../plugins/growth-and-customer-tools/skills/source-command-launch-product/SKILL.md): reads the [launch-product procedure](../../plugins/growth-and-customer-tools/commands/launch-product.md) using the installed command wrapper selector.

## highlevel

Version `3.1.0`. 3 Stingers, 3 Drones. [Pack overview](../../plugins/highlevel/README.md).

### Stingers

- [ghl-to-mermaid-stinger](../../plugins/highlevel/skills/ghl-to-mermaid-stinger/SKILL.md): Turn a GoHighLevel/HighLevel account JSON export into per-workflow files and Mermaid flowcharts. Use for GHL snapshot exports, workflow diagrams, automation maps, or SuperSnapshot AI exports.
- [gohighlevel-stinger](../../plugins/highlevel/skills/gohighlevel-stinger/SKILL.md): GoHighLevel API authority - OAuth vs Private Integration Tokens, contacts/opportunities/calendars, inbound/outbound webhooks, rate limits, Marketplace apps. Use for GoHighLevel/HighLevel integration.
- [highlevel-ai-studio-stinger](../../plugins/highlevel/skills/highlevel-ai-studio-stinger/SKILL.md): HighLevel AI Studio specialist for Vibe sites, Content AI, Funnel & Website AI, and WordPress AI pages. Use for HighLevel AI content, site building, publishing, or troubleshooting.

### Drones

- [ghl-to-mermaid-wasp-drone](../../plugins/highlevel/agents/ghl-to-mermaid-wasp-drone.md): Turns HighLevel account exports into per-workflow JSON and readable Mermaid charts.
- [gohighlevel-wasp-drone](../../plugins/highlevel/agents/gohighlevel-wasp-drone.md): GoHighLevel (HighLevel) API integration specialist - OAuth 2.0 vs Private Integration Tokens, contacts/opportunities/pipelines/calendars/conversations, inbound and outbound webhooks, workflows, rate limits, and Marketplace app creation.
- [highlevel-ai-studio-wasp-drone](../../plugins/highlevel/agents/highlevel-ai-studio-wasp-drone.md): HighLevel AI Studio and AI creation specialist for Vibe sites, Content AI, Ask AI, Funnel & Website AI, Blog Post AI, Email AI, and WordPress AI pages.

### Commands

- `/highlevel:map-highlevel` ([procedure](../../plugins/highlevel/commands/map-highlevel.md)): Turn a supplied HighLevel export into traceable workflow maps, asset links, and an honest gaps report.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-map-highlevel](../../plugins/highlevel/skills/source-command-map-highlevel/SKILL.md): reads the [map-highlevel procedure](../../plugins/highlevel/commands/map-highlevel.md) using the installed command wrapper selector.

## infrastructure-decision-tools

Version `3.1.0`. 6 Stingers, 6 Drones. [Pack overview](../../plugins/infrastructure-decision-tools/README.md).

### Stingers

- [digitalocean-platform-stinger](../../plugins/infrastructure-decision-tools/skills/digitalocean-platform-stinger/SKILL.md): Recommend DigitalOcean App Platform or Droplet fit from supplied workload, data, operator and recovery needs. Prepare dated cost inputs and readiness handoffs; no provisioning.
- [infrastructure-fit-stinger](../../plugins/infrastructure-decision-tools/skills/infrastructure-fit-stinger/SKILL.md): Recommend one infrastructure topology from workload, budget and operator skills. Compare managed hosting and VPS with sourced constraints and cost-owner handoff.
- [launch-assets-stinger](../../plugins/infrastructure-decision-tools/skills/launch-assets-stinger/SKILL.md): Prepare launch accounts, assets and owners for web, desktop, mobile or integrations. Produce a dated readiness ledger with costs, prerequisites and blockers.
- [network-boundaries-stinger](../../plugins/infrastructure-decision-tools/skills/network-boundaries-stinger/SKILL.md): Choose firewall, WAF and rate-limit placement from actual network flows. Return one sourced control recommendation with owner and proof gaps.
- [railway-platform-stinger](../../plugins/infrastructure-decision-tools/skills/railway-platform-stinger/SKILL.md): Select Railway from supplied workload, state, jobs, networking, cost inputs and recovery duties. Return one sourced recommendation or provisional choice and owner gaps.
- [vultr-platform-stinger](../../plugins/infrastructure-decision-tools/skills/vultr-platform-stinger/SKILL.md): Assess Vultr workload fit, compute forms, operator duties, data/recovery and dated cost inputs. Use for a read-only Vultr recommendation.

### Drones

- [digitalocean-platform-wasp-drone](../../plugins/infrastructure-decision-tools/agents/digitalocean-platform-wasp-drone.md): Use for DigitalOcean App Platform/Droplet workload fit, operations, data/recovery and dated cost handoff.
- [infrastructure-fit-wasp-drone](../../plugins/infrastructure-decision-tools/agents/infrastructure-fit-wasp-drone.md): Recommend one workload-matched infrastructure topology.
- [launch-assets-wasp-drone](../../plugins/infrastructure-decision-tools/agents/launch-assets-wasp-drone.md): Prepare platform-specific launch accounts, assets and owners.
- [network-boundaries-wasp-drone](../../plugins/infrastructure-decision-tools/agents/network-boundaries-wasp-drone.md): Choose firewall, WAF and rate-limit layers from actual flows.
- [railway-platform-wasp-drone](../../plugins/infrastructure-decision-tools/agents/railway-platform-wasp-drone.md): Assess Railway fit for supplied runtime, state, jobs, network, region, cost and recovery requirements.
- [vultr-platform-wasp-drone](../../plugins/infrastructure-decision-tools/agents/vultr-platform-wasp-drone.md): Use for read-only Vultr compute/workload fit, retained operations, data/recovery and dated cost handoff.

### Commands

- `/infrastructure-decision-tools:assess-digitalocean` ([procedure](../../plugins/infrastructure-decision-tools/commands/assess-digitalocean.md)): Assess DigitalOcean service fit with dated responsibilities, eligibility, scaling, recovery and cost inputs for a supplied workload.
- `/infrastructure-decision-tools:assess-railway` ([procedure](../../plugins/infrastructure-decision-tools/commands/assess-railway.md)): Assess Railway workload fit with dated service, operating, recovery and cost constraints.
- `/infrastructure-decision-tools:assess-vultr` ([procedure](../../plugins/infrastructure-decision-tools/commands/assess-vultr.md)): Assess Vultr workload fit with dated service, operating, recovery and cost constraints.
- `/infrastructure-decision-tools:choose-infrastructure` ([procedure](../../plugins/infrastructure-decision-tools/commands/choose-infrastructure.md)): Recommend one infrastructure topology from workload, budget and operator capacity, with sourced constraints and recovery/cost handoffs.
- `/infrastructure-decision-tools:plan-network-boundaries` ([procedure](../../plugins/infrastructure-decision-tools/commands/plan-network-boundaries.md)): Choose network firewall, WAF and application rate-limit layers from actual trust boundaries, protocols and operating constraints.
- `/infrastructure-decision-tools:prepare-assets` ([procedure](../../plugins/infrastructure-decision-tools/commands/prepare-assets.md)): Prepare the minimum launch assets and accounts with owners, environments, dated costs, prerequisites and blockers.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-assess-digitalocean](../../plugins/infrastructure-decision-tools/skills/source-command-assess-digitalocean/SKILL.md): reads the [assess-digitalocean procedure](../../plugins/infrastructure-decision-tools/commands/assess-digitalocean.md) using the installed command wrapper selector.
- [source-command-assess-railway](../../plugins/infrastructure-decision-tools/skills/source-command-assess-railway/SKILL.md): reads the [assess-railway procedure](../../plugins/infrastructure-decision-tools/commands/assess-railway.md) using the installed command wrapper selector.
- [source-command-assess-vultr](../../plugins/infrastructure-decision-tools/skills/source-command-assess-vultr/SKILL.md): reads the [assess-vultr procedure](../../plugins/infrastructure-decision-tools/commands/assess-vultr.md) using the installed command wrapper selector.
- [source-command-choose-infrastructure](../../plugins/infrastructure-decision-tools/skills/source-command-choose-infrastructure/SKILL.md): reads the [choose-infrastructure procedure](../../plugins/infrastructure-decision-tools/commands/choose-infrastructure.md) using the installed command wrapper selector.
- [source-command-plan-network-boundaries](../../plugins/infrastructure-decision-tools/skills/source-command-plan-network-boundaries/SKILL.md): reads the [plan-network-boundaries procedure](../../plugins/infrastructure-decision-tools/commands/plan-network-boundaries.md) using the installed command wrapper selector.
- [source-command-prepare-assets](../../plugins/infrastructure-decision-tools/skills/source-command-prepare-assets/SKILL.md): reads the [prepare-assets procedure](../../plugins/infrastructure-decision-tools/commands/prepare-assets.md) using the installed command wrapper selector.

## interstellar-coding

Version `3.1.0`. 9 Stingers, 8 Drones. [Pack overview](../../plugins/interstellar-coding/README.md).

### Stingers

- [crew-case-stinger](../../plugins/interstellar-coding/skills/crew-case-stinger/SKILL.md): CASE, the crew's read-only contrarian. Answers ASK CASE with one verdict line per question, using structured dissent sized to the stakes.
- [crew-coop-stinger](../../plugins/interstellar-coding/skills/crew-coop-stinger/SKILL.md): Build one chip as COOP: one outcome, one branch, one PR. Keeps an attempt log, answers CHECKPOINT at once, sends GATE to MURPH before calling a PR ready, and never merges its own PR.
- [crew-kipp-stinger](../../plugins/interstellar-coding/skills/crew-kipp-stinger/SKILL.md): KIPP, the Interstellar Coding product desk and librarian: feature intake, PRDs, IRDs, number reservation and library invariants. Use when running /kipp or a crew intake.
- [crew-lady-stinger](../../plugins/interstellar-coding/skills/crew-lady-stinger/SKILL.md): LADY, the crew's deep independent investigator. Runs audits, root-cause work, forensics and pre-merge due diligence with audit-my-code-stinger.
- [crew-moon-stinger](../../plugins/interstellar-coding/skills/crew-moon-stinger/SKILL.md): MOON, the crew's operating efficiency agent. Keeps a flight recorder per agent, spots dormant, looping or stuck agents, and pauses or terminates them only after their work is preserved.
- [crew-murph-stinger](../../plugins/interstellar-coding/skills/crew-murph-stinger/SKILL.md): MURPH, the crew's verification and release gate. Runs Security then Quality on a candidate SHA, replies PASS or FAIL, and tracks merged, deployed, verified on evidence.
- [crew-owel-stinger](../../plugins/interstellar-coding/skills/crew-owel-stinger/SKILL.md): OWEL, the Interstellar Coding documentarian: keeps the append-only crew ledger and writes knowledge docs and ADRs unprompted from what the crew decides. Use when running /owel.
- [crew-protocol](../../plugins/interstellar-coding/skills/crew-protocol/SKILL.md): Shared contract for the Interstellar Coding crew: roster, authority, messages, the append-only ledger, state layout, and session-start and post-compaction recovery. Read by every role.
- [crew-tars-stinger](../../plugins/interstellar-coding/skills/crew-tars-stinger/SKILL.md): Lead the Interstellar Coding crew as TARS: boot the roles, spawn every session, route work, and send progress to OWEL's ledger. Overlay on tars-stinger.

### Drones

- [crew-case-wasp-drone](../../plugins/interstellar-coding/agents/crew-case-wasp-drone.md): CASE, consultant and contrarian of the Interstellar Coding crew: a read-only adviser that answers ASK CASE with one verdict line per question (PROCEED, SIMPLIFY, OVERKILL, RETHINK, ASK OWNER).
- [crew-coop-wasp-drone](../../plugins/interstellar-coding/agents/crew-coop-wasp-drone.md): COOP, build engineer of the Interstellar Coding crew: writes product code for one chip, one outcome, one PR, on its own branch, with an attempt log, immediate checkpoints, and a MURPH gate before ready.
- [crew-kipp-wasp-drone](../../plugins/interstellar-coding/agents/crew-kipp-wasp-drone.md): KIPP, the Interstellar Coding crew's product team and librarian: runs feature intake, writes PRDs and IRDs with their indexes, reserves PRD and IRD numbers, and keeps the library's folder and naming rules.
- [crew-lady-wasp-drone](../../plugins/interstellar-coding/agents/crew-lady-wasp-drone.md): LADY, the Interstellar Coding crew's deep independent investigator: full code audits, root-cause work on stuck problems, incident and regression forensics, and pre-merge due diligence, each finding cited to evidence.
- [crew-moon-wasp-drone](../../plugins/interstellar-coding/agents/crew-moon-wasp-drone.md): MOON, the Interstellar Coding crew's operating efficiency agent: keeps a flight recorder of each agent's real output, dormancy and repeated attempts, and pauses or terminates under-performing agents only after their work is preserved for handoff.
- [crew-murph-wasp-drone](../../plugins/interstellar-coding/agents/crew-murph-wasp-drone.md): MURPH, verification and release gate of the Interstellar Coding crew: runs Security then Quality on an exact candidate SHA, replies PASS or FAIL with report paths, and tracks a change to merged, deployed and verified on evidence.
- [crew-owel-wasp-drone](../../plugins/interstellar-coding/agents/crew-owel-wasp-drone.md): OWEL, the Interstellar Coding crew's documentarian and ledger keeper: maintains library/knowledge private and public docs, writes ADRs and knowledge docs unprompted from contracts, PRDs, PRs, transcripts and owner decisions, and keeps the append-only crew ledger.
- [crew-tars-wasp-drone](../../plugins/interstellar-coding/agents/crew-tars-wasp-drone.md): TARS, lead development engineer and orchestrator of the Interstellar Coding crew: boots the roles in order, is the only spawner, routes work to CASE, KIPP, LADY, MURPH and MOON, and sends project progress to OWEL's ledger.

### Commands

- `/interstellar-coding:case` ([procedure](../../plugins/interstellar-coding/commands/case.md)): Make this session CASE, the crew's read-only contrarian. Answers ASK CASE with one verdict line per question, sized to the stakes.
- `/interstellar-coding:coop` ([procedure](../../plugins/interstellar-coding/commands/coop.md)): Make this session COOP, build engineer of the Interstellar Coding crew. Builds one chip as one PR on its own branch, logs attempts, answers CHECKPOINT at once, and sends GATE to MURPH before ready.
- `/interstellar-coding:interstellar` ([procedure](../../plugins/interstellar-coding/commands/interstellar.md)): Make this session TARS, lead of the Interstellar Coding crew. Boots OWEL, MOON, CASE and KIPP, spawns COOP build chips, routes work, and reports progress to OWEL's ledger.
- `/interstellar-coding:kipp` ([procedure](../../plugins/interstellar-coding/commands/kipp.md)): Make this session KIPP, the crew's product team and librarian: feature intake, PRDs and IRDs, number reservation, library invariants. Writes no product code.
- `/interstellar-coding:lady` ([procedure](../../plugins/interstellar-coding/commands/lady.md)): Make this session LADY, the crew's deep independent investigator: code audits, root cause on stuck problems, incident forensics and pre-merge due diligence. Read-only; reports findings, never fixes.
- `/interstellar-coding:moon` ([procedure](../../plugins/interstellar-coding/commands/moon.md)): Make this session MOON, the crew's operating efficiency agent: keeps the flight recorder, spots dormant, looping or stuck agents, and pauses or terminates them only after their work is preserved.
- `/interstellar-coding:murph` ([procedure](../../plugins/interstellar-coding/commands/murph.md)): Make this session MURPH, the crew's verification and release gate. Runs Security then Quality on a candidate SHA, replies PASS or FAIL, and tracks merged, deployed, verified.
- `/interstellar-coding:owel` ([procedure](../../plugins/interstellar-coding/commands/owel.md)): Make this session OWEL, the crew's documentarian and ledger keeper: append-only ledger, knowledge docs and ADRs written unprompted from the crew's work. Writes no product code.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-case](../../plugins/interstellar-coding/skills/source-command-case/SKILL.md): reads the [case procedure](../../plugins/interstellar-coding/commands/case.md) using the installed command wrapper selector.
- [source-command-coop](../../plugins/interstellar-coding/skills/source-command-coop/SKILL.md): reads the [coop procedure](../../plugins/interstellar-coding/commands/coop.md) using the installed command wrapper selector.
- [source-command-interstellar](../../plugins/interstellar-coding/skills/source-command-interstellar/SKILL.md): reads the [interstellar procedure](../../plugins/interstellar-coding/commands/interstellar.md) using the installed command wrapper selector.
- [source-command-kipp](../../plugins/interstellar-coding/skills/source-command-kipp/SKILL.md): reads the [kipp procedure](../../plugins/interstellar-coding/commands/kipp.md) using the installed command wrapper selector.
- [source-command-lady](../../plugins/interstellar-coding/skills/source-command-lady/SKILL.md): reads the [lady procedure](../../plugins/interstellar-coding/commands/lady.md) using the installed command wrapper selector.
- [source-command-moon](../../plugins/interstellar-coding/skills/source-command-moon/SKILL.md): reads the [moon procedure](../../plugins/interstellar-coding/commands/moon.md) using the installed command wrapper selector.
- [source-command-murph](../../plugins/interstellar-coding/skills/source-command-murph/SKILL.md): reads the [murph procedure](../../plugins/interstellar-coding/commands/murph.md) using the installed command wrapper selector.
- [source-command-owel](../../plugins/interstellar-coding/skills/source-command-owel/SKILL.md): reads the [owel procedure](../../plugins/interstellar-coding/commands/owel.md) using the installed command wrapper selector.

## littlebird-toolkit

Version `3.1.0`. 30 Stingers, 0 Drones. [Pack overview](../../plugins/littlebird-toolkit/README.md).

### Stingers

- [brand-voice-guardian](../../plugins/littlebird-toolkit/skills/brand-voice-guardian/SKILL.md): Review a draft against the user's established voice. Use before shipping posts, emails, pages, or messages in their name.
- [client-health-radar](../../plugins/littlebird-toolkit/skills/client-health-radar/SKILL.md): Assess client health from Littlebird evidence. Use for churn risk, scope creep, margin pressure, or weekly account reviews.
- [combined-voice-creator](../../plugins/littlebird-toolkit/skills/combined-voice-creator/SKILL.md): Build a personal writing-voice skill from Littlebird history and a Facebook export. Use when both consented sources are available.
- [comment-to-crm-piper](../../plugins/littlebird-toolkit/skills/comment-to-crm-piper/SKILL.md): Pipe new comment-keyword leads into a CRM. Use for daily deduplication, tagging, and handoff drafts.
- [commitment-tracker](../../plugins/littlebird-toolkit/skills/commitment-tracker/SKILL.md): Track commitments in Littlebird meeting records. Use to see what you owe, what others owe, and what has gone stale.
- [competitor-watch](../../plugins/littlebird-toolkit/skills/competitor-watch/SKILL.md): Track competitors from Littlebird sightings and public sources. Use for watchlists, new entrants, or weekly market deltas.
- [content-repurposer](../../plugins/littlebird-toolkit/skills/content-repurposer/SKILL.md): Turn one long artifact into distinct voice-matched posts. Use for a week of content from a talk, article, or call.
- [daily-brief](../../plugins/littlebird-toolkit/skills/daily-brief/SKILL.md): Build a morning brief from Littlebird activity and meetings. Use for today's commitments, changes, and one priority.
- [day-reconstructor](../../plugins/littlebird-toolkit/skills/day-reconstructor/SKILL.md): Rebuild a work session from Littlebird activity. Use for a dev log, session changelog, or what-shipped recap.
- [deal-pipeline-reconstructor](../../plugins/littlebird-toolkit/skills/deal-pipeline-reconstructor/SKILL.md): Rebuild a sales pipeline from Littlebird records. Use to identify stage, evidence, next action, and stale deals.
- [facebook-voice-creator](../../plugins/littlebird-toolkit/skills/facebook-voice-creator/SKILL.md): Build a personal writing-voice skill from a Facebook export. Use when the user supplies their own export.
- [focus-forensics](../../plugins/littlebird-toolkit/skills/focus-forensics/SKILL.md): Analyze weekly attention from Littlebird capture. Use for context switching, interruptions, or focus-pattern reviews.
- [invoice-chaser](../../plugins/littlebird-toolkit/skills/invoice-chaser/SKILL.md): Find unpaid invoices from Littlebird records and draft follow-ups. Use for receivables review or payment chasing.
- [knowledge-base-builder](../../plugins/littlebird-toolkit/skills/knowledge-base-builder/SKILL.md): Build a project knowledge pack from Littlebird meetings and threads. Use for PRDs, decisions, and project context.
- [lead-harvester](../../plugins/littlebird-toolkit/skills/lead-harvester/SKILL.md): Find hand-raisers in a comment-keyword campaign. Use to qualify leads, deduplicate, and prepare CRM handoff.
- [learning-capturer](../../plugins/littlebird-toolkit/skills/learning-capturer/SKILL.md): Capture recurring fixes from Littlebird activity. Use after a hard debugging session or for a weekly personal knowledge-base review.
- [littlebird-voice-creator](../../plugins/littlebird-toolkit/skills/littlebird-voice-creator/SKILL.md): Build a personal writing-voice skill from Littlebird writing and speech. Use when Littlebird is the consented source.
- [meeting-scribe](../../plugins/littlebird-toolkit/skills/meeting-scribe/SKILL.md): Write post-meeting follow-ups from Littlebird records. Use for call recaps, decisions, action items, and commitments.
- [money-leak-auditor](../../plugins/littlebird-toolkit/skills/money-leak-auditor/SKILL.md): Audit SaaS and vendor spend from Littlebird capture. Use for unused subscriptions, failed payments, or cost-cutting decisions.
- [osint-investigator](../../plugins/littlebird-toolkit/skills/osint-investigator/SKILL.md): Research a named person using Littlebird history and public sources. Use for due diligence, meeting prep, or verification.
- [pre-call-prep](../../plugins/littlebird-toolkit/skills/pre-call-prep/SKILL.md): Build a meeting brief from Littlebird history. Use before calls to surface context, open loops, and relevant changes.
- [renewal-sentinel](../../plugins/littlebird-toolkit/skills/renewal-sentinel/SKILL.md): Track upcoming renewals from Littlebird records. Use for auto-charge deadlines, cancellation windows, and 90-day planning.
- [research-synthesizer](../../plugins/littlebird-toolkit/skills/research-synthesizer/SKILL.md): Synthesize a topic against Littlebird memory and current sources. Use for a concise what-changed research brief.
- [routine-architect](../../plugins/littlebird-toolkit/skills/routine-architect/SKILL.md): Audit Littlebird routines. Use for duplicate prompts, noisy schedules, missing handoffs, or routine drift.
- [said-it-already](../../plugins/littlebird-toolkit/skills/said-it-already/SKILL.md): Mine meeting transcripts for reusable lines the user already said. Use for content ideas, drafts, or authentic social posts.
- [skill-suggester](../../plugins/littlebird-toolkit/skills/skill-suggester/SKILL.md): Find repeated manual work in Littlebird activity. Use to draft the next automation skill worth building.
- [sop-forge](../../plugins/littlebird-toolkit/skills/sop-forge/SKILL.md): Turn a completed workflow in Littlebird into an SOP. Use when documenting a repeatable process from observed work.
- [testimonial-miner](../../plugins/littlebird-toolkit/skills/testimonial-miner/SKILL.md): Find earned praise in Littlebird records. Use to build a quote bank and check permission before publishing social proof.
- [weekly-review](../../plugins/littlebird-toolkit/skills/weekly-review/SKILL.md): Build a weekly scorecard from Littlebird and sibling routine reports. Use for progress, dropped commitments, and next-week priorities.
- [who-am-i-ghosting](../../plugins/littlebird-toolkit/skills/who-am-i-ghosting/SKILL.md): Find conversations left unanswered in Littlebird records. Use to rank follow-ups by consequence and draft replies.

### Commands

- `/littlebird-toolkit:review-my-work` ([procedure](../../plugins/littlebird-toolkit/commands/review-my-work.md)): Build a private evidence-based review of a defined work period using available Littlebird reports and stated limits.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-review-my-work](../../plugins/littlebird-toolkit/skills/source-command-review-my-work/SKILL.md): reads the [review-my-work procedure](../../plugins/littlebird-toolkit/commands/review-my-work.md) using the installed command wrapper selector.

## media-and-creative-tools

Version `3.1.0`. 4 Stingers, 4 Drones. [Pack overview](../../plugins/media-and-creative-tools/README.md).

### Stingers

- [elevenlabs-api-stinger](../../plugins/media-and-creative-tools/skills/elevenlabs-api-stinger/SKILL.md): ElevenLabs API integration for speech, voices, streaming, webhooks, usage, and key boundaries. Use for ElevenLabs API implementation, review, or troubleshooting.
- [heygen-api-stinger](../../plugins/media-and-creative-tools/skills/heygen-api-stinger/SKILL.md): HeyGen API integration for video generation, avatars, assets, webhooks, limits, and safe asynchronous delivery. Use for HeyGen API implementation or debugging.
- [natural-photography-stinger](../../plugins/media-and-creative-tools/skills/natural-photography-stinger/SKILL.md): Generate or retouch photos of consented models. Use for realistic capture prompts, source-image gating, or honest EXIF metadata.
- [product-demo-stinger](../../plugins/media-and-creative-tools/skills/product-demo-stinger/SKILL.md): Plan honest product demos and tutorials with claim-to-scene evidence, accessible narration, failure coverage and explicit mock disclosures. Use before recording or reviewing a walkthrough.

### Drones

- [elevenlabs-api-wasp-drone](../../plugins/media-and-creative-tools/agents/elevenlabs-api-wasp-drone.md): ElevenLabs API integration specialist for speech, voices, streaming, usage telemetry, and safe server boundaries.
- [heygen-api-wasp-drone](../../plugins/media-and-creative-tools/agents/heygen-api-wasp-drone.md): HeyGen API integration specialist for asynchronous video jobs, avatars, assets, webhooks, limits, and safe delivery.
- [natural-photography-wasp-drone](../../plugins/media-and-creative-tools/agents/natural-photography-wasp-drone.md): Photographic generation and retouching specialist for consented model work.
- [product-demo-wasp-drone](../../plugins/media-and-creative-tools/agents/product-demo-wasp-drone.md): Prepare evidence-bound product demos and tutorials, scenes, narration and disclosures.

### Commands

- `/media-and-creative-tools:create-product-media` ([procedure](../../plugins/media-and-creative-tools/commands/create-product-media.md)): Create a product-media brief and supported consented photo or provider-media workflow with verifiable deliverables.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-create-product-media](../../plugins/media-and-creative-tools/skills/source-command-create-product-media/SKILL.md): reads the [create-product-media procedure](../../plugins/media-and-creative-tools/commands/create-product-media.md) using the installed command wrapper selector.

## platform-and-release-tools

Version `3.1.0`. 20 Stingers, 20 Drones. [Pack overview](../../plugins/platform-and-release-tools/README.md).

### Stingers

- [auth-stinger](../../plugins/platform-and-release-tools/skills/auth-stinger/SKILL.md): Design and implement authentication. Use for provider choice, OAuth, passkeys, MFA, RBAC, sessions, or B2B SSO.
- [changelog-release-notes-stinger](../../plugins/platform-and-release-tools/skills/changelog-release-notes-stinger/SKILL.md): Write public changelogs and release notes. Use after shipping a change or when improving release communication.
- [ci-release-stinger](../../plugins/platform-and-release-tools/skills/ci-release-stinger/SKILL.md): Design CI and release gates for SvelteKit on Vercel or npm packages. Use for Actions jobs, migrations, caching, or publishing.
- [crm-integration-stinger](../../plugins/platform-and-release-tools/skills/crm-integration-stinger/SKILL.md): Design CRM sync with HubSpot, Salesforce, Pipedrive, Attio, and peers. Use for field mapping, deduplication, or sync conflicts.
- [cron-scheduling-stinger](../../plugins/platform-and-release-tools/skills/cron-scheduling-stinger/SKILL.md): Design reliable scheduled jobs. Use for cron expressions, DST, distributed execution, retries, idempotency, or monitoring.
- [devops-stinger](../../plugins/platform-and-release-tools/skills/devops-stinger/SKILL.md): Build Docker and GitHub Actions pipelines. Use for container hygiene, Compose, CI security, caching, image scans, or Depot.
- [discord-bot-stinger](../../plugins/platform-and-release-tools/skills/discord-bot-stinger/SKILL.md): Build Discord bots. Use for slash commands, modals, voice, gateway design, rate limits, or verification.
- [doppler-stinger](../../plugins/platform-and-release-tools/skills/doppler-stinger/SKILL.md): Doppler secrets manager for SvelteKit on Vercel - doppler run/secrets CLI, project/config model, Vercel sync, service tokens, rotation, audit logs, GitHub Actions CI, replacing .env files.
- [mcp-protocol-stinger](../../plugins/platform-and-release-tools/skills/mcp-protocol-stinger/SKILL.md): Design and audit MCP servers. Use for tools and resources, schemas, transport, JSON-RPC errors, auth, testing, or registration.
- [payments-stinger](../../plugins/platform-and-release-tools/skills/payments-stinger/SKILL.md): Stripe Elements for SvelteKit. Build checkout, enforce server entitlements, separate trial/payment/access state, and prepare approved billing-support actions.
- [posthog-stinger](../../plugins/platform-and-release-tools/skills/posthog-stinger/SKILL.md): PostHog for SvelteKit: install, pageview tracking, autocapture vs manual events, identify/alias, feature flags, experiments, replay, surveys, groups, Vercel proxy, EU/US residency, cost control.
- [runbook-writing-stinger](../../plugins/platform-and-release-tools/skills/runbook-writing-stinger/SKILL.md): Write and audit operational runbooks. Use for break-fix, scheduled tasks, exact commands, escalation, rollback, or game days.
- [sentry-stinger](../../plugins/platform-and-release-tools/skills/sentry-stinger/SKILL.md): Sentry error tracking for SvelteKit on Vercel - client/server hooks, source maps and releases, tracing sampling, session replay, PII scrubbing, alert tuning, and cost control.
- [slack-app-stinger](../../plugins/platform-and-release-tools/skills/slack-app-stinger/SKILL.md): Build Slack apps with Bolt. Use for slash commands, Block Kit, modals, Events API, OAuth installs, or Marketplace submission.
- [status-page-stinger](../../plugins/platform-and-release-tools/skills/status-page-stinger/SKILL.md): Public status page specialist: platform selection, incident communication templates, subscriber notifications, compliance. Use when setting up or auditing a status page.
- [tailscale-stinger](../../plugins/platform-and-release-tools/skills/tailscale-stinger/SKILL.md): Tailscale for SvelteKit/Vercel/Neon - tailnets, MagicDNS, ACLs/tags, SSH, subnet routers, exit nodes, private database access, Funnel/Serve, OAuth clients, auth keys, ephemeral CI nodes, key expiry.
- [telegram-bot-stinger](../../plugins/platform-and-release-tools/skills/telegram-bot-stinger/SKILL.md): Build Telegram bots. Use for grammY, aiogram, webhooks, Mini Apps, inline mode, Stars payments, or rate limits.
- [traffic-capacity-stinger](../../plugins/platform-and-release-tools/skills/traffic-capacity-stinger/SKILL.md): Plan traffic spikes from measured request, latency, resource, DB and queue data. Produce capacity, SLO, cost, admission and recovery proposals with bounded future validation scope.
- [vercel-stinger](../../plugins/platform-and-release-tools/skills/vercel-stinger/SKILL.md): Vercel deployment for SvelteKit (Svelte 5) + Neon - adapter-vercel config, runtimes, ISR/caching, env vars, cron, image optimization, middleware, WAF/rate limiting, cost control, rollbacks.
- [workos-stinger](../../plugins/platform-and-release-tools/skills/workos-stinger/SKILL.md): WorkOS AuthKit for SvelteKit - hosted/headless flows, sealed sessions, JWT verification, orgs, RBAC, SSO/SCIM, MFA/passkeys/Magic Auth, webhooks, and staging-to-prod cutover.

### Drones

- [auth-wasp-drone](../../plugins/platform-and-release-tools/agents/auth-wasp-drone.md): End-to-end authentication implementation specialist: provider selection (Clerk / Better Auth / Auth.js / Supabase Auth / WorkOS / Stack Auth / Kinde / Stytch), Google OAuth flows including the October 2025 unused-client deletion policy and GIS migration, MFA / passkeys, RBAC, session storage, and B2B SSO.
- [changelog-release-notes-wasp-drone](../../plugins/platform-and-release-tools/agents/changelog-release-notes-wasp-drone.md): Publishes engaging public changelogs and release notes that drive user engagement.
- [ci-release-wasp-drone](../../plugins/platform-and-release-tools/agents/ci-release-wasp-drone.md): CI and release engineering specialist.
- [crm-integration-wasp-drone](../../plugins/platform-and-release-tools/agents/crm-integration-wasp-drone.md): CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper.
- [cron-scheduling-wasp-drone](../../plugins/platform-and-release-tools/agents/cron-scheduling-wasp-drone.md): Scheduled-job specialist for cron expression authoring and auditing, platform-specific limits (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions schedule), distributed-cron correctness (exactly-once execution, leader election, idempotency keys), timezone and DST safety, retry-on-failure patterns, and the "did the cron run?" observability loop.
- [devops-wasp-drone](../../plugins/platform-and-release-tools/agents/devops-wasp-drone.md): Container build + CI/CD pipeline specialist for Node / Next.js / TypeScript stacks: Dockerfile hygiene (multi-stage, BuildKit secrets + cache mounts, non-root, HEALTHCHECK, .dockerignore), Docker Compose for dev (profiles, healthchecked depends_on, secrets, watch), GitHub Actions architecture (reusable workflows, composite actions, concurrency, OIDC, least-privilege GITHUB_TOKEN, pinning to SHA), Depot acceleration (drop-in build-push-action, ARM ephemeral runners, shared persistent cache), image scanning (Trivy, Scout), and local-CI parity (Docker Bake, make targets).
- [discord-bot-wasp-drone](../../plugins/platform-and-release-tools/agents/discord-bot-wasp-drone.md): Discord bot and application specialist.
- [doppler-wasp-drone](../../plugins/platform-and-release-tools/agents/doppler-wasp-drone.md): Doppler specialist - project/config/environment model, the CLI (doppler run, doppler secrets set/get/upload/download), the Vercel integration and sync, service tokens and access control, secret rotation, audit logs, and CI/CD usage in GitHub Actions.
- [mcp-protocol-wasp-drone](../../plugins/platform-and-release-tools/agents/mcp-protocol-wasp-drone.md): MCP protocol authority for The Wasp Nest.
- [payments-wasp-drone](../../plugins/platform-and-release-tools/agents/payments-wasp-drone.md): Stripe integration specialist for SvelteKit (Svelte 5) on Vercel.
- [posthog-wasp-drone](../../plugins/platform-and-release-tools/agents/posthog-wasp-drone.md): PostHog specialist - SvelteKit client/server install, pageview tracking under SvelteKit's router, autocapture vs manual events, event/property naming, identify/alias identity stitching, feature flags (client, server, local evaluation, bootstrapping), experiments, session replay privacy and cost, surveys, group analytics for B2B, Vercel reverse proxy, EU/US data residency, cost control.
- [runbook-writing-wasp-drone](../../plugins/platform-and-release-tools/agents/runbook-writing-wasp-drone.md): Operational runbook authorship specialist: canonical templates (break-fix, scheduled operation, diagnostic), the no-implied-context audit protocol, exact-command discipline, escalation path architecture, rollback procedure standards, runbook-as-test (game day) methodology, and postmortem-to-runbook linkage.
- [sentry-wasp-drone](../../plugins/platform-and-release-tools/agents/sentry-wasp-drone.md): Sentry specialist for SvelteKit on Vercel - client/server SDK setup (hooks.server.ts, hooks.client.ts), source map upload via the Sentry Vite plugin, release and commit association, performance tracing sample rates, Session Replay setup and privacy configuration, beforeSend PII scrubbing, issue alert tuning, and event-quota/cost control.
- [slack-app-wasp-drone](../../plugins/platform-and-release-tools/agents/slack-app-wasp-drone.md): Slack app development specialist.
- [status-page-wasp-drone](../../plugins/platform-and-release-tools/agents/status-page-wasp-drone.md): Public status page specialist: platform selection (Statuspage/Atlassian, Better Stack, Instatus, Cachet OSS), component tree architecture, incident communication templates (initial/update/resolution), subscriber notification setup (email, SMS, webhook, Slack), GDPR/CAN-SPAM compliance, post-incident update discipline, and API-driven automation integration.
- [tailscale-wasp-drone](../../plugins/platform-and-release-tools/agents/tailscale-wasp-drone.md): Tailscale specialist - tailnets, MagicDNS, ACLs/grants/tags, Tailscale SSH, subnet routers, exit nodes, reaching a private Neon database from a dev machine or CI, Funnel/Serve, OAuth clients, auth keys, ephemeral CI nodes, key expiry and the security model.
- [telegram-bot-wasp-drone](../../plugins/platform-and-release-tools/agents/telegram-bot-wasp-drone.md): Telegram Bot specialist: Bot API (up to 10.0, May 2026 including guest mode and managed bots), grammY v1.x (TypeScript, recommended 2026 choice over abandoned Telegraf), aiogram 3.x (Python, async-native), webhook vs long-polling architecture with quantitative thresholds, Telegram Mini Apps initData validation (HMAC-SHA256 + Ed25519 paths), Telegram Stars payments (mandatory for digital goods), inline mode, and MTProto escalation via Telethon/TDLib.
- [traffic-capacity-wasp-drone](../../plugins/platform-and-release-tools/agents/traffic-capacity-wasp-drone.md): Read-only traffic-spike planning from measured requests, latency, CPU/memory, DB/pool and queue data: bottlenecks, SLO/cost limits, admission/recovery and future test scope.
- [vercel-wasp-drone](../../plugins/platform-and-release-tools/agents/vercel-wasp-drone.md): Vercel deployment specialist for SvelteKit (Svelte 5) + Neon Postgres - adapter-vercel config, Node.js vs Edge runtime, ISR/Cache-Control precedence, environment variables per environment, cron jobs, image optimization, Routing Middleware, WAF/rate limiting, cost control and spend limits, vercel.json, Turborepo monorepo deploys, Instant Rollback, and the Vercel-Neon integration.
- [workos-wasp-drone](../../plugins/platform-and-release-tools/agents/workos-wasp-drone.md): WorkOS specialist - AuthKit (hosted and headless), sealed sessions, JWT/JWKS verification, User Management (users/orgs/memberships/invitations), RBAC, SSO (SAML/OIDC), Directory Sync (SCIM), MFA/passkeys/Magic Auth, webhooks, and migrations from Supabase Auth or Clerk onto WorkOS.

### Commands

- `/platform-and-release-tools:build-integration` ([procedure](../../plugins/platform-and-release-tools/commands/build-integration.md)): Build a scoped provider integration with explicit authorization, sync, retry, rate-limit and revocation contracts.
- `/platform-and-release-tools:design-release-pipeline` ([procedure](../../plugins/platform-and-release-tools/commands/design-release-pipeline.md)): Design a scoped release graph, evidence gates, promotion rules, and rollback drill from the actual pipeline.
- `/platform-and-release-tools:plan-traffic-capacity` ([procedure](../../plugins/platform-and-release-tools/commands/plan-traffic-capacity.md)): Prepare measured traffic-spike capacity, SLO, cost, admission and recovery proposals from supplied evidence.
- `/platform-and-release-tools:prepare-native-release` ([procedure](../../plugins/platform-and-release-tools/commands/prepare-native-release.md)): Prepare a native release artifact matrix with signing, update, install, and device evidence boundaries.
- `/platform-and-release-tools:prepare-privacy-implementation` ([procedure](../../plugins/platform-and-release-tools/commands/prepare-privacy-implementation.md)): Prepare a privacy engineering inventory, implementation boundaries, and proof requirements from actual product data flows.
- `/platform-and-release-tools:prepare-release` ([procedure](../../plugins/platform-and-release-tools/commands/prepare-release.md)): Prepare a release candidate, evidence checklist, honest notes, and a release decision without publishing it.
- `/platform-and-release-tools:secure-platform-foundation` ([procedure](../../plugins/platform-and-release-tools/commands/secure-platform-foundation.md)): Prepare and implement an authorized platform foundation with identity, secrets, environment and data-access boundaries.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-build-integration](../../plugins/platform-and-release-tools/skills/source-command-build-integration/SKILL.md): reads the [build-integration procedure](../../plugins/platform-and-release-tools/commands/build-integration.md) using the installed command wrapper selector.
- [source-command-design-release-pipeline](../../plugins/platform-and-release-tools/skills/source-command-design-release-pipeline/SKILL.md): reads the [design-release-pipeline procedure](../../plugins/platform-and-release-tools/commands/design-release-pipeline.md) using the installed command wrapper selector.
- [source-command-plan-traffic-capacity](../../plugins/platform-and-release-tools/skills/source-command-plan-traffic-capacity/SKILL.md): reads the [plan-traffic-capacity procedure](../../plugins/platform-and-release-tools/commands/plan-traffic-capacity.md) using the installed command wrapper selector.
- [source-command-prepare-native-release](../../plugins/platform-and-release-tools/skills/source-command-prepare-native-release/SKILL.md): reads the [prepare-native-release procedure](../../plugins/platform-and-release-tools/commands/prepare-native-release.md) using the installed command wrapper selector.
- [source-command-prepare-privacy-implementation](../../plugins/platform-and-release-tools/skills/source-command-prepare-privacy-implementation/SKILL.md): reads the [prepare-privacy-implementation procedure](../../plugins/platform-and-release-tools/commands/prepare-privacy-implementation.md) using the installed command wrapper selector.
- [source-command-prepare-release](../../plugins/platform-and-release-tools/skills/source-command-prepare-release/SKILL.md): reads the [prepare-release procedure](../../plugins/platform-and-release-tools/commands/prepare-release.md) using the installed command wrapper selector.
- [source-command-secure-platform-foundation](../../plugins/platform-and-release-tools/skills/source-command-secure-platform-foundation/SKILL.md): reads the [secure-platform-foundation procedure](../../plugins/platform-and-release-tools/commands/secure-platform-foundation.md) using the installed command wrapper selector.

## product-studio

Version `3.1.0`. 3 Stingers, 3 Drones. [Pack overview](../../plugins/product-studio/README.md).

### Stingers

- [product-design-stinger](../../plugins/product-studio/skills/product-design-stinger/SKILL.md): Turn a product strategy into a UX package: journeys, IA, flows, screen states, WCAG 2.2 AA, HTML prototypes, critique, Claude Design round trip.
- [product-planning-stinger](../../plugins/product-studio/skills/product-planning-stinger/SKILL.md): Turn an approved strategy and UX package into a PRD map, saved wave plan, project Definition of Done and handoff packet. Use to plan the build order.
- [product-strategy-stinger](../../plugins/product-studio/skills/product-strategy-stinger/SKILL.md): Turn a product idea or existing repo into a one-page Product Strategy by interviewing the owner: customer, positioning, bets, north star, v1 scope, riskiest assumption.

### Drones

- [product-design-wasp-drone](../../plugins/product-studio/agents/product-design-wasp-drone.md): Turn a product strategy into a UX package: journeys, IA, Mermaid flows, screen states, WCAG 2.2 AA baseline, light and dark HTML prototypes, scored critique, Claude Design brief and import.
- [product-planning-wasp-drone](../../plugins/product-studio/agents/product-planning-wasp-drone.md): Plans the build from an approved strategy and UX package: PRD map, saved wave plan with Mermaid graph, project Definition of Done and handoff packet.
- [product-strategy-wasp-drone](../../plugins/product-studio/agents/product-strategy-wasp-drone.md): Interview the owner and write a one-page Product Strategy to library/knowledge/private/product/: customer, job, positioning, 2 to 4 bets, north star plus 3 inputs, v1 and NOT-in-v1, riskiest assumption.

### Commands

- `/product-studio:plan-product` ([procedure](../../plugins/product-studio/commands/plan-product.md)): Plan a product before building it: strategy, then UX design, then the build plan (PRD map, wave plan, Definition of Done), with owner approval at each gate and handoffs to Library and Contract Writing.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-plan-product](../../plugins/product-studio/skills/source-command-plan-product/SKILL.md): reads the [plan-product procedure](../../plugins/product-studio/commands/plan-product.md) using the installed command wrapper selector.

## repository-modernization-tools

Version `3.1.0`. 1 Stingers, 1 Drones. [Pack overview](../../plugins/repository-modernization-tools/README.md).

### Stingers

- [flaky-test-repair-stinger](../../plugins/repository-modernization-tools/skills/flaky-test-repair-stinger/SKILL.md): Repair flaky tests from observed failures with bounded causal reproduction, narrow fixture fixes, preserved assertions and exact final-candidate evidence.

### Drones

- [flaky-test-repair-wasp-drone](../../plugins/repository-modernization-tools/agents/flaky-test-repair-wasp-drone.md): Observed-failure flaky-test triage and bounded test/fixture repair specialist.

### Commands

- `/repository-modernization-tools:improve-repository` ([procedure](../../plugins/repository-modernization-tools/commands/improve-repository.md)): Establish a repository baseline and prepare evidence-backed, owned repair batches.
- `/repository-modernization-tools:onboard-contributor` ([procedure](../../plugins/repository-modernization-tools/commands/onboard-contributor.md)): Prepare and exercise a contributor setup path, first contribution and complete contractor handoff packet when requested using actual repository evidence.
- `/repository-modernization-tools:refactor-safely` ([procedure](../../plugins/repository-modernization-tools/commands/refactor-safely.md)): Convert bloat evidence into bounded behavior-preserving repairs with baseline and rollback proof.
- `/repository-modernization-tools:remove-unused-dependencies` ([procedure](../../plugins/repository-modernization-tools/commands/remove-unused-dependencies.md)): Remove manually qualified unused dependencies within exact approved package and lockfile scope, with before/after import and build proof.
- `/repository-modernization-tools:repair-flaky-tests` ([procedure](../../plugins/repository-modernization-tools/commands/repair-flaky-tests.md)): Diagnose observed flaky failures and repair a bounded causal defect while preserving test assertions and evidence.
- `/repository-modernization-tools:verify-refactor` ([procedure](../../plugins/repository-modernization-tools/commands/verify-refactor.md)): Compare pinned refactor behavior, performance, and accepted interfaces with explicit evidence limits.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-improve-repository](../../plugins/repository-modernization-tools/skills/source-command-improve-repository/SKILL.md): reads the [improve-repository procedure](../../plugins/repository-modernization-tools/commands/improve-repository.md) using the installed command wrapper selector.
- [source-command-onboard-contributor](../../plugins/repository-modernization-tools/skills/source-command-onboard-contributor/SKILL.md): reads the [onboard-contributor procedure](../../plugins/repository-modernization-tools/commands/onboard-contributor.md) using the installed command wrapper selector.
- [source-command-refactor-safely](../../plugins/repository-modernization-tools/skills/source-command-refactor-safely/SKILL.md): reads the [refactor-safely procedure](../../plugins/repository-modernization-tools/commands/refactor-safely.md) using the installed command wrapper selector.
- [source-command-remove-unused-dependencies](../../plugins/repository-modernization-tools/skills/source-command-remove-unused-dependencies/SKILL.md): reads the [remove-unused-dependencies procedure](../../plugins/repository-modernization-tools/commands/remove-unused-dependencies.md) using the installed command wrapper selector.
- [source-command-repair-flaky-tests](../../plugins/repository-modernization-tools/skills/source-command-repair-flaky-tests/SKILL.md): reads the [repair-flaky-tests procedure](../../plugins/repository-modernization-tools/commands/repair-flaky-tests.md) using the installed command wrapper selector.
- [source-command-verify-refactor](../../plugins/repository-modernization-tools/skills/source-command-verify-refactor/SKILL.md): reads the [verify-refactor procedure](../../plugins/repository-modernization-tools/commands/verify-refactor.md) using the installed command wrapper selector.

## software-economics-tools

Version `3.1.0`. 4 Stingers, 4 Drones. [Pack overview](../../plugins/software-economics-tools/README.md).

### Stingers

- [operating-cost-stinger](../../plugins/software-economics-tools/skills/operating-cost-stinger/SKILL.md): Estimate low/base/high monthly operating costs from supplied workload and dated rates, separating allowances, shared credits, fees, floors and labor. Use for infrastructure operating budgets.
- [saas-pricing-stinger](../../plugins/software-economics-tools/skills/saas-pricing-stinger/SKILL.md): Recommend one provisional SaaS price/model from buyer value, costs and dated evidence. Use for seats, tiers, usage, credits, price experiments or missing willingness-to-pay evidence.
- [services-quoting-stinger](../../plugins/software-economics-tools/skills/services-quoting-stinger/SKILL.md): Prepare service quotes and agency SOW drafts from supplied scope/costs. Use for project pricing, acceptance criteria, maintenance, unknown integrations or scope changes.
- [unit-economics-stinger](../../plugins/software-economics-tools/skills/unit-economics-stinger/SKILL.md): Model supplied software prices and costs into margins, break-even, losses, and scenarios. Use for an economic worksheet, operating economics, or free/trial, abuse-cost, refund and usage sensitivity.

### Drones

- [operating-cost-wasp-drone](../../plugins/software-economics-tools/agents/operating-cost-wasp-drone.md): Estimate monthly software operating costs from supplied workloads and dated rates.
- [saas-pricing-wasp-drone](../../plugins/software-economics-tools/agents/saas-pricing-wasp-drone.md): Recommend one provisional SaaS price/model with buyer value, current evidence, cost feasibility, limits and a test plan.
- [services-quoting-wasp-drone](../../plugins/software-economics-tools/agents/services-quoting-wasp-drone.md): Prepare proposed service quotes and agency statements of work with observable scope, supplied costs, discovery limits, maintenance and change requests.
- [unit-economics-wasp-drone](../../plugins/software-economics-tools/agents/unit-economics-wasp-drone.md): Model supplied prices and operating costs into contribution, gross margin, break-even and scenario worksheets.

### Commands

- `/software-economics-tools:estimate-operating-cost` ([procedure](../../plugins/software-economics-tools/commands/estimate-operating-cost.md)): Estimate low/base/high monthly cash operating costs and separate operator time value from supplied workload and dated rates.
- `/software-economics-tools:model-unit-economics` ([procedure](../../plugins/software-economics-tools/commands/model-unit-economics.md)): Produce a reviewable economic worksheet from supplied prices, costs, refunds and usage scenarios. No provider writes.
- `/software-economics-tools:price-my-product` ([procedure](../../plugins/software-economics-tools/commands/price-my-product.md)): Prepare one provisional SaaS price/model recommendation with buyer evidence, workload economics, limits and an unexecuted price test.
- `/software-economics-tools:quote-project` ([procedure](../../plugins/software-economics-tools/commands/quote-project.md)): Prepare a scoped proposed website, app/integration or maintenance quote with effort/cost evidence, pricing maths and change boundaries.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-estimate-operating-cost](../../plugins/software-economics-tools/skills/source-command-estimate-operating-cost/SKILL.md): reads the [estimate-operating-cost procedure](../../plugins/software-economics-tools/commands/estimate-operating-cost.md) using the installed command wrapper selector.
- [source-command-model-unit-economics](../../plugins/software-economics-tools/skills/source-command-model-unit-economics/SKILL.md): reads the [model-unit-economics procedure](../../plugins/software-economics-tools/commands/model-unit-economics.md) using the installed command wrapper selector.
- [source-command-price-my-product](../../plugins/software-economics-tools/skills/source-command-price-my-product/SKILL.md): reads the [price-my-product procedure](../../plugins/software-economics-tools/commands/price-my-product.md) using the installed command wrapper selector.
- [source-command-quote-project](../../plugins/software-economics-tools/skills/source-command-quote-project/SKILL.md): reads the [quote-project procedure](../../plugins/software-economics-tools/commands/quote-project.md) using the installed command wrapper selector.

## web-development-tools

Version `3.1.0`. 30 Stingers, 30 Drones. [Pack overview](../../plugins/web-development-tools/README.md).

### Stingers

- [asset-stinger](../../plugins/web-development-tools/skills/asset-stinger/SKILL.md): Maintain the Universal Asset Registry. Use to register assets, audit code-to-registry drift, or generate migrations.
- [component-vendoring-stinger](../../plugins/web-development-tools/skills/component-vendoring-stinger/SKILL.md): Select existing UI components and prepare notice-preserving source-copy plans. Use for component reuse, exact MIT artifact provenance, authorized copies, or local fork updates.
- [csv-xlsx-import-export-stinger](../../plugins/web-development-tools/skills/csv-xlsx-import-export-stinger/SKILL.md): Implement spreadsheet import and export in React. Use for CSV/XLSX parsing, mapping, row validation, streaming, or CSV injection.
- [dark-mode-theming-stinger](../../plugins/web-development-tools/skills/dark-mode-theming-stinger/SKILL.md): Audits and implements dark mode for React/Next.js: CSS tokens, next-themes wiring, FOWT prevention, SSR hydration, Tailwind v4 config, multi-brand theming. Use for dark mode setup or flashing bugs.
- [design-system-stinger](../../plugins/web-development-tools/skills/design-system-stinger/SKILL.md): Bootstrap a product design system. Use for tokens, utilities, component and screen specs, or static examples.
- [font-loading-stinger](../../plugins/web-development-tools/skills/font-loading-stinger/SKILL.md): Fix web font loading performance. Use for FOIT/FOUT, preload, subsetting, metric-matched fallbacks, or font-swap CLS.
- [icon-system-stinger](../../plugins/web-development-tools/skills/icon-system-stinger/SKILL.md): Design a React icon system. Use for library choice, bundle size, SVG sprites, dynamic icons, or accessibility.
- [image-optimization-stinger](../../plugins/web-development-tools/skills/image-optimization-stinger/SKILL.md): Optimize web image delivery. Use for AVIF/WebP, responsive sizes, blur placeholders, Next image config, or image CLS.
- [impeccable-stinger](../../plugins/web-development-tools/skills/impeccable-stinger/SKILL.md): Operate Impeccable for UI design. Use for new surfaces, redesign, polish, design capture, or anti-slop checks.
- [localization-stinger](../../plugins/web-development-tools/skills/localization-stinger/SKILL.md): Implement locale routing, message resources, ICU/plurals, Intl formatting and RTL in a selected web framework. Use for localization changes and scoped translation review.
- [modal-toast-dialog-stinger](../../plugins/web-development-tools/skills/modal-toast-dialog-stinger/SKILL.md): Build accessible React overlays. Use for dialog, drawer, toast, command menu, focus handling, or stacking.
- [nextjs-stinger](../../plugins/web-development-tools/skills/nextjs-stinger/SKILL.md): Implement Next.js App Router features: server/client boundaries, reads, actions, handlers, private data, cache contracts and build/provider handoffs.
- [nuxt-stinger](../../plugins/web-development-tools/skills/nuxt-stinger/SKILL.md): Implement Nuxt apps, SSR/data integration, Nitro routes, request state and cache/auth boundaries. Use for accepted Nuxt builds or changes.
- [preact-stinger](../../plugins/web-development-tools/skills/preact-stinger/SKILL.md): Build Preact 11 apps and widgets. Use for signals, React compat migration, embeds, Astro islands, or Fresh.
- [product-tour-onboarding-ui-stinger](../../plugins/web-development-tools/skills/product-tour-onboarding-ui-stinger/SKILL.md): Build in-app tours and onboarding UI. Use for tour tools, tooltips, checklists, segment triggers, or maintenance after UI changes.
- [pwa-stinger](../../plugins/web-development-tools/skills/pwa-stinger/SKILL.md): Implement browser PWA manifest, service-worker lifecycle and bounded public offline assets. Use for scoped PWA/offline changes.
- [react-stinger](../../plugins/web-development-tools/skills/react-stinger/SKILL.md): Review and refactor React 18/19 architecture. Use for state layers, Server Components, Suspense, Actions, data boundaries, or testing.
- [react-to-svelte-stinger](../../plugins/web-development-tools/skills/react-to-svelte-stinger/SKILL.md): React-to-Svelte 5 porting: hooks-to-runes translation, TanStack Router to SvelteKit, RTK Query and Radix conversion, contract-first port waves. Use when porting React components or dashboards.
- [seo-aeo-stinger](../../plugins/web-development-tools/skills/seo-aeo-stinger/SKILL.md): SEO and AEO for SvelteKit (Svelte 5) + Payload CMS + Vercel. Covers metadata, sitemap/robots, JSON-LD, Payload SEO fields, Core Web Vitals, llms.txt/AI citation, E-E-A-T, and indexation playbooks.
- [shadcn-svelte-stinger](../../plugins/web-development-tools/skills/shadcn-svelte-stinger/SKILL.md): The shadcn-svelte library itself for any Svelte project: CLI, copy-in model, anatomy, registry, theming, forms, upgrades. A project's design system or brand contract belongs to ux-ui-svelte-stinger.
- [svelte-stinger](../../plugins/web-development-tools/skills/svelte-stinger/SKILL.md): Svelte 5 specialist for runes, snippets, lifecycle, universal reactivity, SvelteKit 2 load/actions/remote functions, and Svelte 4 migration. Use for any .svelte, .svelte.js, or .svelte.ts work.
- [tailwind-stinger](../../plugins/web-development-tools/skills/tailwind-stinger/SKILL.md): Tailwind CSS v4 the framework itself, CSS-first config, @theme, the Vite plugin, v3-to-v4 migration, dark mode, container queries, class ordering. Generic, any codebase, not OSPRY-specific.
- [tanstack-stinger](../../plugins/web-development-tools/skills/tanstack-stinger/SKILL.md): TanStack libraries in SvelteKit (Svelte 5) - Query SSR/caching/mutations, Table runes state, Form snippet validation, Virtual; states plainly that Router and Start have no official Svelte support.
- [typography-font-stinger](../../plugins/web-development-tools/skills/typography-font-stinger/SKILL.md): Build a web typography system. Use for variable fonts, font loading, fluid scales, vertical rhythm, or type tokens.
- [ux-ui-stinger](../../plugins/web-development-tools/skills/ux-ui-stinger/SKILL.md): Enforce an existing design system. Use for component specs, token drift, library wrappers, motion rulings, or visual deltas.
- [ux-ui-svelte-stinger](../../plugins/web-development-tools/skills/ux-ui-svelte-stinger/SKILL.md): Enforce and implement a SvelteKit UI standard: shadcn-svelte, Tailwind v4 token bridge, brand theming, markup styling. OSPRY's ADR-007 is the worked example.
- [vue-stinger](../../plugins/web-development-tools/skills/vue-stinger/SKILL.md): Build Vue application slices with SFCs, composables, typed props/events, state, forms, routing and delivery evidence. Use after Vue is chosen; hand Nuxt SSR to its selected owner.
- [web-stack-selection-stinger](../../plugins/web-development-tools/skills/web-stack-selection-stinger/SKILL.md): Recommend one web framework from product, rendering, team and hosting needs. Separate backend choices and expose implementation-owner gaps.
- [website-stinger](../../plugins/web-development-tools/skills/website-stinger/SKILL.md): Build a SvelteKit marketing site from a brief. Use for site scaffolding, Payload CMS, Supabase, lead capture, blog, or conversion.
- [xyflow-stinger](../../plugins/web-development-tools/skills/xyflow-stinger/SKILL.md): React Flow and Svelte Flow (xyflow) node editors: setup, state, custom nodes and edges, handles, layout, sub flows, theming, React Flow UI, SSR, tests, and migrations.

### Drones

- [asset-wasp-drone](../../plugins/web-development-tools/agents/asset-wasp-drone.md): Single owner of the Universal Asset Registry: the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken, Icon, MediaAsset, Font, Motion, Breakpoint, ContentEntry, Translation, FeatureFlag binding, Meter binding, and Entitlement in the codebase.
- [component-vendoring-wasp-drone](../../plugins/web-development-tools/agents/component-vendoring-wasp-drone.md): Select reusable UI components, prepare exact notice-preserving copy plans, and maintain authorized local forks with artifact provenance.
- [csv-xlsx-import-export-wasp-drone](../../plugins/web-development-tools/agents/csv-xlsx-import-export-wasp-drone.md): Implements and audits the "upload your spreadsheet" feature surface for React/Next.js products.
- [dark-mode-theming-wasp-drone](../../plugins/web-development-tools/agents/dark-mode-theming-wasp-drone.md): Audits and implements the full dark-mode theming surface for React/Next.js applications.
- [design-system-wasp-drone](../../plugins/web-development-tools/agents/design-system-wasp-drone.md): Bootstraps complete design systems from scratch for any product: master design brief, tokens CSS, utility layer CSS, per-component specs, per-screen specs, static HTML examples, and README.
- [font-loading-wasp-drone](../../plugins/web-development-tools/agents/font-loading-wasp-drone.md): Production-focused web font loading specialist.
- [icon-system-wasp-drone](../../plugins/web-development-tools/agents/icon-system-wasp-drone.md): Icon-system specialist for React/Next.js applications.
- [image-optimization-wasp-drone](../../plugins/web-development-tools/agents/image-optimization-wasp-drone.md): Image optimization specialist for React/Next.js and HTML contexts.
- [impeccable-wasp-drone](../../plugins/web-development-tools/agents/impeccable-wasp-drone.md): Operates the entire Impeccable design system (pbakaus/impeccable, Apache-2.0) as the Wasp Swarm's frontend-design operating system: the four-phase loop (Start -> Iterate -> Polish -> Maintain), the context contract (PRODUCT.md + DESIGN.md + surface briefs), the 23-command vocabulary, the deterministic 59-rule anti-slop detector gate, hooks, live mode, and native playbooks.
- [localization-wasp-drone](../../plugins/web-development-tools/agents/localization-wasp-drone.md): Implement locale routing, resources, ICU/plurals, Intl formatting and RTL in the selected web framework.
- [modal-toast-dialog-wasp-drone](../../plugins/web-development-tools/agents/modal-toast-dialog-wasp-drone.md): Accessible overlay specialist for React.
- [nextjs-wasp-drone](../../plugins/web-development-tools/agents/nextjs-wasp-drone.md): Implement Next.js App Router features, reads, Server Actions, Route Handlers, cache/private-data isolation and build/provider handoffs.
- [nuxt-wasp-drone](../../plugins/web-development-tools/agents/nuxt-wasp-drone.md): Implement accepted Nuxt apps: routing, SSR/data, Nitro routes, request state, private config and cache/auth integration.
- [preact-wasp-drone](../../plugins/web-development-tools/agents/preact-wasp-drone.md): Preact 11 specialist: signals API (v2 with createModel/useModel/action), preact/compat migration from React (alias setup, known gaps, compat blockers), third-party embed widgets (shadow DOM isolation, IIFE bundle pattern, size budgeting), Astro island integration (client:* directives, require >= 5.0.1 for useId fix), and Fresh 2.x framework (Deno-native, serializable island props, cross-island signals state).
- [product-tour-onboarding-ui-wasp-drone](../../plugins/web-development-tools/agents/product-tour-onboarding-ui-wasp-drone.md): In-app product tour and onboarding UI specialist.
- [pwa-wasp-drone](../../plugins/web-development-tools/agents/pwa-wasp-drone.md): Implement scoped browser PWA manifest, service-worker lifecycle and public offline assets.
- [react-to-svelte-wasp-drone](../../plugins/web-development-tools/agents/react-to-svelte-wasp-drone.md): Port-wave drone converting React surfaces to Svelte 5 against an immutable API contract - contract extraction, behavior inventory, runes/snippets port, per-row verification.
- [react-wasp-drone](../../plugins/web-development-tools/agents/react-wasp-drone.md): React architecture specialist for React 18/19 codebases: bulletproof-react patterns, awesome-react ecosystem, React 19 idioms (Server Components, Suspense, Actions, Compiler), state layering, data-fetching boundaries, error handling, testing strategy, and performance discipline.
- [seo-aeo-wasp-drone](../../plugins/web-development-tools/agents/seo-aeo-wasp-drone.md): SvelteKit (Svelte 5) + Payload CMS + Vercel SEO and Answer Engine Optimization specialist.
- [shadcn-svelte-wasp-drone](../../plugins/web-development-tools/agents/shadcn-svelte-wasp-drone.md): shadcn-svelte library specialist for any Svelte 5 project: CLI (init/add/apply), the copy-in-your-repo model, component anatomy, the registry system, generic theming mechanics, dark mode, Superforms + Formsnap forms, customization patterns that survive upstream re-syncs, and accessibility inherited from Bits UI.
- [svelte-wasp-drone](../../plugins/web-development-tools/agents/svelte-wasp-drone.md): Svelte 5 language and SvelteKit 2 runtime specialist: runes ($state, $derived, $effect, $props, $bindable, $host, $inspect), snippets and event attributes, component lifecycle, universal reactivity in .svelte.js/.svelte.ts, Svelte 4-to-5 migration, SvelteKit 2 load functions/form actions/remote functions/error boundaries, and Svelte-aware testing.
- [tailwind-wasp-drone](../../plugins/web-development-tools/agents/tailwind-wasp-drone.md): Tailwind CSS v4 framework specialist, CSS-first configuration, @theme mechanics, utility generation, the Vite plugin, v3-to-v4 migration, dark mode variants via @custom-variant, container queries, class ordering and tooling, and Oxide-engine performance, for ANY codebase.
- [tanstack-wasp-drone](../../plugins/web-development-tools/agents/tanstack-wasp-drone.md): TanStack-in-SvelteKit (Svelte 5) specialist - TanStack Query SSR/caching/prefetching/mutations, TanStack Table runes-native setup and feature registration, TanStack Form snippet-based validation, TanStack Virtual, and drawing the line on TanStack Router/Start having no official Svelte support.
- [typography-font-wasp-drone](../../plugins/web-development-tools/agents/typography-font-wasp-drone.md): Typography and font-loading specialist for web products: variable fonts, Google Fonts vs Fontsource vs self-host, the FOIT/FOUT/FOFT loading story, font-display semantics, fluid type scales via clamp(), vertical rhythm, and the type-token architecture.
- [ux-ui-svelte-wasp-drone](../../plugins/web-development-tools/agents/ux-ui-svelte-wasp-drone.md): General Svelte 5 / SvelteKit UI owner: enforces and implements UI work with shadcn-svelte 1.x on Bits UI v2 + Melt UI and Tailwind v4, the @theme token bridge to a project's design tokens, and brand or white-label theming.
- [ux-ui-wasp-drone](../../plugins/web-development-tools/agents/ux-ui-wasp-drone.md): Enforces a product's design system from its source-of-truth folder (tokens, utilities, components, screens) and governs integration with shadcn/ui, Mantine, Lucide-react, and Framer Motion.
- [vue-wasp-drone](../../plugins/web-development-tools/agents/vue-wasp-drone.md): Implement Vue SFC, composable, state, form and client-route slices after Vue is selected.
- [web-stack-selection-wasp-drone](../../plugins/web-development-tools/agents/web-stack-selection-wasp-drone.md): Recommend one web framework using product, rendering, team, backend and hosting constraints.
- [website-wasp-drone](../../plugins/web-development-tools/agents/website-wasp-drone.md): Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end from a brief, applying a 12-phase site-template playbook (monorepo architecture, SvelteKit performance + security, SEO/AEO, analytics, Supabase backend with RLS, auth + RBAC, Payload admin, lead capture, blog, webhooks, conversion-rate optimization, and visual design tokens).
- [xyflow-wasp-drone](../../plugins/web-development-tools/agents/xyflow-wasp-drone.md): React Flow (@xyflow/react) and Svelte Flow (@xyflow/svelte) specialist for node editors, workflow builders, and diagram canvases: setup, flow state, custom nodes, edges and handles, connection rules, Dagre or ELK layout, sub flows, theming and Tailwind v4, React Flow UI, SSR, performance, accessibility, tests, and reactflow 11 or Svelte Flow 0.x migrations.

### Commands

- `/web-development-tools:build-app-search` ([procedure](../../plugins/web-development-tools/commands/build-app-search.md)): Build tenant-safe application search with an accepted query/result contract, stable pagination and measured retrieval quality.
- `/web-development-tools:build-localization` ([procedure](../../plugins/web-development-tools/commands/build-localization.md)): Build or extend a localization app using current locale, resource, plural, formatting and RTL boundaries with explicit verification.
- `/web-development-tools:build-nextjs-app` ([procedure](../../plugins/web-development-tools/commands/build-nextjs-app.md)): Build or extend a Next.js app using current App Router, server/client, data, mutation and cache boundaries with explicit verification.
- `/web-development-tools:build-nuxt-app` ([procedure](../../plugins/web-development-tools/commands/build-nuxt-app.md)): Build or extend a Nuxt app using current Nuxt routing, SSR, Nitro, data and cache boundaries with explicit verification.
- `/web-development-tools:build-pwa-app` ([procedure](../../plugins/web-development-tools/commands/build-pwa-app.md)): Build or extend a PWA app using current public asset, offline fallback, update and private-data boundaries with explicit verification.
- `/web-development-tools:build-quick-website` ([procedure](../../plugins/web-development-tools/commands/build-quick-website.md)): Build a scoped SvelteKit marketing or lead-generation website from a brief, with explicit CMS and integration decisions.
- `/web-development-tools:build-saas-foundation` ([procedure](../../plugins/web-development-tools/commands/build-saas-foundation.md)): Build a scoped SaaS foundation joining tenant identity, data isolation, billing entitlements and a verified user journey.
- `/web-development-tools:build-vue-app` ([procedure](../../plugins/web-development-tools/commands/build-vue-app.md)): Build or extend a Vue app using current component, state, form, routing and asynchronous boundaries with explicit verification.
- `/web-development-tools:build-web-app` ([procedure](../../plugins/web-development-tools/commands/build-web-app.md)): Scope and build an authorized web-app slice using an actual supported framework owner and verified boundaries.
- `/web-development-tools:choose-web-stack` ([procedure](../../plugins/web-development-tools/commands/choose-web-stack.md)): Recommend one web framework from product, rendering, team and hosting needs, with backend boundaries and owner gaps.
- `/web-development-tools:qualify-typography` ([procedure](../../plugins/web-development-tools/commands/qualify-typography.md)): Qualify a web typography system and font delivery using source inspection and actual browser evidence.
- `/web-development-tools:vendor-component` ([procedure](../../plugins/web-development-tools/commands/vendor-component.md)): Select and prepare an authorized component vendoring plan with actual artifact provenance, notices, patches and update evidence.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-build-app-search](../../plugins/web-development-tools/skills/source-command-build-app-search/SKILL.md): reads the [build-app-search procedure](../../plugins/web-development-tools/commands/build-app-search.md) using the installed command wrapper selector.
- [source-command-build-localization](../../plugins/web-development-tools/skills/source-command-build-localization/SKILL.md): reads the [build-localization procedure](../../plugins/web-development-tools/commands/build-localization.md) using the installed command wrapper selector.
- [source-command-build-nextjs-app](../../plugins/web-development-tools/skills/source-command-build-nextjs-app/SKILL.md): reads the [build-nextjs-app procedure](../../plugins/web-development-tools/commands/build-nextjs-app.md) using the installed command wrapper selector.
- [source-command-build-nuxt-app](../../plugins/web-development-tools/skills/source-command-build-nuxt-app/SKILL.md): reads the [build-nuxt-app procedure](../../plugins/web-development-tools/commands/build-nuxt-app.md) using the installed command wrapper selector.
- [source-command-build-pwa-app](../../plugins/web-development-tools/skills/source-command-build-pwa-app/SKILL.md): reads the [build-pwa-app procedure](../../plugins/web-development-tools/commands/build-pwa-app.md) using the installed command wrapper selector.
- [source-command-build-quick-website](../../plugins/web-development-tools/skills/source-command-build-quick-website/SKILL.md): reads the [build-quick-website procedure](../../plugins/web-development-tools/commands/build-quick-website.md) using the installed command wrapper selector.
- [source-command-build-saas-foundation](../../plugins/web-development-tools/skills/source-command-build-saas-foundation/SKILL.md): reads the [build-saas-foundation procedure](../../plugins/web-development-tools/commands/build-saas-foundation.md) using the installed command wrapper selector.
- [source-command-build-vue-app](../../plugins/web-development-tools/skills/source-command-build-vue-app/SKILL.md): reads the [build-vue-app procedure](../../plugins/web-development-tools/commands/build-vue-app.md) using the installed command wrapper selector.
- [source-command-build-web-app](../../plugins/web-development-tools/skills/source-command-build-web-app/SKILL.md): reads the [build-web-app procedure](../../plugins/web-development-tools/commands/build-web-app.md) using the installed command wrapper selector.
- [source-command-choose-web-stack](../../plugins/web-development-tools/skills/source-command-choose-web-stack/SKILL.md): reads the [choose-web-stack procedure](../../plugins/web-development-tools/commands/choose-web-stack.md) using the installed command wrapper selector.
- [source-command-qualify-typography](../../plugins/web-development-tools/skills/source-command-qualify-typography/SKILL.md): reads the [qualify-typography procedure](../../plugins/web-development-tools/commands/qualify-typography.md) using the installed command wrapper selector.
- [source-command-vendor-component](../../plugins/web-development-tools/skills/source-command-vendor-component/SKILL.md): reads the [vendor-component procedure](../../plugins/web-development-tools/commands/vendor-component.md) using the installed command wrapper selector.

## website-audit-tools

Version `3.1.0`. 21 Stingers, 20 Drones. [Pack overview](../../plugins/website-audit-tools/README.md).

### Stingers

- [accessibility-audit-stinger](../../plugins/website-audit-tools/skills/accessibility-audit-stinger/SKILL.md): Automated-plus-heuristic WCAG 2.1 AA audit across crawled site-data/, a 0-100% score and AA/AAA-style rating, every finding cited with evidence. Not a legal EAA-conformance determination.
- [aeo-audit-stinger](../../plugins/website-audit-tools/skills/aeo-audit-stinger/SKILL.md): 100-page AEO audit: llms.txt presence, per-engine AI-crawler robots.txt access (GPTBot, PerplexityBot, ClaudeBot, etc.), citation-relevant structured data, subjective topical alignment. Wave W5.
- [analytics-stack-stinger](../../plugins/website-audit-tools/skills/analytics-stack-stinger/SKILL.md): Foundational, industry-specific, and lawful-only de-anonymization analytics audit, built on the vendor census. Flags jurisdiction questions rather than a compliance verdict.
- [audit-intake-stinger](../../plugins/website-audit-tools/skills/audit-intake-stinger/SKILL.md): Runs the four-question intake, scaffolds the shared audit workspace, hydrates every template with the answers. First Drone in every engagement, no authorization-capture step by design.
- [audit-reporting-stinger](../../plugins/website-audit-tools/skills/audit-reporting-stinger/SKILL.md): Generates customer- and auditor-facing reports (Markdown + styled HTML), subtly Legion Code Inc.-branded, rendered only from the scored findings register.
- [audit-scoring-stinger](../../plugins/website-audit-tools/skills/audit-scoring-stinger/SKILL.md): N/A-aware weighted rollup engine (leaf to sub-audit to category to final), critical-security-override, populates the branded named-range-driven XLSX scorecard.
- [blog-content-stinger](../../plugins/website-audit-tools/skills/blog-content-stinger/SKILL.md): Bonus, conditional blog audit: 10 recent posts, word count, subjective quality read, AI-authorship reported only as a probability band with method and error rate, never a verdict. Wave W6a.
- [content-semantics-stinger](../../plugins/website-audit-tools/skills/content-semantics-stinger/SKILL.md): Quantified reading-level estimate (Flesch Reading Ease/Grade Level) plus a subjective ICP-relevancy score per crawled page, kept in separate sections. Wave W5.
- [ecommerce-catalog-stinger](../../plugins/website-audit-tools/skills/ecommerce-catalog-stinger/SKILL.md): Bonus, conditional ecommerce audit: up to 25 products, schema.org Product metadata completeness (quantified) plus subjective copy/conversion quality, kept separate. Wave W6b.
- [icp-positioning-stinger](../../plugins/website-audit-tools/skills/icp-positioning-stinger/SKILL.md): Niche/ICP/goal assessment, conversion-action taxonomy, two-stage buyer-readiness model. Owns the run's hard focus-undeterminable gate: halts and asks rather than guessing.
- [internal-linking-stinger](../../plugins/website-audit-tools/skills/internal-linking-stinger/SKILL.md): Internal link-graph analysis: orphan-page detection, click-depth via BFS, four-dimension anchor-text scoring plus cannibalization detection, internal-PageRank-style equity flow. Wave W5.
- [keyword-intelligence-stinger](../../plugins/website-audit-tools/skills/keyword-intelligence-stinger/SKILL.md): Compiles 75-100 keywords + 25-50 questions via a strict 4-tier source chain: Search Console MCP, then customer Trends export, then EXA/Firecrawl inference, then paid API. Degrades gracefully.
- [master-website-auditor](../../plugins/website-audit-tools/skills/master-website-auditor/SKILL.md): Fallback orchestrator for harnesses without native command dispatch. Activates the same 20 Drone/Stinger pairs as /perform-website-audit, same order, same shared workspace.
- [performance-cwv-stinger](../../plugins/website-audit-tools/skills/performance-cwv-stinger/SKILL.md): CDN/caching-header audit plus Core Web Vitals scoring for an external site, from an outside unauthenticated posture. Cross-linked with lighthouse-pagespeed-stinger, not duplicated.
- [site-crawler-stinger](../../plugins/website-audit-tools/skills/site-crawler-stinger/SKILL.md): Platform-aware crawl to depth 100, raw HTML+MD storage in site-data/, which nine Wave-5 Drones then read read-only with zero write contention.
- [social-presence-stinger](../../plugins/website-audit-tools/skills/social-presence-stinger/SKILL.md): Facebook/LinkedIn/Instagram presence audit via the harness's own browser tooling, opt-in auth per platform; decline or unavailable auth is a silent no-op, never a score penalty.
- [stack-fingerprint-stinger](../../plugins/website-audit-tools/skills/stack-fingerprint-stinger/SKILL.md): Landing-page-only stack and render-mode fingerprinting (React/Vite, Next.js, SvelteKit, WordPress, Shopify, Magento). Writes target-profile.json every later Drone reads.
- [technical-seo-stinger](../../plugins/website-audit-tools/skills/technical-seo-stinger/SKILL.md): 100-page technical SEO audit: crawlability/indexability, sitemap/robots.txt validation, canonicalization, log-file/crawl-budget analysis, keyword-frequency and long-tail semantic analysis. Wave W5.
- [vendor-inventory-stinger](../../plugins/website-audit-tools/skills/vendor-inventory-stinger/SKILL.md): Third-party vendor census after a real JS-executed page load, including GTM-hydrated scripts and content-injection/metadata-manipulation tools like Search Atlas, classified by function.
- [visual-funnel-stinger](../../plugins/website-audit-tools/skills/visual-funnel-stinger/SKILL.md): 25-page visual funnel walk, real desktop (1440x900) and mobile (390x844) Chrome, screenshots at every checkpoint. No state-creating actions unless interactive mode is opted into.
- [web-security-posture-stinger](../../plugins/website-audit-tools/skills/web-security-posture-stinger/SKILL.md): External, passive security-posture audit: headers, TLS coarse-check, cookies, CSP, injection surface, payment-path integrity. Highest-weighted category (20%); a critical leaf caps the grade at C.

### Drones

- [accessibility-audit-wasp-drone](../../plugins/website-audit-tools/agents/accessibility-audit-wasp-drone.md): Automated-plus-heuristic WCAG 2.1 AA accessibility audit of a crawled third-party site, scored 0-100% with an AA/AAA-style rating band, every finding cited to its success criterion with evidence.
- [aeo-audit-wasp-drone](../../plugins/website-audit-tools/agents/aeo-audit-wasp-drone.md): 100-page-depth Answer Engine Optimization audit: `llms.txt` presence/correctness, per-engine AI-crawler robots.txt access (GPTBot, PerplexityBot, ClaudeBot, Googlebot, Google-Extended, Cohere-AI), citation-relevant structured data, and a subjective topical-alignment read against `content-targets/questions.md`.
- [analytics-stack-wasp-drone](../../plugins/website-audit-tools/agents/analytics-stack-wasp-drone.md): Foundational, industry-specific, and (where lawful) de-anonymization analytics audit, built on vendor-inventory-wasp-drone's census.
- [audit-intake-wasp-drone](../../plugins/website-audit-tools/agents/audit-intake-wasp-drone.md): First Drone in every website-audit engagement.
- [audit-reporting-wasp-drone](../../plugins/website-audit-tools/agents/audit-reporting-wasp-drone.md): Generates the customer-facing and auditor-facing reports, in Markdown and styled HTML, subtly Legion Code Inc.-branded.
- [audit-scoring-wasp-drone](../../plugins/website-audit-tools/agents/audit-scoring-wasp-drone.md): The rubric engine: rolls every leaf finding up through sub-audit, category, and final scores using the N/A-aware weighted formulas from the build plan, applies the critical-security-override, and populates the branded XLSX scorecard.
- [blog-content-wasp-drone](../../plugins/website-audit-tools/agents/blog-content-wasp-drone.md): Bonus, conditional audit of the 10 most recent blog posts: word count, [subjective] semantic/quality read, and AI-authorship-probability analysis reported strictly as a probability band with method and error rate, never a verdict.
- [content-semantics-wasp-drone](../../plugins/website-audit-tools/agents/content-semantics-wasp-drone.md): Subjective copy interpretation for the crawled content set: a quantified reading-level estimate per page plus a `[subjective]`-labelled ICP-relevancy score.
- [ecommerce-catalog-wasp-drone](../../plugins/website-audit-tools/agents/ecommerce-catalog-wasp-drone.md): Bonus, conditional audit of up to 25 products across categories: metadata completeness (quantified, schema.org Product field checks by Google surface) and on-page copy/conversion-potential quality ([subjective]).
- [icp-positioning-wasp-drone](../../plugins/website-audit-tools/agents/icp-positioning-wasp-drone.md): Determines the audited site's niche, ICP, and conversion-action taxonomy, and owns this run's one hard stop: if the site's focus can't be determined, the run halts and asks rather than guessing.
- [internal-linking-wasp-drone](../../plugins/website-audit-tools/agents/internal-linking-wasp-drone.md): Internal link-graph analysis across the crawled page set: orphan pages, click-depth outliers (BFS from defined entry points), anchor-text quality and cannibalization, internal-PageRank-style link-equity flow.
- [keyword-intelligence-wasp-drone](../../plugins/website-audit-tools/agents/keyword-intelligence-wasp-drone.md): Compiles 75-100 keywords and 25-50 customer questions using a strict four-tier source priority: Google Search Console MCP (if connected and has data) before a customer-supplied Google Trends export, before EXA/Firecrawl inference, before a paid keyword API as last resort.
- [performance-cwv-wasp-drone](../../plugins/website-audit-tools/agents/performance-cwv-wasp-drone.md): CDN/caching strategy and Core Web Vitals audit for an external site the customer does not necessarily control the infrastructure of, from the outside.
- [site-crawler-wasp-drone](../../plugins/website-audit-tools/agents/site-crawler-wasp-drone.md): Platform-aware crawl to a depth of 100 pages, storing raw HTML and Markdown per page under `site-data/`, which every Wave-5 Drone then reads read-only.
- [social-presence-wasp-drone](../../plugins/website-audit-tools/agents/social-presence-wasp-drone.md): Facebook, LinkedIn, and Instagram presence audit using the harness's own browser tooling, explicitly prompting the user to authenticate per platform if deeper data is wanted, defaulting to a silent no-op (never a score penalty) when declined or unavailable.
- [stack-fingerprint-wasp-drone](../../plugins/website-audit-tools/agents/stack-fingerprint-wasp-drone.md): Fingerprints the audited site's technology stack (React+Vite, Next.js, SvelteKit, WordPress, Shopify, or Magento) and render mode (SSR/CSR/hybrid) from the landing page alone.
- [technical-seo-wasp-drone](../../plugins/website-audit-tools/agents/technical-seo-wasp-drone.md): 100-page-depth SEO audit: technical structure (title/meta/canonical/robots/sitemap/structured-data), keyword-frequency analysis against `content-targets/keywords.md`, long-tail semantic analysis against `content-targets/questions.md`, and deep-linking findings cross-linked with internal-linking-stinger.
- [vendor-inventory-wasp-drone](../../plugins/website-audit-tools/agents/vendor-inventory-wasp-drone.md): Full third-party vendor census of the audited landing page after a real headless-browser load, including anything Google Tag Manager injects at runtime and content-injection/metadata-manipulation tools such as Search Atlas.
- [visual-funnel-wasp-drone](../../plugins/website-audit-tools/agents/visual-funnel-wasp-drone.md): 25-page-depth visual customer-funnel audit using real desktop (1440x900) and mobile (390x844, real mobile UA) Chrome sessions.
- [web-security-posture-wasp-drone](../../plugins/website-audit-tools/agents/web-security-posture-wasp-drone.md): External, passive security-posture audit of a third-party site: headers, TLS coarse-check, cookies, CSP, platform exposure, client-side injection surface, and payment-path integrity at an observational level only, the highest-weighted category (20%) in the final score.

### Commands

- `/website-audit-tools:perform-website-audit` ([procedure](../../plugins/website-audit-tools/commands/perform-website-audit.md)): Run a full Website Auditor by Legion Code Inc. engagement end to end: intake through scored, branded reports, dispatching the 20 Drone/Stinger pairs in dependency order.

Use the named skill or generated command wrapper where the host does not expose this Claude Code command. Source-authoring commands require the writable source checkout.

### Command wrappers

These are derived adapters for the source commands, not additional canonical skills. A wrapper does not grant a host missing tools or authority.

- [source-command-perform-website-audit](../../plugins/website-audit-tools/skills/source-command-perform-website-audit/SKILL.md): reads the [perform-website-audit procedure](../../plugins/website-audit-tools/commands/perform-website-audit.md) using the installed command wrapper selector.
