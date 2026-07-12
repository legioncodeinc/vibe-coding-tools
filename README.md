<div align="center">

<a href="https://www.ospry.ai">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-white-1024.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-ink-1024.png">
    <img alt="OSPRY" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-ink-1024.png" width="300">
  </picture>
</a>

<sub>Want to know what will actually drive more revenue? **[OSPRY](https://www.ospry.ai)** is the insight engine built for exactly that. Check it out at [ospry.ai](https://www.ospry.ai).</sub>

</div>

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-light.svg">
  <img alt="Legion" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-light.svg" width="280">
</picture>

<br>
<br>

# That Git Life

**Get the Git life.** The planning blueprint and the cross-harness AI tooling for a dev-environment system that will keep your GitHub folder healthy, standardized, and ready to vibe.

</div>

---

That Git Life is a [Legion Code Inc.](https://www.legioncodeinc.com) project. The product remains a blueprint, while the repository also includes a small `bee-army` CLI for globally installing and updating its AI tooling across Cursor, Claude Code, and Codex. The plan is a `library/` of PRDs and knowledge docs that spec exactly what gets built. The tooling is a cross-harness army of agents and skills that do the building.

The product these plans describe will be a globally-installed npm package: a single-command installer for Windows, macOS, and Linux, an always-on local service on `http://localhost:3050`, and a React web UI that standardizes new repos, scans existing ones for drift, manages your GitHub root, and syncs skills and agents for Cursor or Claude Code. That is the destination. This repo is how we get there.

---

## What this repo is

This repo is the **planning and source of truth** for the product. Cursor (or another AI coding agent) reads the docs here and builds the product against them. The `bee-army` CLI is intentionally limited to distributing the repository's existing AI assets; it is not the planned product service or web UI.

| Where | What's in it |
|---|---|
| [`library/`](library/) | Library Schema v2 scaffold. Lifecycle folder structure (knowledge, requirements, issues, notes) with seeded READMEs. |
| [`.cursor/`](.cursor/) | Cursor agents, skills, and rules. The source of truth for the asset system. |
| [`.claude/`](.claude/) | The same agents and skills, in the structure Claude Code consumes. |
| [`.cowork/`](.cowork/) | Every skill packaged as an installable `.skill` for Claude Cowork. |
| [`scripts/bee-army.mjs`](scripts/bee-army.mjs) | Global installer and pinned cross-harness update manager for Cursor, Claude Code, and Codex. |
| `AGENTS.md` · `SKILLS.md` · `HOOKS.md` · `RULES.md` | Deep explainers for each asset type and how they work across harnesses. |
| `README.md` | This file. |
| `LICENSE.md` | License. |

The work lives in `library/`. The agents read the PRDs there and build the product against them.

---

## Global Bee Army installer

The installer treats `.cursor/` as the canonical asset source and installs one pinned upstream commit into all three CLI/IDE harnesses:

| Harness | Global destinations |
|---|---|
| Cursor | `~/.cursor/agents`, `~/.cursor/skills`, `~/.cursor/commands`, `~/.cursor/rules` |
| Claude Code | `~/.claude/agents`, `~/.claude/skills`, `~/.claude/commands` |
| Codex | `~/.codex/agents`, `~/.codex/skills/bee-army-update`, `~/.agents/skills` |

From a checkout, install the command and then preview the global changes:

```bash
npm link
bee-army check
bee-army preview
bee-army validate
bee-army install --apply
bee-army doctor
```

Later upstream changes use the same reviewed flow:

```bash
bee-army check
bee-army preview
bee-army update --apply
```

The manager records the exact upstream commit and hashes every managed file. It refuses to overwrite locally modified managed files, backs up every touched path before applying, retains the three newest backups by default, and supports `bee-army rollback --apply`. Interrupted updates are recovered from their pending backup before another update begins. It copies or translates declarative assets but never executes scripts from the upstream checkout.

This is a **global-only installation**. Running any command must not create `.codex/`, `.agents/`, or `AGENTS.md` inside the current project. Codex receives native TOML Bee definitions plus the shared Stingers each Bee must read before working. Start a fresh Codex session after installation or update so it discovers the new global assets.

Environment overrides are available for non-default layouts and tests: `CODEX_HOME`, `CLAUDE_HOME`, `CURSOR_HOME`, `AGENTS_HOME`, `BEE_ARMY_HOME`, `BEE_ARMY_STATE_ROOT`, `BEE_ARMY_UPSTREAM_URL`, `BEE_ARMY_UPSTREAM_BRANCH`, `BEE_ARMY_BACKUP_RETENTION`, `BEE_ARMY_GIT_TIMEOUT_MS`, and `BEE_ARMY_LOCK_STALE_MS`.

---

## The asset system

This repo ships a full army of AI assets that work across Cursor, Claude Code, Codex, and Claude Cowork. There are four kinds. Each has a deep-dive doc.

### Agents

Focused AI personas, one per domain, with their own instructions and guardrails. A primary orchestrator routes each request to the specialist that owns it. In this repo they are called **Bees**, and each one is paired with a skill it reads from. They live in [`.cursor/agents/`](./.cursor/agents/) and [`.claude/agents/`](./.claude/agents/).

**[Read more in AGENTS.md](./AGENTS.md)**

### Skills

Packaged, reusable expertise an agent loads on demand: instructions, guides, templates, and examples behind a `SKILL.md`. In this repo they are called **Stingers**. They are the most portable asset, working in all three harnesses, and ship for Cowork as one-click `.skill` packages.

**[Read more in SKILLS.md](./SKILLS.md)**

### Hooks

Scripts that fire automatically on session events (before or after a tool runs, on prompt submit, on session start). They make "always do X" a guarantee instead of a hope. This repo currently ships none; the doc explains the model and how to add them per harness.

**[Read more in HOOKS.md](./HOOKS.md)**

### Rules

Always-on guidance that constrains every agent at all times: house style, safety constraints, and workflow gates. This repo carries four, including a strict no-em-dashes rule and a plan-construction protocol.

**[Read more in RULES.md](./RULES.md)**

---

## Cross-harness compatibility

| Asset | Cursor | Claude Code | Codex | Claude Cowork |
|---|---|---|---|---|
| **Agents** | `.cursor/agents/*.md` | `.claude/agents/*.md` | globally generated `~/.codex/agents/*.toml` | runs on the Agent SDK; skills are the portable unit |
| **Skills** | `.cursor/skills/<name>/` | `.claude/skills/<name>/` | globally installed `~/.agents/skills/<name>/` | `.cowork/skills/<name>.skill` (one-click install) |
| **Hooks** | `.cursor/hooks.json` | `.claude/settings.json` | not used by the Bee Army | not user-configurable |
| **Rules** | `.cursor/rules/*.mdc` (installed globally by `bee-army`) | `CLAUDE.md` (reference only) | global Codex instructions (reference only) | `CLAUDE.md` + project instructions |

Skills port one-to-one across all three. Agents share a format across Cursor and Claude Code. The current `bee-army` installer installs rules only for Cursor; it does not generate `CLAUDE.md` or global Codex instructions. The Cowork skill copies have their angle brackets swapped for curly braces so they survive import (see [SKILLS.md](./SKILLS.md)).

---

## Agent and skill catalog

Every capability in the army, with its description and a direct link for each harness. Where a row shows an **Agent** and a **Skill**, the Bee is the persona and the Stinger is the arsenal it wields. Standalone skills (the factory line and orchestrators) have no paired Bee.

<details>
<summary><b>Browse all 82 capabilities</b></summary>

| Capability | What it does | Cursor | Claude Code | Cowork |
|---|---|---|---|---|
| **Adr Writing** | Architecture Decision Records specialist , authors, reviews, and governs ADRs in Nygard format (Context / Decision / Consequences / Alternatives Considered), MADR... | [Agent](./.cursor/agents/adr-writing-worker-bee.md) · [Skill](./.cursor/skills/adr-writing-stinger/) | [Agent](./.claude/agents/adr-writing-worker-bee.md) · [Skill](./.claude/skills/adr-writing-stinger/) | [Skill](./.cowork/skills/adr-writing-stinger.skill) |
| **Affiliate Referral Program** | Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate... | [Agent](./.cursor/agents/affiliate-referral-program-worker-bee.md) · [Skill](./.cursor/skills/affiliate-referral-program-stinger/) | [Agent](./.claude/agents/affiliate-referral-program-worker-bee.md) · [Skill](./.claude/skills/affiliate-referral-program-stinger/) | [Skill](./.cowork/skills/affiliate-referral-program-stinger.skill) |
| **Agile Scrum** | Scrum methodology specialist , audits whether teams are actually practising Scrum, coaches Sprint Planning / Daily Scrum / Sprint Review / Retrospective / Backlog... | [Agent](./.cursor/agents/agile-scrum-worker-bee.md) · [Skill](./.cursor/skills/agile-scrum-stinger/) | [Agent](./.claude/agents/agile-scrum-worker-bee.md) · [Skill](./.claude/skills/agile-scrum-stinger/) | [Skill](./.cowork/skills/agile-scrum-stinger.skill) |
| **Ai Coding Tools** | The vibe-coder's AI coding tool advisor , recommends, compares, and configures Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent,... | [Agent](./.cursor/agents/ai-coding-tools-worker-bee.md) · [Skill](./.cursor/skills/ai-coding-tools-stinger/) | [Agent](./.claude/agents/ai-coding-tools-worker-bee.md) · [Skill](./.claude/skills/ai-coding-tools-stinger/) | [Skill](./.cowork/skills/ai-coding-tools-stinger.skill) |
| **Ai Docs** | API documentation research notes. Stub skill, no SKILL.md yet. | [Skill](./.cursor/skills/ai-docs-stinger/) | [Skill](./.claude/skills/ai-docs-stinger/) | [Skill](./.cowork/skills/ai-docs-stinger.skill) |
| **Ai Tools Platform** | The vibe coder's AI toolbox specialist , AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Clau... | [Agent](./.cursor/agents/ai-tools-platform-worker-bee.md) · [Skill](./.cursor/skills/ai-tools-platform-stinger/) | [Agent](./.claude/agents/ai-tools-platform-worker-bee.md) · [Skill](./.claude/skills/ai-tools-platform-stinger/) | [Skill](./.cowork/skills/ai-tools-platform-stinger.skill) |
| **Alt Ads Platforms** | Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search , LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (S... | [Agent](./.cursor/agents/alt-ads-platforms-worker-bee.md) · [Skill](./.cursor/skills/alt-ads-platforms-stinger/) | [Agent](./.claude/agents/alt-ads-platforms-worker-bee.md) · [Skill](./.claude/skills/alt-ads-platforms-stinger/) | [Skill](./.cowork/skills/alt-ads-platforms-stinger.skill) |
| **Bee Creator** | Phase 3 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/bee-creator/) | [Skill](./.claude/skills/bee-creator/) | [Skill](./.cowork/skills/bee-creator.skill) |
| **Api Docs** | API documentation authority , Swagger UI / Redoc / Scalar / Mintlify / Stoplight / Bump.sh tool selection, OpenAPI spec enrichment with JSON request + response ex... | [Agent](./.cursor/agents/api-docs-worker-bee.md) · [Skill](./.cursor/skills/api-docs-stinger/) | [Agent](./.claude/agents/api-docs-worker-bee.md) · [Skill](./.claude/skills/api-docs-stinger/) | [Skill](./.cowork/skills/api-docs-stinger.skill) |
| **App Store Submission** | App store publication specialist for iOS (App Store Connect + TestFlight) and Android (Google Play Console). | [Agent](./.cursor/agents/app-store-submission-worker-bee.md) · [Skill](./.cursor/skills/app-store-submission-stinger/) | [Agent](./.claude/agents/app-store-submission-worker-bee.md) · [Skill](./.claude/skills/app-store-submission-stinger/) | [Skill](./.cowork/skills/app-store-submission-stinger.skill) |
| **Asset** | Single owner of the Universal Asset Registry , the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken,... | [Agent](./.cursor/agents/asset-worker-bee.md) · [Skill](./.cursor/skills/asset-stinger/) | [Agent](./.claude/agents/asset-worker-bee.md) · [Skill](./.claude/skills/asset-stinger/) | [Skill](./.cowork/skills/asset-stinger.skill) |
| **Auth** | End-to-end authentication implementation specialist , provider selection (Clerk / Better Auth / Auth.js / Supabase Auth / WorkOS / Stack Auth / Kinde / Stytch), G... | [Agent](./.cursor/agents/auth-worker-bee.md) · [Skill](./.cursor/skills/auth-stinger/) | [Agent](./.claude/agents/auth-worker-bee.md) · [Skill](./.claude/skills/auth-stinger/) | [Skill](./.cowork/skills/auth-stinger.skill) |
| **Blogging Content Strategy** | Editorial blogging strategy specialist , cluster + pillar topical authority architecture, post-length decisions by search intent, title + H1 + meta description cr... | [Agent](./.cursor/agents/blogging-content-strategy-worker-bee.md) · [Skill](./.cursor/skills/blogging-content-strategy-stinger/) | [Agent](./.claude/agents/blogging-content-strategy-worker-bee.md) · [Skill](./.claude/skills/blogging-content-strategy-stinger/) | [Skill](./.cowork/skills/blogging-content-strategy-stinger.skill) |
| **Branching Strategy** | Branching strategy advisor for Git-based teams. | [Agent](./.cursor/agents/branching-strategy-worker-bee.md) · [Skill](./.cursor/skills/branching-strategy-stinger/) | [Agent](./.claude/agents/branching-strategy-worker-bee.md) · [Skill](./.claude/skills/branching-strategy-stinger/) | [Skill](./.cowork/skills/branching-strategy-stinger.skill) |
| **Changelog Release Notes** | Publishes engaging public changelogs and release notes that drive user engagement. | [Agent](./.cursor/agents/changelog-release-notes-worker-bee.md) · [Skill](./.cursor/skills/changelog-release-notes-stinger/) | [Agent](./.claude/agents/changelog-release-notes-worker-bee.md) · [Skill](./.claude/skills/changelog-release-notes-stinger/) | [Skill](./.cowork/skills/changelog-release-notes-stinger.skill) |
| **Code Forensics** | Conducts forensic investigations of software-development and agency-services engagements to support fee-clawback, breach-of-contract, fraud, and gross-negligence... | [Agent](./.cursor/agents/code-forensics-worker-bee.md) · [Skill](./.cursor/skills/code-forensics-stinger/) | [Agent](./.claude/agents/code-forensics-worker-bee.md) · [Skill](./.claude/skills/code-forensics-stinger/) | [Skill](./.cowork/skills/code-forensics-stinger.skill) |
| **Code Review Pr** | Code review culture and PR lifecycle specialist. | [Agent](./.cursor/agents/code-review-pr-worker-bee.md) · [Skill](./.cursor/skills/code-review-pr-stinger/) | [Agent](./.claude/agents/code-review-pr-worker-bee.md) · [Skill](./.claude/skills/code-review-pr-stinger/) | [Skill](./.cowork/skills/code-review-pr-stinger.skill) |
| **Cold Outreach** | Outbound sales specialist for founders running cold email. | [Agent](./.cursor/agents/cold-outreach-worker-bee.md) · [Skill](./.cursor/skills/cold-outreach-stinger/) | [Agent](./.claude/agents/cold-outreach-worker-bee.md) · [Skill](./.claude/skills/cold-outreach-stinger/) | [Skill](./.cowork/skills/cold-outreach-stinger.skill) |
| **Command Center** | Phase 1 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/command-center/) | [Skill](./.claude/skills/command-center/) | [Skill](./.cowork/skills/command-center.skill) |
| **Crm Integration** | CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper. | [Agent](./.cursor/agents/crm-integration-worker-bee.md) · [Skill](./.cursor/skills/crm-integration-stinger/) | [Agent](./.claude/agents/crm-integration-worker-bee.md) · [Skill](./.claude/skills/crm-integration-stinger/) | [Skill](./.cowork/skills/crm-integration-stinger.skill) |
| **Cron Scheduling** | Scheduled-job specialist for cron expression authoring and auditing, platform-specific limits (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions schedule), di... | [Agent](./.cursor/agents/cron-scheduling-worker-bee.md) · [Skill](./.cursor/skills/cron-scheduling-stinger/) | [Agent](./.claude/agents/cron-scheduling-worker-bee.md) · [Skill](./.claude/skills/cron-scheduling-stinger/) | [Skill](./.cowork/skills/cron-scheduling-stinger.skill) |
| **Csv Xlsx Import Export** | Implements and audits the "upload your spreadsheet" feature surface for React/Next.js products. | [Agent](./.cursor/agents/csv-xlsx-import-export-worker-bee.md) · [Skill](./.cursor/skills/csv-xlsx-import-export-stinger/) | [Agent](./.claude/agents/csv-xlsx-import-export-worker-bee.md) · [Skill](./.claude/skills/csv-xlsx-import-export-stinger/) | [Skill](./.cowork/skills/csv-xlsx-import-export-stinger.skill) |
| **Cursor Ide** | Cursor IDE platform specialist , project rules (.cursorrules migration, .cursor/rules/*.mdc authoring), MCP server registration and tool authoring, @cursor/sdk AP... | [Agent](./.cursor/agents/cursor-ide-worker-bee.md) · [Skill](./.cursor/skills/cursor-ide-stinger/) | [Agent](./.claude/agents/cursor-ide-worker-bee.md) · [Skill](./.claude/skills/cursor-ide-stinger/) | [Skill](./.cowork/skills/cursor-ide-stinger.skill) |
| **Customer Support Tooling** | Support stack specialist for SaaS products. | [Agent](./.cursor/agents/customer-support-tooling-worker-bee.md) · [Skill](./.cursor/skills/customer-support-tooling-stinger/) | [Agent](./.claude/agents/customer-support-tooling-worker-bee.md) · [Skill](./.claude/skills/customer-support-tooling-stinger/) | [Skill](./.cowork/skills/customer-support-tooling-stinger.skill) |
| **Dark Mode Theming** | Audits and implements the full dark-mode theming surface for React/Next.js applications. | [Agent](./.cursor/agents/dark-mode-theming-worker-bee.md) · [Skill](./.cursor/skills/dark-mode-theming-stinger/) | [Agent](./.claude/agents/dark-mode-theming-worker-bee.md) · [Skill](./.claude/skills/dark-mode-theming-stinger/) | [Skill](./.cowork/skills/dark-mode-theming-stinger.skill) |
| **Db** | PostgreSQL data architecture specialist , schema design, indexing strategy, zero-downtime migrations, ORM choice (Drizzle / Prisma / raw SQL), and serverless DB p... | [Agent](./.cursor/agents/db-worker-bee.md) · [Skill](./.cursor/skills/db-stinger/) | [Agent](./.claude/agents/db-worker-bee.md) · [Skill](./.claude/skills/db-stinger/) | [Skill](./.cowork/skills/db-stinger.skill) |
| **Dependency Audit** | Supply-chain security specialist for open-source dependency hygiene. | [Agent](./.cursor/agents/dependency-audit-worker-bee.md) · [Skill](./.cursor/skills/dependency-audit-stinger/) | [Agent](./.claude/agents/dependency-audit-worker-bee.md) · [Skill](./.claude/skills/dependency-audit-stinger/) | [Skill](./.cowork/skills/dependency-audit-stinger.skill) |
| **Design System** | Bootstraps complete design systems from scratch for any product , master design brief, tokens CSS, utility layer CSS, per-component specs, per-screen specs, stati... | [Agent](./.cursor/agents/design-system-worker-bee.md) · [Skill](./.cursor/skills/design-system-stinger/) | [Agent](./.claude/agents/design-system-worker-bee.md) · [Skill](./.claude/skills/design-system-stinger/) | [Skill](./.cowork/skills/design-system-stinger.skill) |
| **Devops** | Container build + CI/CD pipeline specialist for Node / Next.js / TypeScript stacks , Dockerfile hygiene (multi-stage, BuildKit secrets + cache mounts, non-root, H... | [Agent](./.cursor/agents/devops-worker-bee.md) · [Skill](./.cursor/skills/devops-stinger/) | [Agent](./.claude/agents/devops-worker-bee.md) · [Skill](./.claude/skills/devops-stinger/) | [Skill](./.cowork/skills/devops-stinger.skill) |
| **Discord Bot** | Discord bot and application specialist. | [Agent](./.cursor/agents/discord-bot-worker-bee.md) · [Skill](./.cursor/skills/discord-bot-stinger/) | [Agent](./.claude/agents/discord-bot-worker-bee.md) · [Skill](./.claude/skills/discord-bot-stinger/) | [Skill](./.cowork/skills/discord-bot-stinger.skill) |
| **Discovery Research** | Continuous product discovery coach , Teresa Torres interview cadence, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interviews, assumption mapping, and... | [Agent](./.cursor/agents/discovery-research-worker-bee.md) · [Skill](./.cursor/skills/discovery-research-stinger/) | [Agent](./.claude/agents/discovery-research-worker-bee.md) · [Skill](./.claude/skills/discovery-research-stinger/) | [Skill](./.cowork/skills/discovery-research-stinger.skill) |
| **Docs Site** | Documentation-site infrastructure specialist. | [Agent](./.cursor/agents/docs-site-worker-bee.md) · [Skill](./.cursor/skills/docs-site-stinger/) | [Agent](./.claude/agents/docs-site-worker-bee.md) · [Skill](./.claude/skills/docs-site-stinger/) | [Skill](./.cowork/skills/docs-site-stinger.skill) |
| **Estimation** | Software estimation and forecasting specialist , relative-sizing frameworks (Fibonacci story points, T-shirt sizing, Planning Poker), the NoEstimates movement and... | [Agent](./.cursor/agents/estimation-worker-bee.md) · [Skill](./.cursor/skills/estimation-stinger/) | [Agent](./.claude/agents/estimation-worker-bee.md) · [Skill](./.claude/skills/estimation-stinger/) | [Skill](./.cowork/skills/estimation-stinger.skill) |
| **Font Loading** | Production-focused web font loading specialist. | [Agent](./.cursor/agents/font-loading-worker-bee.md) · [Skill](./.cursor/skills/font-loading-stinger/) | [Agent](./.claude/agents/font-loading-worker-bee.md) · [Skill](./.claude/skills/font-loading-stinger/) | [Skill](./.cowork/skills/font-loading-stinger.skill) |
| **Git** | Git mastery specialist , interactive rebase (squash, fixup, reword, autosquash), conflict resolution (rerere, mergetool, diff3), history rewriting (git filter-rep... | [Agent](./.cursor/agents/git-worker-bee.md) · [Skill](./.cursor/skills/git-stinger/) | [Agent](./.claude/agents/git-worker-bee.md) · [Skill](./.claude/skills/git-stinger/) | [Skill](./.cowork/skills/git-stinger.skill) |
| **Github Repo Health** | Repository hygiene auditor for GitHub repositories. | [Agent](./.cursor/agents/github-repo-health-worker-bee.md) · [Skill](./.cursor/skills/github-repo-health-stinger/) | [Agent](./.claude/agents/github-repo-health-worker-bee.md) · [Skill](./.claude/skills/github-repo-health-stinger/) | [Skill](./.cowork/skills/github-repo-health-stinger.skill) |
| **The Queen** | Pipeline controller and orchestration Bee for the Legion AI Tools Factory. | [Agent](./.cursor/agents/the-queen.md) · [Skill](./.cursor/skills/the-queen-stinger/) | [Agent](./.claude/agents/the-queen.md) · [Skill](./.claude/skills/the-queen-stinger/) | [Skill](./.cowork/skills/the-queen-stinger.skill) |
| **Hiring Ats** | Applicant Tracking Systems authority for recruiting-tech stacks. | [Agent](./.cursor/agents/hiring-ats-worker-bee.md) · [Skill](./.cursor/skills/hiring-ats-stinger/) | [Agent](./.claude/agents/hiring-ats-worker-bee.md) · [Skill](./.claude/skills/hiring-ats-stinger/) | [Skill](./.cowork/skills/hiring-ats-stinger.skill) |
| **Hr Payroll** | HR infrastructure and payroll decision specialist for software startups , domestic payroll platform selection (Gusto, Rippling, Justworks), international contract... | [Agent](./.cursor/agents/hr-payroll-worker-bee.md) · [Skill](./.cursor/skills/hr-payroll-stinger/) | [Agent](./.claude/agents/hr-payroll-worker-bee.md) · [Skill](./.claude/skills/hr-payroll-stinger/) | [Skill](./.cowork/skills/hr-payroll-stinger.skill) |
| **Http Rest Fundamentals** | HTTP and REST protocol authority. | [Agent](./.cursor/agents/http-rest-fundamentals-worker-bee.md) · [Skill](./.cursor/skills/http-rest-fundamentals-stinger/) | [Agent](./.claude/agents/http-rest-fundamentals-worker-bee.md) · [Skill](./.claude/skills/http-rest-fundamentals-stinger/) | [Skill](./.cowork/skills/http-rest-fundamentals-stinger.skill) |
| **Icon System** | Icon-system specialist for React/Next.js applications. | [Agent](./.cursor/agents/icon-system-worker-bee.md) · [Skill](./.cursor/skills/icon-system-stinger/) | [Agent](./.claude/agents/icon-system-worker-bee.md) · [Skill](./.claude/skills/icon-system-stinger/) | [Skill](./.cowork/skills/icon-system-stinger.skill) |
| **Image Optimization** | Image optimization specialist for React/Next.js and HTML contexts. | [Agent](./.cursor/agents/image-optimization-worker-bee.md) · [Skill](./.cursor/skills/image-optimization-stinger/) | [Agent](./.claude/agents/image-optimization-worker-bee.md) · [Skill](./.claude/skills/image-optimization-stinger/) | [Skill](./.cowork/skills/image-optimization-stinger.skill) |
| **Incorporation Startup Stack** | Company formation advisor for software startup founders. | [Agent](./.cursor/agents/incorporation-startup-stack-worker-bee.md) · [Skill](./.cursor/skills/incorporation-startup-stack-stinger/) | [Agent](./.claude/agents/incorporation-startup-stack-worker-bee.md) · [Skill](./.claude/skills/incorporation-startup-stack-stinger/) | [Skill](./.cowork/skills/incorporation-startup-stack-stinger.skill) |
| **Investor Cap Table** | Cap-table management and fundraising paperwork specialist for startup founders. | [Agent](./.cursor/agents/investor-cap-table-worker-bee.md) · [Skill](./.cursor/skills/investor-cap-table-stinger/) | [Agent](./.claude/agents/investor-cap-table-worker-bee.md) · [Skill](./.claude/skills/investor-cap-table-stinger/) | [Skill](./.cowork/skills/investor-cap-table-stinger.skill) |
| **Kanban Flow** | Kanban method specialist , WIP limit design and enforcement, flow-metric calculation (cycle time, lead time, throughput, flow efficiency), Little's Law diagnostic... | [Agent](./.cursor/agents/kanban-flow-worker-bee.md) · [Skill](./.cursor/skills/kanban-flow-stinger/) | [Agent](./.claude/agents/kanban-flow-worker-bee.md) · [Skill](./.claude/skills/kanban-flow-stinger/) | [Skill](./.cowork/skills/kanban-flow-stinger.skill) |
| **Knowledge** | Authors narrative knowledge documentation for any repository , the human-readable, technically deep domain docs under `library/knowledge/private/<domain>/`. | [Agent](./.cursor/agents/knowledge-worker-bee.md) · [Skill](./.cursor/skills/knowledge-stinger/) | [Agent](./.claude/agents/knowledge-worker-bee.md) · [Skill](./.claude/skills/knowledge-stinger/) | [Skill](./.cowork/skills/knowledge-stinger.skill) |
| **Knowledge Base Help Center** | Customer-facing knowledge base specialist , platform selection (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide), search-fir... | [Agent](./.cursor/agents/knowledge-base-help-center-worker-bee.md) · [Skill](./.cursor/skills/knowledge-base-help-center-stinger/) | [Agent](./.claude/agents/knowledge-base-help-center-worker-bee.md) · [Skill](./.claude/skills/knowledge-base-help-center-stinger/) | [Skill](./.cowork/skills/knowledge-base-help-center-stinger.skill) |
| **Legal Docs** | SaaS legal documentation specialist for Terms of Service, Privacy Policy, DPA, MSA, and Cookie Notice. | [Agent](./.cursor/agents/legal-docs-worker-bee.md) · [Skill](./.cursor/skills/legal-docs-stinger/) | [Agent](./.claude/agents/legal-docs-worker-bee.md) · [Skill](./.claude/skills/legal-docs-stinger/) | [Skill](./.cowork/skills/legal-docs-stinger.skill) |
| **Library** | Owns the full documentation lifecycle for any repository , scaffolds the canonical `library/` folder on first run, ingests GitHub issues into IRDs, generates feat... | [Agent](./.cursor/agents/library-worker-bee.md) · [Skill](./.cursor/skills/library-stinger/) | [Agent](./.claude/agents/library-worker-bee.md) · [Skill](./.claude/skills/library-stinger/) | [Skill](./.cowork/skills/library-stinger.skill) |
| **Lighthouse Pagespeed** | Lighthouse + PageSpeed Insights specialist , running audits locally vs in CI (LHCI 0.15.x / GitHub Actions), interpreting all four audit categories (Performance,... | [Agent](./.cursor/agents/lighthouse-pagespeed-worker-bee.md) · [Skill](./.cursor/skills/lighthouse-pagespeed-stinger/) | [Agent](./.claude/agents/lighthouse-pagespeed-worker-bee.md) · [Skill](./.claude/skills/lighthouse-pagespeed-stinger/) | [Skill](./.cowork/skills/lighthouse-pagespeed-stinger.skill) |
| **Live Chat Support** | Customer support surface specialist , Intercom, Crisp, Plain, Pylon, Help Scout , widget integration, HMAC/JWT identity verification, conversation routing, AI def... | [Agent](./.cursor/agents/live-chat-support-worker-bee.md) · [Skill](./.cursor/skills/live-chat-support-stinger/) | [Agent](./.claude/agents/live-chat-support-worker-bee.md) · [Skill](./.claude/skills/live-chat-support-stinger/) | [Skill](./.cowork/skills/live-chat-support-stinger.skill) |
| **Markdown Mdx Content Pipeline** | Markdown/MDX content processing specialist. | [Agent](./.cursor/agents/markdown-mdx-content-pipeline-worker-bee.md) · [Skill](./.cursor/skills/markdown-mdx-content-pipeline-stinger/) | [Agent](./.claude/agents/markdown-mdx-content-pipeline-worker-bee.md) · [Skill](./.claude/skills/markdown-mdx-content-pipeline-stinger/) | [Skill](./.cowork/skills/markdown-mdx-content-pipeline-stinger.skill) |
| **Mind** | Cognitive-layer specialist for the deploying product , coach/agent routing, prompt cascade, RAG / GraphRAG, three-tier memory, observability, evaluation, multimod... | [Agent](./.cursor/agents/mind-worker-bee.md) · [Skill](./.cursor/skills/mind-stinger/) | [Agent](./.claude/agents/mind-worker-bee.md) · [Skill](./.claude/skills/mind-stinger/) | [Skill](./.cowork/skills/mind-stinger.skill) |
| **Modal Toast Dialog** | Accessible overlay specialist for React. | [Agent](./.cursor/agents/modal-toast-dialog-worker-bee.md) · [Skill](./.cursor/skills/modal-toast-dialog-stinger/) | [Agent](./.claude/agents/modal-toast-dialog-worker-bee.md) · [Skill](./.claude/skills/modal-toast-dialog-stinger/) | [Skill](./.cowork/skills/modal-toast-dialog-stinger.skill) |
| **Newsletter Platform** | Newsletter-as-channel specialist for product builders and founders , platform selection (Beehiiv, ConvertKit/Kit, Loops, Substack, Resend Audiences, Ghost), embed... | [Agent](./.cursor/agents/newsletter-platform-worker-bee.md) · [Skill](./.cursor/skills/newsletter-platform-stinger/) | [Agent](./.claude/agents/newsletter-platform-worker-bee.md) · [Skill](./.claude/skills/newsletter-platform-stinger/) | [Skill](./.cowork/skills/newsletter-platform-stinger.skill) |
| **Okr Goal Setting** | OKR methodology specialist , writes, grades, and iterates on Objectives and Key Results. | [Agent](./.cursor/agents/okr-goal-setting-worker-bee.md) · [Skill](./.cursor/skills/okr-goal-setting-stinger/) | [Agent](./.claude/agents/okr-goal-setting-worker-bee.md) · [Skill](./.claude/skills/okr-goal-setting-stinger/) | [Skill](./.cowork/skills/okr-goal-setting-stinger.skill) |
| **Payments** | Stripe (non-Connect) integration specialist , Checkout, Payment Intents, Subscriptions, Customer Portal, Invoicing, Payment Links, and webhook processing. | [Agent](./.cursor/agents/payments-worker-bee.md) · [Skill](./.cursor/skills/payments-stinger/) | [Agent](./.claude/agents/payments-worker-bee.md) · [Skill](./.claude/skills/payments-stinger/) | [Skill](./.cowork/skills/payments-stinger.skill) |
| **Preact** | Preact 11 specialist , signals API (v2 with createModel/useModel/action), preact/compat migration from React (alias setup, known gaps, compat blockers), third-par... | [Agent](./.cursor/agents/preact-worker-bee.md) · [Skill](./.cursor/skills/preact-stinger/) | [Agent](./.claude/agents/preact-worker-bee.md) · [Skill](./.claude/skills/preact-stinger/) | [Skill](./.cowork/skills/preact-stinger.skill) |
| **Product Feedback Roadmap** | Customer-feedback-to-roadmap loop specialist , Userback, Canny, Featurebase, Productboard, Frill, Productlane , in-app-widget vs portal vs voting-board taxonomy,... | [Agent](./.cursor/agents/product-feedback-roadmap-worker-bee.md) · [Skill](./.cursor/skills/product-feedback-roadmap-stinger/) | [Agent](./.claude/agents/product-feedback-roadmap-worker-bee.md) · [Skill](./.claude/skills/product-feedback-roadmap-stinger/) | [Skill](./.cowork/skills/product-feedback-roadmap-stinger.skill) |
| **Product Tour Onboarding Ui** | In-app product tour and onboarding UI specialist. | [Agent](./.cursor/agents/product-tour-onboarding-ui-worker-bee.md) · [Skill](./.cursor/skills/product-tour-onboarding-ui-stinger/) | [Agent](./.claude/agents/product-tour-onboarding-ui-worker-bee.md) · [Skill](./.claude/skills/product-tour-onboarding-ui-stinger/) | [Skill](./.cowork/skills/product-tour-onboarding-ui-stinger.skill) |
| **Python** | Python architecture specialist for Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv codebases , enforces the canonical stack (Pydantic v2 at boun... | [Agent](./.cursor/agents/python-worker-bee.md) · [Skill](./.cursor/skills/python-stinger/) | [Agent](./.claude/agents/python-worker-bee.md) · [Skill](./.claude/skills/python-stinger/) | [Skill](./.cowork/skills/python-stinger.skill) |
| **Quality** | Quality-assurance reviewer that audits a completed implementation against its source plan document (a feature PRD at `library/requirements/features/feature-<###>-... | [Agent](./.cursor/agents/quality-worker-bee.md) · [Skill](./.cursor/skills/quality-stinger/) | [Agent](./.claude/agents/quality-worker-bee.md) · [Skill](./.claude/skills/quality-stinger/) | [Skill](./.cowork/skills/quality-stinger.skill) |
| **React** | React architecture specialist for React 18/19 codebases , bulletproof-react patterns, awesome-react ecosystem, React 19 idioms (Server Components, Suspense, Actio... | [Agent](./.cursor/agents/react-worker-bee.md) · [Skill](./.cursor/skills/react-stinger/) | [Agent](./.claude/agents/react-worker-bee.md) · [Skill](./.claude/skills/react-stinger/) | [Skill](./.cowork/skills/react-stinger.skill) |
| **Readme Writing** | Authors, audits, and restructures README files so they convert visitors into users. | [Agent](./.cursor/agents/readme-writing-worker-bee.md) · [Skill](./.cursor/skills/readme-writing-stinger/) | [Agent](./.claude/agents/readme-writing-worker-bee.md) · [Skill](./.claude/skills/readme-writing-stinger/) | [Skill](./.cowork/skills/readme-writing-stinger.skill) |
| **Retrospective** | Retrospective facilitator and follow-through enforcer for engineering teams. | [Agent](./.cursor/agents/retrospective-worker-bee.md) · [Skill](./.cursor/skills/retrospective-stinger/) | [Agent](./.claude/agents/retrospective-worker-bee.md) · [Skill](./.claude/skills/retrospective-stinger/) | [Skill](./.cowork/skills/retrospective-stinger.skill) |
| **Review Funnels G2** | Review collection and online-reputation specialist for SaaS products. | [Agent](./.cursor/agents/review-funnels-g2-worker-bee.md) · [Skill](./.cursor/skills/review-funnels-g2-stinger/) | [Agent](./.claude/agents/review-funnels-g2-worker-bee.md) · [Skill](./.claude/skills/review-funnels-g2-stinger/) | [Skill](./.cowork/skills/review-funnels-g2-stinger.skill) |
| **Runbook Writing** | Operational runbook authorship specialist , canonical templates (break-fix, scheduled operation, diagnostic), the no-implied-context audit protocol, exact-command... | [Agent](./.cursor/agents/runbook-writing-worker-bee.md) · [Skill](./.cursor/skills/runbook-writing-stinger/) | [Agent](./.claude/agents/runbook-writing-worker-bee.md) · [Skill](./.claude/skills/runbook-writing-stinger/) | [Skill](./.cowork/skills/runbook-writing-stinger.skill) |
| **Scripture Historian** | Phase 1.5 of the Legion AI Tools Factory pipeline. | [Agent](./.cursor/agents/scripture-historian.md) | [Agent](./.claude/agents/scripture-historian.md) | n/a |
| **Security** | Security audit and remediation specialist for React, Next.js, TypeScript, and Node.js codebases. | [Agent](./.cursor/agents/security-worker-bee.md) · [Skill](./.cursor/skills/security-stinger/) | [Agent](./.claude/agents/security-worker-bee.md) · [Skill](./.claude/skills/security-stinger/) | [Skill](./.cowork/skills/security-stinger.skill) |
| **Seo Aeo** | Next.js 14+ App Router SEO and Answer Engine Optimization specialist. | [Agent](./.cursor/agents/seo-aeo-worker-bee.md) · [Skill](./.cursor/skills/seo-aeo-stinger/) | [Agent](./.claude/agents/seo-aeo-worker-bee.md) · [Skill](./.claude/skills/seo-aeo-stinger/) | [Skill](./.cowork/skills/seo-aeo-stinger.skill) |
| **Slack App** | Slack app development specialist. | [Agent](./.cursor/agents/slack-app-worker-bee.md) · [Skill](./.cursor/skills/slack-app-stinger/) | [Agent](./.claude/agents/slack-app-worker-bee.md) · [Skill](./.claude/skills/slack-app-stinger/) | [Skill](./.cowork/skills/slack-app-stinger.skill) |
| **Social Media Marketing Organic** | Genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people). | [Agent](./.cursor/agents/social-media-marketing-organic-worker-bee.md) · [Skill](./.cursor/skills/social-media-marketing-organic-stinger/) | [Agent](./.claude/agents/social-media-marketing-organic-worker-bee.md) · [Skill](./.claude/skills/social-media-marketing-organic-stinger/) | [Skill](./.cowork/skills/social-media-marketing-organic-stinger.skill) |
| **Status Page** | Public status page specialist , platform selection (Statuspage/Atlassian, Better Stack, Instatus, Cachet OSS), component tree architecture, incident communication... | [Agent](./.cursor/agents/status-page-worker-bee.md) · [Skill](./.cursor/skills/status-page-stinger/) | [Agent](./.claude/agents/status-page-worker-bee.md) · [Skill](./.claude/skills/status-page-stinger/) | [Skill](./.cowork/skills/status-page-stinger.skill) |
| **Technical Writing Craft** | Reviews and writes technical documentation using the Diataxis framework, inverted-pyramid prose structure, code-example discipline, voice and tone consistency, an... | [Agent](./.cursor/agents/technical-writing-craft-worker-bee.md) · [Skill](./.cursor/skills/technical-writing-craft-stinger/) | [Agent](./.claude/agents/technical-writing-craft-worker-bee.md) · [Skill](./.claude/skills/technical-writing-craft-stinger/) | [Skill](./.cowork/skills/technical-writing-craft-stinger.skill) |
| **Telegram Bot** | Telegram Bot specialist , Bot API (up to 10.0, May 2026 including guest mode and managed bots), grammY v1.x (TypeScript, recommended 2026 choice over abandoned Te... | [Agent](./.cursor/agents/telegram-bot-worker-bee.md) · [Skill](./.cursor/skills/telegram-bot-stinger/) | [Agent](./.claude/agents/telegram-bot-worker-bee.md) · [Skill](./.claude/skills/telegram-bot-stinger/) | [Skill](./.cowork/skills/telegram-bot-stinger.skill) |
| **Terminal Bash** | Terminal productivity specialist for Bash/Zsh/Fish configuration, modern CLI tools (ripgrep, fd, fzf, bat, eza, zoxide), shell scripting best practices, dotfile a... | [Agent](./.cursor/agents/terminal-bash-worker-bee.md) · [Skill](./.cursor/skills/terminal-bash-stinger/) | [Agent](./.claude/agents/terminal-bash-worker-bee.md) · [Skill](./.claude/skills/terminal-bash-stinger/) | [Skill](./.cowork/skills/terminal-bash-stinger.skill) |
| **Thanos Gauntlet Glove** | End-to-end PRD execution orchestrator. | [Skill](./.cursor/skills/thanos-gauntlet-glove/) | [Skill](./.claude/skills/thanos-gauntlet-glove/) | [Skill](./.cowork/skills/thanos-gauntlet-glove.skill) |
| **Typography Font** | Typography and font-loading specialist for web products , variable fonts, Google Fonts vs Fontsource vs self-host, the FOIT/FOUT/FOFT loading story, font-display... | [Agent](./.cursor/agents/typography-font-worker-bee.md) · [Skill](./.cursor/skills/typography-font-stinger/) | [Agent](./.claude/agents/typography-font-worker-bee.md) · [Skill](./.claude/skills/typography-font-stinger/) | [Skill](./.cowork/skills/typography-font-stinger.skill) |
| **Ux Ui** | Enforces a product's design system from its source-of-truth folder (tokens, utilities, components, screens) and governs integration with shadcn/ui, Mantine, Lucid... | [Agent](./.cursor/agents/ux-ui-worker-bee.md) · [Skill](./.cursor/skills/ux-ui-stinger/) | [Agent](./.claude/agents/ux-ui-worker-bee.md) · [Skill](./.claude/skills/ux-ui-stinger/) | [Skill](./.cowork/skills/ux-ui-stinger.skill) |
| **Stinger Forge** | Phase 2 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/stinger-forge/) | [Skill](./.claude/skills/stinger-forge/) | [Skill](./.cowork/skills/stinger-forge.skill) |
| **Website** | Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end from a brief, applying a 12-phase site-template playbook (monorepo archi... | [Agent](./.cursor/agents/website-worker-bee.md) · [Skill](./.cursor/skills/website-stinger/) | [Agent](./.claude/agents/website-worker-bee.md) · [Skill](./.claude/skills/website-stinger/) | [Skill](./.cowork/skills/website-stinger.skill) |
| **Wiki** | Extracts code entities (functions, classes, modules, services, endpoints, env vars, config keys, data models, React components, SQL tables, queues, cron jobs, fea... | [Agent](./.cursor/agents/wiki-worker-bee.md) · [Skill](./.cursor/skills/wiki-stinger/) | [Agent](./.claude/agents/wiki-worker-bee.md) · [Skill](./.claude/skills/wiki-stinger/) | [Skill](./.cowork/skills/wiki-stinger.skill) |

</details>

---

## Why this repo is built on documents, not vibes

Most projects rot because the knowledge that built them lives in someone's head, a closed Slack thread, or a commit message nobody will ever read again. The code ships, the context evaporates, and six months later you are reverse-engineering your own product to make one safe change.

This repo runs on the opposite bet. Every decision, every feature, and every fix gets written down before it ships, in a place a human or an AI agent can find it. The `library/` folder is that place. Here is what goes in it and why it matters.

### What is a knowledge base?

A knowledge base is the durable memory of your codebase. It is the set of documents that explain what your system is, how it works, why it works that way, and how to operate it, written in plain language instead of buried in implementation. Code tells you *what* the machine does right now. A knowledge base tells you *why* it does that, *what* it is supposed to do, and *what* breaks if you change it.

In this repo the knowledge base lives at `library/knowledge/` and splits by audience:

- `library/knowledge/public/` holds docs meant for end-users and customers: overviews, how-to guides, FAQs.
- `library/knowledge/private/` holds everything internal: architecture docs, engineering standards, domain-specific knowledge, ADRs, and strategy. When in doubt, a doc goes here and gets promoted to public later.

A knowledge base is not documentation for documentation's sake. It is the difference between a codebase one person can change safely and a codebase a whole team, plus a fleet of AI agents, can change safely.

### Why document your codebase in the knowledge folder with domain-specific knowledge

Generic docs are worthless. "This is a React app" helps no one. The value is in the domain-specific knowledge: the rules, edge cases, and hard-won decisions that are true for *your* system and nowhere else.

Why it is worth the effort:

- **Onboarding goes from weeks to days.** A new engineer, contractor, or AI agent reads the domain docs and is productive immediately instead of pestering whoever has been here longest.
- **You stop paying the same tax twice.** Every gotcha you solve once gets written down once. Nobody rediscovers the same landmine in six months.
- **AI agents become useful instead of dangerous.** An agent with no context guesses. An agent with your domain knowledge in `library/knowledge/private/` makes the call you would have made. The knowledge base is the brief you give the machine before you let it touch your code.
- **The truth has one home.** When the data model, the auth flow, or the deploy process is documented in one canonical place, arguments end and work starts.

Domain knowledge is the moat. Write it down or watch it walk out the door every time someone leaves.

### Why document design decisions in ADRs

An ADR is an Architecture Decision Record. It is a short, dated document that captures one significant decision: the context that forced it, the decision you made, the consequences you accepted, and the alternatives you rejected. In this repo ADRs always live at `library/knowledge/private/architecture/ADR-<n>-<slug>.md`, numbered in sequence, and every one of them contains four sections: **Context, Decision, Consequences, Alternatives Considered.**

The reason ADRs matter is simple: the most expensive question in software is "why did we do it this way?" Without a record, the answer is a shrug, and a shrug gets you one of two bad outcomes. Either someone rips out a load-bearing decision because they did not understand it, or nobody dares touch anything because nobody understands any of it.

An ADR kills that problem. It freezes the reasoning at the moment you had the full picture. Later, when someone questions the choice, they do not relitigate it from zero. They read the context, see what tradeoffs were on the table, and either respect the decision or supersede it with a new ADR that says what changed. Decisions become a traceable chain instead of a pile of mysteries. You get to disagree with the past on the merits, not in the dark.

### What is a Product Requirements Document (PRD)?

A PRD is the spec for a piece of work before it gets built. It states what you are building, why it exists, what counts as done, and what it explicitly will not do. In this repo a PRD is a folder, not a single file, and it carries real structure:

```
library/requirements/backlog/prd-<###>-<slug>/
  prd-<###>-<slug>-index.md          module overview, goals, non-goals, feature list
  prd-<###><letter>-<slug>-<feature>.md   one sub-PRD per discrete feature
  qa/
    prd-<###>-<slug>-qa.md           QA report, written by quality-worker-bee
```

The index sets the module-level picture: overview, goals, non-goals, a feature table, and top-level acceptance criteria. Each sub-PRD scopes one feature with its own goals, user stories, acceptance criteria, and implementation notes. The acceptance criteria are the contract. They are checkboxes, and the work is not done until every box is checked and verified.

### Why having a PRD for everything is critical

A PRD for everything sounds like bureaucracy. It is the opposite. It is the thing that lets you move fast without breaking the wrong stuff.

- **It forces clarity before code.** Most wasted engineering is building the wrong thing precisely. Writing the PRD is where you find the holes in the idea, while changes still cost a sentence instead of a sprint.
- **It defines done.** "Done" without acceptance criteria is an opinion. With acceptance criteria it is a fact you can verify. No more shipping something that "mostly works."
- **It is the only reliable brief for an AI agent.** This is the part that makes the whole system run. An AI agent cannot read your mind, but it can read a PRD. A tight PRD with explicit acceptance criteria turns an agent from a liability into a force multiplier, because the agent has an unambiguous target and a checklist it must satisfy. No PRD means the agent guesses, and a guessing agent ships confident garbage.
- **It creates a paper trail.** Every feature traces back to a written intent. When you ask "why does this exist," there is an answer with a date on it.
- **It scales past you.** One person can hold a small project in their head. The moment a second human or a single agent joins, the head stops scaling and the document starts.

PRDs for features and modules. IRDs for issues and fixes (an Issue Resolution Document, numbered to its GitHub issue, living under `library/issues/`). Knowledge docs for how it all fits together. ADRs for the decisions that shaped it. That is the full record, and the record is what lets both humans and agents work on this codebase without fear.

### What you can expect from running the system

Follow the knowledge base, ADR, and PRD discipline and here is what you get:

- A codebase any new teammate or agent can understand without a guided tour.
- Decisions you can defend, revisit, and supersede on purpose instead of by accident.
- Features that ship against a verifiable definition of done, not a vibe.
- AI agents that build the right thing because they were handed the right brief.
- A system where the work outlives the person who did it.

The cost is writing things down. The return is a codebase that does not punish you for coming back to it.

---

## The exact processes

These are the start-to-finish workflows. Each one runs through the bundled agents and skills. You drive them with plain-language commands. The agent does the filing, naming, and numbering by the rules baked into the skills.

### Create the knowledge base from scratch

1. **Scaffold the structure.** Command library-worker-bee: `initialize library` (or "set up docs"). It runs the standardizer, which builds the full schema v2 tree and seeds every folder with a `README.md` that documents that folder's rules. Do not hand-create folders. Let the script own the structure.
2. **Confirm the scaffold is clean.** The agent verifies the standardizer reports "Already up to date" on a dry run and that the docs sync status is current. You now have `library/knowledge/{public,private}`, `library/requirements/{backlog,in-work,completed,reports}`, `library/issues/{backlog,in-work,completed}`, and `library/notes/`.
3. **Decide audience for your first doc.** Public for customers, private for the team and agents. Unsure means private. You can promote later.
4. **Pick or create a domain folder.** Inside `public/` or `private/`, choose the subdomain (`overview/`, `guides/`, `faqs/` for public; `architecture/`, `standards/`, or a domain like `ai/`, `auth/`, `data/`, `frontend/`, `security/` for private). Create the folder if it does not exist.
5. **Write the doc.** Name it lowercase kebab-case, 60 characters or fewer, `.md`. Open with the standard header (title, category, version, date, status, one-sentence description, related links). Write the domain-specific truth, not generic filler.
6. **Cross-link it.** Link the new doc from any related PRD, IRD, or knowledge doc so it is discoverable.
7. **Record decisions as ADRs.** For any significant architectural choice, command the agent to write an ADR. It lands at `library/knowledge/private/architecture/ADR-<n>-<slug>.md`, numbered max-plus-one, with Context, Decision, Consequences, and Alternatives Considered.

### Reverse-PRD your existing codebase

Use this when code already exists but no PRD was ever written for it. You are documenting what was built so the requirements record stops lying by omission.

1. **Point the agent at the code.** Command: `backwards-PRD this module` (or "retroactively document this feature"). Name the module or path.
2. **The agent scans the source.** It reads the actual implementation with Grep and Read and cites real files and line numbers. It documents what the code *does*, not what someone once hoped it would do.
3. **It assigns the next PRD number.** Same rule as a forward PRD: list every `prd-*` folder across `backlog/`, `in-work/`, and `completed/`, take the max and add one.
4. **It writes the index, marked retroactive.** The header status is "Shipped" with a "Retroactive: Yes" note. The body captures the real APIs, data models, and the key decisions that would otherwise be lost.
5. **It cross-links.** Related knowledge docs, ADRs, and any issues the scan surfaced get linked in.
6. **It files by lifecycle.** A backwards-PRD is created in `backlog/`. If the code is fully shipped and verified, the agent moves the whole folder straight to `completed/`.

Repeat module by module until your shipped code has a paper trail that matches reality.

### Generate new PRDs for features, modules, and fixes

**For a feature or module (PRD):**

1. **Command the agent:** `write a PRD for <X>` (or "plan feature X", "spec out X").
2. **The agent copies the PRD template** into `library/requirements/backlog/prd-<###>-<slug>/` and assigns `<###>` as max-plus-one across all lifecycle folders.
3. **It writes the index:** overview, goals, non-goals, the feature table, and module-level acceptance criteria.
4. **It writes one sub-PRD per discrete feature** at `prd-<###><letter>-<slug>-<feature>.md`, each scoped tight with its own acceptance criteria.
5. **It creates an empty `qa/` folder** inside the PRD folder. quality-worker-bee fills it later. The library agent owns the structure and never writes QA content itself.
6. **Lifecycle by moving folders:** backlog when planned, move the whole folder to `in-work/` when started, move it to `completed/` when shipped. Status is the folder it lives in, never just a line in the frontmatter.

**For a bug or incident (IRD):**

1. **Make sure a GitHub issue exists first.** IRD numbers equal GitHub issue numbers. Never invent one.
2. **Command the agent:** `write an IRD for issue #<N>` (or "track this bug", "document this incident").
3. **The agent creates** `library/issues/backlog/ird-<###>-<slug>/` with an index (Problem, Root Cause, Fix Plan, Acceptance Criteria, Related) and an empty `qa/` folder. One issue equals one IRD. No sub-IRDs. Keep scope tight.
4. **Lifecycle by moving folders:** backlog, then `in-work/`, then `completed/` when the fix is verified.

---

## Wielding the Thanos Gauntlet Glove

Once your PRDs and IRDs are written, the Thanos Gauntlet Glove is how you execute them. It is the orchestrator skill at [`.cursor/skills/thanos-gauntlet-glove/`](./.cursor/skills/thanos-gauntlet-glove/). You point it at a set of PRDs and it drives them to 100 percent completion: spec to merged, CI-green PR, with no partial credit allowed. You do not micromanage it. You command it and hold it to the standard.

**Invoke it** with phrases like "execute the PRDs", "run the gauntlet", "snap it", or "ship these PRDs." The agent then runs four phases:

- **Phase 0, Recon and Planning.** It reads every PRD end to end and extracts every acceptance criterion into a master checklist, the AC Ledger, saved at the repo root so it survives context loss and you can audit it. It maps dependencies, produces a wave plan that maximizes parallel work, and picks the right model for each task. It shows you the wave plan and ledger, then executes without waiting for further approval.
- **Phase 1, Execution.** It orchestrates. Sub-agents do the building, each with a tightly scoped brief: the exact criteria it owns, the files it may touch, and how its work gets verified. No partial credit. A criterion is done only when it is fully implemented, proven by passing tests, and nothing else broke. Verification is a separate pass from implementation, because implementers do not grade their own homework. A watchdog kills any stalled sub-agent and re-dispatches the work at a smaller scope.
- **Phase 2, Security and Quality Gauntlet.** Once the ledger reads fully verified, it runs security-worker-bee then quality-worker-bee, fixes anything medium severity or higher through sub-agents, and loops until both come back clean with the test suite still green.
- **Phase 3, Ship.** It commits, pushes, opens a PR whose description carries the full AC Ledger and wave plan, and then watches CI. If CI fails, it diagnoses, dispatches a fix, and watches the next run until the pipeline is fully green.

**How you command it well:**

- **Feed it tight PRDs.** The gauntlet is only as good as the acceptance criteria you wrote. Vague criteria produce vague results. This is why the PRD discipline above is not optional.
- **Define the scope, then get out of the way.** Tell it which PRDs are in play. Let it plan the waves and pick the models. That is its job.
- **Hold the line on done.** The skill is built to refuse partial completion. Do not talk it out of that. "Mostly works" is open, not done.
- **Read the ledger, not the chatter.** The AC Ledger at the repo root is the source of truth for the run. If a criterion is parked as blocked, it will come with a specific ask. Answer the ask and let it keep going.

The standard is the whole point. Every PRD, every acceptance criterion, verified, shipped, and green. Anything less is a failed run.

---

## License

Source-available. Use the skills and agents anywhere, including commercially. Do not sell them or pass them off as your own, and credit Legion Code Inc. See [`LICENSE.md`](LICENSE.md) for the full terms.

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg">
  <img alt="Legion symbol" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg" width="32">
</picture>

<sub>We are Legion. Vibe with Legion.</sub>

</div>
