# Webapp Capture

**Designed and built by [Legion Code Inc.](https://www.legioncodeinc.com)** Version 1.1.0. Licensed under AGPL-3.0-or-later.

Wasp Nest pack imported from `app-auditor-plugin-claude` at commit `8528c4a`. The donor checkout was not modified. Third-party dependencies and archived source captures retain their own rights; see [third-party notices](THIRD-PARTY-NOTICES.md).

Capture any running web app the way its users see it, then turn that capture into something people and AI agents can build on.

## Components

| Component | Name when installed | Role |
| --- | --- | --- |
| Command | `/webapp-capture` (also `/webapp-capture:webapp-capture`) | Orchestrator instructions: intake, setup, login, dry run, route execution, watchdogs, verification, report, Ship Gate |
| Skill | `webapp-capture:webapp-capture-stinger` | Guides, references, prompts, research, and scripts |
| Agent | `webapp-capture:webapp-capture-wasp-drone` | Runs script-heavy capture stages on the orchestrator's behalf |

## Usage

```text
/webapp-capture doctor
/webapp-capture screenshots http://localhost:3000
/webapp-capture demo http://localhost:3000 onboarding flow for new admins
/webapp-capture library https://staging.example.com
/webapp-capture audit http://localhost:3000
/webapp-capture shadcn http://localhost:3000
/webapp-capture all http://localhost:3000
```

Claude asks for anything it cannot infer (environment, theme, output folder, sensitive regions), opens a browser window for you to log in, runs a small dry run and shows you the result, then runs the full route.

## Outputs

| Route | Default location | Contents |
| --- | --- | --- |
| screenshots | `library/design/screenshots/<route>/` | `<route>-001.png`, `<route>__<tab>-001.png`, `manifest.tsv` |
| demo | `library/design/demo/<title>/` | `demo.mp4`, `scenes/`, `screenshots/`, `captions.vtt`, `script.md`, `plan.json`, `make-video.sh` |
| library | `library/design/` | `components/<name>/` (component.md, code.html, styles.json, assets.json, screenshots), `ledger.json`, `tokens-raw.json`, `candidate.tokens.json`, `assets/` |
| audit | `library/requirements/reports/` | dated visual audit, code audit, and a combined inconsistency report |
| shadcn | `library/design/shadcn/` | `SHADCN-MAP.md`, `shadcn-map.json`, `globals.css` |
| Claude Design handoff | `library/design/<app>-claude-design-handoff-<date>.zip` | Library, tokens, audits, pages, shadcn map, `CLAUDE-DESIGN-INSTRUCTIONS.md` |

## Safety model

Read-only crawling by default, explicitly approved local or seeded onboarding, human-only login, off-origin navigation blocking, theme guard, text redaction, screenshot masks, destructive-target and secret-field guards, and a Ship Gate before any commit. Details: `skills/webapp-capture-stinger/guides/00-foundation.md`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `doctor` reports no Chromium | `npx playwright install chromium` in `skills/webapp-capture-stinger/scripts/` |
| Every route errors with `session expired` | Rerun the login step; the app's session timed out or uses session-only cookies |
| `theme check failed` | A tab click switched the theme: add that route to `tabs.noTabsOnRoutes` |
| Screenshots show empty states | Capture a seeded or real account; empty accounts render empty states |
| Shards killed or slow | Lower `browser.shards`; each headless browser needs roughly 1 GB of memory |
| A describe batch missing | `prepare-describe.mjs --pending` lists only the batches to rerun |

Set `WEBAPP_CAPTURE_DEBUG=1` to print stack traces from any script.

## Hive integration

When The Wasp Nest's skills are installed (`pest-controller-suit`, `security-stinger`, `quality-stinger`, `github-repo-health-stinger`, `design-system-stinger`, `impeccable-stinger`), the command routes through them and hands work off to them. Without them, the plugin runs self-contained and performs equivalent review passes itself.

---

© 2026 Legion Code Inc. · [legioncodeinc.com](https://www.legioncodeinc.com)
