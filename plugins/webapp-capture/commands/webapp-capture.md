---
description: Capture a live web app. Demo video and script; component library with design tokens, a Claude Design handoff zip, and a shadcn/ui map; UI inconsistency audit. By Legion Code Inc.
argument-hint: "[demo | screenshots | library | audit | shadcn | all | doctor] [app URL] [notes]"
---

# /webapp-capture

Orchestrator instructions for capturing a running, authenticated web application. Designed and built by Legion Code Inc.

You are the orchestrator. You own the conversation with the user, every decision that needs their approval, and every fan-out of subagents. Scripts do the deterministic work; subagents do the judgment work; you verify both before anything is reported as done.

Arguments: `$ARGUMENTS`

## 0. Non-negotiable guardrails

Read these before anything else and hold them for the whole run.

1. **Never handle credentials.** Never type, paste, script, print, or store passwords, tokens, API keys, or MFA codes. A human logs in through `save-session.mjs` in a visible browser window.
2. **Ordinary crawls never change the app.** They only navigate same-origin routes, scroll, and click tabs that pass the tab filter. The sole setup exception is an onboarding plan for a local or seeded environment whose exact actions the user explicitly approved. It runs once before browser shards, screenshots every step before acting, and retains the built-in secret-field and destructive-click blocks. Demo interactions likewise require an approved plan.
3. **Prefer non-production.** Recommend local, staging, or a seeded demo account. If the user chooses production, say plainly that screenshots will contain real data, and configure masks.
4. **Keep secrets out of artifacts.** Text passes `redact.patterns`; sensitive screen regions go in `redact.maskSelectors`. Review sample screenshots before reporting.
5. **Never commit capture secrets or bulk raw data.** Session files are always gitignored. Raw capture data (`_raw/`, crops) is committed only if the user asks.
6. **Stay in your lane.** Do not modify or delete files you did not create in this run, including other agents' in-progress work. Surface conflicts to the user.
7. **No silent caps.** If coverage is limited (routes skipped, pages truncated, batches failed), say so in the report.

## 1. Load the skill

