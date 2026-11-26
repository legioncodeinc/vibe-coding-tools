#!/usr/bin/env node
// TARS compaction survival hook (Claude Code: home install and Core plugin).
// A TARS manager session runs for hours, so Claude Code compacts its context.
// The compacted summary keeps the facts but drops the rules, and a TARS that
// forgets its rules starts doing chip work. This hook brings the rules back.
//
// Usage:  node tars-compaction.mjs <SessionStart|PreCompact> [plugin]
//   The event comes from the payload's hook_event_name, else from argv.
//   The Core plugin binding passes "plugin". That copy prints {} when the user's
//   settings.json already binds the home copy for the same event, so a machine
//   with both installs gets one ledger line and one notice. The check reads
//   ${CLAUDE_CONFIG_DIR:-~/.claude}/settings.json and requires the home handler
//   file to exist; anything unreadable leaves the plugin copy running.
//   Hook stdin is the host JSON payload; malformed or non-object stdin -> {}.
//
// Registry: ${WASP_TARS_DIR:-~/.wasp-nest/tars}/active.json, written by the
//   tars-stinger CLI scripts/tars-registry.mjs (TARS runs it via Bash):
//   {"version":1,"sessions":{"<session_id>":{"stateFolder":"<absolute path>",
//     "registeredAt":"<ISO UTC>","cwd":"<absolute path>"}}}
//   A missing or malformed registry, or an unregistered session_id, prints {}.
//
// SessionStart (bound with matcher "compact"; source === "compact" is also
//   checked here): for a registered session, prints
//   {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}
//   telling the model, in order, to reload /tars and the tars-stinger guides,
//   read the ledger tail and owner profile, re-arm the tick and CI Monitor,
//   reconcile linked sessions, and do no implementation work. Any other source
//   (startup, resume, clear) prints {}.
// PreCompact (payload trigger: "manual" | "auto"; anything else is recorded as
//   "unknown"): for a registered session, appends one restart-point line to
//   <stateFolder>/ledger.md and prints {}. It appends only to an existing regular
//   file (lstat, symlinks refused, O_APPEND|O_NOFOLLOW, no O_CREAT); it never
//   creates the state folder or the ledger.
//
// Registry strings reach model context, so a stateFolder must be an absolute
// path of at most 256 characters with no control characters (including
// U+2028/U+2029). Anything else is ignored silently, as if unregistered.
//
// Observer contract: never block, never decide. Exit 0 always, never exit 2,
// never emit continue/decision/permissionDecision/stopReason. Fail open to "{}".
import {
  closeSync, constants, fstatSync, lstatSync, openSync, readFileSync, readSync, realpathSync, statSync, writeSync,
} from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SESSION_ID = /^[A-Za-z0-9._-]{1,120}$/;
export const MAX_PATH = 256;
const MAX_REGISTRY_BYTES = 1_000_000;
const MAX_SETTINGS_BYTES = 1_000_000;
const HOME_HANDLER = "/.claude/hooks/tars-compaction.mjs";
const TRIGGERS = new Set(["manual", "auto"]);
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;

// ---------------------------------------------------------------- input

