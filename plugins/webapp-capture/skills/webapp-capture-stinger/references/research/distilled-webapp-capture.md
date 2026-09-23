# Distilled research: webapp-capture-stinger

Dense reference for capturing live, authenticated web apps: screenshots, demo videos, UI component inventories, design tokens, and visual and code inconsistency audits. Every claim cites its source in `raw/`. Fetched 2026-09-15; research window: last 6 months preferred, canonical official docs and specs of any date.

Five sections, each distilled independently from its own raw set and assembled here unchanged apart from heading levels. Where sources conflict, both readings are stated with the official one preferred. Gaps are marked `research gap:` and are not filled from training data.

| Section | Raw files | Topic |
| --- | --- | --- |
| 01 | `raw/playwright--*.md` | Playwright capture primitives |
| 02 | `raw/inventory--*.md` | Component inventory and design tokens |
| 03 | `raw/visual--*.md` | Visual inconsistency detection |
| 04 | `raw/code--*.md` | Code inconsistency and capture safety |
| 05 | `raw/demo--*.md` | Demo video, screenshots, and script |
| 06 | `raw/shadcn--*.md` | shadcn/ui components, theming, CLI, and shadcn-svelte |

## 01. Playwright capture primitives

Distilled from the raw sources listed at the end. Every claim is cited to its raw file with `[raw/<filename>]`. Where a raw file does not state something the skill needs, this is marked `research gap:` rather than filled from memory.

### 1. Screenshots: page vs locator, fullPage, animations, scale, mask/style

#### `page.screenshot()` vs `locator.screenshot()`

| Aspect | `page.screenshot()` | `locator.screenshot()` |
|---|---|---|
| Scope | Whole page (viewport or full scrollable page) [raw/playwright--screenshots.md] | Clipped to the size and position of the element matching the locator [raw/playwright--screenshots.md] |
| `fullPage` option | Supported; `true` captures the full scrollable page as if the viewport were tall enough to fit it entirely, defaults to `false` [raw/playwright--screenshots.md] | Not accepted, locator screenshots are page-level `clip`/`fullPage` concepts that do not apply since the shot is inherently clipped to the element's bounding box [raw/playwright--screenshots.md] |
| `clip` option | Supported: `{x, y, width, height}` clip rectangle [raw/playwright--screenshots.md] | Not accepted, same reason as `fullPage` [raw/playwright--screenshots.md] |
| Covered elements | N/A | If the element is covered by other elements it will not actually be visible in the screenshot [raw/playwright--screenshots.md] |
| Scrollable containers | N/A | If the element is a scrollable container, only the currently scrolled content is captured [raw/playwright--screenshots.md] |
| Pre-shot behavior | N/A | Waits for actionability checks, then scrolls the element into view before shooting; throws if the element is detached from the DOM [raw/playwright--screenshots.md] |
| Return type | `<Buffer>` with the captured image [raw/playwright--screenshots.md] | `<Buffer>` with the captured image [raw/playwright--screenshots.md] |
| Shared options | `animations`, `omitBackground`, `quality`, `path`, `scale`, `caret`, `type`, `mask`, `maskColor` (since v1.34/v1.35), `style`/`stylePath` (since v1.41), `timeout`, `signal` [raw/playwright--screenshots.md] | Same set (`locator.screenshot()` explicitly documented as accepting the common list) [raw/playwright--screenshots.md] |

Buffer capture: omitting `path` skips writing to disk and returns only the buffer, which can be base64-encoded or handed to a pixel-diff tool [raw/playwright--screenshots.md].

#### `fullPage` limits

research gap: the screenshots raw file defines what `fullPage: true` does (captures the full scrollable page) but states no explicit size cap, performance ceiling, or interaction with `position: sticky`/`fixed` elements. No such limit is documented in the fetched raw content [raw/playwright--screenshots.md].

#### Animations

| API | Default for `animations` | Behavior of `"disabled"` |
|---|---|---|
| `page.screenshot()` / `locator.screenshot()` | `"allow"` (untouched) [raw/playwright--screenshots.md] | Stops CSS animations, CSS transitions, and Web Animations. Finite animations are fast-forwarded to completion (firing `transitionend`); infinite animations are canceled to their initial state, then replayed after the screenshot [raw/playwright--screenshots.md] |
| `expect(page).toHaveScreenshot()` (visual comparisons) | `"disabled"` (explicitly the opposite default of the plain screenshot APIs) [raw/playwright--visual-comparisons.md] | Same disable semantics as above [raw/playwright--visual-comparisons.md] |

#### Scale: `"css"` vs `"device"`

| API | Default `scale` | Meaning |
|---|---|---|
| `page.screenshot()` / `locator.screenshot()` | `"device"` [raw/playwright--screenshots.md] | `"css"`: one image pixel per CSS pixel (smaller files on high-DPI). `"device"`: one image pixel per device pixel (screenshots on high-DPI devices are twice as large or more) [raw/playwright--screenshots.md] |
| `expect(page).toHaveScreenshot()` | `"css"` (explicitly the opposite default of the plain screenshot APIs) [raw/playwright--visual-comparisons.md] | Same two-value semantics as above [raw/playwright--visual-comparisons.md] |

Conflict note: the two APIs intentionally default `animations` and `scale` oppositely (`allow`/`device` for plain screenshots, `disabled`/`css` for `toHaveScreenshot()`); both readings come from the same official source (playwright.dev docs) and are not in tension with each other, they are two different documented defaults for two different APIs [raw/playwright--screenshots.md] [raw/playwright--visual-comparisons.md].

#### `mask` and `style`

- `mask`: array of `Locator`s to mask; masked elements are overlaid with a pink `#FF00FF` box (customizable via `maskColor`, since v1.35) that fully covers the element's bounding box; the mask also applies to invisible elements unless disabled via a "Matching only visible elements" locators-guide setting (that guide's detail is not itself in the fetched raw content) [raw/playwright--screenshots.md].
- `style` (since v1.41): inline stylesheet text applied while taking the screenshot, used to hide dynamic elements or otherwise make screenshots repeatable; pierces the Shadow DOM and applies to inner frames [raw/playwright--screenshots.md].
- `stylePath`: file-based equivalent of `style` (one path or an array of paths); same Shadow-DOM-piercing, inner-frame-applying behavior [raw/playwright--screenshots.md].
- `toHaveScreenshot()` exposes the file-based `stylePath` option (not inline `style`) with the same dynamic-element-hiding purpose, settable per-call or as a project-wide default in the Playwright config [raw/playwright--visual-comparisons.md].

#### Other screenshot options (from the common list)

| Option | Values / default | Notes |
|---|---|---|
| `caret` | `"hide"` (default) or `"initial"` | Hides the text caret by default [raw/playwright--screenshots.md] |
| `omitBackground` | boolean, default `false` | Hides the default white background for transparency; not applicable to JPEG [raw/playwright--screenshots.md] |
| `quality` | 0-100 int | Not applicable to PNG; JPEG default `80`; WebP default `100` (lossless), lower values use lossy compression [raw/playwright--screenshots.md] |
| `type` | `"png"` (default), `"jpeg"`, `"webp"` | Inferred from the `path` file extension when `path` is given [raw/playwright--screenshots.md] |
| `path` | file path | Screenshot type inferred from extension; relative paths resolve against the current working directory; omit to skip saving to disk [raw/playwright--screenshots.md] |
| `timeout` | JS default `0` (no timeout, configurable via `actionTimeout`); Python/Java/C# default `30000` ms | [raw/playwright--screenshots.md] |

### 2. Context options that matter for capture

Set on `browser.newContext(options)` (full option/default table below is from the class-Browser API reference) [raw/playwright--browser-context-options.md].

| Option | Default | Purpose for capture |
|---|---|---|
| `viewport` | `{width: 1280, height: 720}`; `null` disables consistent-viewport emulation and lets the OS window size drive it (non-deterministic) | Controls the rendered/captured area and, indirectly, `recordVideo` default size [raw/playwright--browser-context-options.md] |
| `deviceScaleFactor` | `1` | DPR used for rendering; combine with `viewport` to emulate high-DPI capture [raw/playwright--browser-context-options.md] [raw/playwright--emulation.md] |
| `colorScheme` | `'light'` | Emulates `prefers-color-scheme`; JS/Java accept `null` to reset to system default; values `'light'`/`'dark'`/`'no-preference'` [raw/playwright--browser-context-options.md] |
| `reducedMotion` | `'no-preference'` | Emulates `prefers-reduced-motion`; values `'reduce'`/`'no-preference'`; `null` resets to system default [raw/playwright--browser-context-options.md] |
| `storageState` | none | Populates the context with cookies/localStorage captured via `browserContext.storageState()`, used to start a context already authenticated [raw/playwright--browser-context-options.md] |
| `recordVideo` | none (off) | `{dir, size: {width, height}, showActions}`; enables recording for all pages in the context into `dir` [raw/playwright--browser-context-options.md] |

Other context options present in the reference but not central to capture: `acceptDownloads` (default `true`), `ignoreHTTPSErrors` (`false`), `bypassCSP` (`false`), `baseURL`, `screen`, `userAgent`, `isMobile` (`false`, not supported in Firefox), `hasTouch` (`false`), `javaScriptEnabled` (`true`), `timezoneId`, `geolocation`, `permissions`, `extraHTTPHeaders`, `offline` (`false`), `httpCredentials`, `forcedColors` (`'none'`), `contrast` (`'no-preference'`), `recordHar`, `strictSelectors` (`false`), `proxy`, `clientCertificates` (since 1.46), `serviceWorkers` (`'allow'`) [raw/playwright--browser-context-options.md].

#### `recordVideo.size` and when videos are finalized

