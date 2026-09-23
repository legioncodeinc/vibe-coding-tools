# webapp-capture-stinger reference

Field tables, script map, and output contracts. Load when running any script, editing the config, or checking what a route produces. Procedures live in `guides/`; claims about Playwright, color math, and tooling trace to `research/distilled-webapp-capture.md`.

## Requirements

| Need | Install | Used by |
|---|---|---|
| Node 20.9 or newer | system | all scripts (ES modules and Sharp 0.35) |
| playwright-core, sharp | `npm install` inside `scripts/` (its `package.json` pins both) | browser scripts; sharp for component sheets |
| Chromium | `npx playwright install chromium` inside `scripts/`, or set `browser.executablePath` | browser scripts |
| ffmpeg | system package | demo/make-video.sh |

Run `node scripts/doctor.mjs` first. It verifies all of the above plus the config and session, and prints the exact fix for each problem.

## Config: `capture.config.json`

Start from `scripts/capture.config.example.json`. Relative paths resolve against the config file's folder.

| Key | Type | Meaning |
|---|---|---|
| `app.name` | string | Display name, substituted into prompts |
| `app.origin` | URL | Only this origin is navigable; off-origin navigations are aborted |
| `app.context` | string | One sentence on what the app is and who uses it; feeds describe and merge prompts |
| `app.loginPath` | path | Landing here during capture means the session expired; capture stops |
| `auth.storageState` | path | Saved cookies and localStorage from `save-session.mjs` (plus a `.session.json` sidecar for sessionStorage); owner-only permissions; never commit |
| `onboarding.enabled/approved` | boolean | Both must be true after explicit user approval; runs once before screenshot or inventory shards |
| `onboarding.environment` | local, seeded | Required when onboarding is enabled; any other value is refused |
| `onboarding.denyPattern` | regex string | Adds app-specific blocked click labels; the built-in destructive-action denylist always remains active |
| `onboarding.outputSubdir` | relative path | Screenshot folder under `output.screenshots`; parent traversal and absolute paths are rejected |
| `browser.viewport` | {width,height} | CSS pixels. 1600x1013 matches a 14 to 16 inch laptop browser |
| `browser.deviceScaleFactor` | number | 2 for Retina, 3 for extra-sharp reference captures |
| `browser.colorScheme` | light, dark, no-preference | Emulated `prefers-color-scheme` |
| `browser.reducedMotion` | reduce, no-preference | `reduce` stabilizes animated UIs |
| `browser.shards` | number | Parallel headless browsers. Budget roughly 0.5 to 1 GB RAM each at 3x |
| `theme.localStorage.key/value` | string | Force an app-stored theme before any page script runs |
| `theme.verify.htmlClassIncludes` | string | Capture refuses to shoot if `<html>` lacks this class |
| `routes.discover` | nav-links, crawl-links, list | nav-links reads `startPath`; crawl-links recursively follows same-origin anchors |
| `routes.maxRoutes` | number | Route cap for recursive `crawl-links` discovery |
| `routes.includePattern` | regex string | Optional pathname allowlist for recursive discovery |
| `routes.exclude` | path[] | Never visited (logout, docs that open new tabs, destructive pages) |
| `routes.maxShots` | number | Scroll-capture cap per page state |
| `tabs.selector` | CSS | Default `[role="tab"]` |
| `tabs.noTabsOnRoutes` | path[] | Routes whose tab-looking controls change settings or only filter |
| `tabs.noTabsOnRoutePattern` | regex string | Optional route-family exclusion for tab-like controls that are not views |
| `tabs.notATabLabel` | regex | Labels that are pickers or filters (themes, date ranges) |
| `icons.classPattern` | regex | Icon-font elements, e.g. `material-(symbols|icons)` |
| `redact.patterns` | regex[] | Applied to captured text and HTML before anything is written |
| `redact.maskSelectors` | CSS[] | Regions painted over (Playwright `mask`) in every screenshot and crop |
| `redact.maskColor` | color | Mask fill, default `#000000` (opaque) |
| `output.*` | path | screenshots, inventory, demo, audit destinations |
| `ai.describeBatchSize` | number | Groups per describe agent. 10 keeps agents from skipping images |
| `ai.maxConcurrentAgents` | number | Stay under the harness subagent cap (a cap of 20 was observed in Claude Code) |

