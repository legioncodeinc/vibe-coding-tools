// Shared helpers for webapp-capture-stinger scripts.
// Designed by Legion Code Inc. Requires Node 20.9+, playwright-core, and a Chromium
// build (run `npm install` in scripts/, then `npx playwright install chromium`).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

// Clean failures for every script that imports this module: one readable line, no stack
// trace unless WEBAPP_CAPTURE_DEBUG=1, and a non-zero exit code.
const fail = (err) => {
  console.error(`ERROR: ${err?.message || err}`);
  if (process.env.WEBAPP_CAPTURE_DEBUG) console.error(err?.stack);
  process.exit(1);
};
process.on("uncaughtException", fail);
process.on("unhandledRejection", fail);

export const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
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
      need(u.pathname === "/" || u.pathname === "", "app.origin must be an origin only (no path)");
    } catch { errors.push(`app.origin is not a valid URL: ${cfg.app.origin}`); }
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
  validateConfig(cfg);
  cfg.auth.storageState = rel(cfg.auth.storageState);
  for (const k of Object.keys(cfg.output || {})) cfg.output[k] = rel(cfg.output[k]);
  cfg.app.origin = cfg.app.origin.replace(/\/$/, "");
  cfg.redact ??= { patterns: [] };
  cfg.redact.maskSelectors ??= [];
  return cfg;
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
  const { chromium } = await import("playwright-core");
  if (!fs.existsSync(cfg.auth.storageState)) {
    throw new Error(`No saved session at ${cfg.auth.storageState}. Run save-session.mjs and have a human log in.`);
  }
  const browser = await chromium.launch({ executablePath: chromiumPath(cfg), headless, ...(slowMo ? { slowMo } : {}) });
  const context = await browser.newContext({
    storageState: cfg.auth.storageState,
    viewport: cfg.browser.viewport,
    deviceScaleFactor: cfg.browser.deviceScaleFactor,
    colorScheme: cfg.browser.colorScheme || "no-preference",
    reducedMotion: cfg.browser.reducedMotion || "no-preference",
    ...(recordVideo ? { recordVideo } : {}),
  });
  const ls = cfg.theme?.localStorage;
  if (ls?.key) {
    await context.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} },
      [ls.key, typeof ls.value === "string" ? ls.value : JSON.stringify(ls.value)]);
  }
  const ssFile = sessionStoragePath(cfg);
  if (fs.existsSync(ssFile)) {
    const entries = JSON.parse(fs.readFileSync(ssFile, "utf8"));
    await context.addInitScript(([origin, data]) => {
      if (location.origin !== origin) return;
      try { for (const [k, v] of Object.entries(data)) if (sessionStorage.getItem(k) === null) sessionStorage.setItem(k, v); } catch {}
    }, [cfg.app.origin, entries]);
  }
  const page = await context.newPage();
  context.on("page", (p) => { if (p !== page) p.close().catch(() => {}); });
  await page.route("**/*", (route) => {
    const req = route.request();
    const sameOrigin = (() => { try { return new URL(req.url()).origin === cfg.app.origin; } catch { return false; } })();
    if (req.isNavigationRequest() && req.frame() === page.mainFrame() && !sameOrigin) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
  return { browser, context, page };
}

export async function settle(page, idleMs = 8000, extraMs = 1200) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: idleMs }).catch(() => {});
  await page.waitForTimeout(extraMs);
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
  await page.goto(cfg.app.origin + route, { waitUntil: "domcontentloaded", timeout: 30000 });
  await settle(page, idleMs, extraMs);
  const url = new URL(page.url());
  if (url.origin !== cfg.app.origin) throw new Error(`left origin: ${page.url()}`);
  if (cfg.app.loginPath && url.pathname === cfg.app.loginPath) throw new Error("session expired: log in again with save-session.mjs");
  await assertTheme(cfg, page);
  return url;
}

/** Screenshot options shared by every capture: no animations, masks over configured sensitive regions. */
export function shotOptions(cfg, page, extra = {}) {
  const masks = (cfg.redact?.maskSelectors || []).map((s) => page.locator(s));
  return { animations: "disabled", ...(masks.length ? { mask: masks, maskColor: cfg.redact.maskColor || "#000000" } : {}), ...extra };
}

/** Collect routes from same-origin nav links on startPath, or use the configured list. */
export async function discoverRoutes(cfg, page) {
  const exclude = new Set(cfg.routes.exclude || []);
  if (cfg.routes.discover === "list") {
    const routes = cfg.routes.list.filter((r) => !exclude.has(r) && !DESTRUCTIVE_ROUTE.test(r));
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
      return exclude.has(route) || exclude.has(pathname) || pathname === cfg.app.loginPath || DESTRUCTIVE_ROUTE.test(route) || (include && !include.test(pathname));
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
  const routes = found.filter((r) => !exclude.has(r) && r !== cfg.app.loginPath && !DESTRUCTIVE_ROUTE.test(r));
  if (!routes.length) throw new Error(`no routes discovered on ${cfg.routes.startPath || "/"}; use routes.discover "list"`);
  return routes;
}

/** Route path to a filesystem-safe slug: /dashboard/costs/pricing -> dashboard-costs-pricing */
export const routeSlug = (route) => slugify(route) || "root";

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
  const b = new URL(before), a = new URL(after);
  if (a.searchParams.get("tab") && a.searchParams.get("tab") !== b.searchParams.get("tab")) return slugify(a.searchParams.get("tab"));
  for (const [k, v] of a.searchParams) if (k !== "id" && b.searchParams.get(k) !== v) return slugify(v);
  if (a.pathname !== b.pathname) return slugify(a.pathname.split("/").pop());
  return slugify(label) || "tab";
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
