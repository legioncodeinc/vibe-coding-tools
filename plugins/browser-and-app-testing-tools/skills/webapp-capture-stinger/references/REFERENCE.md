# webapp-capture-stinger reference

Field tables, script map, and output contracts. Load when running any script, editing the config, or checking what a route produces. Procedures live in `guides/`; claims about Playwright, color math, and tooling trace to `research/distilled-webapp-capture.md`.

## Requirements

| Need | Install | Used by |
|---|---|---|
| Node 20.9 or newer | system | all scripts (ES modules and Sharp 0.35) |
| playwright-core, sharp | `npm install` inside `scripts/` (its `package.json` pins both) | browser scripts; sharp for component sheets |
| Chromium | `npx playwright install chromium` inside `scripts/`, or set `browser.executablePath` | browser scripts |
| ffmpeg | existing system package | masked-frame recorder and generated demo make-video.sh |

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
| `routes.discover` | nav-links, crawl-links, list | Default nav-links, which reads `startPath`; crawl-links recursively follows same-origin anchors |
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
| `redact.maskSelectors` | CSS[] | Subtrees with paint suppressed, then opaque Playwright masks, in every screenshot, crop and video frame |
| `redact.maskColor` | color | Mask fill, default `#000000` (opaque) |
| `output.*` | path | screenshots, inventory, demo, audit destinations. Relative to the config file: a config in `library/design/` uses `demo`, not `library/design/demo` (doctor warns when a path repeats the config folder) |
| `ai.describeBatchSize` | number | Groups per describe agent. 10 keeps agents from skipping images |
| `ai.maxConcurrentAgents` | number | Stay under the harness subagent cap (a cap of 20 was observed in Claude Code) |

`routes.discover` also accepts `crawl-links`, which recursively follows
same-origin anchors. Optional `onboarding` config can declare an approved setup
plan using `waitFor` targets and `fill`, `click`, `wait`, or `waitFor` actions.
The preflight refuses password, secret, token, and API-key fields or values and records a
screenshot before every step. Set `onboarding.skipWhenApiHasItems` to a
same-origin JSON array endpoint when an existing seeded account should make the
preflight idempotently skip.

## Demo plan fields

| Field | Values | Notes |
|---|---|---|
| `approved` | boolean | Must be `true`, set only after the user approves the plan |
| `video.width`, `video.height` | px | Default 1920x1080 |
| `video.cursor` | boolean | Draws a DOM cursor (headless video has none) |
| `video.parkAt` | `{x, y}` | Where the cursor rests after click, drag, select, check, and confirm actions; default the bottom right corner |
| `video.endHoldMs` | ms | Last frame hold written to `assembly.conf`, default 1500 |
| `video.fps` | 1 to 15 | Masked-frame rate, default 5 |
| `video.slowMo` | ms | Default 250 |
| `narration.wordsPerMinute` | number | Default 140; drives scene holds and `narration/fit.md` |
| `narration.tts` | `{style, voice, model}` | Eleven v4 clip texts; `style` adds a leading tag such as `[warm]`; no model id is hardcoded |
| `safety.denyPattern` | regex string | Adds to the built-in deny list, never replaces it |
| `safety.environment`, `safety.requests[]` | local or seeded; exact grants | Each write request needs method, path, body SHA256 and `approved: true`. Grants apply only while an action runs in a scene listed in `writes[]` |
| `writes[]` | `{id, scene, description, effect, approved}` | Required for any scene using drag, dragTo, select, check, uncheck, or confirmDialog |
| `scenes[].actions[]` | see guide 01 | wait, hover, click, type, scroll, select, check, uncheck, drag, dragTo, scrollElement, waitFor, confirmDialog |
| `scenes[].verify[]` | visible, hidden, text, count | Read-only; required on write scenes |

## Script map

