// Shared helpers for webapp-capture-stinger scripts.
// Designed by Legion Code Inc. Requires Node 20.9+, playwright-core, and a Chromium
// build (run `npm install` in scripts/, then `npx playwright install chromium`).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { requestAllowed, validateRequestGrants, isSafeCapturePath } from "./browser-policy.mjs";
import { redactCapture } from "./redaction.mjs";
let activeCaptureConfig;
const capturePolicyFailures = new WeakMap();
const captureQueues = new WeakMap();
export function assertCapturePolicy(page) {
  const failure = capturePolicyFailures.get(page);
  if (failure) throw failure;
}

// Clean failures for every script that imports this module: one readable line, no stack
// trace unless WEBAPP_CAPTURE_DEBUG=1, and a non-zero exit code.
const fail = (err) => {
  console.error(`ERROR: ${redactCapture(activeCaptureConfig, err?.message || err)}`);
  if (process.env.WEBAPP_CAPTURE_DEBUG) console.error(redactCapture(activeCaptureConfig, err?.stack));
  process.exit(1);
};
process.on("uncaughtException", fail);
process.on("unhandledRejection", fail);

export const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a.map((v) => redactCapture(activeCaptureConfig, v)));
export const slugify = (s) =>
  String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const pad = (n, w = 3) => String(n).padStart(w, "0");
const DESTRUCTIVE_ROUTE = /(?:^|[\/_?&=-])(?:logout|signout|delete|remove|reset|revoke|restart|purchase|pay|transfer|publish)(?=$|[\/_?&=-])/i;

/** Fail fast with every problem at once, not the first one. */
export function validateConfig(cfg) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };
  need(cfg.app && typeof cfg.app.origin === "string", "app.origin is required");
  if (cfg.app?.origin) {
    try {
      const u = new URL(cfg.app.origin);
      need(["http:", "https:"].includes(u.protocol), "app.origin must be http or https");
      need(!u.username && !u.password && !u.search && !u.hash && (u.pathname === "/" || u.pathname === "") && u.origin === cfg.app.origin.replace(/\/$/, ""), "app.origin must be a clean HTTP origin without credentials, path, query or fragment");
    } catch { errors.push("app.origin is not a valid URL"); }
  }
  need(cfg.auth && typeof cfg.auth.storageState === "string", "auth.storageState path is required");
  need(cfg.browser?.viewport?.width > 0 && cfg.browser?.viewport?.height > 0, "browser.viewport.width and height are required");
  need(cfg.browser?.deviceScaleFactor >= 1 && cfg.browser?.deviceScaleFactor <= 4, "browser.deviceScaleFactor must be between 1 and 4");
  need(["nav-links", "crawl-links", "list"].includes(cfg.routes?.discover), "routes.discover must be nav-links, crawl-links, or list");
  if (cfg.routes?.discover === "list") need(Array.isArray(cfg.routes.list) && cfg.routes.list.length, "routes.list must be a non-empty array when discover is list");
  if (cfg.routes?.discover === "crawl-links") {
    const maxRoutes = Number(cfg.routes.maxRoutes ?? 200);
    need(Number.isInteger(maxRoutes) && maxRoutes > 0, "routes.maxRoutes must be a positive integer");
  }
  need(typeof cfg.tabs?.selector === "string", "tabs.selector is required");
  for (const [key, pattern] of [["tabs.notATabLabel", cfg.tabs?.notATabLabel], ["tabs.noTabsOnRoutePattern", cfg.tabs?.noTabsOnRoutePattern], ["icons.classPattern", cfg.icons?.classPattern]]) {
    try { new RegExp(pattern || ""); } catch (e) { errors.push(`${key} is not a valid regex: ${e.message}`); }
  }
  if (cfg.routes?.includePattern) {
    try { new RegExp(cfg.routes.includePattern); } catch (e) { errors.push(`routes.includePattern is not a valid regex: ${e.message}`); }
  }
  if (cfg.onboarding?.denyPattern) {
    try { new RegExp(cfg.onboarding.denyPattern); } catch (e) { errors.push(`onboarding.denyPattern is not a valid regex: ${e.message}`); }
  }
  if (cfg.onboarding?.outputSubdir) {
    const parts = cfg.onboarding.outputSubdir.split(/[\\/]+/);
    need(!path.isAbsolute(cfg.onboarding.outputSubdir) && !path.win32.isAbsolute(cfg.onboarding.outputSubdir) && !parts.includes(".."), "onboarding.outputSubdir must stay inside the screenshots directory");
  }
  if (cfg.onboarding?.skipWhenApiHasItems) {
    need(/^\/(?!\/)/.test(cfg.onboarding.skipWhenApiHasItems), "onboarding.skipWhenApiHasItems must be a same-origin absolute path");
  }
  for (const p of cfg.redact?.patterns || []) {
    try { new RegExp(p, "gi"); } catch (e) { errors.push(`redact.patterns entry is not a valid regex (${p}): ${e.message}`); }
  }
  need(cfg.output && typeof cfg.output.inventory === "string", "output.inventory is required");
  try { validateRequestGrants(cfg.network?.readPost || [], { reads: true }); } catch (e) { errors.push(e.message); }
  need(["storage-state", "persistent", "cdp"].includes(cfg.browser?.sessionMode || "storage-state"), "invalid browser.sessionMode");
  if (["persistent", "cdp"].includes(cfg.browser?.sessionMode)) need(typeof cfg.browser.profileDir === "string", "dedicated browser.profileDir is required");
  if (cfg.browser?.sessionMode === "cdp") {
    try { const u = new URL(cfg.browser.cdpEndpoint); need(u.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname) && !u.username && !u.password && !u.search && !u.hash && u.pathname === "/", "CDP endpoint must be a loopback HTTP origin"); } catch { errors.push("browser.cdpEndpoint must be a loopback HTTP origin"); }
  }
  if (errors.length) throw new Error(`Invalid capture config:\n  - ${errors.join("\n  - ")}`);
  return cfg;
}

