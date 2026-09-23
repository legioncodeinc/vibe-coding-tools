// Run a capture script across N parallel headless browsers (SHARD/SHARDS), stream
// prefixed logs, enforce a per-shard timeout, and exit non-zero if any shard fails.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... node parallel.mjs <script.mjs> [--shards N] [--timeout-min M]
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { availableMemGb, loadConfig, log, openApp } from "./lib/common.mjs";
import { runOnboarding } from "./lib/onboarding.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const script = args.find((a) => a.endsWith(".mjs"));
if (!script) { console.error("usage: node parallel.mjs <script.mjs> [--shards N] [--timeout-min M]"); process.exit(2); }
const cfg = loadConfig();
const opt = (name, dflt) => (args.includes(name) ? Number(args[args.indexOf(name) + 1]) : dflt);
const memShards = Math.max(1, Math.floor(availableMemGb() / 0.9));
const N = Math.max(1, Math.min(opt("--shards", cfg.browser.shards || 4), memShards, os.cpus().length));
const TIMEOUT = opt("--timeout-min", 60) * 60000;
const target = path.isAbsolute(script) ? script : path.join(here, script);
const onboardingTargets = new Set(["screenshots.mjs", "extract.mjs"]);
let onboardingAttempted = false;

if (cfg.onboarding?.enabled && onboardingTargets.has(path.basename(target))) {
  const out = cfg.output.screenshots || path.join(cfg.output.inventory, "screenshots");
  const { browser, page } = await openApp(cfg);
  try {
    await runOnboarding(cfg, page, out);
    onboardingAttempted = true;
  } finally {
    await browser.close();
  }
}

log(`running ${path.relative(here, target)} on ${N} shard(s)`);
const results = await Promise.all(Array.from({ length: N }, (_, i) => new Promise((resolve) => {
  const child = spawn(process.execPath, [target], {
    env: {
      ...process.env,
      SHARD: String(i),
      SHARDS: String(N),
      ...(onboardingAttempted ? { WEBAPP_CAPTURE_ONBOARDING_DONE: "1" } : {}),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const prefix = (chunk) => chunk.toString().split("\n").filter(Boolean).map((l) => `[shard ${i}] ${l}`).join("\n");
  let errored = false;
  child.stdout.on("data", (d) => { const t = prefix(d); if (/ERROR/.test(t)) errored = true; console.log(t); });
  child.stderr.on("data", (d) => { errored = true; console.error(prefix(d)); });
  const timer = setTimeout(() => { console.error(`[shard ${i}] timed out after ${TIMEOUT / 60000} min, killing`); child.kill("SIGTERM"); }, TIMEOUT);
  child.on("exit", (code, signal) => { clearTimeout(timer); resolve({ shard: i, code, signal, errored }); });
})));

const failed = results.filter((r) => r.code !== 0);
const warned = results.filter((r) => r.code === 0 && r.errored);
for (const r of failed) log(`shard ${r.shard} failed (exit ${r.code}${r.signal ? `, ${r.signal}` : ""})`);
for (const r of warned) log(`shard ${r.shard} finished with route errors; check its log lines above`);
log(failed.length ? `${failed.length} of ${N} shard(s) failed` : `all ${N} shard(s) finished`);
process.exit(failed.length ? 1 : 0);
