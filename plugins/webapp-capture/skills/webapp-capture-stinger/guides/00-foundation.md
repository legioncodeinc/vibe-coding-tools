# 00. Foundation: session, safety, routes, naming

Every route in this skill (demo, component library, inconsistency audit) stands on the same base: a saved login, a read-only crawl, and deterministic naming. Read this before any route guide.

## 1. Scope the target

Confirm with the user before touching anything:

- **Origin** (for example `http://localhost:3000`). Capture never leaves it.
- **Environment.** Prefer local, staging, or a seeded demo account. A production account shows real customer data in every screenshot.
- **Theme.** Capture light and dark as separate runs if both matter; never mix themes in one output set.
- **Output location** in the target repo (default `library/design/` for inventory and demo, `library/requirements/reports/` for audits).

Install the scripts' dependencies once (`npm install` in `scripts/`, then `npx playwright install chromium` if no Chromium is present). Copy `scripts/capture.config.example.json` into the target repo, fill `app`, `browser`, `routes`, `output`, and add the `auth.storageState` path and its `.session.json` sidecar to `.gitignore` before the first run. Then run `scripts/doctor.mjs`: it checks Node, dependencies, Chromium, ffmpeg, available memory (and recommends a shard count), config validity, origin reachability, session presence, expiry, permissions, and whether the session file is gitignored, and prints the exact fix for each problem. The saved state holds session cookies that can impersonate the account [raw/playwright--authentication.md].

## 2. Session: a human logs in, the agent never types credentials

1. Run `scripts/save-session.mjs`. It opens a visible browser at `app.loginPath` and waits.
2. The user logs in, including MFA or SSO.
3. The script saves cookies and localStorage with `context.storageState()` to the configured path [raw/playwright--authentication.md], writes sessionStorage to a `.session.json` sidecar, restricts both files to the owner (mode 600, a design choice of this skill), and warns if the file is not gitignored.
4. Headless runs load that file with the `storageState` context option [raw/playwright--browser-context-options.md].

Known limits:

| Limit | Consequence | Handling |
| --- | --- | --- |
| No built-in expiry signal | Playwright does not tell you the state went stale [raw/playwright--authentication.md] | `gotoChecked()` stops the run when a route lands on `app.loginPath`; rerun `save-session.mjs` |
| Session storage is not in `storageState` [raw/playwright--authentication.md] | Apps that keep auth in `sessionStorage` would start unauthenticated | Handled: `save-session.mjs` dumps it to the sidecar and `openApp()` replays it with `context.addInitScript` before any page script runs |
| Session-only cookies | Observed on the first production run: the saved session died when the login browser closed | Keep the visible browser open and attach with `connectOverCDP`, which is meant for an already-running browser [raw/playwright--cdp-persistent-context.md] |
| `launchPersistentContext` rejects `storageState` [raw/playwright--cdp-persistent-context.md] | Profile reuse is a separate path | Use a dedicated empty profile directory, never a real Chrome profile [raw/playwright--cdp-persistent-context.md] |

## 3. Safety contract (non-negotiable)

Capture is read-only. It navigates and switches views; it never submits.

The sole exception is an optional `onboarding` preflight declared in the capture
config. It runs only when `onboarding.enabled` and `onboarding.approved` are both
`true` and `onboarding.environment` is `local` or `seeded`, screenshots every
step before acting, refuses secret-looking fields, values, and deny-listed
clicks, and requires the user to authorize the exact setup mutations. The ordinary crawl remains
read-only after onboarding finishes. Direct screenshot and inventory runs execute
it in their single browser; `parallel.mjs` executes it once before starting any
shards, so setup actions are never repeated concurrently.

- **Allowed actions:** `page.goto` to same-origin routes, clicks on `[role=tab]` elements that pass the tab filter, scrolling. These map to safe, idempotent GET-class requests [raw/code--mdn-http-request-methods.md].
- **Never:** form submits, save/delete/reset/restart/logout buttons, switches, checkboxes, anything that issues POST, PUT, PATCH, or DELETE, which MDN does not classify as safe [raw/code--mdn-http-request-methods.md].
- **Off-origin block:** `openApp()` installs a `page.route('**/*')` handler that aborts main-frame navigation requests outside `app.origin`. Playwright has no ready-made helper for this; it is assembled from `route.abort()`, `route.request()`, and `isNavigationRequest()` [raw/playwright--network-routing.md]. Popups are closed on open.
- **Redaction before write:** every captured text and HTML string passes `redact.patterns` before it lands on disk. The defaults are seeded from GitHub secret scanning pattern families (private key blocks, database connection strings, provider tokens such as AWS `AKIA...` and Slack `xox...`) [raw/code--github-secret-scanning-patterns.md] and the OWASP never-log list (passwords, tokens, session identifiers, PII, connection strings, keys) [raw/code--owasp-logging-cheat-sheet.md]. A capture pipeline is itself a logging surface [raw/code--owasp-logging-cheat-sheet.md].
- **Screenshots are not redacted by regex.** Pixels can show emails, keys, and customer names. List selectors for sensitive regions in `redact.maskSelectors`; every screenshot and crop passes them to Playwright's `mask` option [raw/playwright--screenshots.md], drawn as a fully opaque solid color (`redact.maskColor`, default black) rather than blur [raw/demo--doc-screenshots-google-style-guide.md]. Review a sample of screenshots before sharing anything; masks only cover what you listed.
- **Theme guard:** set `theme.verify.htmlClassIncludes`; `gotoChecked()` refuses to capture if the theme is wrong. A tab that flips the theme is a settings control, not a tab.