/** Load and validate a capture config. Relative paths resolve against the config file's directory. */
export function loadConfig(configPath = process.env.CAPTURE_CONFIG) {
  if (!configPath) throw new Error("Set CAPTURE_CONFIG=/path/to/capture.config.json");
  const abs = path.resolve(configPath);
  if (!fs.existsSync(abs)) throw new Error(`Config not found: ${abs}`);
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(abs, "utf8")); } catch (e) { throw new Error(`Config is not valid JSON (${abs}): ${e.message}`); }
  const base = path.dirname(abs);
  const rel = (p) => (p && !path.isAbsolute(p) ? path.join(base, p) : p);
  cfg.__dir = base;
  cfg.__path = abs;
  // Main-navigation discovery is the default: it starts from routes.startPath, the real landing page.
  if (cfg.routes && typeof cfg.routes === "object") cfg.routes.discover ??= "nav-links";
  cfg.__rawOutput = { ...(cfg.output || {}) };
  validateConfig(cfg);
  cfg.auth.storageState = rel(cfg.auth.storageState);
  if (cfg.browser.profileDir) cfg.browser.profileDir = rel(cfg.browser.profileDir);
  if (cfg.browser.executablePath) cfg.browser.executablePath = rel(cfg.browser.executablePath);
  for (const k of Object.keys(cfg.output || {})) cfg.output[k] = rel(cfg.output[k]);
  cfg.app.origin = cfg.app.origin.replace(/\/$/, "");
  cfg.redact ??= { patterns: [] };
  cfg.redact.maskSelectors ??= [];
  if (!Array.isArray(cfg.redact.maskSelectors) || cfg.redact.maskSelectors.some((s) => typeof s !== "string" || !s.trim())) throw new Error("redact.maskSelectors must contain non-empty selector strings");
  activeCaptureConfig = cfg;
  return cfg;
}

/**
 * Output paths are relative to the config file. Writing "library/design/demo" in a config that
 * already lives in library/design nests a second copy (library/design/library/design/demo).
 * Returns one warning per output key whose path repeats the tail of the config folder.
 */
export function nestedOutputPaths(cfgDir, rawOutput = {}) {
  const dirParts = path.resolve(cfgDir).split(path.sep).filter(Boolean);
  const warnings = [];
  for (const [key, raw] of Object.entries(rawOutput)) {
    if (typeof raw !== "string" || path.isAbsolute(raw)) continue;
    const rel = path.normalize(raw).split(/[\\/]+/).filter((p) => p && p !== ".");
    for (let k = Math.min(dirParts.length, rel.length); k >= 1; k--) {
      const tail = dirParts.slice(-k);
      if (tail.every((part, i) => part === rel[i])) {
        warnings.push({ key, raw, resolved: path.join(cfgDir, raw), repeated: tail.join("/"), suggested: rel.slice(k).join("/") || "." });
        break;
      }
    }
  }
  return warnings;
}

/** Memory the OS can hand to new processes, in GB. os.freemem() undercounts on macOS (it ignores reclaimable cache). */
export function availableMemGb() {
  try {
    if (os.platform() === "linux") {
      const m = fs.readFileSync("/proc/meminfo", "utf8").match(/MemAvailable:\s+(\d+) kB/);
      if (m) return Number(m[1]) / 1048576;
    }
    if (os.platform() === "darwin") {
      const out = execFileSync("vm_stat", { encoding: "utf8" });
      const pageSize = Number((out.match(/page size of (\d+) bytes/) || [])[1] || 16384);
      const pages = (label) => Number((out.match(new RegExp(`${label}:\\s+(\\d+)`)) || [])[1] || 0);
      return ((pages("Pages free") + pages("Pages inactive") + pages("Pages speculative") + pages("Pages purgeable")) * pageSize) / 1073741824;
    }
  } catch {}
  return os.freemem() / 1073741824;
}

