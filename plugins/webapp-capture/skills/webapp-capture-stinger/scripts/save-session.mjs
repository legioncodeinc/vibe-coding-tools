// Open a VISIBLE browser at the app's login page, wait for a human to log in,
// then save cookies + localStorage (storageState) and a sessionStorage sidecar
// for headless runs. The agent never types credentials.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... [LOGIN_TIMEOUT_MS=900000] node save-session.mjs
import fs from "node:fs";
import path from "node:path";
import { chromiumPath, loadConfig, log, sessionStoragePath } from "./lib/common.mjs";

const cfg = loadConfig();
const { chromium } = await import("playwright-core");
const TIMEOUT_MS = Number(process.env.LOGIN_TIMEOUT_MS || 15 * 60 * 1000);
const loginPath = cfg.app.loginPath || "/login";

const browser = await chromium.launch({ executablePath: chromiumPath(cfg), headless: false });
const context = await browser.newContext({ viewport: cfg.browser.viewport, colorScheme: cfg.browser.colorScheme || "no-preference" });
const page = await context.newPage();
await page.goto(cfg.app.origin + loginPath, { waitUntil: "domcontentloaded" });
log(`A browser window is open at ${cfg.app.origin}${loginPath}.`);
log(`Log in there (MFA and SSO are fine). Waiting up to ${Math.round(TIMEOUT_MS / 60000)} minutes.`);

// Logged in = on the app origin, off the login path, and still there 3 seconds later
// (avoids saving mid-redirect during SSO round trips).
const deadline = Date.now() + TIMEOUT_MS;
let stableSince = 0;
for (;;) {
  if (page.isClosed()) throw new Error("the login window was closed before login completed");
  const url = new URL(page.url());
  const onApp = url.origin === cfg.app.origin && url.pathname !== loginPath;
  if (onApp) {
    stableSince ||= Date.now();
    if (Date.now() - stableSince >= 3000) break;
  } else stableSince = 0;
  if (Date.now() > deadline) throw new Error("timed out waiting for login");
  await page.waitForTimeout(1000);
}
await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

fs.mkdirSync(path.dirname(cfg.auth.storageState), { recursive: true });
await context.storageState({ path: cfg.auth.storageState });
fs.chmodSync(cfg.auth.storageState, 0o600);
const session = await page.evaluate(() => { const o = {}; for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); o[k] = sessionStorage.getItem(k); } return o; });
if (Object.keys(session).length) {
  fs.writeFileSync(sessionStoragePath(cfg), JSON.stringify(session), { mode: 0o600 });
}

const state = JSON.parse(fs.readFileSync(cfg.auth.storageState, "utf8"));
const persistent = state.cookies.filter((c) => c.expires > 0);
const sessionOnly = state.cookies.length - persistent.length;
const earliest = persistent.map((c) => c.expires).sort((a, b) => a - b)[0];
log(`Saved ${state.cookies.length} cookies (${sessionOnly} session-only), ${state.origins.length} origin(s) of localStorage, ${Object.keys(session).length} sessionStorage keys.`);
log(earliest ? `Earliest persistent cookie expiry: ${new Date(earliest * 1000).toISOString()}` : "No persistent cookies were set.");
if (!persistent.length && sessionOnly) {
  log("WARNING: only session cookies. Headless runs may land on the login page. Test with one route before a full run.");
}

// Warn if the session file could be committed.
try {
  const { execFileSync } = await import("node:child_process");
  execFileSync("git", ["check-ignore", "-q", cfg.auth.storageState], { cwd: path.dirname(cfg.auth.storageState), stdio: "ignore" });
} catch (e) {
  if (e.status === 1) log(`WARNING: ${cfg.auth.storageState} is NOT gitignored. Add it (and its .session.json sidecar) to .gitignore before committing anything.`);
}
await browser.close();
