// Preflight for webapp-capture. Checks the environment and config before any run and
// prints exactly what to fix. Exit 0 = ready, 1 = blocking problems, 2 = usage error.
// Designed by Legion Code Inc.
// Usage: [CAPTURE_CONFIG=...] node doctor.mjs [--route screenshots|demo|library|audit] [--json]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const json = args.includes("--json");
const routeArg = args.includes("--route") ? args[args.indexOf("--route") + 1] : "all";
if (!["screenshots", "demo", "library", "audit", "all"].includes(routeArg)) { console.error("--route must be screenshots, demo, library, audit, or all"); process.exit(2); }

const checks = [];
const add = (level, name, detail, fix = "") => checks.push({ level, name, detail, fix });
const has = (bin) => { try { execFileSync(bin, ["-version"], { stdio: "ignore" }); return true; } catch { try { execFileSync(bin, ["--version"], { stdio: "ignore" }); return true; } catch { return false; } } };

// Node
const [major, minor] = process.versions.node.split(".").map(Number);
const supportedNode = major > 20 || (major === 20 && minor >= 9);
supportedNode ? add("ok", "node", `v${process.versions.node}`) : add("error", "node", `v${process.versions.node} is too old`, "Install Node 20.9 or newer");

// Dependencies
const resolveDep = async (name) => { try { await import(name); return true; } catch { return false; } };
(await resolveDep("playwright-core"))
  ? add("ok", "playwright-core", "installed")
  : add("error", "playwright-core", "not installed", `cd "${here}" && npm install`);
if (routeArg === "library" || routeArg === "all") {
  (await resolveDep("sharp")) ? add("ok", "sharp", "installed") : add("error", "sharp", "not installed (needed for component sheets)", `cd "${here}" && npm install`);
}

// Chromium
let chromium = null;
try {
  const { chromiumPath } = await import("./lib/common.mjs");
  chromium = chromiumPath({ browser: {} });
} catch {}
if (chromium) add("ok", "chromium", chromium);
else {
  let bundled = false;
  try { const pw = await import("playwright-core"); bundled = fs.existsSync(pw.chromium.executablePath()); } catch {}
  bundled ? add("ok", "chromium", "found via playwright-core") : add("error", "chromium", "no Chromium build found", `cd "${here}" && npx playwright install chromium`);
}

// ffmpeg (demo only)
if (routeArg === "demo" || routeArg === "all") {
  has("ffmpeg") ? add("ok", "ffmpeg", "on PATH") : add(routeArg === "demo" ? "error" : "warn", "ffmpeg", "not found (needed to assemble demo videos)", "Install ffmpeg (brew install ffmpeg, apt install ffmpeg, or winget install ffmpeg)");
}

// Resources
const { availableMemGb } = await import("./lib/common.mjs");
const freeGb = availableMemGb();
const shards = Math.max(1, Math.min(os.cpus().length - 2, Math.floor(freeGb / 0.9)));
add(freeGb < 2 ? "warn" : "ok", "memory", `${freeGb.toFixed(1)} GB available of ${(os.totalmem() / 1073741824).toFixed(0)} GB, ${os.cpus().length} CPUs`, `Recommended browser.shards: ${shards}`);

// Config
const cfgPath = process.env.CAPTURE_CONFIG;
if (!cfgPath) add("warn", "config", "CAPTURE_CONFIG not set; skipping config checks", `Copy ${path.join(here, "capture.config.example.json")} into the target repo and set CAPTURE_CONFIG`);
else {
  try {
    const { loadConfig } = await import("./lib/common.mjs");
    const cfg = loadConfig(cfgPath);
    add("ok", "config", `valid: ${cfg.__path}`);
    if (cfg.browser.shards > shards) add("warn", "config.shards", `browser.shards=${cfg.browser.shards} exceeds the recommended ${shards} for free memory`, `Set browser.shards to ${shards} or free memory`);

    // Reachability
    try {
      const res = await fetch(cfg.app.origin, { redirect: "manual", signal: AbortSignal.timeout(8000) });
      add("ok", "origin", `${cfg.app.origin} answered HTTP ${res.status}`);
    } catch (e) { add("error", "origin", `${cfg.app.origin} unreachable: ${e.cause?.code || e.message}`, "Start the app or fix app.origin"); }

    // Session
    if (!fs.existsSync(cfg.auth.storageState)) add("error", "session", `no saved session at ${cfg.auth.storageState}`, `CAPTURE_CONFIG="${cfg.__path}" node "${path.join(here, "save-session.mjs")}"  (a human logs in)`);
    else {
      const st = JSON.parse(fs.readFileSync(cfg.auth.storageState, "utf8"));
      const mode = (fs.statSync(cfg.auth.storageState).mode & 0o777).toString(8);
      const now = Date.now() / 1000;
      const persistent = st.cookies.filter((c) => c.expires > 0);
      const expired = persistent.filter((c) => c.expires < now);
      const soon = persistent.filter((c) => c.expires >= now).sort((a, b) => a.expires - b.expires)[0];
      if (expired.length && expired.length === persistent.length) add("error", "session", "all persistent cookies expired", "Run save-session.mjs again");
      else add("ok", "session", `${st.cookies.length} cookies; earliest expiry ${soon ? new Date(soon.expires * 1000).toISOString().slice(0, 16) : "session-only"}`);
      if (mode !== "600") add("warn", "session.permissions", `mode ${mode}`, `chmod 600 "${cfg.auth.storageState}"`);
      try {
        execFileSync("git", ["check-ignore", "-q", cfg.auth.storageState], { cwd: path.dirname(cfg.auth.storageState), stdio: "ignore" });
        add("ok", "session.gitignore", "session file is gitignored");
      } catch (e) {
        if (e.status === 1) add("error", "session.gitignore", "session file is NOT gitignored and could be committed", `Add ${path.relative(cfg.__dir, cfg.auth.storageState)} and its .session.json sidecar to .gitignore`);
      }
    }
    if (!cfg.theme?.verify?.htmlClassIncludes && cfg.browser.colorScheme === "dark") {
      add("warn", "theme", "colorScheme is dark but no theme.verify guard is set", "Set theme.verify.htmlClassIncludes (for example \"dark\") so a theme flip cannot produce mixed captures");
    }
    for (const dir of Object.values(cfg.output)) {
      try { fs.mkdirSync(dir, { recursive: true }); fs.accessSync(dir, fs.constants.W_OK); } catch { add("error", "output", `cannot write ${dir}`, "Fix output paths or permissions"); }
    }
  } catch (e) { add("error", "config", e.message, "Fix the config and rerun doctor"); }
}

const errors = checks.filter((c) => c.level === "error");
if (json) console.log(JSON.stringify({ ready: !errors.length, checks }, null, 2));
else {
  const icon = { ok: "ok   ", warn: "WARN ", error: "ERROR" };
  for (const c of checks) {
    console.log(`${icon[c.level]} ${c.name}: ${c.detail}`);
    if (c.fix && c.level !== "ok") console.log(`      fix: ${c.fix}`);
    else if (c.fix && c.name === "memory") console.log(`      ${c.fix}`);
  }
  console.log(errors.length ? `\nNot ready: ${errors.length} blocking problem(s).` : "\nReady.");
}
process.exit(errors.length ? 1 : 0);