/** Sidecar file that holds sessionStorage, which Playwright's storageState does not cover. */
export const sessionStoragePath = (cfg) => `${cfg.auth.storageState}.session.json`;

function privateSessionPath(file) {
  let current = path.resolve(file);
  for (;;) {
    try {
      const st = fs.lstatSync(current);
      if (st.isSymbolicLink()) {
        const alias = process.platform === "darwin" && ["/tmp", "/var", "/etc"].includes(current);
        if (!alias || fs.realpathSync(current) !== `/private${current}`) throw new Error("refusing linked session path");
      } else if (current === path.resolve(file) && !st.isFile()) {
        throw new Error("session path must be a regular file");
      }
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function writePrivateSession(file, text) {
  privateSessionPath(file);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.${randomBytes(12).toString("hex")}.tmp`;
  let descriptor;
  try {
    descriptor = fs.openSync(temporary, "wx", 0o600);
    fs.writeFileSync(descriptor, text);
    fs.closeSync(descriptor);
    descriptor = undefined;
    privateSessionPath(file);
    fs.renameSync(temporary, file);
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

/** Write private state without a world-readable creation window. Bind the
 * sidecar to these exact state bytes so interrupted saves fail closed. */
export function saveSessionState(cfg, state, entries) {
  if (!Array.isArray(state?.cookies) || !Array.isArray(state?.origins) ||
      !entries || typeof entries !== "object" || Array.isArray(entries) ||
      Object.values(entries).some((value) => typeof value !== "string")) {
    throw new Error("invalid saved browser state or sessionStorage entries");
  }
  const file = path.resolve(cfg.auth.storageState);
  const sidecar = sessionStoragePath({ auth: { storageState: file } });
  privateSessionPath(file);
  privateSessionPath(sidecar);
  const text = JSON.stringify(state);
  const payload = JSON.stringify({ version: 1, origin: cfg.app.origin,
    state_sha256: createHash("sha256").update(text).digest("hex"), entries });
  writePrivateSession(file, text);
  // Always replace, including empty entries. A previous user's keys must not
  // survive a new login whose sessionStorage is empty.
  writePrivateSession(sidecar, payload);
}

function readPrivateSession(file) {
  privateSessionPath(file);
  const descriptor = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
  try {
    const st = fs.fstatSync(descriptor);
    if (!st.isFile()) throw new Error("session path must be a regular file");
    if (process.platform !== "win32" && (st.mode & 0o077)) throw new Error("saved session must be private (chmod 600, then re-save if needed)");
    return fs.readFileSync(descriptor, "utf8");
  } finally { fs.closeSync(descriptor); }
}

/** Validate the pair before launching a browser or restoring any credentials. */
export function readSessionState(cfg) {
  const text = readPrivateSession(cfg.auth.storageState);
  const parse = (value) => {
    try { return JSON.parse(value); }
    catch { throw new Error("saved session is not valid JSON; re-run the human login save"); }
  };
  const state = parse(text);
  if (!Array.isArray(state?.cookies) || !Array.isArray(state?.origins)) throw new Error("invalid saved browser state");
  const sidecar = sessionStoragePath(cfg);
  privateSessionPath(sidecar);
  let entries = {};
  if (!fs.existsSync(sidecar)) throw new Error("saved session sidecar is missing; re-run the human login save");
  if (fs.existsSync(sidecar)) {
    const saved = parse(readPrivateSession(sidecar));
    if (saved?.version !== 1 || saved.origin !== cfg.app.origin ||
        saved.state_sha256 !== createHash("sha256").update(text).digest("hex") ||
        !saved.entries || typeof saved.entries !== "object" || Array.isArray(saved.entries) ||
        Object.values(saved.entries).some((value) => typeof value !== "string")) {
      throw new Error("saved session sidecar is stale or legacy; re-run the human login save");
    }
    entries = saved.entries;
  }
  return { state, entries };
}

/** Find a Chromium executable: explicit config, then the Playwright cache. Undefined lets playwright-core decide. */
export function chromiumPath(cfg) {
  if (cfg.browser?.executablePath) return cfg.browser.executablePath;
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH ||
    path.join(os.homedir(), os.platform() === "darwin" ? "Library/Caches/ms-playwright" : os.platform() === "win32" ? "AppData/Local/ms-playwright" : ".cache/ms-playwright");
  if (!fs.existsSync(cache)) return undefined;
  const dirs = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  const candidates = [
    "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
    "chrome-linux64/chrome",
    "chrome-linux/chrome",
    "chrome-win64/chrome.exe",
    "chrome-win/chrome.exe",
  ];
  for (const d of dirs) for (const c of candidates) {
    const p = path.join(cache, d, c);
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

/**
 * Launch headless Chromium with the saved session (cookies, localStorage, and the
 * sessionStorage sidecar), theme forcing, and an off-origin navigation block.
 * Returns { browser, context, page }.
 */
export async function openApp(cfg, { headless = true, recordVideo, slowMo } = {}) {
  activeCaptureConfig = cfg;
  let origin;
  try { origin = new URL(cfg.app.origin); } catch { throw new Error("capture origin must be a clean HTTP origin"); }
  if (!["http:", "https:"].includes(origin.protocol) || origin.origin !== cfg.app.origin || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/") throw new Error("capture origin must be a clean HTTP origin");
  validateRequestGrants(cfg.network?.readPost || [], { reads: true });
  if (!fs.existsSync(cfg.auth.storageState)) {
    throw new Error(`No saved session at ${cfg.auth.storageState}. Run save-session.mjs and have a human log in.`);
  }
  const { state, entries } = readSessionState(cfg);
  const { chromium } = await import("playwright-core");
  if (recordVideo) throw new Error("continuous recording is refused; use startMaskedVideo for pixel-safe frames");
  const options = { viewport: cfg.browser.viewport, deviceScaleFactor: cfg.browser.deviceScaleFactor,
    colorScheme: cfg.browser.colorScheme || "no-preference", reducedMotion: cfg.browser.reducedMotion || "no-preference", serviceWorkers: "block" };
  const mode = cfg.browser.sessionMode || "storage-state";
  let browser, context;
  if (mode === "persistent") {
    ensureDedicatedProfile(cfg, false);
    context = await chromium.launchPersistentContext(cfg.browser.profileDir, { ...options, executablePath: chromiumPath(cfg), headless, ...(slowMo ? { slowMo } : {}) });
    browser = { close: () => context.close() };
    await context.clearCookies(); await context.addCookies(state.cookies);
    await context.addInitScript((origins) => { const saved = origins.find((o) => o.origin === location.origin); if (saved) for (const e of saved.localStorage || []) localStorage.setItem(e.name, e.value); }, state.origins);
  } else if (mode === "cdp") {
    ensureDedicatedProfile(cfg, false);
    const endpoint = new URL(cfg.browser.cdpEndpoint);
    if (endpoint.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname) || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== "/") throw new Error("CDP endpoint must be a loopback HTTP origin");
    const connection = await chromium.connectOverCDP(cfg.browser.cdpEndpoint);
    try {
      const command = await connection.newBrowserCDPSession();
      const { arguments: launchArgs } = await command.send("Browser.getBrowserCommandLine");
      await command.detach();
      const dataArg = launchArgs.find((value) => value.startsWith("--user-data-dir="));
      if (!dataArg || path.resolve(dataArg.slice("--user-data-dir=".length)) !== path.resolve(cfg.browser.profileDir)) throw new Error("CDP browser does not use the owned capture profile");
    } catch (error) { await connection.close(); throw error; }
    // Never operate or close the borrowed browser's default context or tabs.
    context = await connection.newContext({ ...options, storageState: state });
    browser = { close: async () => { await context.close(); await connection.close(); } };
  } else {
    browser = await chromium.launch({ executablePath: chromiumPath(cfg), headless, ...(slowMo ? { slowMo } : {}) });
    context = await browser.newContext({ ...options, storageState: state });
  }
  try {
  const ls = cfg.theme?.localStorage;
  if (ls?.key) {
    await context.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} },
      [ls.key, typeof ls.value === "string" ? ls.value : JSON.stringify(ls.value)]);
  }
  if (Object.keys(entries).length) {
    await context.addInitScript(([origin, data]) => {
      if (location.origin !== origin) return;
      try { for (const [k, v] of Object.entries(data)) if (sessionStorage.getItem(k) === null) sessionStorage.setItem(k, v); } catch {}
    }, [cfg.app.origin, entries]);
  }
  const page = await context.newPage();
  await validatePageMaskSelectors(cfg, page);
  context.on("page", (p) => { if (p !== page) p.close().catch(() => {}); });
  await context.route("**/*", async (route) => {
    if (!requestAllowed(cfg, route.request(), page)) return route.abort("blockedbyclient");
    let response;
    try {
      // Browser routing sees only the first request of some redirect chains.
      // Fetch one approved hop only, inspect it, and never pass a redirect back.
      response = await route.fetch({ maxRedirects: 0, timeout: 30000 });
      if (response.status() >= 300 && response.status() < 400) {
        capturePolicyFailures.set(page, new Error(`capture refused HTTP ${response.status()} redirect response; configure the final direct route`));
        return await route.abort("blockedbyclient");
      }
      return await route.fulfill({ response });
    } catch {
      capturePolicyFailures.set(page, new Error("capture request failed under the no-redirect policy; inspect the direct route"));
      await route.abort("blockedbyclient").catch(() => {});
    } finally { if (response) await response.dispose(); }
  });
  // WebSockets can mutate without an HTTP method. Disable them for capture.
  if (typeof context.routeWebSocket === "function") await context.routeWebSocket("**/*", (socket) => socket.close());
  else await context.addInitScript(() => { window.WebSocket = class { constructor() { throw new Error("capture blocks WebSocket writes"); } }; });
  return { browser, context, page };
  } catch (error) { await browser.close(); throw error; }
}

/** idleMs <= 0 skips networkidle. Realtime pages (polling, long-poll, streams) never go idle,
 * and in Playwright a timeout of 0 means wait forever, so demos pass 0 and use waitFor actions. */
export async function settle(page, idleMs = 8000, extraMs = 1200) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  if (idleMs > 0) await page.waitForLoadState("networkidle", { timeout: idleMs }).catch(() => {});
  await page.waitForTimeout(extraMs);
  assertCapturePolicy(page);
}

/** Throws if the configured theme is not active. */
export async function assertTheme(cfg, page) {
  const want = cfg.theme?.verify?.htmlClassIncludes;
  if (!want) return;
  const ok = await page.evaluate((c) => document.documentElement.classList.contains(c), want);
  if (!ok) throw new Error(`theme check failed: <html> lacks class "${want}". If a tab click caused this, add the route to tabs.noTabsOnRoutes.`);
}

/** Navigate and enforce the capture preconditions (same origin, logged in, theme active). */
export async function gotoChecked(cfg, page, route, { idleMs = 8000, extraMs = 1200 } = {}) {
  assertCapturePolicy(page);
  const target = new URL(route, cfg.app.origin);
  if (target.origin !== cfg.app.origin || !isSafeCapturePath(target.pathname) || DESTRUCTIVE_ROUTE.test(route)) throw new Error("capture refused unsafe or ambiguously encoded route");
  try { await page.goto(cfg.app.origin + route, { waitUntil: "domcontentloaded", timeout: 30000 }); } catch (error) { assertCapturePolicy(page); throw error; }
  await settle(page, idleMs, extraMs);
  const url = new URL(page.url());
  if (url.origin !== cfg.app.origin) throw new Error(`left origin: ${page.url()}`);
  if (cfg.app.loginPath && url.pathname === cfg.app.loginPath) throw new Error("session expired: log in again with save-session.mjs");
  await assertTheme(cfg, page);
  return url;
}

/** Only native CSS selectors can be used in the temporary privacy stylesheet. */
export function validatedMaskSelectors(cfg) {
  const configured = cfg.redact?.maskSelectors || [];
  if (!Array.isArray(configured)) throw new Error("redact.maskSelectors must be a CSS selector array");
  const selectors = [...new Set(["input[type=password]", ...configured])];
  for (const selector of selectors) {
    if (typeof selector !== "string" || !selector.trim() || /[{};@\\`]/.test(selector) || selector.includes("/*") || selector.includes("*/") || selector.includes(">>") || /^(?:[a-z]+)=/i.test(selector) || /:(?:visible|has-text|text(?:-is|-matches)?|nth-match|light)\b/.test(selector)) throw new Error("privacy masks require native CSS selectors without stylesheet injection");
    const stack = []; let quote = "";
    for (const char of selector) {
      if (quote) { if (char === quote) quote = ""; continue; }
      if (char === "'" || char === '"') { quote = char; continue; }
      if (char === "[" || char === "(") stack.push(char);
      else if (char === "]" || char === ")") { if (stack.pop() !== (char === "]" ? "[" : "(")) throw new Error("privacy selector syntax is unbalanced"); }
    }
    if (quote || stack.length) throw new Error("privacy selector syntax is unbalanced");
  }
  return selectors;
}
export async function validatePageMaskSelectors(cfg, page) {
  const selectors = validatedMaskSelectors(cfg);
  await page.evaluate((values) => {
    for (const selector of values) try { document.querySelector(selector); } catch { throw new Error("privacy masks require valid native CSS selectors"); }
  }, selectors);
}