Lesson from the first production run (OmniRoute, 2026-09-15): controls that expose `role="tab"` can be setting pickers. A routing-strategy selector and a Light/Dark/System theme picker were both clicked as tabs. The routing change did not persist (verified by reload); the theme did, in browser storage, and had to be restored. Hence `tabs.noTabsOnRoutes`, `tabs.notATabLabel`, and the theme guard. After any dry run, reload the affected settings pages and confirm nothing changed.

## 4. Browser settings that matter

| Setting | Recommendation | Why |
| --- | --- | --- |
| `deviceScaleFactor` | 2 for docs, 3 for reference inventories | Plain screenshots default to `scale: 'device'`, so file size multiplies with DPR [raw/playwright--screenshots.md] |
| `animations: 'disabled'` | On every screenshot | Plain screenshot APIs default to `'allow'`, unlike `toHaveScreenshot()` [raw/playwright--screenshots.md] [raw/playwright--visual-comparisons.md] |
| Mouse off-target | `page.mouse.move(-1, -1)` before capture | Avoids incidental `:hover` states [raw/playwright--visual-comparisons.md] |
| `colorScheme`, `reducedMotion` | Set explicitly | Emulated media, not OS state [raw/playwright--emulation.md] |
| Dark mode driver | Detect first | Tailwind v4 dark mode is `prefers-color-scheme` by default or a class/attribute via `@custom-variant`; the two need different setups [raw/inventory--tailwind-v4-dark-mode.md] |

## 5. Route discovery and tabs

- `routes.discover: nav-links` collects same-origin `<a href>` values on `startPath` that do not open a new tab. `crawl-links` recursively follows same-origin anchors up to `routes.maxRoutes`. Every discovery mode rejects destructive-looking route segments in addition to the configured `routes.exclude` list. Use `list` for apps whose navigation is not links.
- Scroll capture targets the largest scrollable region, which in dashboards is usually an inner container, not the window. Screenshots with `fullPage` only cover document scroll [raw/playwright--screenshots.md], so this skill scrolls one viewport at a time instead of relying on `fullPage`.
- A tab is real only if it is visible, same-origin, not selected on arrival (that state is already the base capture), not on `noTabsOnRoutes`, and its label does not match `notATabLabel` (theme pickers, date ranges, group-by filters).

## 6. Naming (deterministic, collision-free)

| Artifact | Pattern |
| --- | --- |
| Route slug | path lowercased, non-alphanumerics to `-`: `/dashboard/costs/pricing` becomes `dashboard-costs-pricing` |
| Tab state | `<route-slug>__<tab>`; tab name is the `?tab=` value, else a changed query value ignoring `id`, else the changed path segment, else the label |
| Scroll shots | `<state>-001.png`, `-002.png` |
| Folders | one folder per route slug |

The double underscore exists because `/analytics?tab=search` and `/analytics/search` otherwise produce the same file name and overwrite each other, which happened on the first production run.

## 7. Parallelism and limits

- Run browser scripts through `scripts/parallel.mjs <script> --shards N`. It spawns one headless browser per shard, caps N by available memory (about 0.9 GB per browser) and CPU count, prefixes and streams logs, kills a shard after a timeout, and exits non-zero if any shard fails. Ten shards took 87 routes from about 25 minutes to about 4 on the first production run.
- Subagent concurrency is capped by the harness. The first production run hit a limit of 20 concurrent subagents in Claude Code (observed, configurable). For large describe stages, run a workflow with its own concurrency rather than launching agents one notification at a time.

## 8. Blind spots to report, never hide

| Blind spot | Why | What to do |
| --- | --- | --- |
| Closed shadow roots | Invisible to page script and Playwright locators [raw/code--mdn-using-shadow-dom.md] [raw/code--playwright-locators-shadow-dom.md] | Screenshot only; list the host elements in the report |
| Cross-origin iframes | `contentDocument` is null [raw/code--mdn-iframe-contentdocument.md] | Screenshot the region; no DOM data |
| Cross-origin stylesheets | `cssRules` throws `SecurityError` [raw/inventory--mdn-cssstylesheet-cssrules.md] | Wrap in try/catch; CSS variables still resolve via `getComputedStyle` |
| Interaction-only UI | Menus, dialogs, tooltips, hover states need clicks the safety contract forbids | Record in the report; capture them only through an approved demo plan |
| Canvas and WebGL | No elements to read | Screenshot only |
| Data-dependent screens | Empty accounts show empty states | Use a seeded account |