function readPayload() {
  try {
    const value = JSON.parse(readFileSync(0, "utf8") || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

export function registryPath(env = process.env) {
  return join(resolve(env.WASP_TARS_DIR || join(homedir(), ".wasp-nest", "tars")), "active.json");
}

// Same rule as the beacon's clean(), but a path that needs cleaning is rejected
// rather than rewritten: a rewritten path would name a different folder.
export function cleanPath(value) {
  if (typeof value !== "string" || !value || value.length > MAX_PATH) return null;
  if (CONTROL.test(value) || !isAbsolute(value)) return null;
  const path = resolve(value);
  return path.length <= MAX_PATH ? path : null;
}

export function sessionIdOf(data) {
  const sid = data && data.session_id;
  return typeof sid === "string" && SESSION_ID.test(sid) ? sid : null;
}

export function parseRegistry(text) {
  try {
    const doc = JSON.parse(text);
    if (!doc || typeof doc !== "object" || Array.isArray(doc) || doc.version !== 1) return null;
    const sessions = doc.sessions;
    if (!sessions || typeof sessions !== "object" || Array.isArray(sessions)) return null;
    return doc;
  } catch { return null; }
}

// Read the registry without following a link and without blocking on a FIFO.
function readRegistry(env = process.env) {
  const path = registryPath(env);
  let descriptor;
  try {
    const dirStat = lstatSync(resolve(path, ".."));
    if (dirStat.isSymbolicLink() || !dirStat.isDirectory()) return null;
    const seen = lstatSync(path);
    if (!seen.isFile() || seen.size > MAX_REGISTRY_BYTES) return null;
    descriptor = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0) | constants.O_NONBLOCK);
    const st = fstatSync(descriptor);
    if (!st.isFile() || st.ino !== seen.ino || st.size > MAX_REGISTRY_BYTES) return null;
    return parseRegistry(readFileSync(descriptor, "utf8"));
  } catch { return null; }
  finally { if (descriptor !== undefined) closeSync(descriptor); }
}

// The registered state folder for this session, or null.
export function lookup(registry, sid) {
  if (!registry || !sid || !Object.hasOwn(registry.sessions, sid)) return null;
  const entry = registry.sessions[sid];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  return cleanPath(entry.stateFolder);
}

// True when the home install will handle this event, so the plugin copy must not.
// settings.json may be a symlink (dotfiles), so it is followed; only a regular,
// bounded file is read.
export function homeBinds(event, env = process.env) {
  try {
    const home = env.HOME || homedir();
    const path = join(env.CLAUDE_CONFIG_DIR || join(home, ".claude"), "settings.json");
    const st = statSync(path);
    if (!st.isFile() || st.size > MAX_SETTINGS_BYTES) return false;
    const settings = JSON.parse(readFileSync(path, "utf8"));
    if (!statSync(join(home, ".claude", "hooks", "tars-compaction.mjs")).isFile()) return false;
    return settings.hooks[event].some((group) => group.hooks.some((hook) =>
      typeof hook.command === "string" && hook.command.includes(HOME_HANDLER) && hook.command.trimEnd().endsWith(` ${event}`)));
  } catch { return false; }
}

// ---------------------------------------------------------------- output

export function compactContext(stateFolder, sid) {
  return [
    `TARS compaction recovery. This session is TARS for ${stateFolder} (session ${sid}).`,
    "Context was just compacted. The summary is not the rules. BEFORE anything else, in order:",
    "1. Reload /tars, then read tars-stinger SKILL.md and every guide (00 to 08) in full. Exception: a crew TARS started with /interstellar does not run /tars or start the standing CASE and KIPP; it follows the crew-tars-stinger guides/01-start-and-resume.md recovery order.",
    `2. Read the tail of ${join(stateFolder, "ledger.md")} and owner-profile.md (in the state folder, or the path the ledger names).`,
    `3. Check CronList for the 10-minute tick and the CI Monitor (heartbeat ${join(stateFolder, "heartbeat")}; stale over 3 minutes means dead). Re-arm whichever is missing.`,
    "4. Run list_sessions with linked=true and reconcile it with the ledger Sessions table.",
    "5. Do no implementation work: TARS manages, chips work. Prod data scripts are a chip's job.",
  ].join("\n");
}

export function normalizeTrigger(value) {
  return typeof value === "string" && TRIGGERS.has(value) ? value : "unknown";
}

export function ledgerLine(trigger, date = new Date()) {
  const at = date.toISOString().slice(0, 19) + "Z";
  return `- ${at} compaction at ${at} (trigger: ${normalizeTrigger(trigger)}). ` +
    "Decision: restart point recorded; reload /tars before any other work. By: PreCompact hook.";
}

// Append to an existing regular ledger only. Returns true when a line was written.
export function appendLedger(stateFolder, line) {
  const path = join(stateFolder, "ledger.md");
  let descriptor;
  try {
    const seen = lstatSync(path);
    if (!seen.isFile()) return false;
    descriptor = openSync(path, constants.O_RDWR | constants.O_APPEND | (constants.O_NOFOLLOW || 0) | constants.O_NONBLOCK);
    const st = fstatSync(descriptor);
    if (!st.isFile() || st.ino !== seen.ino) return false;
    let lead = "";
    if (st.size > 0) {
      const last = Buffer.alloc(1);
      readSync(descriptor, last, 0, 1, st.size - 1);
      if (last[0] !== 0x0a) lead = "\n";
    }
    writeSync(descriptor, `${lead}${line}\n`);
    return true;
  } catch { return false; }
  finally { if (descriptor !== undefined) closeSync(descriptor); }
}

// The whole hook as one call: event, payload, environment, clock -> output object.
export function handle(event, data, env = process.env, now = new Date(), flavor = "home") {
  if (event !== "SessionStart" && event !== "PreCompact") return {};
  const sid = sessionIdOf(data);
  if (!sid) return {};
  if (event === "SessionStart" && data.source !== "compact") return {};
  const stateFolder = lookup(readRegistry(env), sid);
  if (!stateFolder) return {};
  if (flavor === "plugin" && homeBinds(event, env)) return {};
  if (event === "PreCompact") {
    appendLedger(stateFolder, ledgerLine(data.trigger, now));
    return {};
  }
  return { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: compactContext(stateFolder, sid) } };
}

// ---------------------------------------------------------------- main

// Compare real paths: the hook is often reached through a symlinked home or a path with spaces.
function invokedDirectly() {
  try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; }
}
if (invokedDirectly()) {
  let output = {};
  try {
    const data = readPayload();
    const named = typeof data.hook_event_name === "string" ? data.hook_event_name : "";
    output = handle(named || String(process.argv[2] || ""), data, process.env, new Date(), process.argv[3] === "plugin" ? "plugin" : "home");
  } catch {
    output = {};
  }
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}