/** Screenshot options shared by every capture: no animations, masks over configured sensitive regions. */
export function shotOptions(cfg, page, extra = {}) {
  assertCapturePolicy(page);
  if (cfg.redact?.maskColor && !/^#[a-f0-9]{6}$/i.test(cfg.redact.maskColor)) throw new Error("redact.maskColor must be an opaque six-digit hex color");
  const selectors = validatedMaskSelectors(cfg);
  const masks = selectors.map((selector) => page.locator(selector));
  // Opacity/filter hide overflowing descendants and shadow paint while keeping
  // the original layout. Playwright restores its temporary stylesheet afterward.
  const privacyStyle = selectors.map((selector) => `${selector} { opacity: 0 !important; filter: opacity(0) !important; }`).join("\n");
  if (["style", "mask", "maskColor"].some((key) => Object.hasOwn(extra, key))) throw new Error("capture options cannot override privacy styles or masks");
  return { animations: "disabled", ...(masks.length ? { mask: masks, maskColor: cfg.redact.maskColor || "#000000", style: privacyStyle } : {}), ...extra };
}

/** Serialize captures so temporary privacy styles never race another frame. */
export function captureScreenshot(cfg, page, options = {}, target = page) {
  if (Object.hasOwn(options, "path")) throw new Error("captureScreenshot returns bytes; use writePrivateCapture for private output");
  const previous = captureQueues.get(page) || Promise.resolve();
  const run = previous.catch(() => {}).then(async () => {
    const selectors = validatedMaskSelectors(cfg);
    await validatePageMaskSelectors(cfg, page);
    const key = `__capture_privacy_${randomBytes(12).toString("hex")}`;
    const frames = page.frames();
    try {
      for (const frame of frames) await frame.evaluate(([key, selectors]) => {
        const saved = new Map(), roots = new Set();
        let running = true, animation;
        const originalAttach = Element.prototype.attachShadow;
        const hide = (element) => {
          if (!saved.has(element)) saved.set(element, { value: element.style.getPropertyValue("opacity"), priority: element.style.getPropertyPriority("opacity"), attribute: element.getAttribute("style"), cssText: element.style.cssText });
          if (element.style.getPropertyValue("opacity") !== "0" || element.style.getPropertyPriority("opacity") !== "important") element.style.setProperty("opacity", "0", "important");
        };
        const observers = [];
        const scan = (root) => {
          if (!roots.has(root)) {
            roots.add(root); const observer = new MutationObserver(() => { if (running) scan(root); });
            observer.observe(root, { subtree: true, childList: true, attributes: true }); observers.push(observer);
          }
          for (const selector of selectors) for (const element of root.querySelectorAll(selector)) hide(element);
          for (const element of root.querySelectorAll("*")) if (element.shadowRoot) scan(element.shadowRoot);
        };
        window[key] = () => {
          running = false; cancelAnimationFrame(animation); observers.forEach((observer) => observer.disconnect());
          Element.prototype.attachShadow = originalAttach;
          for (const [element, original] of saved) {
            if (original.value) element.style.setProperty("opacity", original.value, original.priority); else element.style.removeProperty("opacity");
            if (element.style.cssText === original.cssText) { if (original.attribute === null) element.removeAttribute("style"); else element.setAttribute("style", original.attribute); }
          }
          delete window[key];
        };
        Element.prototype.attachShadow = function (...args) { const root = originalAttach.apply(this, args); scan(root); return root; };
        const tick = () => { if (running) { scan(document); animation = requestAnimationFrame(tick); } };
        scan(document); animation = requestAnimationFrame(tick);

      }, [key, selectors]);
      const bytes = await target.screenshot(shotOptions(cfg, page, options));
      const currentFrames = page.frames();
      if (currentFrames.length !== frames.length || currentFrames.some((frame) => !frames.includes(frame))) throw new Error("capture context changed during the image; no image was exported");
      for (const frame of frames) {
        let guarded = false;
        try { guarded = await frame.evaluate((key) => typeof window[key] === "function", key); } catch { /* replaced or detached document fails closed */ }
        if (!guarded) throw new Error("capture context changed during the image; no image was exported");
      }
      assertCapturePolicy(page);
      return bytes;
    } finally {
      for (const frame of frames) await frame.evaluate((key) => { window[key]?.(); }, key).catch(() => {});
    }
  });
  captureQueues.set(page, run);
  run.finally(() => { if (captureQueues.get(page) === run) captureQueues.delete(page); }).catch(() => {});
  return run;
}

/** Collect routes from same-origin nav links on startPath, or use the configured list. */
export async function discoverRoutes(cfg, page) {
  const exclude = new Set(cfg.routes.exclude || []);
  if (cfg.routes.discover === "list") {
    const routes = cfg.routes.list.filter((r) => !exclude.has(r) && isSafeCapturePath(new URL(r, cfg.app.origin).pathname) && !DESTRUCTIVE_ROUTE.test(r));
    if (!routes.length) throw new Error("routes.list contains no safe routes after exclusions");
    return routes;
  }
  if (cfg.routes.discover === "crawl-links") {
    const start = cfg.routes.startPath || "/";
    const maxRoutes = Math.max(1, Number(cfg.routes.maxRoutes || 200));
    const include = cfg.routes.includePattern ? new RegExp(cfg.routes.includePattern) : null;
    const queued = new Set([start]);
    const visited = new Set();
    const routes = [];
    const isExcluded = (route) => {
      const pathname = new URL(route, cfg.app.origin).pathname;
      return exclude.has(route) || exclude.has(pathname) || pathname === cfg.app.loginPath || !isSafeCapturePath(pathname) || DESTRUCTIVE_ROUTE.test(route) || (include && !include.test(pathname));
    };

    while (queued.size && routes.length < maxRoutes) {
      const route = queued.values().next().value;
      queued.delete(route);
      if (visited.has(route) || isExcluded(route)) continue;
      visited.add(route);
      await gotoChecked(cfg, page, route, { idleMs: 1500, extraMs: 250 });
      const current = new URL(page.url());
      const canonical = `${current.pathname}${current.search}`;
      if (!isExcluded(canonical) && !routes.includes(canonical)) routes.push(canonical);
      const links = await page.evaluate(() => Array.from(document.querySelectorAll("a[href]"), (a) => ({
        href: a.href,
        target: a.target,
      })));
      for (const link of links) {
        if (link.target === "_blank") continue;
        let url;
        try { url = new URL(link.href); } catch { continue; }
        if (url.origin !== cfg.app.origin) continue;
        const candidate = `${url.pathname}${url.search}`;
        if (!visited.has(candidate) && !isExcluded(candidate)) queued.add(candidate);
      }
    }
    if (queued.size) log(`route discovery stopped at routes.maxRoutes=${maxRoutes}; ${queued.size} route(s) remain queued`);
    if (!routes.length) throw new Error(`no routes discovered from ${start}`);
    return routes;
  }
  await gotoChecked(cfg, page, cfg.routes.startPath || "/");
  const found = await page.evaluate(() => {
    const seen = new Set();
    const out = [];
    for (const a of document.querySelectorAll("a[href]")) {
      if (a.host !== location.host || a.getAttribute("href").startsWith("#")) continue;
      if (a.target === "_blank" || seen.has(a.pathname)) continue;
      seen.add(a.pathname);
      out.push(a.pathname);
    }
    return out;
  });
  const routes = found.filter((r) => !exclude.has(r) && r !== cfg.app.loginPath && isSafeCapturePath(new URL(r, cfg.app.origin).pathname) && !DESTRUCTIVE_ROUTE.test(r));
  if (!routes.length) throw new Error(`no routes discovered on ${cfg.routes.startPath || "/"}; use routes.discover "list"`);
  return routes;
}

/** Route path to a filesystem-safe slug: /dashboard/costs/pricing -> dashboard-costs-pricing */
export const routeSlug = (route) => {
  const pathname = new URL(String(route), "http://capture.invalid").pathname;
  return `${(slugify(redactCapture(activeCaptureConfig, pathname)) || "root").slice(0, 80)}-${createHash("sha256").update(String(route)).digest("hex").slice(0, 16)}`;
};

/** Split an array into n roughly equal shards (round robin, keeps heavy pages spread). */
export const shard = (items, n) => {
  const out = Array.from({ length: Math.max(1, n) }, () => []);
  items.forEach((x, i) => out[i % out.length].push(x));
  return out.filter((s) => s.length);
};

/** Tabs: visible tab elements that are real views, not setting pickers or filters. */
export async function listTabs(cfg, page, route) {
  if ((cfg.tabs.noTabsOnRoutes || []).includes(route)) return [];
  if (cfg.tabs.noTabsOnRoutePattern && new RegExp(cfg.tabs.noTabsOnRoutePattern).test(route)) return [];
  const notATab = new RegExp(cfg.tabs.notATabLabel || "^$", "i");
  const tabs = page.locator(`${cfg.tabs.selector}:visible`);
  const info = await tabs.evaluateAll((els, iconPattern) => els.map((el, index) => {
    const c = el.cloneNode(true);
    c.querySelectorAll("svg").forEach((n) => n.remove());
    c.querySelectorAll("*").forEach((n) => { if (new RegExp(iconPattern).test(String(n.className))) n.remove(); });
    const href = el.closest("a")?.href || "";
    return {
      index,
      label: c.textContent.trim(),
      selected: el.getAttribute("aria-selected") === "true" || el.dataset.state === "active",
      external: href ? new URL(href, location.href).host !== location.host : false,
    };
  }), cfg.icons?.classPattern || "^$");
  return info.filter((t) => !t.external && !notATab.test(t.label));
}

/** Name a tab by the query param it sets (prefer ?tab=), else the changed path segment, else its label. */
export function tabName(before, after, label) {
  return `state-${createHash("sha256").update(JSON.stringify([before, after, label])).digest("hex").slice(0, 16)}`;
}

/** Run an async step with a clear timeout, so one hung page cannot stall a shard forever. */
export async function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms); });
  try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
}