1. If `pest-controller-suit` is installed (The Wasp Nest), load it first and follow its routing for this request.
2. Load the capture skill with the Skill tool: `webapp-capture:webapp-capture-stinger` (or `webapp-capture-stinger` if installed standalone). If the Skill tool cannot load it, find its `SKILL.md` with Glob (search `~/.claude/plugins/` and the project's `.claude/` for `**/webapp-capture-stinger/SKILL.md`) and Read it.
3. Set `SKILL_DIR` to the folder containing that `SKILL.md`. Use absolute paths in every command from here on.
4. Read `SKILL_DIR/guides/00-foundation.md` in full before continuing, and the route guide before starting that route.

## 2. Parse the request

Read `$ARGUMENTS`:

| First word | Route |
| --- | --- |
| `demo` | Demo video, key screenshots, captions, narration script (guide 01) |
| `screenshots` | Route-by-route scrolling screenshot set, tabs included (guide 01, screenshot set) |
| `library` | Full component library with ledger and candidate design tokens (guide 02) |
| `audit` | Visual and code inconsistency audit (guide 03) |
| `shadcn` | Map every captured component, variant, and theme token onto shadcn/ui (guide 04); builds the library first if it does not exist |
| `all` | library, then audit, then shadcn, then demo, then the Claude Design handoff |
| `doctor` | Environment and config check only |
| missing | Ask the user which route they want |

A URL in the arguments is the app origin. Anything else is notes for intake.

## 3. Intake (one batched question round)

Ask everything you cannot infer, in a single AskUserQuestion call where possible. Do not start work on guesses.

- **App origin** and **environment** (local, staging, seeded account, or production).
- **Theme(s)** to capture (light, dark, both as separate runs) and how the app switches theme (system preference, class on `<html>`, stored preference).
- **Route discovery**: every link in the main navigation (default) or an explicit route list.
- **Output location** in the current repository. Defaults: `library/design/` for library and demo, `library/requirements/reports/` for audits.
- **Sensitive regions** to mask (customer names, emails, keys, billing).
- **Onboarding setup**, when the local or seeded app is empty: the exact fields, values, and buttons required. Show the complete action plan and get explicit approval before setting `onboarding.approved: true`. Never run onboarding against production.
- Route specifics:
  - demo: audience, goal, target length (60 to 90 seconds by default), must-show flows, narration wanted (text only, or synthesized audio with the user's own TTS key).
  - audit: path to the app's source code, if available.
  - library: whether to pilot on a few pages first (recommended for new apps).
  - shadcn: React shadcn/ui (default) or shadcn-svelte, and whether the target app already uses shadcn/ui.

## 4. Set up (verify, do not assume)

1. **Dependencies.** If `SKILL_DIR/scripts/node_modules` is missing, run `npm install` in `SKILL_DIR/scripts`. If `doctor.mjs` later reports no Chromium, run `npx playwright install chromium` in the same folder.
2. **Config.** Copy `SKILL_DIR/scripts/capture.config.example.json` to `<output>/capture.config.json` in the target repo and fill it from intake. Set `auth.storageState` to a path inside a gitignored folder (for example `.capture/auth.json`).
   If approved onboarding is required, set `onboarding.environment` to `local` or `seeded`, set both `onboarding.enabled` and `onboarding.approved` to `true`, encode only the approved actions, and keep the built-in denylist active. The scripts refuse any other environment. `parallel.mjs` runs this preflight once before screenshot or inventory shards.
3. **Gitignore.** Add the session file, its `.session.json` sidecar, and the capture folder's `_raw/` (unless the user wants raw data committed) to the repo's `.gitignore`. Show the user the lines you added.
4. **Doctor.** Run `CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/doctor.mjs --route <route>`. Fix every ERROR it reports, rerun until it prints `Ready.`, and apply its recommended shard count to `browser.shards`.

## 5. Session

1. Tell the user a browser window will open and they need to log in there, including MFA or SSO.
2. Run `CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/save-session.mjs` in the background and wait for it to finish. Do not poll the page or interact with it.
3. Read its output: cookie counts, earliest expiry, session-only warning, gitignore warning. Relay anything that needs action.
4. Rerun `doctor.mjs`; the session checks must pass.

## 6. Dry run (always, before any full run)

1. Pick 3 or 4 representative routes: a dashboard, a list or table page, a settings page, a page with tabs.
2. Run `ROUTES=/a,/b,/c CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/screenshots.mjs`.
3. Look at several screenshots with Read. Check: logged in, correct theme, masks cover sensitive regions, no half-rendered states.
4. Inspect the manifest for tab states. Any "tab" that is really a setting picker, theme switch, date range, or filter goes into `tabs.noTabsOnRoutes` or `tabs.notATabLabel`.
5. If any settings page was touched, reload it and confirm nothing changed. If something did change, stop, tell the user exactly what, and help restore it before continuing.
6. Show the user 2 or 3 screenshots and a one-paragraph summary, and get a go-ahead for the full run.

## 7. Run the route

Browser stages run through `SKILL_DIR/scripts/parallel.mjs`, which caps shards by available memory and fails loudly. Delegating long script stages to the `webapp-capture-wasp-drone` agent (installed by this plugin as `webapp-capture:webapp-capture-wasp-drone`) keeps your context small; subagents cannot spawn subagents, so you always own the describe and merge fan-out.

### screenshots

1. `CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/parallel.mjs screenshots.mjs`
2. Merge the ordered shard manifests with `CAPTURE_MANIFESTS=<manifest-0.tsv,manifest-1.tsv,...> CAPTURE_FINAL_MANIFEST=<screenshots>/manifest-final.tsv node SKILL_DIR/scripts/merge-screenshot-manifests.mjs`. Successful retry manifests go last so they supersede earlier failures.
3. The merge must exit 0. Verify every discovered route has files and no final row is truncated or starts with `error:`. Rerun failed routes with `ROUTES=` and merge the retry manifests last.

### library (follow guide 02 exactly)

1. **Extract:** `node SKILL_DIR/scripts/parallel.mjs inventory/extract.mjs`. Verify every route has at least one state JSON in `<output>/_raw/`.
2. **Group and tokens:** run `inventory/cluster.mjs`, `inventory/tokens.mjs`, `inventory/tokens-dtcg.mjs`, then `inventory/sheets.mjs` with `BATCH=10`, using the env variables documented in `SKILL_DIR/references/REFERENCE.md`.
3. **Prepare describe:** `inventory/prepare-describe.mjs` prints the batch list and the exact per-agent prompt.
4. **Pilot describe:** dispatch 2 batches first. Use Sonnet (Haiku skipped images and wrote generic output in testing). Read their `desc-NN.json` next to the matching sheet images. If quality is poor, fix the cause (context, batch size, instructions) before continuing.
5. **Full describe:** dispatch the remaining batches with the printed prompt, one Sonnet agent per batch, never more than `ai.maxConcurrentAgents` at once. When there are more batches than that, use the Workflow tool with a pipeline over the batch list; otherwise launch waves with the Agent tool as slots free up.
6. **Prepare merge:** `inventory/prepare-merge.mjs`. If it exits 1, rerun only the batches it lists (`prepare-describe.mjs --pending`) and repeat.
7. **Merge:** follow the plan it prints. Single mode: one Sonnet merge agent. Sharded mode: one Sonnet agent per shard in parallel, wait for all, then one reconcile agent.
8. **Validate:** `inventory/validate-merge.mjs`. It must exit 0. Use `--fix` only for dangling related names, and tell the user what it changed.
9. **Build:** `inventory/build.mjs` with `SOURCE="<app> <origin> (<theme>)"`.
10. **Spot check:** open 3 random `components/<name>/component.md` files and their screenshots. The measured table must match the image.
11. **Claude Design handoff:** run the handoff step below.

### audit (follow guide 03)

1. Reuse fresh `_raw/` data from a library run, or run extract, cluster, and tokens only (no AI cost).
2. `audit/audit-visual.mjs` into `library/requirements/reports/<date>-visual-audit`.
3. If source is available: `audit/audit-code.mjs` with `SRC=<repo>`.
4. Connect every medium or higher visual finding to source (grep values and variables), so findings carry both evidence and a file and line.
5. Contrast: recommend running axe-core's `color-contrast` rule in the same session; do not compute contrast from captured styles.
6. Write `library/requirements/reports/<date>-ui-inconsistency-report.md` in the structure guide 03 defines.
7. If a component library exists, run the Claude Design handoff step so the zip carries these findings.

### shadcn (follow guide 04)

1. If `<output>/ledger.json` does not exist, run the library route first.
2. `inventory/shadcn-prepare.mjs` prints the batch list, the per-agent map prompt, and the theme prompt.
3. Dispatch one Sonnet agent per batch and one Sonnet theme agent, in parallel (Workflow tool when the count exceeds `ai.maxConcurrentAgents`).
4. `inventory/shadcn-build.mjs`. If it exits 1, rerun only the batches it lists (`shadcn-prepare.mjs --pending`) and build again.
5. Read `shadcn/SHADCN-MAP.md` and check three `compose` or `custom` entries against their component screenshots.
6. Run the Claude Design handoff step so the zip includes the `shadcn/` folder.
7. Tell the user the install command at the top of `SHADCN-MAP.md` and that `globals.css` must be merged, not copied over an existing file. Implementing the map in their app is a separate, gated code change.

### demo (follow guide 01)

1. Draft the narration script (hook, aha moment, walkthrough, social proof, call to action; about 140 words per minute) and a plan JSON from `scripts/demo/demo-plan.example.json`.
2. Show both to the user. Only after explicit approval, set `"approved": true` in the plan. Never set it yourself on assumption.
3. `PLAN=<plan> CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/demo/record-demo.mjs`. It refuses unapproved plans and destructive or secret-looking targets.
4. Run `make-video.sh` in the demo folder (ffmpeg required). Confirm `demo.mp4` exists and has a video and a subtitle stream (`ffprobe`).
5. Read the key screenshots. Check for sensitive data.
6. Narration audio only with the user's own TTS key from their secret manager; never ask them to paste a key into chat.

### all

Run library, then audit (reusing library data), then shadcn, then demo, then the Claude Design handoff. Report after each so the user can stop early.

### Claude Design handoff (closing step of library, audit, shadcn, and all)

1. `CAPTURE_CONFIG=<config> node SKILL_DIR/scripts/inventory/design-handoff.mjs`
2. It prints the zip path and size. Confirm the zip contains `CLAUDE-DESIGN-INSTRUCTIONS.md`, `ledger.json`, `components/`, `tokens/`, `pages/`, and `audit/` (and `shadcn/` when mapped): `unzip -l <zip> | head -40`.
3. Read the generated `CLAUDE-DESIGN-INSTRUCTIONS.md` once to check the app name, theme, counts, and top inconsistencies are right.
4. Deliver the zip: give the user its path, send the file if your environment has a file-sending tool, and tell them how to use it: upload the zip to Claude Design and send "Read CLAUDE-DESIGN-INSTRUCTIONS.md and follow it."
5. Over 200 MB: rerun with `SHOTS_PER_COMPONENT=2`.

## 8. Watchdogs

- Run long stages in the background and wait for completion notifications instead of polling.
- A shard or agent with no output progress for 15 minutes is stalled: stop it, rerun only its routes (`ROUTES=`) or batches (`prepare-describe.mjs --pending`), and note it in the report.
- A `session expired` error stops the stage: have the user rerun `save-session.mjs`, then resume from the failed routes.
- Two consecutive failures of the same stage: stop and ask the user rather than looping.

## 9. Verify before reporting

- [ ] Every discovered route and real tab has output; any gaps are listed with the reason.
- [ ] Library: every group described once and assigned once (`prepare-merge.mjs` and `validate-merge.mjs` exit 0).
- [ ] shadcn: `shadcn-build.mjs` exited 0 and every component is mapped.
- [ ] Claude Design zip delivered, with its path and upload instruction in the final message.
- [ ] Spot checks passed against screenshots.
- [ ] No secrets in `code.html`, JSON, or screenshots (sample at least 10 files, including a settings page).
- [ ] No app settings changed (dry-run check done).
- [ ] Session files are gitignored and nothing sensitive is staged (`git status`).
- [ ] Blind spots recorded: closed shadow roots, cross-origin iframes, interaction-only UI, canvas.

## 10. Report

Write a capture report to the repository's `library/` directory following its documentation conventions (Library Schema v2 routine reports go in `library/requirements/reports/`). Include: route, app and environment, routes and states covered, outputs and locations (including the Claude Design zip and `SHADCN-MAP.md` when produced), counts, blind spots, environment changes, verification performed, and recommended next steps.

Then give the user a short summary with links to the key outputs.

## 11. Ship Gate

Before anything from this run is committed:

1. If `security-stinger`, `quality-stinger`, and `github-repo-health-stinger` are installed, run them in that order, writing a report to `library/` after each, resolving medium and above findings, and re-evaluating before moving on. `github-repo-health-stinger` runs at orchestrator level.
2. If they are not installed, run equivalent passes yourself: security (secrets, session files, redaction and masks, any generated code), quality (the route guide's "Done when" list), repository hygiene (gitignore, staged size, no raw data unless requested).
3. Show the user the reports and a summary, and commit or push only after they approve.

---

Designed and built by Legion Code Inc. (https://www.legioncodeinc.com). Licensed under AGPL-3.0-or-later.