- Default video size: equal to `viewport` scaled down to fit inside 800x800; if `viewport` is not explicitly configured, the default is 800x450 [raw/playwright--browser-context-options.md] [raw/playwright--videos.md].
- If an explicit `size` is given, the actual page picture is scaled down as needed to fit; the viewport's picture is placed in the top-left corner of the output frame [raw/playwright--videos.md].
- Videos are saved only upon browser context closure at the end of a run; a manually created context must be explicitly closed (`await browserContext.close()`) for the video to be flushed [raw/playwright--videos.md] [raw/playwright--browser-context-options.md] ("Make sure to await `browserContext.close()` for videos to be saved.").
- `page.video()` returns the `Video` object for a page; `video.path()` returns the filesystem path and "is guaranteed to be written to the filesystem upon closing the browser context"; it throws when connected remotely [raw/playwright--videos.md].
- The video is only available after the page or browser context is closed; reading `page.video().path()` before that point is unreliable [raw/playwright--videos.md].
- `video.saveAs(path)`: JS is safe to call while the video is still in progress or after the page has closed (it waits until closed and fully saved); Java requires it be called after `page.close()`/`browserContext.close()` or it throws; Python's sync API has the same requirement as Java, the async API behaves like JS [raw/playwright--videos.md].
- `video.delete()`: deletes the video file, waiting for the video to finish first if necessary [raw/playwright--videos.md].
- Video format: `.webm`, files get generated unique names in the output directory (implied by the guide's output-directory description rather than a single explicit "format:" statement) [raw/playwright--videos.md].

#### `storageState` expiry

Covered fully in section 3 below.

### 3. Authentication and session reuse

#### Core model

- Playwright test isolation uses browser contexts; loading existing authenticated state avoids re-authenticating every test and speeds execution [raw/playwright--authentication.md].
- Recommended convention: a gitignored `playwright/.auth` directory holding the saved state file, because "the browser state file may contain sensitive cookies and headers that could be used to impersonate you or your test account" and must never be committed [raw/playwright--authentication.md].

#### Reusing signed-in state

- `browserContext.storageState({path})` (or `context.storage_state(path=...)`) writes cookies + per-origin localStorage to a file; `browser.newContext({storageState: path})` (or `storage_state=...`) creates a new context pre-populated from that file [raw/playwright--authentication.md].
- Covers cookie-based auth, token-based auth stored in local storage, IndexedDB, and virtual WebAuthn credentials (passkeys); these are documented as usable across different browsers, dependent on the app's own auth model [raw/playwright--authentication.md].
- Storage-state shape: `cookies[]` (`name`, `value`, `domain`, `path`, `expires` as Unix seconds, `httpOnly`, `secure`, `sameSite`) and `origins[]` (`origin`, `localStorage[]` of `{name, value}`) [raw/playwright--browser-context-options.md].
- C#/Java also expose `storageStatePath` (since v1.9) as a path-based alternative to the inline JSON-string `storageState` [raw/playwright--browser-context-options.md].

#### Session/expiry handling (explicit statements)

- "Note that you need to delete the stored state when it expires": Playwright provides no built-in expiry detection or auto-refresh for a `storageState` file [raw/playwright--authentication.md].
- To avoid reusing a possibly-expired file across runs, the guide suggests writing the state file under `TestProject.outputDir`, which is automatically cleaned before every test run, forcing re-authentication each run [raw/playwright--authentication.md].
- In UI mode, the `setup` project (which normally performs the authentication step) does not run by default for speed, so expired state has to be refreshed by manually re-running the auth setup file [raw/playwright--authentication.md].
- Session storage (distinct from local storage) is **not** covered by `storageState`; Playwright provides no API to persist it. The guide gives a manual workaround: `page.evaluate(() => JSON.stringify(sessionStorage))` to dump it, and `context.addInitScript(...)` to replay `sessionStorage.setItem` calls into a new context, gated by `window.location.hostname` [raw/playwright--authentication.md].

#### Auth strategies documented

| Strategy | When to use | Mechanism |
|---|---|---|
| Shared account, `setup` project | Tests don't mutate shared server-side state | One `auth.setup.ts` authenticates once, saves `storageState`, all test projects declare it as a dependency and reuse the file [raw/playwright--authentication.md] |
| One account per parallel worker | Tests do mutate shared server-side state | A worker-scoped fixture authenticates once per `TestInfo.parallelIndex`, writing/reading a per-worker file [raw/playwright--authentication.md] |
| API-based auth | The app has a login API cheaper than driving the UI | `request.post(...)` then `request.storageState({path})` [raw/playwright--authentication.md] |
| Multiple roles (reused across tests) | More than one role, accounts reusable | Authenticate each role once in `setup`, then `test.use({storageState: ...})` per file/describe block [raw/playwright--authentication.md] |
| Multiple roles in one test | Roles must interact together in a single test | Separate `BrowserContext`s / `Page`s each constructed with a different `storageState` [raw/playwright--authentication.md] |
| Avoid auth for a specific test | One test file should run unauthenticated despite project-level `storageState` | `test.use({storageState: {cookies: [], origins: []}})` [raw/playwright--authentication.md] |

### 4. Video recording

- Config-level modes (Playwright Test): `'off'` (default), `'on'`, `'retain-on-failure'` (kept only for failures), `'on-first-retry'` [raw/playwright--videos.md].
- Library mode: pass `recordVideo: {dir}` to `browser.newContext()`; must `await context.close()` for the file to be saved [raw/playwright--videos.md].
- `showActions` (test-runner `video` config object): visually highlights each interacted element with an outline and an action-title subtitle; `duration` defaults to `500`ms; `position` defaults to `"top-right"`; also a `fontSize` and `cursor` (`"pointer"` default vs `"none"`) at the context-option level (`recordVideo.showActions`) [raw/playwright--browser-context-options.md] [raw/playwright--videos.md].
- Separately, `show: {test}` (test-runner-only) annotates the video with current test info at a configurable `level` [raw/playwright--videos.md].
- Size and finalization rules: see section 2 above (shared with context options) [raw/playwright--videos.md] [raw/playwright--browser-context-options.md].

### 5. Tracing

- `context.tracing.start({screenshots, snapshots, ...})` begins capture; `context.tracing.stop({path: 'trace.zip'})` exports the archive [raw/playwright--tracing.md].
- Explicit guidance for non-test-runner usage: "If you are not using Playwright as a Test Runner, use the `BrowserContext.tracing` API instead," which is the relevant path for a headless capture/automation tool [raw/playwright--tracing.md].
- Official caution: "You probably want to enable tracing in your config file instead of using `Tracing.start`. The `context.tracing` API captures browser operations and network activity, but it doesn't record test assertions." This caution is aimed at the Test Runner; a non-test-runner capture tool has no alternative but the direct API [raw/playwright--tracing.md].
- `Tracing.start(options)`:
  - `screenshots` <boolean>: capture screenshots used to build a timeline preview [raw/playwright--tracing.md]
  - `snapshots` <boolean|Object> (JS): `true` shorthand for `{dom: true}`; sub-flags `dom`, `aria`, `screen` (JS only); Java/Python/C# take a single boolean meaning DOM snapshot + network recording [raw/playwright--tracing.md]
  - `ariaSnapshots` / `screenSnapshots` <boolean> (Java/Python/C#, since v1.63): per-action aria snapshot / per-action screenshot [raw/playwright--tracing.md]
  - `sources` <boolean> (since v1.17): include source files for trace actions [raw/playwright--tracing.md]
  - `title` <string> (since v1.17): trace name shown in the viewer [raw/playwright--tracing.md]
  - `live` <boolean> (since v1.59): writes the trace unarchived and live-updated instead of caching and zipping at the end, useful for live trace viewing during execution [raw/playwright--tracing.md]
  - `name` <string> (since v1.12): intermediate-file prefix inside `tracesDir` (final zip name is set via `Tracing.stop({path})` instead) [raw/playwright--tracing.md]
- `Tracing.startChunk()` / `Tracing.stopChunk({path})`: record multiple discrete trace files on the same context after a single `Tracing.start()` call [raw/playwright--tracing.md].
- `Tracing.startHar(path, options)` / `Tracing.stopHar()` (since v1.60): records a HAR independent of the trace archive; options `content` (`'omit'|'embed'|'attach'`, default `'attach'` for `.zip` output else `'embed'`), `mode` (`'full'|'minimal'`, default `'full'`), `urlFilter`, and JS-only `resourcesDir` [raw/playwright--tracing.md].
- `Tracing.group(name, options)` / `Tracing.groupEnd()` (since v1.49): labels a span of API calls as a named, nestable group in the viewer; official guidance says prefer `test.step` when available [raw/playwright--tracing.md].
- Viewing: `npx playwright show-trace path/to/trace.zip`, or the statically hosted trace.playwright.dev (loads and renders entirely client-side, "does not transmit any data externally"); remote traces can be opened directly by URL, including as a `?trace=` query param on trace.playwright.dev, subject to CORS [raw/playwright--tracing.md].

### 6. Network routing to block off-origin navigation

- `page.route(pattern, handler)` / `browserContext.route(pattern, handler)` intercept matching requests; context-level routing also applies to popup windows and opened links [raw/playwright--network-routing.md].
- Three terminal actions on a `Route`: `route.continue(options)` (alias `resume`/`continue_`) forwards the request, optionally overriding `headers`, `method`, `postData`, `url`; `route.fulfill(options)` answers without touching the network (`status`, `headers`, `body`, `path`, or a base `response` to override fields on); `route.abort(errorCode)` fails the request [raw/playwright--network-routing.md].
- `route.abort()` `errorCode` values (default `'failed'`): `'aborted'`, `'accessdenied'`, `'addressunreachable'`, `'blockedbyclient'`, `'blockedbyresponse'`, `'connectionaborted'`, `'connectionclosed'`, `'connectionfailed'`, `'connectionrefused'`, `'connectionreset'`, `'internetdisconnected'`, `'namenotresolved'`, `'timedout'`, `'failed'` [raw/playwright--network-routing.md].
- Documented abort-by-resource-type pattern (the shape a capture tool would use to block off-origin resources): `page.route('**/*', route => { return route.request().resourceType() === 'image' ? route.abort() : route.continue(); })`, i.e. inspect `route.request()` inside the handler and branch to `abort()` vs `continue()`/`resume()` [raw/playwright--network-routing.md]. No off-origin-navigation-specific abort example (e.g. matching by `request.url()` origin or gating on `isNavigationRequest()`) appears verbatim in the fetched guide; the pattern above is the general resource-type-based abort example given.
- `Request.isNavigationRequest()`: returns whether the request is driving the frame's navigation; the raw file notes "some navigation requests are issued before the corresponding frame is created, and therefore do not have `request.frame()` available," but does not show a worked example combining `isNavigationRequest()` with `route.abort()` to block off-origin navigations [raw/playwright--network-routing.md]. research gap: no example in the fetched content pairs `isNavigationRequest()` with an abort-on-different-origin capture pattern; a capture script implementing this must combine the documented primitives (`route.request().isNavigationRequest()`, `request.url()`, `route.abort()`) itself.
- Routing mechanics: the route handler runs before the browser's network stack processes the request; `route.continue()` hands off to the network stack, which then attaches headers such as `Cookie`, `Host`, `Accept-Encoding`, `Content-Length`, and `Sec-Fetch-*`; these are a security boundary (e.g. `HttpOnly` cookies are never exposed to the page) and are therefore not reliably present in `request.headers()`/`request.allHeaders()` from inside the handler, nor overridable; a `cookie` header passed to `route.continue()` is ignored in favor of the browser's own cookie store [raw/playwright--network-routing.md].
- Redirects are treated as one unit: the handler fires once, for the original request; the browser follows the redirect chain itself; `response.request()` returns the last request in the chain; `request.redirectedFrom()` walks back to the intercepted one; headers passed to `route.continue()` apply to every hop except `cookie`. Fulfilling with a `3xx` status does not give a second interception chance (Chromium/Firefox follow the redirect without recalling the handler; WebKit rejects the call outright) [raw/playwright--network-routing.md].
- Glob URL matching rules for `page.route()`/`page.waitForResponse()` etc.: single `*` matches any characters except `/`; double `**` matches any characters including `/`; `?` matches only a literal `?` (use `*` for "any character"); `{a,b}` matches a comma-separated option list; `\` escapes special characters (escape `\` itself as `\\`); the pattern must match the **entire** URL, not a substring [raw/playwright--network-routing.md].

### 7. `connectOverCDP` vs `launchPersistentContext`

| | `browserType.connectOverCDP(endpointURL, options)` | `browserType.launchPersistentContext(userDataDir, options)` |
|---|---|---|
| Purpose | Attach Playwright to an **existing** browser instance via the Chrome DevTools Protocol; the default context is reachable via `browser.contexts()` [raw/playwright--cdp-persistent-context.md] | **Launch** a browser that uses persistent storage at `userDataDir` and return the single resulting context; closing that context closes the browser [raw/playwright--cdp-persistent-context.md] |
| Browser support | Chromium-based browsers only ("Connecting over the Chrome DevTools Protocol is only supported for Chromium-based browsers") [raw/playwright--cdp-persistent-context.md] | Same shared launch-options surface as `browserType.launch()`, so channel selection (`chromium`, `chrome`, `msedge`, etc.) applies [raw/playwright--cdp-persistent-context.md] |
| Fidelity | Explicitly lower fidelity than a native Playwright-protocol connection via `browserType.connect()`: "If you are experiencing issues or attempting to use advanced functionality, you probably want to use `browserType.connect()`" [raw/playwright--cdp-persistent-context.md] | Not flagged with any fidelity caveat in the raw file [raw/playwright--cdp-persistent-context.md] |
| Argument-matching warning | "Playwright maintains a curated list of arguments for launching the browser. If you launch the browser without Playwright and do not pass the exact same arguments, some of Playwright functionality may be broken upon connecting." | N/A (Playwright itself performs the launch) [raw/playwright--cdp-persistent-context.md] |
| `isLocal` option | since v1.58: tells Playwright it runs on the same host as the CDP server, enabling optimizations that assume a shared filesystem between Playwright and the browser [raw/playwright--cdp-persistent-context.md] | N/A, not applicable since Playwright owns the launch [raw/playwright--cdp-persistent-context.md] |
| `noDefaults` option | since v1.60: when `true`, Playwright does not apply its default overrides to the existing default context (`acceptDownloads` left at the browser's own setting, no focus emulation, and media emulation like `colorScheme`/`reducedMotion`/`forcedColors`/`contrast` not applied); useful when attaching to a user's daily-driver browser so these overrides don't disturb existing state; new contexts created afterward via `browser.newContext()` are unaffected [raw/playwright--cdp-persistent-context.md] | N/A [raw/playwright--cdp-persistent-context.md] |
| Other options | `headers` (extra HTTP headers on the connect request, since v1.11), `slowMo`, `timeout` (default 30000ms, `0` disables), `artifactsDir` (since v1.61, for traces/downloads) [raw/playwright--cdp-persistent-context.md] | Union of shared launch options (`args`, `channel`, `chromiumSandbox` default `false`, `downloadsPath`, `env`, `executablePath`, `handleSIGINT` default `true`, `headless`, `ignoreDefaultArgs`, `proxy`, `timeout` default 30000ms, `tracesDir`, `artifactsDir`) plus the shared context options (`viewport`, `deviceScaleFactor`, `colorScheme`, `reducedMotion`, `forcedColors`, `contrast`, `locale`, `timezoneId`, `geolocation`, `permissions`, `extraHTTPHeaders`, `offline`, `httpCredentials`, `recordHar`/flat variants, `recordVideo`/flat variants, `userAgent`, `isMobile`, `hasTouch`, `javaScriptEnabled`, `acceptDownloads`, `ignoreHTTPSErrors`, `bypassCSP`, `baseURL`, `screen`, `strictSelectors`, `serviceWorkers`), plus `slowMo`, `firefoxUserPrefs`/`firefoxUserPrefs2` (since v1.40), and `clientCertificates` (since 1.46) [raw/playwright--cdp-persistent-context.md] |
| `storageState` | Not itself part of `connectOverCDP`'s options table; new contexts made afterward with `browser.newContext()` can still take `storageState` normally [raw/playwright--cdp-persistent-context.md] [raw/playwright--browser-context-options.md] | **Explicitly does not accept `storageState`**, because it always launches from the given `userDataDir`'s own existing persistent storage [raw/playwright--cdp-persistent-context.md] |
| `userDataDir` constraints | N/A | Path to a user-data directory storing cookies/local storage; pass `""` for a temporary directory; browsers refuse to launch multiple instances against the same user-data directory; Chromium's user-data directory is the **parent** of the "Profile Path" shown at `chrome://version` [raw/playwright--cdp-persistent-context.md] |
| Known limit / warning | See argument-matching warning above | Chrome policy warning: "automating the default Chrome user profile is not supported. Pointing `userDataDir` to Chrome's main 'User Data' directory... may result in pages not loading or the browser exiting." Use a separate, dedicated automation profile directory instead [raw/playwright--cdp-persistent-context.md] |

Key conceptual distinction, stated directly: `launchPersistentContext` combines browser-launch options and browser-context options into one call and returns the context directly (no separate `Browser` object), because the persistent profile *is* the browser session, closing the context closes the browser [raw/playwright--cdp-persistent-context.md].

### 8. Visual comparisons: `threshold`, `maxDiffPixels`, `maxDiffPixelRatio` defaults

`expect(page).toHaveScreenshot()` (JS/Playwright Test only, "screenshot assertions only work with the Playwright test runner") [raw/playwright--visual-comparisons.md]:

| Option | Type | Default | Meaning |
|---|---|---|---|
| `threshold` | float | **`0.2`** | Acceptable perceived color difference in the YIQ color space between the same pixel in the two images; `0` is strict, `1` is lax; default is configurable via `TestConfig.expect` [raw/playwright--visual-comparisons.md] |
| `maxDiffPixels` | int | **unset** | Acceptable count of differing pixels; default configurable via `TestConfig.expect` [raw/playwright--visual-comparisons.md] |
| `maxDiffPixelRatio` | float, 0-1 | **unset** | Acceptable ratio of differing pixels to total pixels; default configurable via `TestConfig.expect` [raw/playwright--visual-comparisons.md] |

Underlying diff engine: Playwright Test uses the `pixelmatch` library; `threshold`/`maxDiffPixels`/`maxDiffPixelRatio` are all pixelmatch-facing tuning knobs [raw/playwright--visual-comparisons.md].

Other `toHaveScreenshot()` options in the same reference: `timeout`, `signal` (since v1.62), `animations` (default `"disabled"`, see section 1), `caret` (default `"hide"`), `clip`, `fullPage` (default `false`), `mask`/`maskColor` (default `#FF00FF`), `stylePath` (since v1.41), `omitBackground` (default `false`), `scale` (default `"css"`, see section 1) [raw/playwright--visual-comparisons.md].

Snapshot lifecycle: first run has no golden file, so Playwright takes screenshots until two consecutive ones match, then saves the last one as the baseline; subsequent runs compare against it. Baselines regenerate via `npx playwright test --update-snapshots` [raw/playwright--visual-comparisons.md]. Storage: PNG by default; naming the snapshot with a `.webp` extension stores it losslessly as WebP instead [raw/playwright--visual-comparisons.md]. Auto-generated snapshot filenames follow `<test-name>-<index>-<project-or-browser-name>-<platform>.png`, stored in a `<test-file-name>-snapshots/` directory sibling to the test file, which the guide says to commit to version control; the full path template is configurable via `TestConfig.snapshotPathTemplate` [raw/playwright--visual-comparisons.md]. An explicit snapshot path (string or array of path segments) must stay inside that per-test-file snapshots directory or the call throws [raw/playwright--visual-comparisons.md]. To avoid hover-state pollution, the guide recommends moving the mouse to `(-1, -1)` (or hovering a no-effect element) before the assertion [raw/playwright--visual-comparisons.md]. Non-image content (text, arbitrary binary) can be diffed the same way via `expect(value).toMatchSnapshot(name)`, auto-detecting the content type [raw/playwright--visual-comparisons.md].

Environment-sensitivity warning, stated directly: "Browser rendering can vary based on the host OS, version, settings, hardware, power source (battery vs. power adapter), headless mode, and other factors. For consistent screenshots, run tests in the same environment where the baseline screenshots were generated." [raw/playwright--visual-comparisons.md]

### 9. Locators and bounding boxes

- `locator.boundingBox()` returns `{x, y, width, height}` (floats, pixels) or `null` if the element is not visible; calculated relative to the main frame's viewport (usually the same as the browser window) [raw/playwright--locators-bounding-box.md].
- Scrolling affects the returned box the same way it affects `Element.getBoundingClientRect`, so `x`/`y` can be negative [raw/playwright--locators-bounding-box.md].
- Elements inside child frames return a bounding box relative to the **main frame**, which differs from native `Element.getBoundingClientRect` behavior [raw/playwright--locators-bounding-box.md].
- On a static page it is safe to use the returned coordinates to drive input, e.g. clicking the element's center via `page.mouse.click(box.x + box.width/2, box.y + box.height/2)` [raw/playwright--locators-bounding-box.md].
- `elementHandle.boundingBox()` has an identical return shape and the same scrolling/child-frame caveats, but `ElementHandle` itself is not the recommended API surface for new code [raw/playwright--locators-bounding-box.md].
- `locator.scrollIntoViewIfNeeded()`: waits for actionability checks, then scrolls the element into view unless it is already fully visible per IntersectionObserver's `ratio` [raw/playwright--locators-bounding-box.md].
- `elementHandle.scrollIntoViewIfNeeded()` is explicitly marked **discouraged** in favor of the locator-based method; it throws if the handle is not connected to a Document or ShadowRoot [raw/playwright--locators-bounding-box.md].
- General scrolling guidance: most actions auto-scroll the target into view, so explicit scrolling is rarely needed; when it is (e.g. forcing an infinite list to load more content, or positioning the page for a specific screenshot), `locator.scrollIntoViewIfNeeded()` is "the most reliable way." For finer control, use `page.mouse.wheel(dx, dy)` after hovering the scroll container, or `locator.evaluate(el => el.scrollTop += 100)` [raw/playwright--locators-bounding-box.md].
- Explicit recommendation for capture-adjacent code: "For any new capture-tooling code (e.g. scrolling an element into view before a `page.screenshot()` or `locator.screenshot()` call, or computing precise mouse-click coordinates for a masked/clipped screenshot), prefer the `Locator` APIs" over `ElementHandle` [raw/playwright--locators-bounding-box.md].

### 10. Open shadow DOM piercing

research gap: none of the ten `playwright--*.md` raw files fetched for this distillation is dedicated to shadow DOM piercing in locators; the only shadow-DOM-relevant statements found are narrower, both from the screenshots file: the `style` stylesheet option (and its `stylePath` file-based counterpart) "pierces the Shadow DOM and applies to the inner frames" when applied during a screenshot [raw/playwright--screenshots.md], and the `toHaveScreenshot()` `stylePath` option carries the same pierce-Shadow-DOM/inner-frames behavior for visual-comparison screenshots [raw/playwright--visual-comparisons.md]. No statement in these ten files describes general locator-to-shadow-DOM piercing (e.g. whether `page.locator()` queries pierce open shadow roots by default), so that broader claim is not sourced here. A separate raw file exists in the same directory under a different naming pattern (`code--playwright-locators-shadow-dom.md`) that appears to cover this topic, but it falls outside the `playwright--*.md` glob this distillation was scoped to, so its content is not represented above.

### Implications for capture scripts

- Default to `locator.screenshot()` for a single component/inconsistency-audit target and `page.screenshot({fullPage: true})` for whole-page captures; never mix `fullPage`/`clip` into a locator call, since those options are not accepted there [raw/playwright--screenshots.md].
- Explicitly set `animations: 'disabled'` on every `page.screenshot()`/`locator.screenshot()` call used for deterministic UI-inventory or diffing work, since the plain screenshot APIs default to `'allow'` (unlike `toHaveScreenshot()`, which already defaults to `'disabled'`) [raw/playwright--screenshots.md] [raw/playwright--visual-comparisons.md].
- Pick `scale: 'css'` deliberately when file size or pixel-for-pixel CSS-space comparison matters, since plain screenshots default to `scale: 'device'` and will silently double (or more) the output size on high-DPI capture machines [raw/playwright--screenshots.md].
- Use `mask` (with a distinct `maskColor` if the default pink would collide with the UI under test) to blank out timestamps, avatars, or other non-deterministic regions before diffing, and use `style`/`stylePath` for structural hiding (e.g. iframes) that also needs to reach into open shadow DOM or inner frames [raw/playwright--screenshots.md].
- Move the mouse off-target (e.g. `page.mouse.move(-1, -1)`) before any screenshot intended for pixel comparison, to avoid capturing incidental `:hover` states [raw/playwright--visual-comparisons.md].
- For authenticated capture runs, drive login once, persist via `browserContext.storageState({path})`, and reuse that file across capture jobs; store it outside version control (gitignored `playwright/.auth`-style directory) because it can carry impersonation-capable cookies [raw/playwright--authentication.md].
- Treat `storageState` as capable of going stale with no built-in signal: a capture pipeline should either regenerate it on a schedule, write it to a run-scoped, auto-cleaned directory to force fresh login each run, or detect auth failure at capture time and re-run the login flow, since Playwright will not tell you the state expired [raw/playwright--authentication.md].
- Session storage is not covered by `storageState` at all; if the target app depends on it, the capture script needs the manual dump/replay `page.evaluate`/`context.addInitScript` pattern, or it will silently start unauthenticated for that piece of state [raw/playwright--authentication.md].
- When recording demo video, set `recordVideo.size` (or the equivalent viewport) deliberately rather than relying on the 800x800/800x450 default scale-down, and always close the owning context/page before reading `video.path()` or calling `saveAs()`, since videos are only guaranteed written to disk at that point [raw/playwright--browser-context-options.md] [raw/playwright--videos.md].
- For debugging a failed capture run (not for the capture artifact itself), start `context.tracing.start({screenshots, snapshots, sources: true})` before any navigation and `stop({path})` after, using the direct `BrowserContext.tracing` API rather than the Test Runner's `trace` config option, since a headless capture tool is explicitly the case the docs say should use the direct API [raw/playwright--tracing.md].
- For network isolation during capture (e.g. preventing a screenshot job from wandering off-origin via a redirect or embedded link), install a `page.route('**/*', ...)` handler that inspects `route.request().url()` (and, for navigations specifically, `route.request().isNavigationRequest()`) and calls `route.abort()` for anything off-origin, `route.continue()` otherwise; there is no ready-made "block off-origin navigation" helper documented, this must be hand-assembled from `route.abort(errorCode)`, `route.request()`, and `isNavigationRequest()` [raw/playwright--network-routing.md].
- Remember that request-side headers owned by the network stack (`Cookie`, `Host`, `Sec-Fetch-*`, etc.) are not visible or overridable from inside a route handler, so origin-based blocking logic must key off `request.url()`, not header inspection [raw/playwright--network-routing.md].
- Prefer `connectOverCDP` only for attaching to an already-running, externally-managed browser (e.g. a user's real profile or an existing debug-port session), and prefer `launchPersistentContext` when the capture tool itself should own a durable, reusable profile directory across runs; do not expect `storageState` to work with `launchPersistentContext`, since it explicitly does not accept that option, pre-seed the `userDataDir` itself instead [raw/playwright--cdp-persistent-context.md].
- Never point `launchPersistentContext`'s `userDataDir` at a real default Chrome profile directory; Chrome's own policy blocks automating that profile and can cause pages to fail to load or the browser to exit, use a dedicated empty automation profile directory [raw/playwright--cdp-persistent-context.md].
- When computing click targets or crop rectangles from `locator.boundingBox()`, account for the fact that coordinates are relative to the main frame (not child frames) and can be negative after scrolling; re-resolve via the Locator (not a cached `ElementHandle`) immediately before use to avoid stale coordinates [raw/playwright--locators-bounding-box.md].
- If building a visual-regression gate on top of raw screenshots (outside the Playwright Test runner's own `toHaveScreenshot()`), the capture script must implement its own pixelmatch-equivalent threshold/maxDiffPixels/maxDiffPixelRatio logic, none of that comparison machinery is described as available outside `expect(page).toHaveScreenshot()`, which itself is JS/Playwright-Test-only [raw/playwright--visual-comparisons.md].

---

### Sources (raw files read in full for this distillation)

- raw/playwright--screenshots.md
- raw/playwright--browser-context-options.md
- raw/playwright--authentication.md
- raw/playwright--videos.md
- raw/playwright--tracing.md
- raw/playwright--network-routing.md
- raw/playwright--cdp-persistent-context.md
- raw/playwright--visual-comparisons.md
- raw/playwright--locators-bounding-box.md
- raw/playwright--emulation.md

## 02. Component inventory and design tokens

Source material: all files under `references/research/raw/inventory--*.md`. Every claim below is cited to its source file. No training-data facts are included; anything not present in the raw files is marked "research gap:".

### DTCG Format Module 2025.10

#### Identity and stability

The Design Tokens Format Module is published by the Design Tokens Community Group (DTCG) under the W3C Community Final Specification Agreement, at status "Final Community Group Report," dated 28 October 2025, and is explicitly "considered stable," with future updates arriving only through superseding specifications [raw/inventory--dtcg-format-spec.md]. The publication URL is `https://www.designtokens.org/TR/2025.10/format/` [raw/inventory--dtcg-format-spec.md]. Editors are Louis Chenais, Kathleen McMahon, Drew Powers, Matthew Strom-Awn, and Donna Vitan [raw/inventory--dtcg-format-spec.md]. A separate "living draft" copy exists at `https://www.designtokens.org/tr/drafts/format/` and is explicitly marked "do not implement anything in this document," so the stable 2025.10 release, not the draft, is the normative source [raw/inventory--dtcg-format-spec.md]. The companion Color Module carries the same version, date, and stability status, published at `https://www.designtokens.org/TR/2025.10/color/`, edited by Ayesha Mazrana, Kathleen McMahon, Adekunle Oduye, and Matthew Strom-Awn [raw/inventory--dtcg-color-module.md].

#### File shape

A design token file is JSON (RFC 8259), chosen for broad standard-library support, human readability/hand-editability, and version-control friendliness [raw/inventory--dtcg-format-spec.md]. The recommended media type is `application/design-tokens+json`; because every token file is valid JSON, files may also be served as `application/json`, and tools "MUST support both media types" [raw/inventory--dtcg-format-spec.md]. Recommended file extensions are `.tokens` (succinct) or `.tokens.json` (verbose, for JSON-editor compatibility); tools that save token files "SHOULD" append one of these [raw/inventory--dtcg-format-spec.md].

#### `$value`, `$type`, `$description` and other reserved properties

A design token is "information associated with a human readable name, at minimum a name/value pair," and "an object with a `$value` property is a token" [raw/inventory--dtcg-format-spec.md]. `$value` is required on every token; its content varies by type [raw/inventory--dtcg-format-spec.md].

`$type` is conditional: if not set directly on a token, it must be resolvable by walking up through the resolved group's `$type`, then the parent group's `$type`, and the token is invalid if no type can be determined this way; tools "MUST NOT" infer type by inspecting the value itself [raw/inventory--dtcg-format-spec.md].

`$description` is an optional plain JSON string explaining the token's purpose, usable by tools in style guides, IDEs, design tools, or as source comments [raw/inventory--dtcg-format-spec.md].

`$deprecated` is optional and takes `true` (deprecated, no explanation), `false` (not deprecated, overrides defaults), or a string (deprecated with an explanation, which tools may augment by resolving embedded token aliases to documentation links) [raw/inventory--dtcg-format-spec.md].

`$extensions` is an optional vendor-specific metadata object; each tool "MUST" use a vendor-specific key (reverse domain notation recommended, e.g. `"org.example.tool-a"`), and tools processing token files "MUST preserve any extension data they do not themselves understand" [raw/inventory--dtcg-format-spec.md].

Token and group names must not begin with `$` and must not contain `{`, `}`, or `.`, a restriction that exists specifically to keep the reference syntax unambiguous [raw/inventory--dtcg-format-spec.md].

All spec-defined properties are `$`-prefixed (`$value`, `$type`, `$description`, `$extensions`, `$deprecated`, `$root`, `$extends`, `$ref`), and the spec states this convention will continue for any future properties [raw/inventory--dtcg-format-spec.md].

#### Groups

A group is a JSON object that does not contain `$value`; groups provide arbitrary hierarchical organization and may hold nested tokens and groups [raw/inventory--dtcg-format-spec.md]. An object cannot be both a token and a group: if it has both `$value` and child tokens/groups, this "creates an invalid structure" and tools "MUST report this as an error" [raw/inventory--dtcg-format-spec.md].

Groups may declare a root token via the reserved name `$root`, referenced with the pattern `{group.$root}` [raw/inventory--dtcg-format-spec.md].

Group-level properties: `$description` (optional text), `$type` (default type inherited by children unless overridden), `$extends` (inherits tokens/properties from another group, JSON Schema `$ref`-style), `$deprecated` (marks group and children deprecated), `$extensions` (vendor metadata) [raw/inventory--dtcg-format-spec.md]. When a group has `$type`, all child tokens inherit it unless they declare their own `$type` [raw/inventory--dtcg-format-spec.md].

`$extends` resolution: locate the target group, copy inherited tokens/properties, apply local overrides at the same paths (local wins, full replacement not property-merge), and add any new local tokens at different paths, which coexist [raw/inventory--dtcg-format-spec.md]. Groups "MUST NOT" form circular inheritance chains (e.g. `a -> b -> c -> a`), and tools must detect and error on cycles [raw/inventory--dtcg-format-spec.md].

#### Aliases / references

Two mechanisms exist. Curly-brace syntax, `{group.token}` (nesting: `{group.subgroup.token}`), targets a complete token value and always resolves to `$value`; it cannot address individual properties or array elements [raw/inventory--dtcg-format-spec.md]. JSON Pointer syntax (RFC 6901), `"$ref": "#/path/to/target"`, is required support ("tools implementing this specification MUST support JSON Pointer syntax") and can address any document location including array indices and sub-properties such as a color's `hex` field or a single `components` element [raw/inventory--dtcg-format-spec.md]. Aliases may chain (alias -> alias -> explicit value), and tools follow the chain to resolution; references "MUST NOT be circular," and a circular reference is reported as an error affecting every token in the cycle [raw/inventory--dtcg-format-spec.md].

#### Token type table

| Type | Category | Structure | Source |
|---|---|---|---|
| color | atomic | `$value` object: `colorSpace` (string, required), `components` (array of number or `'none'`, required), `alpha` (0-1, optional, default 1), `hex` (6-digit CSS hex fallback, optional); `$type` must be `"color"` | [raw/inventory--dtcg-color-module.md] |
| dimension | atomic | `{value: number, unit: "px"\|"rem"}`; only `px`/`rem` permitted; px = idealized viewport pixel (~Android dp, iOS pt); rem = multiple of system default font size (~Android 16sp) | [raw/inventory--dtcg-format-spec.md] |
| fontFamily | atomic | single string or ordered array of strings, e.g. `"Comic Sans MS"` or `["Helvetica","Arial","sans-serif"]` | [raw/inventory--dtcg-format-spec.md] |
| fontWeight | atomic | numeric [1,1000] or string alias (thin/hairline=100 ... extra-black/ultra-black=950); out-of-range numbers or unlisted strings "MUST be rejected" | [raw/inventory--dtcg-format-spec.md] |
| duration | atomic | `{value: number, unit: "ms"\|"s"}` | [raw/inventory--dtcg-format-spec.md] |
| cubicBezier | atomic | `[P1x,P1y,P2x,P2y]`; Y unrestricted, X restricted to [0,1] | [raw/inventory--dtcg-format-spec.md] |
| number | atomic | unitless numeric (pos/neg/fractional); used for gradient stop positions and unitless line-heights | [raw/inventory--dtcg-format-spec.md] |
| strokeStyle | composite | predefined string (`solid`,`dashed`,`dotted`,`double`,`groove`,`ridge`,`outset`,`inset`, aligned with CSS `border-style`) or object `{dashArray:[dimension,...], lineCap:"round"\|"butt"\|"square"}` | [raw/inventory--dtcg-format-spec.md] |
| border | composite | `{color, width: dimension, style: strokeStyle}`, each sub-value a literal or reference | [raw/inventory--dtcg-format-spec.md] |
| transition | composite | `{duration, delay, timingFunction: cubicBezier}` | [raw/inventory--dtcg-format-spec.md] |
| shadow | composite | `{color, offsetX: dimension, offsetY: dimension, blur: dimension, spread: dimension}`; single object or array (no flattening) | [raw/inventory--dtcg-format-spec.md] |
| gradient | composite | full definition in spec section 9.7 (not detailed further in the archived excerpt) | [raw/inventory--dtcg-format-spec.md] |
| typography | composite | complete text styling, full definition in spec section 9.8 combining font family, size, weight, line height, etc. (not detailed further in the archived excerpt) | [raw/inventory--dtcg-format-spec.md] |

research gap: the raw files do not reproduce the full field-by-field structure of the `gradient` and `typography` composite types beyond naming their component concepts [raw/inventory--dtcg-format-spec.md].

#### Color Module value object detail

Required color `$value` fields are `colorSpace` and `components`; optional fields are `alpha` (default 1, "0 is fully transparent and 1 is fully opaque") and `hex` ("MUST be formatted in 6 digit CSS hex color notation") [raw/inventory--dtcg-color-module.md]. Each `components` array element "MUST be either: A number" or the literal `'none'`, used "to indicate that a component is not applicable" [raw/inventory--dtcg-color-module.md]. Supported `colorSpace` values and their component structure:

| colorSpace key | Components |
|---|---|
| `srgb` | [R,G,B] 0-1 |
| `srgb-linear` | [R,G,B] 0-1 |
| `hsl` | [Hue,Saturation,Lightness] |
| `hwb` | [Hue,Whiteness,Blackness] |
| `lab` | [Lightness,A,B] |
| `lch` | [Lightness,Chroma,Hue] |
| `oklab` | [Lightness,A,B] |
| `oklch` | [Lightness,Chroma,Hue] |
| `display-p3` | [R,G,B] 0-1 |
| `a98-rgb` | [R,G,B] 0-1 |
| `prophoto-rgb` | [R,G,B] 0-1 |
| `rec2020` | [R,G,B] 0-1 |
| `xyz-d65` | [X,Y,Z] 0-1 |
| `xyz-d50` | [X,Y,Z] 0-1 |

[raw/inventory--dtcg-color-module.md]

The Color Module normatively defers to CSS Color Module Level 4 as its baseline for color-science concepts [raw/inventory--dtcg-color-module.md].

### Browser APIs for extraction

#### `getComputedStyle`

`window.getComputedStyle(element, pseudoElt?)` returns a **live, read-only** `CSSStyleProperties` object (a `CSSStyleDeclaration` in older specs) holding resolved CSS values after applying active stylesheets and resolving computations; it updates automatically as the element's styles change via other APIs [raw/inventory--mdn-window-getcomputedstyle.md]. It throws `TypeError` if the argument is not an `Element`, or if `pseudoElt` is invalid or is `::part()`/`::slotted()` [raw/inventory--mdn-window-getcomputedstyle.md]. Shorthand properties are expanded to longhands (e.g. `border-top` yields `border-top-color`, `border-top-style`, `border-top-width` both dash- and camelCase) [raw/inventory--mdn-window-getcomputedstyle.md]. Color serialization: sRGB with alpha=1 serializes as `rgb(255, 0, 0)`; other alphas as `rgba(...)`; other color spaces may appear as `lab()`, `lch()`, `oklab()`, `oklch()`, `color()` [raw/inventory--mdn-window-getcomputedstyle.md]. Browsers may deliberately return inaccurate values for visited links to prevent CSS-history leaks [raw/inventory--mdn-window-getcomputedstyle.md]. Baseline support: widely available since July 2015 [raw/inventory--mdn-window-getcomputedstyle.md].

#### `getPropertyValue` (including custom properties)

`CSSStyleDeclaration.getPropertyValue(property)` (property in hyphen case, including custom property names like `--my-custom-property`) returns a string of the dynamically computed value, or an empty string if unset [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md]. Values are canonicalized: colors normalize to `rgb()`/`rgba()`, shorthands expand to longhand components, and a shorthand with mixed `!important` or undeclared components returns an empty string [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md]. Example: `hsl(250 90 50)` as declared returns `"rgb(51, 13, 242)"` from `getPropertyValue("color")` [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md]. This method is the mechanism for reading custom properties off any `CSSStyleDeclaration`, including the object `getComputedStyle()` returns, e.g. `getComputedStyle(el).getPropertyValue('--my-custom-property')`; custom-property values come back as their serialized, untyped string exactly as declared/resolved [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md]. Baseline support: widely available since July 2015 [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md].

#### `getBoundingClientRect`

`Element.getBoundingClientRect()` takes no parameters and returns a `DOMRect` with `x`/`left`, `y`/`top`, `right`, `bottom`, `width`, `height` [raw/inventory--mdn-element-getboundingclientrect.md]. The rectangle is the smallest box containing the element including padding and border-width; with `box-sizing: border-box`, width/height equal the CSS width/height directly [raw/inventory--mdn-element-getboundingclientrect.md]. Coordinates (other than width/height) are relative to the viewport top-left, not the document, so they change on scroll; document-relative coordinates require adding `window.scrollY`/`window.scrollX` [raw/inventory--mdn-element-getboundingclientrect.md]. Empty border-boxes are ignored; if all boxes are empty, the method returns width:0, height:0 [raw/inventory--mdn-element-getboundingclientrect.md]. Baseline: widely available since July 2015 [raw/inventory--mdn-element-getboundingclientrect.md].

#### `compareDocumentPosition`

`Node.compareDocumentPosition(otherNode)` returns an integer bitmask (or `0` if same node) combining: `DOCUMENT_POSITION_DISCONNECTED` (1, different documents/trees), `DOCUMENT_POSITION_PRECEDING` (2), `DOCUMENT_POSITION_FOLLOWING` (4), `DOCUMENT_POSITION_CONTAINS` (8, otherNode is an ancestor), `DOCUMENT_POSITION_CONTAINED_BY` (16, otherNode is a descendant), `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` (32) [raw/inventory--mdn-node-comparedocumentposition.md]. Bits are checked with bitwise AND, e.g. `head.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING` [raw/inventory--mdn-node-comparedocumentposition.md]. Baseline: widely available since July 2015 [raw/inventory--mdn-node-comparedocumentposition.md].

#### `CSSStyleSheet.cssRules` and cross-origin `SecurityError`

`cssRules` is a read-only property returning a **live** `CSSRuleList` of every rule in the stylesheet; it updates in real time as the stylesheet changes and is not a proper array, so `forEach` requires `Array.from()` first [raw/inventory--mdn-cssstylesheet-cssrules.md]. Baseline: widely available since July 2015 [raw/inventory--mdn-cssstylesheet-cssrules.md]. Cross-origin restriction: "In some browsers, if a stylesheet is loaded from a different domain, accessing `cssRules` results in a `SecurityError`": this applies equally to the legacy `rules` property and is a deliberate privacy/anti-leak measure [raw/inventory--mdn-cssstylesheet-cssrules.md]. Practical implication called out directly in the source: extraction tooling iterating `document.styleSheets` must catch/handle `SecurityError` or pre-filter stylesheets whose `cssRules` access throws [raw/inventory--mdn-cssstylesheet-cssrules.md].

### Color serialization: lab(), oklab(), oklch(), color-mix()

#### `lab()`

Syntax `lab(L a b [/ A])`, absolute or relative (`lab(from <color> L a b [/ A])`); Baseline widely available since May 2023 [raw/inventory--mdn-css-lab.md]. L: number/percentage/none, range 0-100 or 0%-100%, 0=black/100=white [raw/inventory--mdn-css-lab.md]. a/b: number/percentage/none, range -125..125 or -100%..100%, negative a=green/positive a=red, negative b=blue/positive b=yellow; "in practice, values cannot exceed +-160" though theoretically unbounded [raw/inventory--mdn-css-lab.md]. Alpha 0-1, default 100% if omitted [raw/inventory--mdn-css-lab.md]. Percentage mapping: L 100%=100; a/b 100%=125, -100%=-125 [raw/inventory--mdn-css-lab.md]. `none` defaults to 0% in absolute mode; in relative colors it takes the origin color's value, and unspecified relative alpha defaults to the origin's alpha [raw/inventory--mdn-css-lab.md].

#### `oklab()`

Syntax `oklab(L a b [/ A])`, absolute or relative; Baseline widely available since May 2023 [raw/inventory--mdn-css-oklab.md]. Useful for grayscale conversion preserving perceived lightness, saturation modification preserving hue/lightness, and smooth uniform gradients [raw/inventory--mdn-css-oklab.md]. L: 0-1 or 0%-100%, 0=black/1=white [raw/inventory--mdn-css-oklab.md]. a/b: -0.4 to 0.4 or -100% to 100% (negative a=green/positive a=red; negative b=blue/positive b=yellow); "practically cannot exceed +-0.5" [raw/inventory--mdn-css-oklab.md]. Cartesian (not polar): use `oklch()` for hue/chroma polar form [raw/inventory--mdn-css-oklab.md]. Relative alpha defaults to the origin color's alpha if unspecified [raw/inventory--mdn-css-oklab.md].

#### `oklch()`

Syntax `oklch(L C H [/ A])`, absolute or relative; Baseline widely available since May 2023 [raw/inventory--mdn-css-oklch.md]. It is "the cylindrical form of `oklab()`," sharing the L axis with polar Chroma (C) and Hue (H) [raw/inventory--mdn-css-oklch.md]. L: 0-1 or 0%-100% [raw/inventory--mdn-css-oklch.md]. C: number/percentage/none, minimum 0, practical maximum ~0.4 (unbounded theoretically); "100% does NOT equal 1 for chroma; instead, 100% = 0.4" [raw/inventory--mdn-css-oklch.md]. H: number/angle/none, default 0deg; hue angles differ across oklch/hsl/lch: in oklch 0deg is magenta and ~41deg is roughly red, unlike hsl where 0deg is red and 300deg is magenta [raw/inventory--mdn-css-oklch.md]. Relative form exposes `l` (0-1), `c` (0-0.4), `h` (0-360), `alpha` (0-1) from the origin color for use in `calc()` [raw/inventory--mdn-css-oklch.md].

#### `color-mix()`

Syntax `color-mix(<color-interpolation-method>?, [<color> && <percentage>?]#)`; Widely available since May 2023 [raw/inventory--mdn-css-color-mix.md]. Interpolation method: `in <color-space> [<hue-interpolation-method>]?` [raw/inventory--mdn-css-color-mix.md]. Rectangular color spaces: `srgb`, `srgb-linear`, `display-p3`, `display-p3-linear`, `a98-rgb`, `prophoto-rgb`, `rec2020`, `lab`, `oklab`, `xyz`, `xyz-d50`, `xyz-d65` [raw/inventory--mdn-css-color-mix.md]. Polar color spaces: `hsl`, `hwb`, `lch`, `oklch`, each with hue interpolation `shorter hue` (default), `longer hue`, `increasing hue`, `decreasing hue` [raw/inventory--mdn-css-color-mix.md]. Default interpolation space: `oklab` with `shorter hue`: i.e. `color-mix(red, blue)` == `color-mix(in oklab, red, blue)` == `color-mix(in oklab shorter hue, red, blue)` [raw/inventory--mdn-css-color-mix.md]. Percentage normalization rules: both omitted -> 50/50; one omitted -> other subtracted from 100%; sum != 100% -> both normalized proportionally (`p1' = p1/(p1+p2)`); sum < 100% -> an alpha multiplier of `(p1+p2)` is applied (equivalent to mixing with transparent); both 0% is invalid [raw/inventory--mdn-css-color-mix.md]. Guidance given in the source: linear light intensity mixing favors `xyz`/`srgb-linear`; perceptually uniform gradients favor `oklab`/`lab`; maximum-chroma mixing favors `oklch`/`lch`; plain `srgb` is called out as neither linear nor perceptually uniform and to be avoided [raw/inventory--mdn-css-color-mix.md].

#### Relation to sRGB

`lab()`, `oklab()`, `oklch()`, and `color-mix()` are all defined against the CSS Color Module Level 4/5 specs, which model color spaces (including sRGB) as points reachable via defined conversion matrices; sRGB is one of the rectangular interpolation spaces `color-mix()` can operate in directly [raw/inventory--mdn-css-color-mix.md] [raw/inventory--mdn-css-lab.md] [raw/inventory--mdn-css-oklab.md] [raw/inventory--mdn-css-oklch.md]. research gap: the raw files do not reproduce the CIE XYZ<->sRGB gamma/matrix conversion itself, only the Oklab<->XYZ matrices covered next [raw/inventory--mdn-css-oklab.md].

#### Oklab conversion matrices (Ottosson, archived exactly)

Bjorn Ottosson's Oklab was designed to be an opponent color space (like CIELAB) that predicts lightness/chroma/hue well with L, C, h roughly orthogonal, gives even blending transitions, assumes a D65 whitepoint, behaves well numerically, assumes normal well-lit viewing conditions, and is scale-invariant under exposure changes [raw/inventory--oklab-bottosson.md]. Conversion structure: XYZ -> LMS via matrix M1 (approximate cone response), then a cube-root nonlinearity `l'=l^(1/3)` etc., then LMS' -> Lab via matrix M2 [raw/inventory--oklab-bottosson.md]. Polar form matches OKLCH: `C = sqrt(a^2+b^2)`, `h = atan2(b,a)` [raw/inventory--oklab-bottosson.md]. The matrices as archived in the raw file:

M1 (XYZ to LMS):
```
[+0.8189330101  +0.3618667424  -0.1288597137]
[+0.0329845436  +0.9293118715  +0.0361456387]
[+0.0482003018  +0.2643662691  +0.6338517070]
```

M2 (LMS' to Lab, after cube-root nonlinearity):
```
[+0.2104542553  +0.7936177850  -0.0040720468]
[+1.9779984951  -2.4285922050  +0.4505937099]
[+0.0259040371  +0.7827717662  -0.8086757660]
```
[raw/inventory--oklab-bottosson.md]

Ottosson also provides optimized coefficients for a direct linear-sRGB -> LMS -> Oklab path that skips the intermediate XYZ step, released with reference C++ code under a public-domain/MIT-equivalent license [raw/inventory--oklab-bottosson.md]. research gap: the raw file references this direct-sRGB coefficient set by description only; it does not reproduce the numeric direct-sRGB-to-LMS matrix values themselves [raw/inventory--oklab-bottosson.md].

Derivation: Ottosson optimized against three datasets (CAM16 constant-lightness colors, CAM16 constant-chroma colors, uniform-perceived-hue experimental data) scored by CIEDE2000 error; the nonlinearity exponent converged to ~1/3 and was fixed at exactly 1/3 in the final model [raw/inventory--oklab-bottosson.md]. Comparative findings: CIELAB/CIELUV "largest issue is their inability to predict hue... blue hues are predicted badly"; CAM16-UCS is excellent perceptually but numerically unstable and not scale-invariant; IPT models hue uniformity well but not lightness/chroma; HSV "does not meet any of the requirements" and is included only because of its ubiquity [raw/inventory--oklab-bottosson.md]. Adoption note from the source: Oklab/OKLCH is the color space referenced normatively by CSS Color Module Level 4's `oklab()`/`oklch()` and by the DTCG Color Module's `oklab`/`oklch` color spaces; Tailwind CSS v4's default palette is expressed in OKLCH [raw/inventory--oklab-bottosson.md].

### Tailwind v4

#### `@theme` variables and the utility mapping

Theme variables are CSS variables defined with `@theme`; they must sit at the top level (not nested in selectors or media queries), and defining one both creates new utility classes and emits a regular CSS variable, e.g. `--color-mint-500: oklch(0.72 0.11 178)` creates `bg-mint-500`, `text-mint-500`, `fill-mint-500`, plus `var(--color-mint-500)` [raw/inventory--tailwind-v4-theme.md]. `@theme` differs from `:root`: use `@theme` for tokens that should drive utilities, `:root` for variables that should not [raw/inventory--tailwind-v4-theme.md]. All theme variables also compile onto `:root` as plain CSS variables, and by default only used variables are emitted, unless `@theme static` forces all of them to generate [raw/inventory--tailwind-v4-theme.md]. `@theme inline` resolves referenced variables' values directly into utilities rather than leaving a `var()` indirection, avoiding resolution issues [raw/inventory--tailwind-v4-theme.md]. Runtime reads are possible via `getComputedStyle(document.documentElement).getPropertyValue("--shadow-xl")` [raw/inventory--tailwind-v4-theme.md].

Namespace-to-utility table:

| Namespace | Utility classes / effect |
|---|---|
| `--color-*` | color utilities (`bg-red-500`, `text-sky-300`, etc.) |
| `--font-*` | font family utilities (`font-sans`, `font-serif`) |
| `--text-*` | font size utilities (`text-xl`) |
| `--font-weight-*` | font weight utilities (`font-bold`) |
| `--tracking-*` | letter spacing (`tracking-wide`) |
| `--leading-*` | line height (`leading-tight`) |
| `--breakpoint-*` | responsive variants (`sm:*`, `md:*`) |
| `--spacing-*` | spacing/sizing utilities (`px-4`, `max-h-16`) |
| `--radius-*` | border radius (`rounded-sm`) |
| `--shadow-*` | box shadow (`shadow-md`) |
| `--blur-*` | blur filter (`blur-md`) |
| `--animate-*` | animation utilities (`animate-spin`) |
| `--ease-*` | timing functions (`ease-out`) |
| `--aspect-*` | aspect ratios (`aspect-video`) |

[raw/inventory--tailwind-v4-theme.md]

Customization mechanics: adding a new `--color-*`/`--font-*` variable extends the theme and creates a new utility; redefining an existing variable (e.g. `--breakpoint-sm`) overrides its behavior; setting a namespace to `initial` (e.g. `--color-lime-*: initial`) disables just that slice of defaults; setting `--color-*: initial` (or `--*: initial` for everything) clears a namespace/the whole theme so only explicitly listed tokens remain [raw/inventory--tailwind-v4-theme.md].

Color utility surface (from the colors-specific doc): `bg-*`, `text-*`, `decoration-*`, `border-*`, `outline-*`, `shadow-*`, `inset-shadow-*`, `ring-*`, `inset-ring-*`, `accent-*`, `caret-*`, `scrollbar-thumb-*`, `scrollbar-track-*`, `fill-*`, `stroke-*` [raw/inventory--tailwind-v4-colors.md]. Opacity is applied via `/` syntax with values 10-100 (e.g. `bg-sky-500/50`), and also supports arbitrary values and CSS-variable-driven alpha, e.g. `bg-pink-500/[71.37%]`, `bg-cyan-400/(--my-alpha-value)` [raw/inventory--tailwind-v4-colors.md]. An `--alpha()` function exists for compositing an alpha value onto a variable, e.g. `--alpha(var(--color-gray-950) / 10%)` [raw/inventory--tailwind-v4-colors.md].

#### OKLCH default palette

Tailwind v4's default palette has 26 color families (red, orange, amber, yellow, pink, rose, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, slate, gray, zinc, neutral, stone, mauve, mist, olive, taupe, fuchsia) plus black/white, each with 11 shades (50,100,200,300,400,500,600,700,800,900,950), all expressed in OKLCH format and exposed as CSS variables in the `--color-*` namespace [raw/inventory--tailwind-v4-colors.md]. Example values (sky): `--color-sky-50: oklch(97.7% 0.013 236.62)` through `--color-sky-950: oklch(29.3% 0.066 243.157)` [raw/inventory--tailwind-v4-colors.md]. Colors can be referenced in custom CSS via `var(--color-gray-950)`, and can be overridden with explicit OKLCH literals such as `--color-gray-50: oklch(0.984 0.003 247.858)` [raw/inventory--tailwind-v4-colors.md].

#### `@custom-variant` dark mode

By default, the `dark` variant uses the `prefers-color-scheme` media feature [raw/inventory--tailwind-v4-dark-mode.md]. It can be overridden to a manual selector strategy via `@custom-variant`: class-based, `@custom-variant dark (&:where(.dark, .dark *));`, toggled by adding `class="dark"` to `<html>`; or data-attribute-based, `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`, toggled via `data-theme="dark"` [raw/inventory--tailwind-v4-dark-mode.md]. A three-way (light/dark/system) toggle pattern combines `localStorage.theme` with `window.matchMedia("(prefers-color-scheme: dark)")`, applied inline in `<head>` before paint to prevent FOUC: `document.documentElement.classList.toggle("dark", localStorage.theme === "dark" || (!("theme" in localStorage) && matchMedia(...).matches))` [raw/inventory--tailwind-v4-dark-mode.md].

### Style Dictionary DTCG support and transforms

Style Dictionary added "first-class support for the DTCG format" as of version 4 [raw/inventory--style-dictionary-dtcg.md]. Legacy Style Dictionary v3 format uses `value`/`type`/`description` with type stored at the group level; DTCG format uses `$value`/`$type`/`$description` with `$type` moved down to individual tokens [raw/inventory--style-dictionary-dtcg.md]. In v4, the two formats cannot be mixed within one Style Dictionary instance, and the `usesDtcg` config option controls whether platform output treats tokens as `$value`/`$type` or `value`/`type` [raw/inventory--style-dictionary-dtcg.md]. An automated v3-to-DTCG converter exists that renames properties and redistributes `$type` to individual tokens, but explicitly does **not** refactor type values themselves (e.g. it will not turn a legacy `"size"` type into DTCG `"dimension"`) [raw/inventory--style-dictionary-dtcg.md]. When a DTCG color object (`{colorSpace, components, alpha, hex}`) is used, Style Dictionary auto-converts it to a CSS-compatible string if that color space supports it [raw/inventory--style-dictionary-dtcg.md]. Version-support caveat, stated directly in the source: "The latest format 2025.10 does not have full support yet in Style Dictionary. This is a work in progress in v5" [raw/inventory--style-dictionary-dtcg.md]: i.e. the format this skill targets (2025.10) is ahead of Style Dictionary's current full-support level.

#### Transforms

Style Dictionary ships 60+ predefined transforms; from v4 onward they match on `token.type` rather than the legacy CTI (Category/Type/Item) structure [raw/inventory--style-dictionary-transforms.md]. Categories relevant to inventory/token output:

- Attribute: `attribute/cti` (adds category/type/item/subitem/state from token location), `attribute/color` (extracts hex/hsl/hsv/rgb) [raw/inventory--style-dictionary-transforms.md].
- Naming: `name/human`, `name/camel`, `name/kebab`, `name/snake`, `name/constant`, `name/pascal` [raw/inventory--style-dictionary-transforms.md].
- Color: `color/rgb`, `color/hsl`, `color/hsl-4`, `color/hex`, `color/hex8`, `color/hex8android`, plus iOS/Swift/Compose/Sketch/Flutter variants [raw/inventory--style-dictionary-transforms.md].
- Size: `size/px`, `size/rem`, `size/remToPx`, `size/pxToRem`, Android `size/sp`/`size/dp` and rem-to-Android variants, Compose/Swift/Flutter variants, all configurable via `basePxFontSize` (default 16) [raw/inventory--style-dictionary-transforms.md].
- DTCG composite-object transforms: `fontFamily/css` (array -> quoted CSS string), `cubicBezier/css` (-> `cubic-bezier()`), `border/css/shorthand`, `typography/css/shorthand` (e.g. `italic 400 1.2rem/1.5 'Font'`), `transition/css/shorthand`, `shadow/css/shorthand` (multi-shadow, optional color conversion), `strokeStyle/css/shorthand` [raw/inventory--style-dictionary-transforms.md].
- Content: `content/quote`, plus Objective-C/Swift/Flutter string-literal variants [raw/inventory--style-dictionary-transforms.md].
- Asset: `asset/url`, `asset/base64`, `asset/path`, plus language-specific variants [raw/inventory--style-dictionary-transforms.md].
- Misc: `html/icon`, `time/seconds` (ms -> decimal seconds) [raw/inventory--style-dictionary-transforms.md].

### Atomic Design levels and the interface inventory method

#### Atomic Design (Brad Frost)

Five stages, explicitly a mental model rather than a strict linear build order [raw/inventory--atomic-design-brad-frost-ch2.md]:

| Stage | Definition |
|---|---|
| Atoms | Foundational UI elements that cannot be reduced further without losing function (basic HTML elements: buttons, labels, inputs); each carries distinct properties |
| Molecules | Simple groups of atoms combined into functional, reusable, single-responsibility units (e.g. a search form = label + input + button) |
| Organisms | Complex components built from molecules and/or atoms forming a distinct interface section (e.g. a header = logo + navigation + search form) |
| Templates | Components placed in layout, showing "what content _is made_ from" rather than final content: structural guardrails for content variation |
| Pages | Concrete template instances with real representative content, used to validate that patterns serve actual content needs and variations |

[raw/inventory--atomic-design-brad-frost-ch2.md]

Key framing: atomic design lets designers move between abstract (component) and concrete (content-rich) views simultaneously: described as a "dance of switching contexts" akin to a painter stepping back to assess the whole work: and is "not a linear process" (atoms are not always built first) [raw/inventory--atomic-design-brad-frost-ch2.md].

#### Interface inventory method (Brad Frost)

An interface inventory is "a comprehensive collection of the bits and pieces that make up your interface," distinct from a content inventory (which catalogs text) [raw/inventory--interface-inventory-brad-frost.md]. Five-step process: (1) preparation: ready screenshot tooling and project access; (2) template setup: organizational categories in presentation software; (3) capture: screenshot distinct component *treatments*, not every instance, i.e. capture styling variation ("a button with a bevel and right-facing caret vs another without") rather than every occurrence; (4) categorization: group similar treatments for side-by-side comparison; (5) presentation: share findings with stakeholders [raw/inventory--interface-inventory-brad-frost.md]. Stated benefits: it is "the first step at deconstructing pages down to their atomic level" and thus a foundation for a design system; it builds a common interface vocabulary across teams/agencies; it exposes unintentional redundancy/inconsistency; it protects scope coverage in a redesign; and it surfaces which components will be hardest to adapt responsively [raw/inventory--interface-inventory-brad-frost.md]. Frost's own example contrasts PNC Bank's inconsistent button treatments against Etsy's more disciplined, deliberate system [raw/inventory--interface-inventory-brad-frost.md].

### Material Symbols variable icon font and ligatures

Material Symbols consolidate "over 2,500 glyphs in a single font file" in three styles: Outlined, Rounded, Sharp: with four variable-font axes [raw/inventory--material-symbols-guide.md]. Axes: Fill (0=unfilled to 1=filled, useful for animating state transitions), Weight/`wght` (100 thin to 700 bold, affects stroke weight and overall size), Grade/`GRAD` (finer thickness control than weight with minimal size impact; negative values e.g. -25 reduce glare, 200+ emphasizes; can be matched to surrounding text's grade for visual harmony), Optical Size/`opsz` (20dp-48dp, auto-adjusts stroke weight proportionally as size changes) [raw/inventory--material-symbols-guide.md]. Default single-`<link>` load settings: weight 400, optical size 48, grade 0, fill 0 [raw/inventory--material-symbols-guide.md]. Ligatures are the preferred rendering approach: using the icon's textual name (e.g. `arrow_forward`, or `search`) as the element's text content triggers a typographic ligature substitution to the glyph, supported in most modern browsers; numeric codepoint references remain an alternative for legacy browser support [raw/inventory--material-symbols-guide.md]. Subsetting via `&icon_names=` (alphabetically sorted, comma-separated list) can shrink payload dramatically, e.g. "from 295 KB to 1.7 KB" in the documented example [raw/inventory--material-symbols-guide.md]. Self-hosting is supported by downloading from the font's Git repository and declaring custom `@font-face` rules [raw/inventory--material-symbols-guide.md]. Beyond web, the icons are distributed as Android Vector Drawable and Apple Symbols formats, with Flutter support noted as planned [raw/inventory--material-symbols-guide.md].

### ARIA role categories for classifying components

Six categories, per MDN's ARIA roles reference (last updated August 14, 2025) [raw/inventory--mdn-aria-roles-reference.md]:

1. **Document structure roles**: structural descriptions of content sections; most are superseded by semantic HTML. Still-useful roles without an HTML equivalent: `toolbar`, `tooltip`, `feed`, `math`, `presentation`/`none`, `note`. Roles to avoid because an HTML alternative exists: `application`, `article`, `cell`, `columnheader`, `definition`, `directory`, `document`, `figure`, `group`, `heading`, `img`, `list`, `listitem`, `meter`, `row`, `rowgroup`, `rowheader`, `separator`, `table`, `term`. Rarely useful: `associationlist`, `associationlistitemkey`, `associationlistitemvalue`, `blockquote`, `caption`, `code`, `deletion`, `emphasis`, `insertion`, `paragraph`, `strong`, `subscript`, `superscript`, `time` [raw/inventory--mdn-aria-roles-reference.md].
2. **Widget roles**: common interactive patterns, typically requiring JavaScript. Standard: `scrollbar`, `searchbox`, `separator` (when focusable), `slider`, `spinbutton`, `switch`, `tab`, `tabpanel`, `treeitem`. Avoid (native HTML exists): `button`, `checkbox`, `gridcell`, `link`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `option`, `progressbar`, `radio`, `textbox`. Composite: `combobox`, `menu`, `menubar`, `tablist`, `tree`, `treegrid`. Composite roles to avoid: `grid`, `listbox`, `radiogroup` [raw/inventory--mdn-aria-roles-reference.md].
3. **Landmark roles**: organizational structure for screen-reader keyboard navigation, to be used sparingly to avoid "noise": `banner` (`<header>`), `complementary` (`<aside>`), `contentinfo` (`<footer>`), `form` (`<form>`), `main` (`<main>`), `navigation` (`<nav>`), `region` (`<section>`), `search` (`<search>`) [raw/inventory--mdn-aria-roles-reference.md].
4. **Live region roles**: announce dynamic content changes: `alert`, `log`, `marquee`, `status`, `timer` [raw/inventory--mdn-aria-roles-reference.md].
5. **Window roles**: sub-windows within the document: `alertdialog`, `dialog` [raw/inventory--mdn-aria-roles-reference.md].
6. **Abstract roles**: "DO NOT USE IN MARKUP," browser-organization only: `command`, `composite`, `input`, `landmark`, `range`, `roletype`, `section`, `sectionhead`, `select`, `structure`, `widget`, `window` [raw/inventory--mdn-aria-roles-reference.md].

Best practices given directly: prefer semantic HTML when available; use ARIA to enhance, not replace, native elements; ensure roles carry their required states/properties; verify the resulting accessibility tree is accurate [raw/inventory--mdn-aria-roles-reference.md]. Common mistakes flagged: adding `role="tabpanel"` with no nested tabs (false semantics); using abstract roles in content; over-using landmark roles (screen-reader noise); adding ARIA roles without matching keyboard handling [raw/inventory--mdn-aria-roles-reference.md].

### Conflicts and gaps

- No direct conflicts were found among the raw files; the DTCG Format and Color modules, Style Dictionary docs, Tailwind docs, and the four MDN color-function pages are all internally consistent and cross-reference cleanly (e.g. Tailwind's OKLCH palette values are consistent with the `oklch()` range/percentage rules, and the DTCG color space list matches the color-function coverage) [raw/inventory--tailwind-v4-colors.md] [raw/inventory--mdn-css-oklch.md] [raw/inventory--dtcg-color-module.md].
- research gap: the raw files do not cover the DTCG **gradient** and **typography** composite type field lists beyond naming them (spec sections 9.7/9.8 referenced but not excerpted) [raw/inventory--dtcg-format-spec.md].
- research gap: no raw file documents the direct linear-sRGB -> LMS numeric coefficient matrix Ottosson mentions as an optimization of the XYZ-routed path; only its existence and licensing are noted [raw/inventory--oklab-bottosson.md].
- research gap: no raw file addresses `CSSStyleSheet.rules` (legacy alias) behavior beyond noting it is "functionally identical" to `cssRules` for the cross-origin `SecurityError` case [raw/inventory--mdn-cssstylesheet-cssrules.md].
- research gap: none of the raw files describe a DTCG Resolver module in detail; the Color Module inventory names "the Resolver module" only as a sibling of the same 2025.10 release, without further content [raw/inventory--dtcg-color-module.md].

### Implications for inventory and token output

- Emit tokens as DTCG-conformant JSON (`$value`/`$type`/`$description`, correct file extension `.tokens` or `.tokens.json`, `application/design-tokens+json` media type) rather than a bespoke schema, since this is the stable, tool-interoperable format and Style Dictionary v4+ already consumes it [raw/inventory--dtcg-format-spec.md] [raw/inventory--style-dictionary-dtcg.md].
- Never guess `$type` from a captured value; resolve it the way the spec requires (explicit token `$type`, then group `$type` walking up the hierarchy) and mark a token invalid/flag it if no type is determinable, since the spec states tools "MUST NOT" infer type by inspection [raw/inventory--dtcg-format-spec.md].
- For color tokens, capture and emit the DTCG color object shape (`colorSpace`, `components`, optional `alpha`, optional 6-digit `hex` fallback) rather than a bare string, so downstream tools (Style Dictionary's CSS auto-conversion) can consume it directly [raw/inventory--dtcg-color-module.md] [raw/inventory--style-dictionary-dtcg.md].
- Keep the **measured** computed value (from `getComputedStyle`/`getPropertyValue`, which is live and canonicalized, e.g. colors normalized to `rgb()`/`rgba()`) alongside the **described**/authored token value, because the two can legitimately differ after canonicalization and shorthand expansion: recording only one loses information needed to detect drift [raw/inventory--mdn-window-getcomputedstyle.md] [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md].
- When reading custom properties (CSS variables) for token extraction, use `getPropertyValue('--x')` on the live `getComputedStyle()` result, not a static parse of source CSS, since the resolved/serialized value is what actually renders [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md].
- When walking stylesheets directly (e.g. to recover authored `@theme` variable names or original shorthand), iterate `document.styleSheets[*].cssRules` defensively: wrap access in try/catch or pre-check for `SecurityError`, since any cross-origin stylesheet will throw and silently abort an unguarded loop [raw/inventory--mdn-cssstylesheet-cssrules.md].
- For layout/position facts in the inventory (element size, placement, DOM order), use `getBoundingClientRect()` for geometry and `compareDocumentPosition()` for ordering/containment rather than inferring either from CSS alone, and normalize `getBoundingClientRect()` output to document-relative coordinates (add `scrollX`/`scrollY`) before persisting, since raw output is viewport-relative and will drift across captures at different scroll offsets [raw/inventory--mdn-element-getboundingclientrect.md] [raw/inventory--mdn-node-comparedocumentposition.md].
- Prefer `oklch()`/`oklab()` (or the DTCG `oklch`/`oklab` color spaces) as the internal working space when computing color differences or generating palette-consistent shades, since it is the space both the DTCG Color Module and Tailwind v4's default palette already standardize on, and it is perceptually uniform by Ottosson's design goals [raw/inventory--oklab-bottosson.md] [raw/inventory--tailwind-v4-colors.md] [raw/inventory--dtcg-color-module.md].
- If reproducing Oklab math locally (e.g. to convert a captured sRGB value to OKLCH for palette clustering), use the exact M1/M2 matrices as archived above rather than re-deriving or approximating them, to stay faithful to the canonical source [raw/inventory--oklab-bottosson.md].
- When color-mixing or generating derived shades programmatically (e.g. hover/active states) for the token set, default to `color-mix(in oklab, ...)` per the CSS default and the stated guidance to avoid plain `srgb` mixing (neither linear nor perceptually uniform) [raw/inventory--mdn-css-color-mix.md].
- Detect Tailwind v4 projects by the `@theme` block and namespace prefixes (`--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`, `--breakpoint-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--blur-*`, `--animate-*`, `--ease-*`, `--aspect-*`); map each surfaced CSS variable back to its generated utility classes for the component inventory rather than treating them as opaque custom properties [raw/inventory--tailwind-v4-theme.md].
- Record dark-mode capture as a first-class dimension: detect whether a target site drives it via `prefers-color-scheme` (default) or a manual `@custom-variant dark` selector (class- or data-attribute-based), since the two require different capture setups (OS-level emulation vs. DOM class/attribute toggling) [raw/inventory--tailwind-v4-dark-mode.md].
- Where the target uses Style Dictionary, prefer emitting DTCG-shaped source tokens over legacy `value`/`type` tokens, but note the current tooling ceiling: Style Dictionary does not yet fully support the 2025.10 format, so downstream builds may need a legacy-DTCG-compatible subset until v5 lands full support [raw/inventory--style-dictionary-dtcg.md].
- When cataloging components, apply Atomic Design levels (atom/molecule/organism/template/page) as the classification taxonomy, but treat it as a labeling lens rather than a required build/traversal order, matching Frost's explicit statement that it is "not a linear process" [raw/inventory--atomic-design-brad-frost-ch2.md].
- Follow Brad Frost's interface-inventory capture discipline: catalog distinct **treatments** (styling variations of a component) rather than every DOM instance, then group visually similar treatments for side-by-side comparison in the output artifact, since that is what exposes unintentional inconsistency (the PNC-vs-Etsy contrast) [raw/inventory--interface-inventory-brad-frost.md].
- For icon inventories, detect Material Symbols usage via its ligature pattern (element text content equal to an icon name like `search`) or numeric codepoint, and record the active variable-font axis values (Fill, `wght`, `GRAD`, `opsz`) per instance, since two icons with the same glyph name can render differently depending on axis settings [raw/inventory--material-symbols-guide.md].
- Classify interactive/structural components against the six ARIA role categories (document structure, widget, landmark, live region, window, abstract) and flag any use of an abstract role in markup or any "avoid" role that has a native HTML equivalent, since both are explicitly called out as anti-patterns [raw/inventory--mdn-aria-roles-reference.md].
- Persist `$description` and `$deprecated` where discoverable (e.g. from adjacent code comments or design-tool exports) rather than discarding them, since both are spec-legal token metadata tools are expected to surface [raw/inventory--dtcg-format-spec.md].
- Preserve unknown vendor metadata under `$extensions` rather than dropping it during any re-serialization step, since the spec requires tools to preserve extension data they do not understand [raw/inventory--dtcg-format-spec.md].

## 03. Visual inconsistency detection

Scope: pixel diffing mechanics, visual regression services, static CSS metric analysis, accessibility contrast rules, perceptual color difference, and design system drift, as distilled from `raw/visual--*.md`. Every claim below is sourced; where a source is thin or a conflict exists between sources, that is called out explicitly.

### 1. Pixel Diffing

#### 1.1 pixelmatch: API and option semantics

pixelmatch is a dependency-free JavaScript pixel-level image comparison library, built to compare screenshots in tests, that detects anti-aliased pixels and uses a perceptual color difference metric; it runs in Node.js and in browsers on raw typed arrays [raw/visual--pixelmatch-readme.md].

Signature: `pixelmatch(img1, img2, output, width, height[, options])`, where `img1`/`img2` are same-dimension image buffers (Buffer, Uint8Array, or Uint8ClampedArray), `output` is a diff-image buffer (or `null` if not needed), and the function returns the count of mismatched pixels (or, in windowed mode, the maximum diff-pixel density in an NxN window) [raw/visual--pixelmatch-readme.md].

| Option | Type | Default | Meaning |
|---|---|---|---|
| `threshold` | number | 0.1 | Matching threshold from 0 to 1; smaller values make the comparison more sensitive [raw/visual--pixelmatch-readme.md] |
| `includeAA` | boolean | false | If true, disables detecting and ignoring anti-aliased pixels [raw/visual--pixelmatch-readme.md] |
| `alpha` | number | 0.1 | Blending factor of unchanged pixels in the diff output, 0 (white) to 1 (original image) [raw/visual--pixelmatch-readme.md] |
| `aaColor` | [R,G,B] | [255,255,0] | Color used for anti-aliased pixels in the diff output [raw/visual--pixelmatch-readme.md] |
| `diffColor` | [R,G,B] | [255,0,0] | Color used for differing pixels in the diff output [raw/visual--pixelmatch-readme.md] |
| `diffColorAlt` | [R,G,B] | null | Alternate color for dark-on-light differences, to distinguish "added" vs "removed" content such as text [raw/visual--pixelmatch-readme.md] |
| `diffMask` | boolean | false | Draws the diff over a transparent background (a mask) instead of over the original image [raw/visual--pixelmatch-readme.md] |

The return value is a raw pixel count, not a ratio; dividing by `width * height` produces a mismatch ratio comparable to Playwright's `maxDiffPixelRatio` [raw/visual--pixelmatch-readme.md]. The default `includeAA: false` avoids false positives from font and edge anti-aliasing differences across runs or machines [raw/visual--pixelmatch-readme.md].

#### 1.2 Playwright `toHaveScreenshot`: threshold vs maxDiffPixels vs maxDiffPixelRatio

Playwright Test's `toHaveScreenshot()` compares a captured screenshot against a stored reference/golden image, generating the reference on the first run; it uses pixelmatch internally for the pixel comparison [raw/visual--playwright-tohavescreenshot.md].

| Option | Scale | Default | Meaning |
|---|---|---|---|
| `threshold` | 0 (strict) to 1 (lax) | 0.2 | Acceptable perceived color difference in the YIQ color space between the same pixel in the two images; this is the per-pixel knob fed into pixelmatch's own `threshold` option, deciding whether one pixel counts as "different" at all [raw/visual--playwright-tohavescreenshot.md] |
| `maxDiffPixels` | absolute count | unset | Acceptable number of differing pixels overall [raw/visual--playwright-tohavescreenshot.md] |
| `maxDiffPixelRatio` | 0 to 1 | unset | Acceptable ratio of differing pixels to total pixels; because it is relative to image size it gives more consistent results across differently sized images, whereas `maxDiffPixels` is a constant that gives finer per-test control [raw/visual--playwright-tohavescreenshot.md] |

`threshold` and `maxDiffPixels`/`maxDiffPixelRatio` are orthogonal: the former decides whether an individual pixel counts as different, the latter decides how many/what proportion of such different pixels is tolerated before the whole assertion fails [raw/visual--playwright-tohavescreenshot.md]. Both `maxDiffPixels` and `maxDiffPixelRatio` are configurable globally via `TestConfig.expect` or per-assertion [raw/visual--playwright-tohavescreenshot.md]. Other relevant options: `animations: "disabled"` (default) fast-forwards finite CSS animations to completion and cancels infinite ones before capture; `mask` overlays a pink box (`#FF00FF`) over locators with dynamic content; `scale: "css"` (default) vs `"device"` controls pixel density on high-DPI screens; `caret: "hide"` (default) hides the text cursor [raw/visual--playwright-tohavescreenshot.md]. Baselines are refreshed with `npx playwright test --update-snapshots` [raw/visual--playwright-tohavescreenshot.md].

#### 1.3 Flakiness guidance (official)

Playwright's own docs state directly that browser rendering can vary based on host OS, version, settings, hardware, power source, headless mode, and other factors, and recommend running tests in the same environment where baseline screenshots were generated [raw/visual--playwright-tohavescreenshot.md]. Concrete practices drawn from that same source: generate and compare screenshots in the same environment (for example the same Docker image or CI runner) as the baseline; disable animations; mask or hide dynamic regions (timestamps, live data, ads) rather than tuning thresholds around them; wait for fonts and images to load before capture; and use `maxDiffPixelRatio`/`maxDiffPixels` to absorb minor sub-pixel rendering noise rather than relying solely on a lax per-pixel `threshold` [raw/visual--playwright-tohavescreenshot.md].

Argos CI's docs add a specific font-rendering stabilization technique: launching Chromium with `--disable-lcd-text --font-render-hinting=none` so glyphs render identically on the local machine and in CI [raw/visual--argos-ci-playwright.md]. Argos also automatically pauses animated GIFs on their first frame, waits for `srcset` images and fonts to load, and hides scrollbars, text carets, and spell-check indicators as part of its stabilization pass [raw/visual--argos-ci-playwright.md].

### 2. Visual Regression Services Comparison

| Service | Capture mechanism | Diff mechanism | Review workflow | Best suited for | Source |
|---|---|---|---|---|---|
| **Argos CI** | `argosScreenshot(page, name)` via a Playwright reporter plugin; screenshots managed in CI, not committed to the repo; full page by default, or a specific element/viewport set | Threshold-based comparison, 0 to 1 scale, default 0.5, higher values reduce sensitivity; automated stabilization of fonts, images, animations, loaders, sticky/fixed elements before diffing | Dashboard side-by-side comparison; failure runs capture Playwright traces for "time travel" debugging plus test metadata | Teams already using Playwright who want CI-native visual review without committing binary baselines, and who need font/animation stabilization built in | [raw/visual--argos-ci-playwright.md] |
| **Chromatic** | Captures a snapshot per Storybook story/test inside a cloud browser; all tests run simultaneously | Pixel-by-pixel comparison against stored baselines; every push triggers a new snapshot-vs-baseline compare | User is prompted to approve or reject on any detected diff; approving promotes the snapshot to the new baseline; runs locally via a Storybook addon or in CI | Storybook-centric teams auditing individual component stories in isolation rather than full page flows | [raw/visual--chromatic-visual-tests.md] |
| **BackstopJS** | Scenario-driven: `url` + optional `readySelector`/`readyEvent`/`delay` for sync, `clickSelector`/`hoverSelector` for interaction, `hideSelectors`/`removeSelectors` for dynamic content; renders via Puppeteer (default, Chrome headless) or Playwright (cross-browser, supports `storageState` for auth) | Resemble.js pixel-level comparison; `misMatchThreshold` sets the percentage of differing pixels tolerated before failure, default 0.1% | Self-hosted interactive HTML report with a scrubber tool for side-by-side inspection; `backstop approve` promotes passing results to reference status (supports regex filtering); a remote HTTP service enables approval from the web report | Self-hosted, config-driven visual regression against arbitrary URLs (not tied to a component framework), with fine scenario-level control over interaction before capture | [raw/visual--backstopjs-readme.md] |
| **Percy** (via `@percy/playwright`) | `percySnapshot(page, name, options?)`; does not screenshot the live rendered browser, instead serializes the full DOM, CSS, and every referenced asset (images, fonts, stylesheets) needed to reconstruct the page state | Percy re-renders the serialized DOM across its own set of cloud browsers/widths and diffs the resulting renders against baselines | Project dashboard shows snapshot comparisons per build; reviewers approve or reject before merge; approved changes become the new baseline | Cross-browser/cross-width visual coverage from a single capture, at the cost of needing all assets to be reachable/inlinable; a materially different capture strategy from literal-screenshot tools since it may not faithfully capture canvas/WebGL content that has no DOM/CSS representation | [raw/visual--percy-playwright-sdk.md] |

Note on scale: BackstopJS's CLI also provides `backstop init` (scaffold), `backstop reference` (generate baselines without comparing), `backstop test` (capture and compare, with `--filter` and `--docker`), and `backstop openReport`; it exits 0/1 for CI branching and can emit JUnit XML via `"report": ["CI"]` [raw/visual--backstopjs-readme.md].

### 3. CSS Metric Analysis

#### 3.1 Project Wallace `css-analyzer`

`@projectwallace/css-analyzer` parses CSS into over 200 metrics, is TypeScript-typed, zero-config, dependency-minimal, and runs in both Node.js and the browser; it powers projectwallace.com itself [raw/visual--project-wallace-css-analyzer.md]. Core API: `analyze(cssString)` returns the metrics object; `compareSpecificity(a, b)` sorts specificity tuples [raw/visual--project-wallace-css-analyzer.md].

Metrics are organized into seven documented categories [raw/visual--project-wallace-css-analyzer.md]:

| Category | Representative metrics |
|---|---|
| Stylesheet | gzip filesize, uncompressed filesize, lines of code, cohesion, simplicity, browser hacks |
| Atrules | total/unique counts of `@keyframes`, `@media`, `@font-face`, `@import`, `@supports` |
| Rules | total empty rules, selector counts per rule (avg/min/max), total rules |
| Selectors | specificity, complexity, ID selectors, universal selectors, accessibility selectors, selectors at maximum specificity |
| Declarations | ratio of `!important` declarations, total unique declarations |
| Properties | vendor-prefixed properties, browser hacks, total property counts |
| Values (design-token relevant) | total unique colors, font families, font sizes, box-shadows, text-shadows, z-indexes, animation durations and timing functions |

The package README groups the same surface into Colors & Formats, Typography, Spacing & Layout (z-indexes, box/text shadows, border radiuses), Selectors, Properties, At-Rules, Design Tokens (custom property usage and uniqueness ratios), CSS Complexity, and Code Quality, with min/max/mean/mode statistics across most dimensions [raw/visual--project-wallace-css-analyzer.md]. A companion Stylelint preset, `@projectwallace/stylelint-plugin` (60+ rules), specifically tracks unique design tokens and flags when a stylesheet uses too many distinct font sizes, colors, or other tokens; the docs caution it should be combined with Stylelint's built-in rules and other defensive-CSS plugins rather than used alone [raw/visual--project-wallace-css-analyzer.md].

#### 3.2 CSS Stats: status

`cssstats/core`, the Node.js module that originally parsed stylesheets into statistics (file size, gzip size, rule/selector/declaration/property counts, specificity, media query breakdowns) and powered cssstats.com, is **archived** as of January 27, 2019 and is read-only [raw/visual--cssstats-status.md]. Its README points to a successor location, `cssstats/cssstats` (a monorepo, `packages/cssstats`), but that project's own README is minimal (clone, `yarn`, `yarn start` on localhost:8000, MIT license) with no clear recent-activity signal surfaced in the source [raw/visual--cssstats-status.md].

**Research gap:** the CSS Stats source material does not establish current maintenance activity for `cssstats/cssstats` one way or the other beyond the archived status of `core`; treat CSS Stats as legacy and prefer Project Wallace's actively maintained, more extensively documented `css-analyzer` [raw/visual--cssstats-status.md].

### 4. Accessibility Contrast

#### 4.1 WCAG 2.2 SC 1.4.3 Contrast (Minimum)

Contrast ratio formula: **(L1 + 0.05) / (L2 + 0.05)**, where L1 is the relative luminance of the lighter color and L2 the relative luminance of the darker color [raw/visual--wcag22-contrast-minimum.md].

Thresholds:
- Normal text: **4.5:1** minimum, chosen to compensate for the contrast-sensitivity loss typical of roughly 20/40 vision, a level of loss common with aging [raw/visual--wcag22-contrast-minimum.md].
- Large text: **3:1** minimum, because larger text remains legible at lower contrast [raw/visual--wcag22-contrast-minimum.md]. "Large scale" text is defined as at least 18 point, or 14 point bold, or an equivalent size for CJK fonts [raw/visual--wcag22-contrast-minimum.md].

Exceptions: logotypes (text that is part of a logo or brand name has no minimum), pure decoration, incidental text (for example street signs captured within a photograph), inactive UI components, and text inside pictures that contain significant other visual content [raw/visual--wcag22-contrast-minimum.md].

#### 4.2 WCAG 2.2 SC 1.4.11 Non-text Contrast

Threshold: **3:1** against adjacent color(s), applied to two categories [raw/visual--wcag22-non-text-contrast.md]:
- User Interface Components: visual information needed to identify controls and their states (for example the boundary of a text input, a button's visible affordance), excluding inactive/disabled components, and excluding a state change conveyed purely by a color change between two states never visible simultaneously [raw/visual--wcag22-non-text-contrast.md].
- Graphical Objects: parts of graphics required to understand the content (icons, chart lines, form-field boundaries), except where the specific presentation is essential to the information conveyed and cannot be altered without losing meaning (logos, flags, sensory photographs, medical diagnostic images/diagrams) [raw/visual--wcag22-non-text-contrast.md].

Computed values are not rounded: a measured 2.999:1 does not meet the 3:1 threshold [raw/visual--wcag22-non-text-contrast.md]. Focus indicators must maintain 3:1 against adjacent background(s); hover states do not require 3:1 unless the hover-state visual change is itself essential to identifying that hover occurred; a control's hit-area border is not separately required to meet 3:1 when visible content already inside the control identifies it [raw/visual--wcag22-non-text-contrast.md].

Both criteria use the same relative-luminance contrast-ratio formula defined under 1.4.3 [raw/visual--wcag22-non-text-contrast.md].

#### 4.3 axe-core `color-contrast` rule: behavior and limits

The rule checks all text elements against WCAG 2 AA thresholds: 4.5:1 for small text, 3:1 for large text (defined as 18pt/24 CSS px, or 14pt bold/19 CSS px), including text that is part of an image [raw/visual--axe-core-color-contrast-rule.md]. It maps to WCAG 1.4.3 Contrast (Minimum), required at WCAG 2.0 AA, 2.1 AA, and 2.2 AA [raw/visual--axe-core-color-contrast-rule.md].

Documented scope and limitations: the rule does **not** report on text elements that have a background-image (effective background color/luminance cannot be reliably computed), are obscured by other elements, or are images of text (not evaluated by its DOM/CSS-based algorithm) [raw/visual--axe-core-color-contrast-rule.md]. It accounts for background transparency/opacity but has documented difficulty accurately detecting foreground opacity when gradients, pseudo-elements, borders, or overlapping elements are involved [raw/visual--axe-core-color-contrast-rule.md]. Child elements of disabled buttons are ignored, matching the WCAG exemption for inactive UI components [raw/visual--axe-core-color-contrast-rule.md]. axe-core 3.5 significantly changed how the rule computes contrast (faster and more accurate than earlier versions), so a recent axe-core version should be pinned rather than an old cached copy [raw/visual--axe-core-color-contrast-rule.md].

### 5. Color Difference: CIEDE2000

culori's `differenceCiede2000(Kl = 1, Kc = 1, Kh = 1)` returns a function `(colorA, colorB) => number` computing the CIEDE2000 delta-E*00 color difference, implemented per G. Sharma's reference implementation (University of Rochester); the three optional parameters weight lightness, chroma, and hue sensitivity respectively for the viewing condition or application at hand [raw/visual--ciede2000-deltae-culori.md]. CIEDE2000 is described as an advance over CIE76 (delta-E*ab) and CIE94 in perceptual uniformity, meaning a given delta-E corresponds more consistently to the same perceived magnitude of difference across the color space [raw/visual--ciede2000-deltae-culori.md].

The culori API reference itself states only that a smaller delta-E means the colors look more similar; it does not publish a numeric perceptibility table [raw/visual--ciede2000-deltae-culori.md]. The thresholds below are aggregated in the source note from secondary color-science explainers (Konica Minolta's "What Is Delta E," Techkon's "Demystifying the CIE Delta E 2000 Formula") rather than from culori's own docs or the primary Sharma paper, so treat the exact cut points as industry rule-of-thumb, not spec-grade [raw/visual--ciede2000-deltae-culori.md]:

- delta-E00 < 1: generally not perceptible to the human eye under normal viewing [raw/visual--ciede2000-deltae-culori.md].
- delta-E00 approximately 1 to 2: a "just noticeable difference" (JND), perceptible only on close, side-by-side inspection; with default weights (Kl=Kc=Kh=1) roughly one delta-E unit corresponds to this JND threshold [raw/visual--ciede2000-deltae-culori.md].
- delta-E00 >= 2: an increasingly obvious mismatch, the kind of difference that typically fails tight color-tolerance requirements such as brand color matching or print/screen tolerance [raw/visual--ciede2000-deltae-culori.md].

**Source-quality caveat:** these numeric bands are secondary-source aggregation, not a verbatim citation from culori's own reference or from the original CIEDE2000 paper; use them as a defensible default, not as a cited spec threshold, when the distinction matters [raw/visual--ciede2000-deltae-culori.md].

### 6. Design-System Drift Taxonomy [community]

The following is drawn from a community/vendor blog article (OverlayQA, published April 26, 2026), not a spec or official docs source; OverlayQA is itself a visual-testing vendor listed alongside its competitors Percy and Chromatic in the article's own tools section, so its detection-tool recommendations carry a vendor bias, though the drift taxonomy itself is a useful and current framing [raw/visual--design-system-drift-community.md].

Design system drift is defined as implemented components, tokens, and patterns silently deviating from the source of truth over time; the article cites the zeroheight Design Systems Report 2026 finding that only 8% of teams consider their design system "very stable" while 44% report it unstable or very unstable [raw/visual--design-system-drift-community.md].

Five drift types [community, raw/visual--design-system-drift-community.md]:
1. **Token drift**: design values in code diverge from documented specs; the article notes roughly 40% of teams have automated token pipelines connecting design source-of-truth to shipped code, implying 60% do not.
2. **Component variant drift**: rendered component properties no longer match design specs, attributed particularly to AI-generated code approximating values instead of reusing exact tokens.
3. **Pattern drift**: component composition and layout conventions vary across product areas or teams.
4. **Documentation drift**: docs describe outdated component behavior that no longer matches what ships.
5. **Behavioral drift**: interaction states, transitions, and animations differ from what is specified.

Root causes cited [community, raw/visual--design-system-drift-community.md]: no automated token sync between design tools (for example Figma) and code; AI-generated code approximating training-data values rather than importing canonical tokens; multiple teams consuming the system without unified governance; missing visual verification during code review; infrequent design-system updates forcing local workarounds that later calcify.

Detection methods at scale [community, raw/visual--design-system-drift-community.md]: automated token comparison between Figma and code; visual comparison of production builds against design specs; component-library audits identifying "detached" instances no longer inheriting from the source component; production CSS extraction revealing orphaned/one-off values outside the token set; visual regression testing integrated into CI.

Prevention strategies cited [community, raw/visual--design-system-drift-community.md]: automate token pipelines (Tokens Studio, Specify, Supernova cited); integrate design QA into the PR process; enforce token usage via CSS linting (`stylelint-declaration-strict-value` cited); establish contribution guidelines; run quarterly audits. The article distinguishes drift from design debt: debt is an intentional, known shortcut, while drift accumulates unintentionally from many small unnoticed deviations [community, raw/visual--design-system-drift-community.md].

### Conflicts and terminology overload

No direct factual conflicts were found between the raw sources. There is, however, a terminology trap worth flagging explicitly: the word "threshold" means three different things across the tools surveyed, and mixing them up when configuring the audit pipeline will silently produce the wrong sensitivity:
- pixelmatch's `threshold` (0 to 1, default 0.1) and Playwright's `threshold` (0 to 1, default 0.2, YIQ perceived color difference) are both **per-pixel** knobs deciding whether one pixel counts as different [raw/visual--pixelmatch-readme.md] [raw/visual--playwright-tohavescreenshot.md].
- Argos's `threshold` (0 to 1, default 0.5, higher = less sensitive) is a single sensitivity setting for the whole comparison, not explicitly decomposed into per-pixel vs aggregate in the source [raw/visual--argos-ci-playwright.md].
- BackstopJS's `misMatchThreshold` (a percentage, default 0.1%) is an **aggregate** tolerance on the proportion of differing pixels, conceptually closer to Playwright's `maxDiffPixelRatio` than to Playwright's own `threshold` [raw/visual--backstopjs-readme.md] [raw/visual--playwright-tohavescreenshot.md].

### Implications for the visual audit

1. **Use `maxDiffPixelRatio` (or an equivalent aggregate tolerance), not a lax per-pixel `threshold`, to absorb rendering noise.** Playwright's own flakiness guidance recommends this split explicitly: tune the per-pixel `threshold` for legitimate color-difference sensitivity and use `maxDiffPixelRatio`/`maxDiffPixels` for how much of the frame is allowed to differ, rather than loosening the per-pixel threshold to compensate for cross-machine noise [raw/visual--playwright-tohavescreenshot.md]. Since the audit will likely run captures across different machines/times, pin capture and baseline generation to the same environment (same container image) as the primary flake-reduction lever, per the same source [raw/visual--playwright-tohavescreenshot.md].

2. **Use delta-E00 (CIEDE2000), not raw hex/RGB equality, to decide whether two "different" colors are actually the same design token rendered inconsistently.** Given the source-quality caveat above, adopt delta-E00 < 1 as "not a finding" (imperceptible), roughly 1 to 2 as a borderline/JND finding worth a low-severity flag, and delta-E00 >= 2 as a clear drift finding worth surfacing, while treating the exact cut points as defensible defaults rather than a spec citation, since culori's own docs do not publish numeric thresholds [raw/visual--ciede2000-deltae-culori.md]. This directly operationalizes "token drift" from the community drift taxonomy: two near-identical blues used inconsistently across the app are exactly the class of finding raw RGB/hex comparison misses but delta-E00 catches [raw/visual--design-system-drift-community.md] [raw/visual--project-wallace-css-analyzer.md].

3. **Run axe-core for contrast, do not hand-compute it from a screenshot, whenever DOM/CSS access is available.** axe-core's `color-contrast` rule already implements the WCAG 1.4.3 luminance-ratio formula and the correct small-text (4.5:1) vs large-text (3:1) branching, is versioned and actively maintained (pin >= 4.x given the 3.5 rewrite), and correctly skips cases a screenshot-based measurement would get wrong or flag as false positives, such as inactive/disabled controls [raw/visual--axe-core-color-contrast-rule.md] [raw/visual--wcag22-contrast-minimum.md]. Compute contrast manually from pixel sampling only as a fallback when axe/DOM access is unavailable (for example, auditing a flattened screenshot or an image-only capture), and in that fallback case still apply the 1.4.3 formula (L1+0.05)/(L2+0.05) with the correct 4.5:1/3:1 branch by text size [raw/visual--wcag22-contrast-minimum.md], since axe-core's own rule explicitly does not evaluate images of text or backgrounds set via background-image [raw/visual--axe-core-color-contrast-rule.md].

4. **Apply the 3:1 non-text threshold separately from the 4.5:1 text threshold when auditing UI chrome.** Buttons, input borders, icons, and focus indicators are governed by SC 1.4.11 (3:1, no small/large split) rather than SC 1.4.3, and inactive components and pure hover-only color changes are explicitly exempt; an audit that runs one blanket 4.5:1 check across every element will over-flag chrome and under-flag borderline controls [raw/visual--wcag22-non-text-contrast.md].

5. **Treat pixel diffing and CSS-metric extraction as complementary layers, not substitutes.** Pixel diffing (pixelmatch/Playwright, or a hosted service) catches visible regressions but only after they are already visually obvious; static CSS extraction via Project Wallace's `css-analyzer` catches design-token drift (duplicate near-identical colors, font-size sprawl, z-index chaos) before it necessarily produces a striking pixel diff, and is the direct static-analysis counterpart to the community article's "token drift" and "production CSS extraction revealing orphaned values" detection method [raw/visual--project-wallace-css-analyzer.md] [raw/visual--design-system-drift-community.md] [raw/visual--pixelmatch-readme.md]. Prefer `@projectwallace/css-analyzer` over CSS Stats for this layer, since CSS Stats's core package has been archived since 2019 [raw/visual--cssstats-status.md].

6. **Pick a visual regression service by capture strategy, not just feature checklist.** If the audit needs to catch canvas/WebGL or otherwise non-DOM-representable rendering, prefer literal-screenshot tools (Argos, BackstopJS, or raw Playwright+pixelmatch) over Percy, since Percy's DOM-serialization-and-re-render approach may not faithfully reproduce that content [raw/visual--percy-playwright-sdk.md]. If the audit is scoped to isolated components rather than full authenticated app flows, Chromatic's Storybook-story model is the closer fit; if it is scoped to full-page, real-app flows across arbitrary URLs with fine interaction control (click/hover before capture) and self-hosting is preferred, BackstopJS's scenario model fits; if CI-native review with zero committed binaries and Playwright-trace-linked debugging is the priority, Argos fits [raw/visual--chromatic-visual-tests.md] [raw/visual--backstopjs-readme.md] [raw/visual--argos-ci-playwright.md].

7. **Normalize font rendering and dynamic content before diffing, regardless of which tool is used.** Both the Playwright and Argos sources converge on the same three flake sources: uncontrolled animations, unloaded fonts/images, and inherently dynamic regions (timestamps, live data). Disable/fast-forward animations, wait for fonts and images to settle, and mask dynamic regions rather than loosening thresholds to compensate [raw/visual--playwright-tohavescreenshot.md] [raw/visual--argos-ci-playwright.md].

## 04. Code inconsistency and capture safety

Stage 3 distillation for webapp-capture-stinger. Synthesizes only facts present in `references/research/raw/code--*.md`. No claim below rests on training data; where the raw corpus was thin, a "research gap:" note says so explicitly.

### Stylelint: configuration basics

Stylelint requires a configuration object with a `rules` map; no rules are enabled by default [raw/code--stylelint-configuration-basics.md]. Stylelint searches upward from the current working directory for `stylelint.config.js` (or `.mjs`/`.cjs`/`.ts`) unless `--config` points elsewhere, and also accepts legacy formats `.stylelintrc.js`, `.stylelintrc.json`, `.stylelintrc.yml`, or a `stylelint` key in `package.json` [raw/code--stylelint-configuration-basics.md].

Each rule value can be `null` (disabled), a single primary-option value, or a two-element array of `[primaryOption, secondaryOptions]` [raw/code--stylelint-configuration-basics.md]. Secondary configuration properties available on rules: `disableFix` (disables autofix), `message` (custom violation text, supports functions), `url` (custom docs link), `severity` (`"warning"` or `"error"`, can be a function), and `reportDisables` (reports `stylelint-disable` comment usage) [raw/code--stylelint-configuration-basics.md].

| Property | Purpose | Notes |
|---|---|---|
| `rules` | rule name to config map | no rules on by default [raw/code--stylelint-configuration-basics.md] |
| `extends` | inherit a shared config | string or array; later entries override earlier ones; npm module name, absolute, or relative path [raw/code--stylelint-configuration-basics.md] |
| `plugins` | register custom/third-party rules | array of plugin references; rules then configured under their namespaced key, e.g. `scale-unlimited/declaration-strict-value` [raw/code--stylelint-configuration-basics.md] [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `overrides` | apply config to a file glob subset | each entry needs `files` plus at least one config property; later overrides win [raw/code--stylelint-configuration-basics.md] |
| `ignoreFiles` | exclude files by glob | docs note `.stylelintignore` is more efficient for large exclusion sets [raw/code--stylelint-configuration-basics.md] |
| `languageOptions` | customize CSS syntax (at-rules, properties, types, units, directionality) | [raw/code--stylelint-configuration-basics.md] |
| `customSyntax` | non-standard CSS syntax (e.g. SCSS) | used per-override with `postcss-scss` in the docs example [raw/code--stylelint-configuration-basics.md] |
| `cache`, `fix`, `maxWarnings`, `defaultSeverity` | run-mode controls | [raw/code--stylelint-configuration-basics.md] |

### Stylelint consistency rules archived

| Rule | Purpose | Key options | Notes |
|---|---|---|---|
| `color-named` | Require or disallow named colors | `"always-where-possible"` flags hex (3/4/6/8-digit), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()`, `gray()` values that have a named equivalent; `"never"` prohibits named colors entirely | secondary options `ignore`, `ignoreFunctions`, `ignoreProperties`; ignores Sass `$` and Less `@` variables; supports up to 2 message arguments [raw/code--stylelint-rule-color-named.md] |
| `color-no-hex` | Disallow hex colors | primary option `true` | secondary option `ignoreFunctions` (e.g. `["var", "/^--/"]`) allows hex inside listed functions such as `var(--foo, #fff)`; supports 1 message argument (the disallowed hex color) [raw/code--stylelint-rule-color-no-hex.md] |
| `unit-allowed-list` | Restrict CSS to a specific set of units | array of permitted units, e.g. `["px", "em", "deg"]` | secondary options `ignoreProperties` (exempt a unit for named/regex properties) and `ignoreFunctions` (exempt units inside functions, e.g. `calc`); unitless values are always permitted; supports 1 message argument (the disallowed unit) [raw/code--stylelint-rule-unit-allowed-list.md] |
| `font-family-no-duplicate-names` | Forbid the same typeface listed twice in one `font`/`font-family` stack | primary option `true` | secondary option `ignoreFontFamilyNames` (array of names or regex to exempt); ignores Sass, Less, and `var(--custom-property)` syntax; documented limitation: it "will stumble on unquoted multi-word font names and unquoted font names containing escape sequences" [raw/code--stylelint-rule-font-family-no-duplicate-names.md] |
| `declaration-property-value-allowed-list` | Restrict declarations to an allow-listed set of property-value pairs | object mapping a property name (literal or `/regex/`) to an array of allowed values (literal or `/regex/`) | if a property is absent from the map, any value is allowed; a regex value matches the entire declaration value, not a substring, so `/^solid/` will not match `10px solid rgba(...)` but `/\bsolid\b/` will [raw/code--stylelint-rule-declaration-property-value-allowed-list.md] |

### stylelint-declaration-strict-value plugin

Third-party plugin (namespace `scale-unlimited`, rule `scale-unlimited/declaration-strict-value`) that enforces variables (`$sass`, `namespace.$sass`, `@less`, `var(--cssnext)`, `css-loader @value`), functions, or explicitly whitelisted custom values (keywords like `inherit`/`none`/`currentColor`, colors, or numbers with units) for CSS longhand and select experimental shorthand properties [raw/code--stylelint-declaration-strict-value-plugin.md].

| Option | Effect | Default |
|---|---|---|
| primary option | single property (`"color"`), regex (`"/color$/"`), or nested array for multiple properties, e.g. `[["/color$/", "z-index", "font-size"]]` | required [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `ignoreVariables` | allow variables as compliant values; can be a boolean or a per-property map, e.g. `{ "margin": false }` | enabled [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `ignoreFunctions` | allow function values as compliant | enabled [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `ignoreValues` | whitelist specific literal values/keywords/regex, single value, array, or per-property map | none [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `ignoreKeywords` | deprecated alias of `ignoreValues`, kept for backward compatibility | n/a [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `ignoreAtRules` | skip validation inside named at-rules (e.g. `@font-face`), globally or per-property | none [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `expandShorthand` | expand shorthand properties before validating (e.g. `border` triggers `border-color` validation) | disabled [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `recurseLonghand` | recursively expand each longhand property (useful for `border`) | disabled (documented alongside `expandShorthand`, no explicit default stated beyond "disabled by default" framing) [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `message` | custom error text with `${types}`/`${value}`/`${property}` interpolation | none [raw/code--stylelint-declaration-strict-value-plugin.md] |
| `autoFixFunc` / `disableFix` | supply a custom autofix function (inline or via external file path) and toggle autofix | none/enabled unless disabled [raw/code--stylelint-declaration-strict-value-plugin.md] |

### Sample Stylelint config (assembled only from documented options)

Every key below is drawn directly from the rule and plugin documentation above; nothing here is invented behavior.

```javascript
/** @type {import('stylelint').Config} */
export default {
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // color-no-hex.md: forbid raw hex, but allow it inside CSS variable fallbacks
    "color-no-hex": [true, { ignoreFunctions: ["var", "/^--/"] }],

    // color-named.md: forbid named colors so tokens/functions are the only path
    "color-named": "never",

    // unit-allowed-list.md: restrict units, but let % through for width and rem through for line-height/border
    "unit-allowed-list": [
      ["px", "em", "deg"],
      {
        ignoreProperties: {
          "rem": ["line-height", "/^border/"],
          "%": ["width"],
        },
      },
    ],

    // font-family-no-duplicate-names.md: catch repeated font names in a stack
    "font-family-no-duplicate-names": [
      true,
      { ignoreFontFamilyNames: ["/^My Font /", "monospace"] },
    ],

    // declaration-property-value-allowed-list.md: pin specific property/value pairs
    "declaration-property-value-allowed-list": {
      "/^(-webkit-)?transform$/": ["/scale/"],
      "whitespace": ["nowrap"],
    },

    // stylelint-declaration-strict-value-plugin.md: require variables/functions for color and z-index
    "scale-unlimited/declaration-strict-value": [
      ["/color$/", "z-index"],
      {
        ignoreValues: ["currentColor", "transparent", "inherit"],
        ignoreAtRules: { "@font-face": ["font-weight"] },
      },
    ],
  },
};
```

research gap: the raw corpus does not document a `stylelint-config-standard` (or any other shareable base config) rule set in detail, only that `extends` can reference one by name [raw/code--stylelint-configuration-basics.md]; no default rule list for such a base config is available in the archived research.

### jscpd (copy/paste detector)

Purpose: a language-aware copy/paste detector across 224 formats, JS/TS/JSX/TSX parsed by the oxc parser, with Vue/Svelte/Astro/Markdown/Razor split into embedded-language blocks before tokenizing [raw/code--jscpd-readme.md]. Detection runs a Rabin-Karp match over the token stream for exact duplicate blocks, with opt-in passes for renamed (Type-2) and near-miss/similar (Type-3) clones; Type-4 (same behavior, different code) is explicitly out of scope for jscpd and for every token-based detector [raw/code--jscpd-readme.md].

Distributed as a Rust engine binary from v5 onward under two command names, `jscpd` and `cpd`, with the same CLI flags, reporters, and `.jscpd.json` config as earlier Node versions [raw/code--jscpd-readme.md].

#### Key CLI options and defaults

| Option | Short | Purpose | Default |
|---|---|---|---|
| `--min-tokens` | `-k` | minimum tokens in a clone | 50 [raw/code--jscpd-readme.md] |
| `--min-lines` | `-l` | minimum lines in a clone | 5 [raw/code--jscpd-readme.md] |
| `--max-lines` | `-x` | maximum source file lines | none stated [raw/code--jscpd-readme.md] |
| `--max-size` | `-z` | skip files above a size (e.g. `1mb`) | no limit [raw/code--jscpd-readme.md] |
| `--mode` | `-m` | `mild` drops whitespace tokens, `weak` also drops comments, `strict` keeps every token | `mild` [raw/code--jscpd-readme.md] |
| `--threshold` | | duplication percentage gate used by the `threshold` reporter | 0 (per `.jscpd.json` example) [raw/code--jscpd-readme.md] |
| `--ignore-identifiers` | | Type-2: treat identifiers as equal | off [raw/code--jscpd-readme.md] |
| `--ignore-literals` | | Type-2: treat string/numeric literals as equal | off [raw/code--jscpd-readme.md] |
| `--ignore-annotations` | | skip `@Name`/`@Name(...)` annotations before detection | off [raw/code--jscpd-readme.md] |
| `--max-gap-lines` | | merge near-miss clones separated by up to N unmatched lines, reported as `similar` | 0 (off) [raw/code--jscpd-readme.md] |
| `--similarity` | | report JS/TS function pairs by syntax-tree similarity ratio in (0,1]; `1` = exact only | 1 (off) [raw/code--jscpd-readme.md] |
| `--cross-formats` | | detect clones across formats; preset `js-ts` = `javascript,jsx,typescript,tsx` | none [raw/code--jscpd-readme.md] |
| `--skip-local` | | skip clones where both fragments share a directory | off [raw/code--jscpd-readme.md] |
| `--skip-isolated` | | skip clones between folders in the same isolation group (monorepo) | none [raw/code--jscpd-readme.md] |
| `--baseline` / `--baseline-from-ref` | | gate CI on new duplication only, via a committed file or an ephemeral ref-built baseline; mutually exclusive | none [raw/code--jscpd-readme.md] |
| `--fail-on-new-clones` | | exit 1 above N new clones (bare flag means N=0); requires a baseline | none [raw/code--jscpd-readme.md] |
| `--fail-on-empty` | | exit 1 if the scan analyzed no files | off [raw/code--jscpd-readme.md] |
| `--workers` | | parallel worker threads | all CPU cores [raw/code--jscpd-readme.md] |
| `--follow-symlinks` | | follow symlinks while walking (v4 did this by default; current default is off) | off [raw/code--jscpd-readme.md] |
| `--mcp` | | serve Model Context Protocol over stdio | off [raw/code--jscpd-readme.md] |
| `--summary` / `--summary-by` | | codebase summary; sort by `tokens` (default), `lines`, `size`, or `complexity` | `tokens` [raw/code--jscpd-readme.md] |

#### Reporters (15 built-in)

`console` (default, clone list plus stats), `console-full` (adds source snippets and, with `--blame`, side-by-side author comparison), `json`, `xml`, `csv`, `html`, `markdown`, `badge` (SVG badges), `sarif` (GitHub Code Scanning), `codeclimate`/alias `gitlab` (`gl-code-quality-report.json`), `openmetrics` (`jscpd-metrics.txt`), `ai` (token-efficient, about 79 percent fewer tokens than `console`, built for LLM pipelines), `xcode`, `threshold` (exit 1 above `--threshold`), and `silent` [raw/code--jscpd-readme.md]. File reporters write into the `--output` directory, default `report/`, using a `jscpd-report.*` filename prefix [raw/code--jscpd-readme.md].

#### Exit codes

| Code | Meaning |
|---|---|
| 0 | scan ran, no gate fired (clones may still be present and reported) [raw/code--jscpd-readme.md] |
| 1 | `--threshold` exceeded, `--fail-on-new-clones` exceeded, `--fail-on-empty` with no files analyzed, a reporter failed to write, a scan path does not exist, an unsupported `--format`, or an invalid flag/config combination [raw/code--jscpd-readme.md] |
| N | `--exit-code N` (default 1) when at least one clone is found [raw/code--jscpd-readme.md] |
| 2 | CLI parse errors: unknown flag or missing value [raw/code--jscpd-readme.md] |

A scan that matches no files under the given `--format`/`--ignore`/`--pattern`, or where every file is below `--min-tokens`, prints a warning and still exits 0 unless `--fail-on-empty` is set [raw/code--jscpd-readme.md]. Config discovery order: `--config <path>`, then `.jscpd.json`, then `.config/jscpd.json` (or `.config/.jscpd.json`), then the `jscpd` key in `package.json` [raw/code--jscpd-readme.md]. Source regions can be excluded inline with `// jscpd:ignore-start` / `// jscpd:ignore-end` comments in the source language's comment syntax [raw/code--jscpd-readme.md].

### Tailwind v4 arbitrary values

Arbitrary values let a utility take a one-off value outside the configured theme via square-bracket syntax, e.g. `bg-[#316ff6]` or `text-[18px]` [raw/code--tailwindcss-v4-arbitrary-values.md]. Complex values work too, e.g. `grid-cols-[24rem_2.5rem_minmax(0,1fr)]`, where underscores inside the brackets are converted to spaces in the generated CSS [raw/code--tailwindcss-v4-arbitrary-values.md]. `calc()` can reference theme values inside brackets, e.g. `max-h-[calc(100dvh-(--spacing(6)))]` [raw/code--tailwindcss-v4-arbitrary-values.md]. Arbitrary properties are also supported for setting raw CSS custom properties, e.g. `[--gutter-width:1rem] lg:[--gutter-width:2rem]` [raw/code--tailwindcss-v4-arbitrary-values.md].

Tailwind infers the CSS data type of an arbitrary value from the value itself; when a value references a CSS variable and the target property is ambiguous, a type hint can be supplied, e.g. `text-[length:var(--my-var)]` [raw/code--tailwindcss-v4-arbitrary-values.md]. Documented type-hint data types: `absolute-size`, `angle`, `bg-size`, `color`, `family-name`, `generic-name`, `image`, `integer`, `length`, `line-width`, `number`, `percentage`, `position`, `ratio`, `relative-size`, `url`, `vector`, `*` [raw/code--tailwindcss-v4-arbitrary-values.md]. Tailwind scans project files for class-name-shaped symbols (arbitrary-value classes included) and generates only the CSS actually used, on demand [raw/code--tailwindcss-v4-arbitrary-values.md]. Arbitrary values compose with modifiers/variants such as hover, focus, responsive breakpoints, and dark mode, e.g. `hover:bg-[#2563eb]` [raw/code--tailwindcss-v4-arbitrary-values.md].

Relevance to a code audit: dense arbitrary-value usage (raw hex colors and pixel values inside brackets, rather than theme tokens) is itself a machine-detectable inconsistency signal, structurally parallel to Stylelint's `color-no-hex`/`unit-allowed-list` findings, though the raw corpus documents Tailwind's own arbitrary-value syntax and not a specific lint rule that flags its overuse.

research gap: the archived research does not include a rule, plugin, or documented convention for limiting or auditing arbitrary-value frequency in Tailwind v4 projects; only the syntax and inference mechanics are covered [raw/code--tailwindcss-v4-arbitrary-values.md].

### prettier-plugin-tailwindcss

Purpose: a Prettier v3+ plugin for Tailwind CSS v3.0+ that automatically sorts utility classes into Tailwind's recommended class order [raw/code--prettier-plugin-tailwindcss-readme.md]. Installed via `npm install -D prettier prettier-plugin-tailwindcss` and registered under `plugins` in Prettier config [raw/code--prettier-plugin-tailwindcss-readme.md]. As of v0.5.x it requires Prettier v3 and is ESM-only, so it cannot be loaded via `require()` [raw/code--prettier-plugin-tailwindcss-readme.md].

#### Config options

| Option | Purpose | Applies to |
|---|---|---|
| `tailwindStylesheet` | path to the CSS entry point carrying theme/utilities/config, resolved relative to the Prettier config file | Tailwind v4+ [raw/code--prettier-plugin-tailwindcss-readme.md] |
| `tailwindConfig` | path to `tailwind.config.js`, resolved relative to the Prettier config file (falls back to Tailwind defaults if not found) | Tailwind v3 [raw/code--prettier-plugin-tailwindcss-readme.md] |
| `tailwindAttributes` | additional attribute names (or `/regex/` patterns) to sort beyond `class`/`className`/`:class`/`[ngClass]`/`@apply` | both [raw/code--prettier-plugin-tailwindcss-readme.md] |
| `tailwindFunctions` | function/tagged-template names whose string arguments should also be sorted (e.g. `clsx`, `tw`) | both [raw/code--prettier-plugin-tailwindcss-readme.md] |
| `tailwindPreserveWhitespace` | keep whitespace between classes instead of normalizing it | both, default off (whitespace normalized) [raw/code--prettier-plugin-tailwindcss-readme.md] |
| `tailwindPreserveDuplicates` | keep duplicate classes instead of removing them (useful for templating languages like Fluid/Blade that cannot be safely deduplicated) | both, default off (duplicates removed) [raw/code--prettier-plugin-tailwindcss-readme.md] |

A public `sorter` entrypoint (`createSorter`) exposes the same sorting logic outside Prettier, with `sortClassAttributes()` for space-separated class strings and `sortClassLists()` for arrays of class-name arrays; `createSorter` accepts `base`, `filepath`, `configPath`, `stylesheetPath`, `preserveWhitespace`, and `preserveDuplicates` [raw/code--prettier-plugin-tailwindcss-readme.md]. The plugin must be loaded last in the `plugins` array when combined with other Prettier plugins that patch the same internal APIs (a documented compatibility list includes `prettier-plugin-svelte` and `prettier-plugin-organize-imports`, among others) [raw/code--prettier-plugin-tailwindcss-readme.md].

### Knip

Purpose: static analysis for JavaScript/TypeScript projects that finds and helps fix unused dependencies, exports, and files, plus unused class members and duplicate exports [raw/code--knip-readme.md]. Official packages: `knip`, `@knip/create-config`, `@knip/language-server`, `@knip/mcp` [raw/code--knip-readme.md]. Ships 150+ framework/tool plugins (Astro, Cypress, ESLint, Jest, GitHub Actions, Next.js, Nx, Remix, Storybook, Svelte, Vite, Vitest, Webpack, among others) and works from fine-grained entry points based on the actual frameworks and tooling detected in a (mono)repo [raw/code--knip-readme.md]. Output is reported to the terminal, listing unused files, dependencies, and exports for developer review and removal [raw/code--knip-readme.md]. Licensed under ISC [raw/code--knip-readme.md].

research gap: the archived research does not document Knip's CLI flags, its JSON/other reporter formats, its config file schema, or exit-code behavior; only its purpose, plugin ecosystem, and terminal-output description are covered [raw/code--knip-readme.md].

### Duplicate UI component detection signals (community source)

Source: 21st.dev blog, "Design System Consistency Audit," a community article rather than official framework documentation [raw/code--duplicate-ui-components-detection.md].

The article's seven-step audit workflow: establish authoritative sources for the component library/tokens/docs; build an inventory of a chosen user journey capturing component imports, local one-off implementations, typography roles, semantic color usage, and state coverage; compare semantics before raw values (quoted: "Two elements can look identical today and still follow different rules"); audit real component states (long labels, pending, disabled, error, narrow space, multiple themes), using existing Storybook stories as an inventory source where available; record exceptions formally with a disposition (fix, approve, propose system change, or investigate) plus explicit boundaries and revisit triggers; prioritize findings by demonstrated impact or repetition; and embed approved rules into docs, examples, and PR checklists to prevent recurrence [raw/code--duplicate-ui-components-detection.md].

Detection signals for duplicate/near-duplicate components named in the article: a component re-implemented locally instead of imported from the shared library; literal color values in place of semantic design tokens (signaling drift from the token system); inconsistent state coverage between similar components (one handles error/disabled/loading, another does not); and two differently named components that serve the same functional role [raw/code--duplicate-ui-components-detection.md]. Consolidation guidance, quoted: "First compare responsibilities and supported states. Consolidate implementations that should share a contract; preserve or document differences with a clear product reason" [raw/code--duplicate-ui-components-detection.md].

Tools referenced by the article: the Design Tokens Community Group format for token exchange, Storybook for state capture/documentation, "Design Bug Bot" for ongoing PR-level consistency review, and private component registries to surface approved options before developers reimplement a component locally [raw/code--duplicate-ui-components-detection.md].

### Capture safety: OWASP Logging Cheat Sheet, data that must never be logged

Core principle, quoted: "Never log data unless it is legally sanctioned" [raw/code--owasp-logging-cheat-sheet.md].

Data the cheat sheet says should usually not be recorded directly in logs: application source code; session identification values (hash instead if logging is required); access tokens; sensitive personal data and PII (health records, government IDs); authentication passwords; database connection strings; encryption keys and primary secrets; bank account or payment card data; commercially sensitive information; and information users opted out of or did not consent to have collected [raw/code--owasp-logging-cheat-sheet.md].

Data needing special handling short of an outright ban: file paths, internal network names/addresses, and non-sensitive personal data such as names, phone numbers, and email addresses [raw/code--owasp-logging-cheat-sheet.md]. All event data should be sanitized before logging to prevent log injection (carriage return, line feed, and delimiter characters can let an attacker manipulate log structure) [raw/code--owasp-logging-cheat-sheet.md]. Where some logging of sensitive data is unavoidable, the cheat sheet recommends personal-data de-identification techniques: deletion, scrambling, or pseudonymization [raw/code--owasp-logging-cheat-sheet.md].

### Capture safety: OWASP Secrets Management guidance relevant to captured artifacts

Secrets in scope per the cheat sheet: API keys and database credentials, IAM permissions, SSH keys and certificates, authentication tokens, encryption keys, and connection strings/passwords [raw/code--owasp-secrets-management-cheat-sheet.md].

Core principles: centralize and standardize secrets management through dedicated solutions rather than scattering secrets across configuration files (quoted: "Standardize and centralize the secrets management solution with care") [raw/code--owasp-secrets-management-cheat-sheet.md]; never hardcode or log secrets, since "Secrets must never be retrievable by everyone and everything," and plaintext storage in source, config files, or logs is unacceptable exposure [raw/code--owasp-secrets-management-cheat-sheet.md]; enforce least-privilege access so engineers do not have blanket access to all secrets, requiring fine-grained per-secret permissions [raw/code--owasp-secrets-management-cheat-sheet.md].

Detection and prevention: pre-commit hooks and IDE-level detection to stop secrets entering a repository; signature-based scanning tools such as Yelp Detect Secrets; shift-left DevSecOps practice that catches secrets before commit; and using multiple detection utilities together to reduce false negatives [raw/code--owasp-secrets-management-cheat-sheet.md].

Lifecycle guidance: regular automated rotation to limit a compromised credential's usable window; immediate automated revocation and replacement on compromise detection; expiration policies scaled to a secret's risk classification; and comprehensive access auditing (who accessed a secret, when, from where) for incident response [raw/code--owasp-secrets-management-cheat-sheet.md].

### GitHub secret scanning pattern families useful for redaction regexes

GitHub secret scanning reports three alert types: user alerts (shown in the repository Security tab), push protection alerts (raised when a contributor bypasses push protection), and partner alerts (sent directly to the secret's provider, not shown in the Security tab) [raw/code--github-secret-scanning-patterns.md].

Patterns fall into three categories [raw/code--github-secret-scanning-patterns.md]:

| Category | Description | Push protection / validity |
|---|---|---|
| Generic patterns | secrets not tied to a specific provider, e.g. private keys and database connection strings, matched via regex; sample patterns named: `rsa_private_key`, `ec_private_key`, `openssh_private_key`, `mongodb_connection_string`, `postgres_connection_string` | marked high precision [raw/code--github-secret-scanning-patterns.md] |
| AI-detected patterns | passwords and other unstructured secrets detected via AI models | support user alerts only, no push protection, no validity checks [raw/code--github-secret-scanning-patterns.md] |
| Provider patterns | secrets tied to a specific service (AWS, Azure, Stripe, etc.), matched via regex | broadest support: partner notification, default push protection, validity checks, extended metadata, some Base64 handling [raw/code--github-secret-scanning-patterns.md] |

Representative provider patterns (all push-protected; validity check varies): 1Password Service Account Token (no validity check), Adafruit IO Key (validity check), Amazon AWS Access Key ID (validity check), Anthropic API Key (validity check), Azure OpenAI Key (no validity check), Discord Bot Token (validity check), GitHub Personal Access Token (validity check), Google Cloud Service Account Credentials (validity check), Mailgun API Key (validity check), OpenAI API Key (validity check), Slack API Token (validity check), Stripe API Key (validity check), Twilio API Key (no validity check), Vercel Personal Access Token (no validity check), Yandex.Cloud API Key (validity check) [raw/code--github-secret-scanning-patterns.md].

Relevance to redaction regexes, as stated directly in the raw research: these categories (generic private-key/connection-string patterns and named provider token patterns, e.g. `sk-...` style OpenAI keys, `xox[baprs]-...` Slack tokens, `AKIA...` AWS access key IDs) are "a useful grounding reference when building redaction regexes for a capture tool," and at minimum a capture tool should redact anything matching a private-key block, a database connection string, or a named provider token pattern before it is written to a screenshot, log, or report [raw/code--github-secret-scanning-patterns.md].

### HTTP safe and idempotent methods (MDN)

| Method | Safe | Idempotent | Cacheable |
|---|---|---|---|
| GET | Yes | Yes | Yes [raw/code--mdn-http-request-methods.md] |
| HEAD | Yes | Yes | Yes [raw/code--mdn-http-request-methods.md] |
| OPTIONS | Yes | Yes | No [raw/code--mdn-http-request-methods.md] |
| TRACE | Yes | Yes | No [raw/code--mdn-http-request-methods.md] |
| PUT | No | Yes | No [raw/code--mdn-http-request-methods.md] |
| DELETE | No | Yes | No [raw/code--mdn-http-request-methods.md] |
| POST | No | No | Conditional (only with explicit freshness info and matching `Content-Location`) [raw/code--mdn-http-request-methods.md] |
| PATCH | No | No | Conditional (same as POST) [raw/code--mdn-http-request-methods.md] |
| CONNECT | No | No | No [raw/code--mdn-http-request-methods.md] |

Definitions per MDN: a method is safe if it only retrieves data and does not modify server state; a method is idempotent if repeating the same request produces the same result as making it once; a response is cacheable if it can be stored and reused for subsequent identical requests [raw/code--mdn-http-request-methods.md].

Stated grounding for capture-tool behavior: this table is "the grounding reference for a capture tool's safety rule," meaning only GET/HEAD-style navigation and read-only interactions (clicking links or tabs, scrolling) are guaranteed not to change server state, and a capture tool should never submit forms or trigger actions that issue POST, PUT, DELETE, or PATCH requests, since those methods are neither safe nor guaranteed idempotent [raw/code--mdn-http-request-methods.md].

### DOM scraping limits

#### Open vs closed shadow roots

`attachShadow({ mode: "open" })` lets page JavaScript read and modify shadow DOM internals through the host element's `shadowRoot` property; `attachShadow({ mode: "closed" })` makes `shadowRoot` return `null`, hiding internals from page script [raw/code--mdn-using-shadow-dom.md]. MDN explicitly cautions that closed mode is not a strong security mechanism, since it can be evaded (for example by browser extensions running in the page), and functions more as a signal that the page should not access the shadow tree's internals [raw/code--mdn-using-shadow-dom.md]. Page-level CSS selectors and stylesheets do not reach into shadow DOM content regardless of mode; encapsulated styling requires constructable stylesheets (`adoptedStyleSheets`) or a `<style>` inside the shadow tree's own template [raw/code--mdn-using-shadow-dom.md]. Custom elements typically attach the shadow root to themselves via `this.attachShadow(...)` inside `connectedCallback()` [raw/code--mdn-using-shadow-dom.md].

#### Playwright locator shadow DOM piercing

Per Playwright's own documentation, quoted: "All locators in Playwright by default work with elements in Shadow DOM. The exceptions are: Locating by XPath does not pierce shadow roots. Closed-mode shadow roots are not supported" [raw/code--playwright-locators-shadow-dom.md]. In other words, Playwright's standard locators (`getByRole`, `getByText`, `locator()`, etc.) automatically traverse open shadow boundaries without extra JS injection, but XPath-based locators cannot cross a shadow boundary, and a closed shadow root is invisible to Playwright in the same way it is invisible to page script (`element.shadowRoot` is `null`) [raw/code--playwright-locators-shadow-dom.md].

#### Same-origin iframe contentDocument access

`HTMLIFrameElement.contentDocument` returns the iframe's `Document` object only when the iframe and its parent document are same-origin; for a cross-origin iframe it returns `null`, per the same-origin policy [raw/code--mdn-iframe-contentdocument.md]. This has been the baseline, widely available behavior across browsers since July 2015, per the HTML Standard's `dom-iframe-contentdocument` definition [raw/code--mdn-iframe-contentdocument.md]. Stated implication: a capture tool can traverse into an iframe's DOM (for component inventory or targeted screenshots) only when the iframe is same-origin; a cross-origin iframe must be treated as an opaque region, screenshot-only, with no DOM introspection [raw/code--mdn-iframe-contentdocument.md].

No conflicts were found among the DOM-scraping-limits sources; the MDN shadow DOM page, the Playwright locator page, and the MDN iframe page independently describe consistent, non-contradictory boundaries (closed shadow roots opaque to both script and Playwright; same-origin-only iframe access) [raw/code--mdn-using-shadow-dom.md] [raw/code--playwright-locators-shadow-dom.md] [raw/code--mdn-iframe-contentdocument.md].

### Implications for the code audit and capture safety

1. A Stylelint pass using `color-no-hex`, `color-named`, `unit-allowed-list`, `font-family-no-duplicate-names`, and `declaration-property-value-allowed-list`, backed by `stylelint-declaration-strict-value` for enforcing token/variable usage on color and z-index, gives a codebase-level consistency signal that pairs with a visual capture: raw hex or unit violations flagged by the linter are the same class of drift the 21st.dev audit workflow calls "literal color values versus semantic tokens" [raw/code--stylelint-rule-color-no-hex.md] [raw/code--stylelint-rule-color-named.md] [raw/code--stylelint-rule-unit-allowed-list.md] [raw/code--stylelint-rule-font-family-no-duplicate-names.md] [raw/code--stylelint-rule-declaration-property-value-allowed-list.md] [raw/code--stylelint-declaration-strict-value-plugin.md] [raw/code--duplicate-ui-components-detection.md].

2. jscpd's exact/renamed/similar clone detection (`--min-tokens`, `--min-lines`, `--ignore-identifiers`, `--ignore-literals`, `--max-gap-lines`, `--similarity`) is the code-level counterpart to the 21st.dev signal "repeated local implementations versus shared primitives": a jscpd clone hit inside component directories is machine evidence for a duplicate-component finding that a visual/DOM capture can then confirm visually [raw/code--jscpd-readme.md] [raw/code--duplicate-ui-components-detection.md].

3. Tailwind v4's arbitrary-value bracket syntax (`bg-[#316ff6]`, `text-[18px]`) is a grep-able proxy for the same token-drift problem Stylelint's hex/unit rules catch in plain CSS; the raw research documents the syntax but no dedicated linter for it, so an audit built on this corpus should treat arbitrary-value density as a heuristic, not a certified rule violation [raw/code--tailwindcss-v4-arbitrary-values.md].

4. `prettier-plugin-tailwindcss` normalizes class order and, via `tailwindFunctions`/`tailwindAttributes`, can sort class strings inside `clsx`/`cva`-style helpers and custom attributes; running it (or diffing against its expected output) is a low-cost way to catch inconsistent class ordering before it is mistaken for a semantic difference during a visual audit [raw/code--prettier-plugin-tailwindcss-readme.md].

5. Knip's unused-exports/files/dependencies detection is a complementary hygiene signal for a codebase audit but was documented at only a purpose level in the raw research; do not cite specific Knip CLI flags or output formats without further research, since none were archived [raw/code--knip-readme.md].

6. Every artifact a capture tool writes (screenshot, HAR, console log, DOM snapshot, generated report) must be filtered against the OWASP Logging Cheat Sheet's never-log list (passwords, access tokens, session identifiers, PII, connection strings, encryption keys, payment data) before it is persisted or shared, since a capture pipeline is itself a logging surface [raw/code--owasp-logging-cheat-sheet.md].

7. Secrets encountered incidentally during capture (API keys typed into a form, tokens visible in a URL or response body, connection strings in dev tools) must be handled per OWASP Secrets Management guidance: never persist them in plaintext inside capture output, and prefer redaction over storage even temporarily [raw/code--owasp-secrets-management-cheat-sheet.md].

8. Redaction regexes for a capture tool should be seeded from GitHub's documented pattern families: generic patterns (private-key blocks, database connection strings) and named provider-token patterns (AWS `AKIA...`, Slack `xox[baprs]-...`, OpenAI `sk-...`-style keys, and the other providers in the supported table), applied to any text a capture tool is about to write to disk or a report [raw/code--github-secret-scanning-patterns.md].

9. A capture tool's action surface must be restricted to safe, and ideally idempotent, HTTP-triggering interactions: navigation, tab switches, clicks on links/tabs, and scrolling, which correspond to GET/HEAD-class requests; it must never submit a form or trigger a control that issues POST/PUT/DELETE/PATCH, since MDN classifies none of those as safe and only PUT/DELETE (not POST/PATCH) as idempotent [raw/code--mdn-http-request-methods.md].

10. A DOM-based component inventory has three hard blind spots the tool must detect and degrade gracefully around rather than silently miss: closed shadow roots (invisible to both page script and Playwright locators), XPath-based locator strategies (do not pierce shadow roots even when open), and cross-origin iframes (`contentDocument` is `null`, so only a screenshot of the region is possible, never DOM introspection) [raw/code--mdn-using-shadow-dom.md] [raw/code--playwright-locators-shadow-dom.md] [raw/code--mdn-iframe-contentdocument.md].

## 05. Demo video, screenshots, and script

Distilled from every file matching `raw/demo--*.md` (20 files). No training-data facts are used; anything not present in these files is marked as a research gap.

### 1. Recording

#### 1.1 Playwright recordVideo (browser-context level)

| Aspect | Detail | Source |
|---|---|---|
| Enable point | `browser.newContext({ recordVideo: { dir: 'videos/' } })` | [raw/demo--playwright-recordvideo.md] |
| Test-config equivalent | `use.video` accepts `'off'`, `'on'`, `'retain-on-failure'`, `'on-first-retry'` | [raw/demo--playwright-recordvideo.md] |
| Default size | Scaled down to fit 800x800, with viewport content positioned in the top-left corner | [raw/demo--playwright-recordvideo.md] |
| Explicit size control | `video: { size: { width, height } }` (example given: 640x480) overrides the default scale-to-fit behavior | [raw/demo--playwright-recordvideo.md] |
| Action/step annotation overlay | `show: { actions: { duration: 500, position: 'top-right' }, test: { level: 'step', position: 'top-left' } }` | [raw/demo--playwright-recordvideo.md] |
| When the file finalizes | Video is only fully written once the browser context is closed; docs explicitly say to `await browserContext.close()` (or `page.close()`/`browser.close()`) | [raw/demo--playwright-recordvideo.md] |
| Retrieving the path | `await page.video().path()`, and the path "is only available after the page or browser context is closed" | [raw/demo--playwright-recordvideo.md] |

No `recordVideo` option controlling container/codec format (e.g. webm vs mp4) is present in the archived page; the file does not state the output container format explicitly. Research gap: the raw doc never names the video's output file format (webm is the implied default from ffmpeg source-clip naming conventions used elsewhere in the archive, but this is not stated in [raw/demo--playwright-recordvideo.md] itself).

#### 1.2 slowMo and launch options

| Option | Type / default | Purpose | Source |
|---|---|---|---|
| `slowMo` | number, default `0` | "Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on." | [raw/demo--playwright-launch-slowmo.md] |
| `headless` | boolean, default `true` | Determines whether the browser runs without a visible UI | [raw/demo--playwright-launch-slowmo.md] |
| `args` | `Array<string>`, optional | Additional Chromium flags; docs warn custom args risk breaking Playwright functionality | [raw/demo--playwright-launch-slowmo.md] |

Usage note from the source: `chromium.launch({ headless: false, slowMo: 250 })` is the documented pattern to pace clicks/typing at a human-watchable speed for screen recording [raw/demo--playwright-launch-slowmo.md].

#### 1.3 Community pipeline article (labeled community)

Source: `playwright-recast`, a "fluent pipeline library for processing Playwright traces into polished demo videos with TTS voiceover, subtitles, speed control, and zoom" [raw/demo--playwright-demo-video-community-article.md]. This is a community/vendor-blog source, not official Playwright or ffmpeg documentation.

| Capability | Detail | Source |
|---|---|---|
| Input | Playwright trace files (ZIP archives of click events, network requests, screenshots, timestamps, DOM snapshots) | [raw/demo--playwright-demo-video-community-article.md] |
| Differential speed-up | `.speedUp({ duringIdle: 4.0, duringUserAction: 1.0, duringNetworkWait: 2.0 })`, i.e. idle/network-wait segments are compressed more aggressively than segments showing a live user action | [raw/demo--playwright-demo-video-community-article.md] |
| Subtitles | Two methods: `.subtitlesFromSrt('./narration.srt')` or `.voiceover(ElevenLabsProvider({ voiceId: 'daniel' }))`, the latter handling timing sync, silence padding, and audio concatenation | [raw/demo--playwright-demo-video-community-article.md] |
| Content filtering | `.hideSteps(s => s.text?.includes('logged in'))` to strip unwanted sequences such as login flows | [raw/demo--playwright-demo-video-community-article.md] |
| Zoom / cursor annotation | Zoom transitions are listed only as a planned/future feature, not yet implemented at time of writing; "cursor positions" are extracted from traces but the article gives no click-highlighting implementation detail | [raw/demo--playwright-demo-video-community-article.md] |
| Architecture | Immutable/lazy fluent builder; methods return new instances until `.toFile()` executes the full render chain | [raw/demo--playwright-demo-video-community-article.md] |

Conflict/dating note: the article's rendered page date shows March 26, 2024, but the archive notes the tool it describes appears actively maintained into 2026 and flags that the accurate date could not be independently confirmed at fetch time [raw/demo--playwright-demo-video-community-article.md].

### 2. FFmpeg assembly

#### 2.1 libx264 options for web delivery

| Flag | Meaning | Source |
|---|---|---|
| `-c:v libx264` | Select the H.264 encoder (requires `--enable-libx264` at ffmpeg build time) | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `preset` | Sets the encoding preset (speed/compression tradeoff) | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `crf` | "Set the quality for constant quality mode" | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `crf_max` | In CRF mode, prevents VBV from lowering quality beyond this point | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `qp` | Constant quantization rate control parameter | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `tune`, `profile` | Tuning of encoding params; profile restrictions | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |
| `-pix_fmt yuv420p` | General ffmpeg output option (not libx264-specific) needed for broad player/device compatibility since many players cannot handle yuv444p/yuv422p | [raw/demo--ffmpeg-webm-to-mp4-libx264.md] |

Documented example command: `ffmpeg -i input.webm -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium output.mp4` [raw/demo--ffmpeg-webm-to-mp4-libx264.md]. The doc also documents `x264opts`/`x264-params` for passing raw libx264 key=value tuples, e.g. `ffmpeg -i foo.mpg -c:v libx264 -x264opts keyint=123:min-keyint=20 -an out.mkv` [raw/demo--ffmpeg-webm-to-mp4-libx264.md].

#### 2.2 Concat demuxer rules

| Rule | Detail | Source |
|---|---|---|
| Same-stream requirement | "All files must have the same streams (same codecs, same time base, etc.)" for stream-copy concatenation to work correctly; otherwise re-encoding is required | [raw/demo--ffmpeg-concat-demuxer.md] |
| Timestamp adjustment | Timestamps are adjusted so the first file starts at 0 and each next file starts where the previous finishes; done globally, which "may cause gaps if all streams do not have exactly the same length" | [raw/demo--ffmpeg-concat-demuxer.md] |
| List file syntax | Plain-text script, one directive per line, `#`-comments and blank lines ignored; `file path` directive per clip (paths with special chars/spaces escaped with backslash or single quotes) | [raw/demo--ffmpeg-concat-demuxer.md] |
| `-safe 0` | Required "when paths are not relative/simple" | [raw/demo--ffmpeg-concat-demuxer.md] |
| Command shape | `ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4` | [raw/demo--ffmpeg-concat-demuxer.md] |
| Optional directives | `ffconcat version 1.0` (must be the literal first line, no extra space/BOM, to auto-detect the format), `duration`, `inpoint`, `outpoint`, `file_packet_metadata` (deprecated in favor of `file_packet_meta`) | [raw/demo--ffmpeg-concat-demuxer.md] |

#### 2.3 +faststart

| Detail | Source |
|---|---|
| `movflags +faststart`: "Run a second pass moving the index (moov atom) to the beginning of the file. This operation can take a while, and will not work in various situations such as fragmented output, thus it is not enabled by default." | [raw/demo--ffmpeg-mov-mp4-faststart.md] |
| Purpose: moves the moov atom to the front so players/browsers can begin playback before the full file downloads (relevant for web-hosted demo videos) | [raw/demo--ffmpeg-mov-mp4-faststart.md] |
| Command shape: `ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4` | [raw/demo--ffmpeg-mov-mp4-faststart.md] |
| Segment-muxer variant: `ffmpeg -i in.mkv -f segment -segment_time 10 -segment_format_options movflags=+faststart out%03d.mp4` | [raw/demo--ffmpeg-mov-mp4-faststart.md] |

#### 2.4 Scale and pad to 1920x1080 preserving aspect ratio

| Filter | Key options | Source |
|---|---|---|
| `scale` | `width`/`w`, `height`/`h` (0 = use input dimension; `-n` with n>=1 maintains aspect ratio and rounds to a value divisible by n); `force_original_aspect_ratio` and `force_divisible_by` documented further down the options list | [raw/demo--ffmpeg-scale-pad-1920x1080.md] |
| `pad` | `width`/`w`, `height`/`h` (0 = use input size), `x`/`y` offsets (default 0; negative values are changed so the input is centered on the padded area), `color` (default black) | [raw/demo--ffmpeg-scale-pad-1920x1080.md] |

Documented example pattern for scaling to fit within a box while preserving SAR: `scale='400:300:force_original_aspect_ratio=decrease:force_divisible_by=2'` [raw/demo--ffmpeg-scale-pad-1920x1080.md]. The combined 1920x1080 pattern is built from the two documented filters (not itself a verbatim example in the doc): `ffmpeg -i input.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" -c:a copy output.mp4`, relying on `pad`'s documented centering behavior for negative x/y [raw/demo--ffmpeg-scale-pad-1920x1080.md].

#### 2.5 Subtitles: burn-in filter vs mov_text soft mux

| Approach | Command shape | Source |
|---|---|---|
| Burn-in (`subtitles` filter, libass-based, requires `--enable-libass`) | `ffmpeg -i input.mp4 -vf "subtitles=captions.srt" -c:a copy output.mp4` | [raw/demo--ffmpeg-subtitles-filter-mov-text.md] |
| Styling burned-in subs | `subtitles=sub.srt:force_style='Fontname=DejaVu Serif,PrimaryColour=&HCCFF0000'` (ASS KEY=VALUE pairs) | [raw/demo--ffmpeg-subtitles-filter-mov-text.md] |
| Soft/selectable track (mov_text) | `ffmpeg -i input.mp4 -i captions.srt -c:v copy -c:a copy -c:s mov_text output.mp4` | [raw/demo--ffmpeg-subtitles-filter-mov-text.md] |

**Documentation gap, stated honestly**: the archived official ffmpeg pages (`ffmpeg-codecs.html`, `ffmpeg-formats.html`, `ffmpeg-filters.html`) contain no dedicated prose section documenting `mov_text` by name. It appears only implicitly as one of the subtitle codecs the MOV/MP4 muxer supports. The `-c:s mov_text` invocation is the standard, widely-documented usage pattern consistent with ffmpeg's general `-c:<stream_type> <codec_name>` syntax, but could not be traced to a specific verbatim official-docs paragraph naming it [raw/demo--ffmpeg-subtitles-filter-mov-text.md].

#### 2.6 Adding an audio track with -map

| Element | Detail | Source |
|---|---|---|
| Syntax | `-map [-]input_file_id[:stream_specifier][:view_specifier][:?] \| [linklabel]` | [raw/demo--ffmpeg-add-audio-track-map.md] |
| Behavior | An output stream is created for every stream from the input file matching `input_file_id`; `stream_specifier` narrows the match; using `-map` at all disables ffmpeg's default automatic mappings for that output file | [raw/demo--ffmpeg-add-audio-track-map.md] |
| Negative mapping | A leading `-` disables matching streams from already-created mappings, e.g. `-map 0 -map -0:a:1` | [raw/demo--ffmpeg-add-audio-track-map.md] |
| Optional mapping | Trailing `?` ignores the map if it matches nothing instead of failing, e.g. `-map 0:a?` (still fails on an invalid input file index) | [raw/demo--ffmpeg-add-audio-track-map.md] |
| Language selection | `-map 0:m:language:eng` | [raw/demo--ffmpeg-add-audio-track-map.md] |
| Documented add-audio pattern | `ffmpeg -i screen_capture.mp4 -i narration.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest output.mp4`; `-shortest` is a separate general output option commonly paired with this but not part of `-map` itself | [raw/demo--ffmpeg-add-audio-track-map.md] |

#### 2.7 GIF via palettegen / paletteuse

| Filter | Key options | Source |
|---|---|---|
| `palettegen` | `max_colors` (palette always contains 256 entries; unused ones are black); `reserve_transparent` (255-color palette + 1 reserved for transparency, on by default, "you probably want to disable this option for a standalone image"); `transparency_color`; `stats_mode` (`full` default, `diff`, `single`); exports `lavfi.color_quant_ratio` metadata | [raw/demo--ffmpeg-gif-palettegen-paletteuse.md] |
| `paletteuse` | Takes a video stream + a 256-pixel palette image; `dither` (default `sierra2_4a`; other modes: bayer, heckbert, floyd_steinberg, sierra2, sierra3, burkes, atkinson, none); `bayer_scale` for bayer-mode pattern visibility | [raw/demo--ffmpeg-gif-palettegen-paletteuse.md] |
| Two-pass workflow | `ffmpeg -i input.mp4 -vf palettegen palette.png` then `ffmpeg -i input.mp4 -i palette.png -lavfi paletteuse output.gif` | [raw/demo--ffmpeg-gif-palettegen-paletteuse.md] |
| Single-pass workflow | `ffmpeg -i input.mp4 -filter_complex "[0:v] fps=15,scale=480:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" output.gif` (this combined form uses `fps`/`scale`/`split`, which are documented elsewhere in ffmpeg and are noted as a "common pattern built from the two filters documented" rather than a single verbatim doc example) | [raw/demo--ffmpeg-gif-palettegen-paletteuse.md] |

#### 2.8 Speed changes: setpts (video) and atempo (audio)

| Filter | Range / behavior | Source |
|---|---|---|
| `setpts` (video) / `asetpts` (audio) | Rewrites presentation timestamps via an expression; `setpts=0.5*PTS` = fast motion (2x), `setpts=2.0*PTS` = slow motion (half speed); other constants: `PTS`, `N`, `STARTPTS`, `STARTT`, `T`, `TB`, `FRAME_RATE`/`FR` | [raw/demo--ffmpeg-speed-setpts-atempo.md] |
| `atempo` (audio) | "Tempo must be in the [0.5, 100.0] range." One filter instance takes exactly one tempo parameter (default 1.0 if unspecified) | [raw/demo--ffmpeg-speed-setpts-atempo.md] |
| Practical caveat | "Note that tempo greater than 2 will skip some samples rather than blend them in... it is always possible to daisy-chain several instances of atempo to achieve the desired product tempo" (documented example: `atempo=sqrt(3),atempo=sqrt(3)` for 3x speed) | [raw/demo--ffmpeg-speed-setpts-atempo.md] |
| Combined video+audio speed change | `ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4` | [raw/demo--ffmpeg-speed-setpts-atempo.md] |

Note on the archived source's own framing: the stated hard range for `atempo` is [0.5, 100.0], but the archive flags that "in practice" a single-filter step of roughly [0.5, 2.0] is the comfortable range before quality degrades per the documented "skip some samples" caveat, with chaining as the documented workaround beyond that [raw/demo--ffmpeg-speed-setpts-atempo.md].

### 3. Captions

#### 3.1 WebVTT structure and cue timing

| Element | Detail | Source |
|---|---|---|
| File signature | Must begin with the literal string `WEBVTT`, optionally preceded by a UTF-8 BOM, followed by two or more line terminators | [raw/demo--webvtt-w3c-spec.md] |
| Cue timing syntax | `HH:MM:SS.mmm --> HH:MM:SS.mmm` (hours optional if zero, minutes/seconds 00-59, milliseconds 3 digits) | [raw/demo--webvtt-w3c-spec.md] |
| Cue identifier | Optional, precedes the timing line, must be unique in the file, cannot contain the substring `-->` | [raw/demo--webvtt-w3c-spec.md] |
| Cue settings | Optional, follow the timing line, space-separated `setting:value` pairs | [raw/demo--webvtt-w3c-spec.md] |
| Spec example | `WEBVTT` header, then `00:11.000 --> 00:13.000` / `<v Roger Bingham>We are in New York City` | [raw/demo--webvtt-w3c-spec.md] |
| MDN example | `WEBVTT` header followed by cues like `00:00.000 --> 00:00.900` / `Hildy!` (MDN's example omits the hours field, consistent with "hours optional if zero" in the W3C spec) | [raw/demo--webvtt-mdn.md] |
| HTML integration | `<track kind="captions|subtitles|descriptions|chapters|metadata" src="captions.vtt" srclang="en" default>` inside `<video>` | [raw/demo--webvtt-mdn.md] |
| JS API | `video.addTextTrack("captions", "Captions", "en")`, `track.mode = "showing"`, `track.addCue(new VTTCue(start, end, text))`; supports inline `<u>`/`<b>` markup in cue text | [raw/demo--webvtt-mdn.md] |
| CSS styling | `::cue` pseudo-element styles cue text (by tag, class, or attribute selector); `::cue-region` is spec-defined but "not supported by any browsers" per the page | [raw/demo--webvtt-mdn.md] |

#### 3.2 SRT differences (community source)

| Element | Detail | Source |
|---|---|---|
| Structure | Four parts per entry: sequence number, timecode line, subtitle text (one or more lines), blank-line delimiter | [raw/demo--srt-basics.md] |
| Timestamp format | `hours:minutes:seconds,milliseconds` using a **comma** as the millisecond separator (vs WebVTT's period), e.g. `00:05:00,400 --> 00:05:15,300` | [raw/demo--srt-basics.md] |
| Formatting support | HTML-derived tags `<b>`, `<i>`, `<u>`, and `<font color="">` | [raw/demo--srt-basics.md] |
| Sync convention | Media players auto-sync when the SRT filename matches the video filename (e.g. `movie.mp4` + `movie.srt`) | [raw/demo--srt-basics.md] |
| Authority | SRT has no formal spec owner (originated from the SubRip DVD-ripping tool); the archived source is a community reference (fileformat.com), corroborated per that page by the Library of Congress digital-preservation format description, which was seen but not separately archived | [raw/demo--srt-basics.md] |

**Key format conflict (both readings given)**: WebVTT uses a period (`.`) as the millisecond separator in `HH:MM:SS.mmm` [raw/demo--webvtt-w3c-spec.md]; SRT uses a comma (`,`) in `HH:MM:SS,mmm` [raw/demo--srt-basics.md]. A script that converts between the two formats must swap this separator, not just rename the file extension.

### 4. Screenshot sets for docs

#### 4.1 Google developer documentation style guide

| Guidance | Detail | Source |
|---|---|---|
| When to use images | "Use images only when they provide useful visual explanations of information that is otherwise difficult to express with words." | [raw/demo--doc-screenshots-google-style-guide.md] |
| Consistency | Be consistent for a given doc/doc set in what OS is used for screenshots; keep visual appearance consistent | [raw/demo--doc-screenshots-google-style-guide.md] |
| Cropping | "Crop screenshots to show the relevant information" to focus readers and improve future-proofing | [raw/demo--doc-screenshots-google-style-guide.md] |
| Sensitive data | Never include personally identifiable information; if unavoidable, "hide it with a solid-color overlay with 100% opacity. Don't rely on blurs, mosaic effects, or similar image-processing effects." | [raw/demo--doc-screenshots-google-style-guide.md] |
| Text formatting | Avoid images of text, code, or terminal output; use actual text instead | [raw/demo--doc-screenshots-google-style-guide.md] |
| Formats | SVG preferred for diagrams (stays sharp when zoomed); PNG otherwise; never transparent backgrounds (especially for lightbox-displayed diagrams); avoid animated GIFs in favor of resource-efficient formats like MP4 | [raw/demo--doc-screenshots-google-style-guide.md] |
| Alt text | Under 155 characters; complete sentences or noun phrases; include punctuation; avoid "Image of"/"Photo of"; empty `alt=""` for purely decorative images | [raw/demo--doc-screenshots-google-style-guide.md] |
| Sizing | Images should not exceed column width (example given: 856px column, 1712px max for the 2x asset); use `srcset` for 1x/2x resolutions | [raw/demo--doc-screenshots-google-style-guide.md] |
| Organization | Always introduce images with complete sentences; optional figure numbers ("Figure 1. Description here."); captions and descriptions differ; don't embed captions inside the graphic itself | [raw/demo--doc-screenshots-google-style-guide.md] |

#### 4.2 Microsoft Writing Style Guide

| Guidance | Detail | Source |
|---|---|---|
| Terminology | "Screenshot" is one word, not "screen shot" or "screen-shot" (verbatim word-list entry) | [raw/demo--doc-screenshots-microsoft-style-guide.md] |
| Cross-referenced companion pages | An internal-audience "Screenshots" page and an "Images and video checklist" page are referenced by the fetched page as covering simplifying procedures via screenshots, localization, and accessibility, but the archive could not independently fetch/verify that internal-audience content, so it is flagged rather than quoted [raw/demo--doc-screenshots-microsoft-style-guide.md] |
| General best practices (cross-referenced, not verbatim from the fetched page) | Lead instructions with an action verb; crop to the relevant area rather than full-screen captures; check every screenshot for emails, passwords, customer names, internal URLs before publishing; keep a consistent visual style (arrows, colors, sizing) across a doc set; re-capture screenshots when the UI changes since outdated screenshots confuse more than no screenshot | [raw/demo--doc-screenshots-microsoft-style-guide.md] |

Both guides converge on: crop tightly, scrub sensitive/PII data before publishing, and keep visual consistency across a set [raw/demo--doc-screenshots-google-style-guide.md] [raw/demo--doc-screenshots-microsoft-style-guide.md]. They diverge on redaction technique specificity: Google is explicit that overlays must be 100%-opaque solid color rather than blur/mosaic [raw/demo--doc-screenshots-google-style-guide.md]; the Microsoft source's fetched page gives no equivalent explicit redaction-method rule, only the general cross-referenced instruction to check for PII before publishing [raw/demo--doc-screenshots-microsoft-style-guide.md].

### 5. Demo script

#### 5.1 Structure (archived source type: community article, marketing/video-production agency blog)

Source: Content Beta, "How to Write A Product Demo Script?" [raw/demo--demo-script-structure.md].

| Section | Timing | Content rule |
|---|---|---|
| Hook | 10-15 seconds | "Open with the buyer's specific pain point or business problem. Do not start with the product name." |
| Aha! Moment | 15-20 seconds | Present the single most valuable capability the product delivers |
| Solution Walkthrough | 45-60 seconds | Demonstrate three core features maximum, each tied to a specific problem and a measurable outcome |
| Social Proof | 10 seconds | One concrete customer result with a timeframe |
| Call to Action | 10 seconds | One specific, low-friction next step |

All rows: [raw/demo--demo-script-structure.md]

| Aggregate guidance | Detail | Source |
|---|---|---|
| Total video length | 60-90 seconds for optimal engagement | [raw/demo--demo-script-structure.md] |
| Word count | ~150 words for a 60-second video; ~225 words for a 90-second video | [raw/demo--demo-script-structure.md] |
| Assumed speaking pace | 130-150 words per minute | [raw/demo--demo-script-structure.md] |
| Method label | "Tell-Show-Tell" style | [raw/demo--demo-script-structure.md] |

Mapping note: the requested hook/problem/walkthrough/call-to-action shape maps onto this source's five-part structure as Hook (with the problem implicit in the hook) leading into Aha! Moment + Solution Walkthrough, then Social Proof, then Call to Action [raw/demo--demo-script-structure.md].

#### 5.2 Narration speaking rate (source quality stated)

Source: VirtualSpeech, a community article citing the National Center for Voice and Speech [raw/demo--narration-speaking-rate-wpm.md]. This is a secondary/community source relaying a named research body's figure, not a link to the NCVS's own primary publication.

| Context | WPM | Source |
|---|---|---|
| Average US English conversation (per NCVS, as cited by the article) | ~150 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Presentations | 100-150 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Conversational speech | 120-150 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Audiobook narration | 150-160 wpm (upper limit for comfortable comprehension) | [raw/demo--narration-speaking-rate-wpm.md] |
| Radio hosts / podcasters | 150-160 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Auctioneers | ~250 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Commentators | 250-400 wpm | [raw/demo--narration-speaking-rate-wpm.md] |
| Five sampled TED Talks (measured by the article) | avg 173 wpm, range 154-201 wpm | [raw/demo--narration-speaking-rate-wpm.md] |

The same source's "practical takeaway" states a safe default for product-demo narration (semi-prepared, moderately paced) is 130-160 wpm, and explicitly cross-references this as consistent with the demo-script-structure source's 130-150 wpm assumption [raw/demo--narration-speaking-rate-wpm.md]. **Conflict, both readings given**: the demo-script-structure source states 130-150 wpm as its assumed pace [raw/demo--demo-script-structure.md], while the narration-rate source's own "presentations" band is 100-150 wpm and its recommended safe default band is 130-160 wpm [raw/demo--narration-speaking-rate-wpm.md]. No third, more authoritative source (e.g. a primary NCVS publication) was archived to adjudicate between these overlapping-but-not-identical bands; treat 130-150 wpm as the conservative intersection of both.

### 6. Text to speech

#### 6.1 ElevenLabs Text-to-Speech (Create speech)

| Element | Detail | Source |
|---|---|---|
| Endpoint | `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` | [raw/demo--elevenlabs-tts-api.md] |
| Auth | Header `xi-api-key` with the API key value | [raw/demo--elevenlabs-tts-api.md] |
| Required body field | `text` (string) - "The text that will get converted into speech" | [raw/demo--elevenlabs-tts-api.md] |
| `model_id` | Optional, default `eleven_multilingual_v2` | [raw/demo--elevenlabs-tts-api.md] |
| `output_format` | Optional, default `mp3_44100_128`; other formats include PCM and mu-law variants per ElevenLabs' broader docs | [raw/demo--elevenlabs-tts-api.md] |
| `voice_settings` | Optional object: `stability` (default 0.5), `similarity_boost` (default 0.75), `use_speaker_boost` (default true), `style` (default 0), `speed` (default 1) | [raw/demo--elevenlabs-tts-api.md] |
| Other optional fields | `language_code`, `seed` (0-4294967295), `apply_text_normalization` (default `auto`), `pronunciation_dictionary_locators` (max 3), and continuity fields `previous_text`/`next_text`/`previous_request_ids`/`next_request_ids` | [raw/demo--elevenlabs-tts-api.md] |
| Response | 200 = generated audio file (binary, in requested `output_format`); 422 = validation error with `detail` array (`loc`, `msg`, `type`) | [raw/demo--elevenlabs-tts-api.md] |
| Pipeline note | `voice_settings.speed` can pace narration independent of ffmpeg's `atempo`; the continuity fields exist specifically to preserve prosody when a long script is generated across multiple chunked calls | [raw/demo--elevenlabs-tts-api.md] |

#### 6.2 OpenAI Audio Speech (Create speech)

| Element | Detail | Source |
|---|---|---|
| Endpoint | `POST https://api.openai.com/v1/audio/speech` | [raw/demo--openai-audio-speech-api.md] |
| Auth | `Authorization: Bearer $OPENAI_API_KEY` | [raw/demo--openai-audio-speech-api.md] |
| Required fields | `input` (string, max 4096 characters); `model` (`tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, `gpt-4o-mini-tts-2025-12-15`); `voice` (alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse, marin, cedar, or a custom voice object with an `id`) | [raw/demo--openai-audio-speech-api.md] |
| `instructions` | Optional string to steer delivery tone/style; "Not compatible with `tts-1`/`tts-1-hd`" | [raw/demo--openai-audio-speech-api.md] |
| `response_format` | Optional, default `mp3`; supported: mp3, opus, aac, flac, wav, pcm | [raw/demo--openai-audio-speech-api.md] |
| `speed` | Optional, default `1.0`, range 0.25-4.0 | [raw/demo--openai-audio-speech-api.md] |
| Response | Audio file content, or a stream of audio events, format per `response_format` | [raw/demo--openai-audio-speech-api.md] |
| Pipeline note | `speed` can pace narration to a target duration directly at generation time as an alternative/complement to ffmpeg's `atempo`; `input`'s 4096-char cap means long scripts need chunking and later concatenation (ffmpeg concat demuxer); requesting `wav`/`pcm` avoids a lossy re-encode before muxing into video | [raw/demo--openai-audio-speech-api.md] |

#### 6.3 ElevenLabs vs OpenAI, side by side

| Dimension | ElevenLabs | OpenAI | Source |
|---|---|---|---|
| Auth header | `xi-api-key` | `Authorization: Bearer` | [raw/demo--elevenlabs-tts-api.md] [raw/demo--openai-audio-speech-api.md] |
| Default output format | `mp3_44100_128` | `mp3` | [raw/demo--elevenlabs-tts-api.md] [raw/demo--openai-audio-speech-api.md] |
| Format options | mp3 (+ sample rate/bitrate variants), PCM, mu-law variants (per ElevenLabs' broader docs, not fully enumerated in this archived page) | mp3, opus, aac, flac, wav, pcm | [raw/demo--elevenlabs-tts-api.md] [raw/demo--openai-audio-speech-api.md] |
| In-request speed control | `voice_settings.speed`, default 1 (range not stated in the archived page) | `speed`, default 1.0, range 0.25-4.0 | [raw/demo--elevenlabs-tts-api.md] [raw/demo--openai-audio-speech-api.md] |
| Long-script chunking | No stated hard character limit in the archived page; continuity handled via `previous_text`/`next_text`/`previous_request_ids`/`next_request_ids` | Hard 4096-character limit on `input`, requiring chunking + concatenation for long scripts | [raw/demo--elevenlabs-tts-api.md] [raw/demo--openai-audio-speech-api.md] |

Research gap: neither archived page documents pricing, rate limits, or streaming-specific request shapes beyond what is captured above; those were out of scope for the fetched pages.

### Implications for the demo route

1. **Video capture rig**: launch with `slowMo` (e.g. ~250ms per the documented example) so actions are human-watchable on camera, and enable `recordVideo` on the browser context, explicitly setting `size` rather than relying on the 800x800 scale-to-fit default, since the skill's `make-video.sh` needs a predictable source resolution to feed into the scale/pad stage [raw/demo--playwright-launch-slowmo.md] [raw/demo--playwright-recordvideo.md].
2. **Always close before reading the file**: `make-video.sh` (or its calling script) must await `context.close()`/`page.close()` before touching the recorded file or calling `page.video().path()`, since Playwright only finalizes the video on context close [raw/demo--playwright-recordvideo.md].
3. **Normalize to H.264/yuv420p before any further processing**: the skill's assembly step should run every captured clip through `-c:v libx264 -pix_fmt yuv420p -crf <value> -preset <value>` first, both for broad player compatibility and so every clip that will later be concatenated shares identical codec parameters (a concat-demuxer requirement) [raw/demo--ffmpeg-webm-to-mp4-libx264.md] [raw/demo--ffmpeg-concat-demuxer.md].
4. **Concat via list file, not filter_complex, for same-codec clips**: `make-video.sh` should generate a `list.txt` of `file '...'` lines and run `ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4`, which only works because step 3 already guaranteed identical streams across clips [raw/demo--ffmpeg-concat-demuxer.md].
5. **Scale and pad every clip to 1920x1080 before concatenation**, using `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black`, so mixed-resolution source captures (different viewport sizes across pages) land on one canonical output frame with letterboxing rather than distortion [raw/demo--ffmpeg-scale-pad-1920x1080.md].
6. **Always finish the pipeline with `-movflags +faststart`** on the final mp4 so the demo video streams/starts playback before fully downloading when embedded in docs or shared links; note it requires a second pass and is incompatible with fragmented output, so it should be the very last mux step, not combined with segment-based output [raw/demo--ffmpeg-mov-mp4-faststart.md].
7. **Default to soft-muxed `mov_text` captions, not burned-in, when the skill needs the caption to remain toggleable**, and fall back to the `subtitles` filter burn-in only when a platform (e.g. a raw video file with no player-level track support) requires pixels-baked-in text; flag to the user that `mov_text`'s exact codec semantics are not found in the official docs pages archived here [raw/demo--ffmpeg-subtitles-filter-mov-text.md].
8. **Author captions in WebVTT internally and convert to SRT only for players that require it**, swapping the period millisecond separator for a comma; this is the one hard format incompatibility between the two [raw/demo--webvtt-w3c-spec.md] [raw/demo--srt-basics.md].
9. **Add narration with `-map 0:v -map 1:a -c:v copy -c:a aac -shortest`** so the assembled video track is never re-encoded, only the audio is added/re-encoded to AAC, keeping the visual quality from step 3-6 intact [raw/demo--ffmpeg-add-audio-track-map.md].
10. **Offer a GIF export via the two-pass palettegen/paletteuse workflow** (`fps=15,scale=480:-1` is the documented common pairing) for docs pages or READMEs that cannot embed video, defaulting `dither` to the library default `sierra2_4a` unless the user requests a harder-edged look [raw/demo--ffmpeg-gif-palettegen-paletteuse.md].
11. **Bound any speed-change feature to what `atempo` can do cleanly**: keep single-step speedups at or below 2x (per the documented "skip some samples" caveat above 2x) and daisy-chain `atempo` instances for anything faster, pairing every `atempo` change with a matching `setpts=<1/factor>*PTS` on the video stream so audio and video stay in sync [raw/demo--ffmpeg-speed-setpts-atempo.md].
12. **Default the demo script generator to the Hook / Aha-Moment / Walkthrough / Social-Proof / CTA structure and its timings** (10-15s / 15-20s / 45-60s / 10s / 10s, 60-90s total, max 3 features in the walkthrough), since it is the only archived source that gives concrete, actionable script timing [raw/demo--demo-script-structure.md].
13. **Set the narration WPM default to 130-150 wpm**, the conservative intersection of the demo-script-structure source's assumed pace and the narration-rate source's presentations/safe-default bands, and expose it as a configurable parameter given the two sources do not fully agree [raw/demo--demo-script-structure.md] [raw/demo--narration-speaking-rate-wpm.md].
14. **Prefer generating TTS output directly in `wav` or `pcm`** (OpenAI) or a comparable uncompressed/high-bitrate ElevenLabs `output_format` when the audio will immediately be muxed with ffmpeg, avoiding a lossy re-encode round-trip; chunk any script over 4096 characters for OpenAI specifically and stitch with the concat demuxer or `-map`-based audio muxing already used in the video pipeline [raw/demo--openai-audio-speech-api.md] [raw/demo--ffmpeg-concat-demuxer.md].
15. **Apply the Google and Microsoft screenshot rules to any static doc-image output the skill produces**: crop tightly to relevant UI, use a 100%-opaque solid-color overlay (never blur/mosaic) for any PII, keep OS/visual style consistent across a set, and write real alt text under 155 characters instead of leaving images undescribed [raw/demo--doc-screenshots-google-style-guide.md] [raw/demo--doc-screenshots-microsoft-style-guide.md].

## 06. shadcn/ui mapping

### Components

| Fact | Source |
| --- | --- |
| The shadcn/ui registry holds 54 `registry:ui` items; the docs also include guide-only entries | [raw/shadcn--components-index.md] |
| `data-table` is a guide built from `table` and TanStack Table, with no `add data-table` install | [raw/shadcn--components-index.md] [raw/shadcn--data-table.md] |
| `date-picker` is a guide built from `popover` and `calendar`; `typography` is a style guide | [raw/shadcn--components-index.md] |
| `toast` is deprecated in favor of `sonner` | [raw/shadcn--components-index.md] |
| Newer conversation primitives exist in source: attachment, bubble, marker, message, message-scroller, questionnaire | [raw/shadcn--components-index.md] |
| `button` variants: default, outline, secondary, ghost, destructive, link; sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg | [raw/shadcn--button.md] |
| `badge` variants: default, secondary, destructive, outline, ghost, link | [raw/shadcn--badge.md] |
| Current source resolves cva variants to semantic classes (for example `cn-button-variant-default`) with `data-slot`, `data-variant`, `data-size` attributes, styled by the imported shadcn stylesheet | [raw/shadcn--button.md] |
| Card, Tabs, Select, Table, Dialog, Tooltip, Alert, Switch, Input, and Sidebar anatomy and install commands are archived per component | [raw/shadcn--card.md] [raw/shadcn--tabs.md] [raw/shadcn--select.md] [raw/shadcn--table.md] [raw/shadcn--dialog.md] [raw/shadcn--tooltip.md] [raw/shadcn--alert.md] [raw/shadcn--switch.md] [raw/shadcn--input.md] [raw/shadcn--sidebar.md] |

### Theming and CLI

| Fact | Source |
| --- | --- |
| Theme tokens live under `:root` and `.dark` as OKLCH values: background, foreground, card, popover, primary, secondary, muted, accent (with foreground pairs), destructive, border, input, ring, chart-1 to chart-5, sidebar set, radius | [raw/shadcn--theming.md] |
| `radius-sm` to `radius-4xl` derive from `--radius` (0.6x to 2.6x) | [raw/shadcn--theming.md] |
| New tokens are declared under both selectors and exposed with `@theme inline` (the docs' example is `--warning`) | [raw/shadcn--theming.md] [raw/shadcn--tailwind-v4.md] |
| `npx shadcn@latest init` sets up a project; `npx shadcn@latest add <component>` installs components | [raw/shadcn--cli.md] |
| `components.json` holds style, Tailwind, alias, and registry settings | [raw/shadcn--components-json.md] [raw/shadcn--registry-basics.md] |
| Blocks are larger prebuilt compositions added through the same CLI | [raw/shadcn--blocks.md] |

### shadcn-svelte

| Fact | Source |
| --- | --- |
| shadcn-svelte is built on Bits UI, not a port of Radix | [raw/shadcn--svelte-components-index.md] |
| It uses namespace imports with dot notation (`Select.Root`) where React uses flat exports | [raw/shadcn--svelte-components-index.md] |
| Its theming follows the same variable approach with documented value differences | [raw/shadcn--svelte-theming.md] |

Research gap: Ottosson's direct linear sRGB to LMS coefficients are not in the archive, so OKLCH conversion goes through XYZ with the archived M1 and M2 matrices [raw/inventory--oklab-bottosson.md].