| Script | Route | Input | Output |
|---|---|---|---|
| `doctor.mjs` | all | config (optional), `--route screenshots\|demo\|library\|audit` | Readiness report with fixes; exit 1 on blocking problems |
| `save-session.mjs` | all | config | `auth.storageState` plus `.session.json` sidecar after a human logs in |
| `parallel.mjs` | all | config, `<script> --shards N` | Runs approved onboarding once, then a browser script across N headless browsers capped by memory and CPUs; exit 1 if any shard fails |
| `lib/common.mjs` | all | | config validation, browser launch, session restore, masks, route discovery, tab listing, naming, timeouts |
| `lib/browser-policy.mjs` | all | request bytes and approved grants | Read/action admission and destructive-path checks |
| `lib/onboarding.mjs` | all | approved seeded onboarding plan | Bounded action scope, safe field checks and private step captures |
| `lib/redaction.mjs` | all | config and exported values | Recursive strings, keys, HTML and URL scrub |
| `lib/video-privacy.mjs` | 1 | page, masks and frame rate | Private masked-frame WebM scenes |
| `lib/contrast.mjs` | 3 | measured foreground/background paint | Unrounded ratios, thresholds and unknown results |
| `inventory/dom-collector.mjs` | 2, 3 | visible DOM and configured bounds | Open-shadow observations with coverage limits |
| `inventory/validation.mjs` | 2, 4 | groups, ledger, theme or mapping data | Schema, coverage and portable-name checks before output |
| `screenshots.mjs` | 1 | config | `<screenshots>/<route>/<route>-001.png`, `<route>__<tab>-001.png`, `manifest.tsv` |
| `merge-screenshot-manifests.mjs` | 1 | ordered `CAPTURE_MANIFESTS`, optional `CAPTURE_IGNORE_STATE_PATTERN` | Final state ledger where successful retries supersede earlier errors or truncations |
| `demo/record-demo.mjs` | 1 | config + approved plan JSON, `--retake` or `RETAKE=1` | `scenes/*.webm` (masked frames), `screenshots/*.png`, `failures/*.png`, `timeline.json`, `segments.tsv`, `assembly.conf`, `writes-report.json`, `privacy-review.json`, `captions.vtt`, `titles.srt`, `narration/`, `script.md`, `make-video.sh`; `<output.demo>/<slug>.ledger.json` and `findings.md` |
| `demo/build-cues.mjs` | 1 | config, `DEMO_DIR` | Rebuilds `captions.vtt`, `titles.srt`, and `narration/` from `timeline.json` and an edited `segments.tsv`; logs overruns |
| `demo/review-demo.mjs` | 1 | config, `DEMO_DIR`, `EVERY_SECONDS` (default 2) | `review/<scene>-sheet.png` contact sheets and `review/REVIEW.md` with masked text hits |
| `demo/make-video.sh` | 1 | run in the demo folder: `segments.tsv`, `assembly.conf`, `captions.vtt` | `segments/*.mp4`, `demo-silent.mp4`, `demo.mp4`; refuses linked inputs and existing outputs |
| `lib/demo-plan.mjs`, `lib/narration.mjs`, `lib/demo-actions.mjs`, `lib/demo-guard.mjs`, `lib/demo-cues.mjs` | 1 | | Plan validation and write ledger, timeline and cues, narration fit and Eleven v4 text, browser actions and verify, target guard, cue files |
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
| `audit/audit-contrast.mjs` | 3 | config, optional `ROUTES`, `OUT` | JSON/Markdown contrast observations, failures and unmeasured cases |
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

## Version 1.2 runtime additions

- `browser.sessionMode`: `storage-state` (default), `persistent`, or `cdp`. Persistent/CDP require this skill's owned `profileDir`; CDP also requires a clean loopback `cdpEndpoint`.
- `network.readPost[]`: approved exact-path POST grants with `method`, `kind` (`rest-read`/`graphql-query`), `bodySha256` of actual UTF-8 bytes and `approved`. No redirects, opaque operations or automatic write fallback.
- `onboarding.requests[]` and demo `safety.requests[]`: separate exact method/path/body grants inside an approved local/seeded action scope.
- `video.fps`: integer 1-15, default 5, for masked-frame recording. Continuous `recordVideo` is refused.
- `contrast.maxElements`: bounded DOM inspection cap, default 6000. `audit/audit-contrast.mjs` writes JSON/Markdown under `output.audit`, with failures and unmeasured cases.
- Raw capture includes actual scale/icon metadata and bounded shadow/scroll coverage. Route and tab identifiers include opaque stable hashes; do not derive them by hand.
- All output roots require private ownership/modes. The handoff ZIP has a member hash/size manifest and refuses missing or nonportable members.

Native tests: `npm test` runs unit, refusal and available-browser fixtures. The local pipeline uses deterministic reviewed descriptions/maps to exercise producer/consumer contracts without a paid model call. It does not qualify every real app, provider or client. Raw research remains dated provenance; the active implementation and these current contracts control runtime behavior.

## Script qualification

Run `npm test` from `scripts/` with the already approved runtime and browser. Set `WEBAPP_CAPTURE_NATIVE_REQUIRED=1` to require the native browser/ffmpeg fixtures; missing dependencies then fail instead of skipping. Tests use owned synthetic local data. They do not prove a real application's routes, model judgments or secrets have been reviewed.