/**
 * Resolve inventory, audit, and token paths. Explicit env variables win; otherwise
 * paths come from CAPTURE_CONFIG. Lets data scripts run with only CAPTURE_CONFIG set.
 */
export function capturePaths() {
  let cfg = null;
  if (process.env.CAPTURE_CONFIG) cfg = loadConfig();
  const inventory = cfg?.output?.inventory;
  const raw = path.resolve(process.env.RAW || (inventory ? path.join(inventory, "_raw") : ""));
  if (!process.env.RAW && !inventory) throw new Error("Set CAPTURE_CONFIG (or RAW=<inventory _raw directory>)");
  const today = new Date().toISOString().slice(0, 10);
  const audit = cfg?.output?.audit || path.join(raw, "..", "reports");
  return {
    cfg,
    raw,
    inventory: inventory || path.dirname(raw),
    audit,
    today,
    tokensRaw: path.join(raw, "tokens-raw.json"),
    source: cfg ? `${cfg.app.name || "app"} ${cfg.app.origin} (${cfg.browser.colorScheme || "default"} theme)` : "captured web app",
  };
}

/** A profile is created empty by this tool, bound to the app and state path.
 * An existing browser profile without this private marker is never borrowed. */
export function ensureDedicatedProfile(cfg, create = false) {
  const dir = path.resolve(cfg.browser.profileDir);
  const marker = path.join(dir, ".webapp-capture-profile.json");
  // Reuse the same no-link ancestor rule without treating the directory as a file.
  privateSessionPath(marker);
  const expected = { version: 1, origin: cfg.app.origin, storageState: path.resolve(cfg.auth.storageState) };
  if (!fs.existsSync(dir)) {
    if (!create) throw new Error("dedicated capture profile has not been initialized by save-session");
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(marker, JSON.stringify(expected), { flag: "wx", mode: 0o600 });
  } else if (!fs.existsSync(marker)) {
    if (!create || fs.readdirSync(dir).length) throw new Error("refusing an existing unowned browser profile");
    fs.writeFileSync(marker, JSON.stringify(expected), { flag: "wx", mode: 0o600 });
  }
  if (process.platform !== "win32" && (fs.statSync(dir).mode & 0o077)) throw new Error("dedicated capture profile must be private (mode 700)");
  if (readPrivateSession(marker) !== JSON.stringify(expected)) throw new Error("dedicated profile binding mismatch");
  return dir;
}