`routes.discover` also accepts `crawl-links`, which recursively follows
same-origin anchors. Optional `onboarding` config can declare an approved setup
plan using `waitFor` targets and `fill`, `click`, `wait`, or `waitFor` actions.
The preflight refuses password, secret, token, and API-key fields or values and records a
screenshot before every step. Set `onboarding.skipWhenApiHasItems` to a
same-origin JSON array endpoint when an existing seeded account should make the
preflight idempotently skip.

## Script map

| Script | Route | Input | Output |
|---|---|---|---|
| `doctor.mjs` | all | config (optional), `--route screenshots\|demo\|library\|audit` | Readiness report with fixes; exit 1 on blocking problems |
| `save-session.mjs` | all | config | `auth.storageState` plus `.session.json` sidecar after a human logs in |
| `parallel.mjs` | all | config, `<script> --shards N` | Runs approved onboarding once, then a browser script across N headless browsers capped by memory and CPUs; exit 1 if any shard fails |
| `lib/common.mjs` | all | | config validation, browser launch, session restore, masks, route discovery, tab listing, naming, timeouts |
| `screenshots.mjs` | 1 | config | `<screenshots>/<route>/<route>-001.png`, `<route>__<tab>-001.png`, `manifest.tsv` |
| `merge-screenshot-manifests.mjs` | 1 | ordered `CAPTURE_MANIFESTS`, optional `CAPTURE_IGNORE_STATE_PATTERN` | Final state ledger where successful retries supersede earlier errors or truncations |
| `demo/record-demo.mjs` | 1 | config + approved plan JSON | `scenes/*.webm`, `screenshots/*.png`, `captions.vtt`, `script.md`, `make-video.sh` |
| `inventory/extract.mjs` | 2, 3 | config | `_raw/<state>.json` (candidates, stats, CSS vars), `_raw/crops/*.png` |
| `inventory/cluster.mjs` | 2, 3 | `RAW` | `_raw/groups.json` (exact signatures merged into fuzzy groups) |
| `inventory/tokens.mjs` | 2, 3 | `RAW`, `DEST` | `tokens-raw.json` (observed values by frequency, CSS variables) |
| `inventory/tokens-dtcg.mjs` | 2, 3 | `SRC`, `DEST`, `MIN_USES` | `candidate.tokens.json` in DTCG 2025.10 shape |
| `inventory/sheets.mjs` | 2 | `RAW`, `BATCH` | `_raw/ai/sheets/<gid>.webp`, `_raw/ai/batch-NN.json` |
| `inventory/prepare-describe.mjs` | 2 | config, `--pending` | `_raw/ai/INSTRUCTIONS.md`, dispatch plan (JSON on stdout) |
| `inventory/prepare-merge.mjs` | 2 | config, `SHARD_ABOVE` | `descriptions.json`, `merge-input*.json`, `MERGE-INSTRUCTIONS.md`, `RECONCILE-INSTRUCTIONS.md` when sharded, dispatch plan; exit 1 with batches to rerun |
| `inventory/validate-merge.mjs` | 2 | `RAW`, `--fix` | Assignment, naming, and related-link report; exit 1 on errors |
| `inventory/build.mjs` | 2 | `RAW`, `DEST` | `components/<name>/`, `ledger.json`, `assets/`, copied `tokens-raw.json` |
| `inventory/shadcn-prepare.mjs` | 4 | config, `BATCH`, `--pending` | `shadcn/batches/batch-NN.json`, `MAP-INSTRUCTIONS.md`, `THEME-INSTRUCTIONS.md`, dispatch plan |
| `inventory/shadcn-build.mjs` | 4 | config, `--allow-missing-theme` | `shadcn/shadcn-map.json`, `SHADCN-MAP.md`, `globals.css`; exit 1 with batches to rerun |
| `inventory/design-handoff.mjs` | 2, 3, 4 | config, `OUT`, `SHOTS_PER_COMPONENT`, `KEEP_PNG`, `SCREENSHOTS`, optional `HANDOFF_FILES` | `<app>-claude-design-handoff-<date>.zip` with `CLAUDE-DESIGN-INSTRUCTIONS.md` |
| `audit/audit-visual.mjs` | 3 | `RAW` | `<report>.json`, `<report>.md` (near-duplicate colors, scale sprawl, component drift) |
| `audit/audit-code.mjs` | 3 | `SRC` | `<report>.json`, `<report>.md` (hardcoded colors, arbitrary values, inline styles, repeated class lists) |

`CAPTURE_CONFIG` is the only variable every script needs: data scripts derive `RAW` (`<output.inventory>/_raw`), `DEST`, `SRC`, and dated report paths (`<output.audit>/<YYYY-MM-DD>-...`) from it. Explicit `RAW`, `DEST`, `SRC`, or `OUT` override those defaults. Browser scripts also accept `ROUTES=/a,/b` (subset) and `SHARD`/`SHARDS` (set by `parallel.mjs`). Set `WEBAPP_CAPTURE_DEBUG=1` to print stack traces on failure.

## Prompt templates

| File | Stage | Fill before use |
|---|---|---|
| `prompts/describe-groups.md` | Describe (one agent per batch) | `{{APP_NAME}}`, `{{APP_CONTEXT}}`, `{{RAW_DIR}}` |
| `prompts/merge-components.md` | Merge (one agent, or one per kind at scale) | same (filled by `prepare-merge.mjs`) |
| `prompts/reconcile-components.md` | Reconcile sharded merges | filled by `prepare-merge.mjs` |
| `prompts/claude-design-handoff.md` | Brief inside the Claude Design zip | filled by `design-handoff.mjs` |
| `prompts/shadcn-map.md` | shadcn/ui component mapping (one agent per 30 components) | filled by `shadcn-prepare.mjs` |
| `prompts/shadcn-theme.md` | shadcn/ui theme token mapping (one agent) | filled by `shadcn-prepare.mjs` |

`shadcn-catalog.json` (next to this file) is the list of valid shadcn/ui components, variants, and theme tokens that `shadcn-build.mjs` validates against.

## Output contracts

### Component folder (`components/<name>/`)

| File | Contents |
|---|---|
| `component.md` | Kind, layer, instances, routes, purpose, anatomy, parts, variants with described and measured tables, states, tokens observed, usage, glyphs, related, notes, source groups |
| `code.html` | One representative redacted outerHTML per variant and part |
| `styles.json` | Per variant: description, gids, described visual, up to 3 measured computed styles with rect and page state |
| `assets.json` | Icon font, glyph names, image sources |
| `screenshots/` | Up to 3 crops per variant or part, at the capture scale |

### `ledger.json`

`{ generated, source, components[], unassigned[], inconsistencies[] }`. Each component: `name, kind, layer, confidence, variants[], parts[], instances, routes[], regions[], related[], sourceGroups[], path`.

### `tokens-raw.json`

`observed.<property>[]` sorted by count, each `{ value, count, routes }`, for color, backgroundColor, borderColor, borderWidth, borderRadius, boxShadow, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, typeStyle, spacing, backgroundImage. `cssVariables.resolvedByPrefix` groups computed custom properties by prefix; `definedBySelector` keeps raw declarations per selector so light and dark sets stay distinguishable.

## Naming rules

| Thing | Pattern | Example |
|---|---|---|
| Route slug | path lowercased, non-alphanumerics to `-` | `/dashboard/costs/pricing` to `dashboard-costs-pricing` |
| Tab state | `<route-slug>__<tab>` | `dashboard-analytics__route-trace` |
| Tab name | `?tab=` value, else changed query value (ignoring `id`), else changed path segment, else label | |
| Scroll shot | `<state>-001.png` upward | |
| Component | `<role>-<modifier>` kebab-case | `button-primary-gradient`, `card-provider` |

Double underscore for tabs prevents collisions between a tab and a sibling route with the same words (the OmniRoute `analytics?tab=search` versus `/analytics/search` case).