/** Capture output is private from its first creation. Public existing roots are
 * refused rather than changing caller permissions. Reruns use private owned files. */
export function ensurePrivateOutputDir(directory) {
  const absolute = path.resolve(directory);
  privateSessionPath(path.join(absolute, ".capture-path-check"));
  const missing = [];
  let current = absolute;
  while (!fs.existsSync(current)) { missing.push(current); const parent = path.dirname(current); if (parent === current) break; current = parent; }
  for (const dir of missing.reverse()) fs.mkdirSync(dir, { mode: 0o700 });
  const st = fs.lstatSync(absolute);
  if (!st.isDirectory() || st.isSymbolicLink()) throw new Error("capture output must be an unlinked directory");
  if (process.platform !== "win32" && ((st.mode & 0o077) || (process.getuid && st.uid !== process.getuid()))) throw new Error("existing capture output directory must be privately owned (mode 700)");
  return absolute;
}
export function writePrivateCapture(file, bytes, { append = false } = {}) {
  const absolute = path.resolve(file);
  ensurePrivateOutputDir(path.dirname(absolute));
  privateSessionPath(absolute);
  let previous;
  if (fs.existsSync(absolute)) {
    previous = fs.lstatSync(absolute);
    if (previous.nlink !== 1) throw new Error("refusing hardlinked capture output file");
    if (!previous.isFile() || previous.isSymbolicLink() || (process.platform !== "win32" && ((previous.mode & 0o077) || (process.getuid && previous.uid !== process.getuid())))) throw new Error("existing capture output file must be privately owned (mode 600)");
  }
  // Do not truncate until the opened inode is proven to be the inspected private,
  // singly linked file. A raced creation uses exclusive mode instead of overwrite.
  const descriptor = fs.openSync(absolute, fs.constants.O_WRONLY | (previous ? 0 : fs.constants.O_CREAT | fs.constants.O_EXCL) | (append ? fs.constants.O_APPEND : 0) | (fs.constants.O_NOFOLLOW || 0), 0o600);
  try {
    const opened = fs.fstatSync(descriptor);
    if (!opened.isFile() || opened.nlink !== 1 || (previous && (previous.dev !== opened.dev || previous.ino !== opened.ino)) || (process.platform !== "win32" && ((opened.mode & 0o077) || (process.getuid && opened.uid !== process.getuid())))) throw new Error("capture output inode changed or is not privately owned and singly linked");
    if (!append) fs.ftruncateSync(descriptor, 0);
    fs.writeFileSync(descriptor, bytes);
  } finally { fs.closeSync(descriptor); }
  return absolute;
}
