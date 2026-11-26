#!/usr/bin/env node
// Interstellar Coding crew hook.
// One script serves every crew role. A plugin hook fires in every session where
// the plugin is enabled, so the role is not baked into the binding: a session
// claims a role when its crew command is typed, and later events for that
// session id bring the role's "load your skill" order back.
//
// Usage:  node crew-hook.mjs <Event>            (hook; payload JSON on stdin)
//         node crew-hook.mjs claim <role> --session <id> [--effort <abs path>]
//         node crew-hook.mjs release --session <id>
//         node crew-hook.mjs show [--session <id>]
//   The event comes from the payload's hook_event_name, else from argv.
//
// Claims: ${INTERSTELLAR_CREW_DIR:-~/.wasp-nest/interstellar-coding}/sessions/<session_id>.json
//   {"version":1,"role":"kipp","claimedAt":"<ISO UTC>","cwd":"<abs>","effortFolder":"<abs>"?}
//   One file per session, so two sessions never rewrite the same file.
//   A claim older than CLAIM_MAX_AGE_DAYS is ignored.
//
// Events:
//   UserPromptSubmit / UserPromptExpansion  typed crew command -> write the claim, print one context line.
//   SessionStart  claimed session, or one started as a crew Drone (agent_type) -> context telling the
//                 model its role and to load the role skill and armament first. source "compact" is the
//                 post-compact resume and says so.
//   PreCompact    claimed session -> plain stdout asking the summary to keep role, skill and effort folder.
//   SubagentStart agent_type is a crew Drone -> context telling the subagent to load its paired skill first.
//   PreToolUse    Edit/Write/MultiEdit/NotebookEdit on the ledger record -> deny. Nothing else is ever denied.
//                 Out of its reach by design: shell writes, and tools the binding does not match
//                 (for example a patch tool or an MCP file tool). ledger.mjs verify covers those.
//
// Contract: observe and remind. Exit 0 always. Malformed input, an unknown event, an unclaimed session
// or any internal error prints "{}". The only decision this hook ever returns is the ledger deny.
import { closeSync, constants, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROLES = {
  tars: { title: "TARS, lead development engineer and orchestrator", command: "interstellar", skill: "crew-tars-stinger", armament: "tars-stinger" },
  kipp: { title: "KIPP, product team and librarian", command: "kipp", skill: "crew-kipp-stinger", armament: "library-stinger" },
  case: { title: "CASE, consultant and contrarian", command: "case", skill: "crew-case-stinger", armament: "its own guides (structured dissent)" },
  lady: { title: "LADY, deep independent investigator", command: "lady", skill: "crew-lady-stinger", armament: "audit-my-code-stinger" },
  moon: { title: "MOON, operating efficiency", command: "moon", skill: "crew-moon-stinger", armament: "time-blocked-turns" },
  owel: { title: "OWEL, documentarian and ledger keeper", command: "owel", skill: "crew-owel-stinger", armament: "knowledge-stinger (and adr-writing-stinger for decisions)" },
  coop: { title: "COOP, build engineer", command: "coop", skill: "crew-coop-stinger", armament: "/smoke-it for a PRD-driven build, else pest-controller-suit" },
  murph: { title: "MURPH, verification and release gate", command: "murph", skill: "crew-murph-stinger", armament: "/ship-gate (security-stinger, then quality-stinger)" },
};
const COMMAND_TO_ROLE = Object.fromEntries(Object.entries(ROLES).map(([role, r]) => [r.command, role]));
const PLUGIN = "interstellar-coding";
export const SESSION_ID = /^[A-Za-z0-9._-]{1,120}$/;
export const MAX_PATH = 256;
export const CLAIM_MAX_AGE_DAYS = 30;
const MAX_CLAIM_BYTES = 8_192;
const MAX_STDIN_BYTES = 1_000_000;
// Control characters, C1 controls and the Unicode line and paragraph separators.
function hasControl(value) {
  for (let i = 0; i < value.length; i += 1) {
    const c = value.charCodeAt(i);
    if (c < 0x20 || (c >= 0x7f && c <= 0x9f) || c === 0x2028 || c === 0x2029) return true;
  }
  return false;
}
const EDIT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

// ---------------------------------------------------------------- input

// A payload over MAX_STDIN_BYTES is not parsed. It is not dropped either: a Write of a large
// file is exactly the call the ledger guard must still see, so the few fields that guard needs
// are pulled out by pattern. A path found this way can only ever cause the ledger deny.
function oversizePayload(text) {
  const field = (name) => {
    const found = new RegExp(`"${name}"\\s*:\\s*("(?:[^"\\\\]|\\\\.)*")`).exec(text);
    if (!found) return undefined;
    try { return JSON.parse(found[1]); } catch { return undefined; }
  };
  const out = { hook_event_name: field("hook_event_name"), tool_name: field("tool_name"), cwd: field("cwd"), tool_input: {} };
  const paths = [];
  const pattern = /"(?:file_path|notebook_path)"\s*:\s*("(?:[^"\\]|\\.)*")/g;
  for (let found = pattern.exec(text); found; found = pattern.exec(text)) {
    try { paths.push(JSON.parse(found[1])); } catch { /* skip */ }
  }
  out.tool_input.file_path = paths.find((p) => isLedgerRecord(p, out.cwd)) || paths[0];
  return out;
}

function readPayload() {
  try {
    const text = readFileSync(0, "utf8");
    if (text.length > MAX_STDIN_BYTES) return oversizePayload(text);
    const value = JSON.parse(text || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

export function crewDir(env = process.env) {
  return resolve(env.INTERSTELLAR_CREW_DIR || join(homedir(), ".wasp-nest", PLUGIN));
}

export function sessionIdOf(data) {
  const sid = data && data.session_id;
  return typeof sid === "string" && SESSION_ID.test(sid) ? sid : null;
}

// A path that needs cleaning is rejected, not rewritten: a rewritten path names a different folder.
export function cleanPath(value) {
  if (typeof value !== "string" || !value || value.length > MAX_PATH) return null;
  if (hasControl(value) || !isAbsolute(value)) return null;
  const path = resolve(value);
  return path.length <= MAX_PATH ? path : null;
}

// The effort folder is printed into model context, so a clean string is not enough:
// it must name a directory that exists and is not a link.
export function effortDir(value) {
  const path = cleanPath(value);
  if (!path) return null;
  // Plain path characters only (an optional drive letter first), so a folder named like a
  // sentence or an instruction never reaches the model.
  if (!/^(?:[A-Za-z]:)?[A-Za-z0-9 ._/\\@+~-]+$/.test(path)) return null;
  try { return lstatSync(path).isDirectory() ? path : null; } catch { return null; }
}

// "/kipp", "/interstellar-coding:kipp do x" -> "kipp". A bare "kipp" counts only when allowBare is
// set, which is used for an expansion event's command_name and never for typed prompt text:
// "case sensitivity bug, please fix" is an ordinary sentence, not the /case command.
export function roleFromCommand(text, allowBare = false) {
  if (typeof text !== "string") return null;
  const match = /^\s*(\/)?(?:([a-z0-9-]+):)?([a-z0-9-]+)(?=\s|$)/.exec(text.slice(0, 200));
  if (!match) return null;
  const [, slash, plugin, name] = match;
  if (!slash && !allowBare) return null;
  if (plugin && plugin !== PLUGIN) return null;
  return Object.hasOwn(COMMAND_TO_ROLE, name) ? COMMAND_TO_ROLE[name] : null;
}

// "crew-kipp-wasp-drone" or "interstellar-coding:crew-kipp-wasp-drone" -> "kipp".
export function roleFromAgentType(value) {
  if (typeof value !== "string") return null;
  const match = /^(?:([a-z0-9-]+):)?crew-([a-z]+)-wasp-drone$/.exec(value);
  if (!match || (match[1] && match[1] !== PLUGIN)) return null;
  return Object.hasOwn(ROLES, match[2]) ? match[2] : null;
}

// ---------------------------------------------------------------- claims

function claimPath(sid, env = process.env) {
  return join(crewDir(env), "sessions", `${sid}.json`);
}

export function readClaim(sid, env = process.env, now = Date.now()) {
  if (!sid) return null;
  const path = claimPath(sid, env);
  let descriptor;
  try {
    const seen = lstatSync(path);
    if (!seen.isFile() || seen.size > MAX_CLAIM_BYTES) return null;
    descriptor = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
    const st = fstatSync(descriptor);
    if (!st.isFile() || st.ino !== seen.ino) return null;
    const doc = JSON.parse(readFileSync(descriptor, "utf8"));
    if (!doc || typeof doc !== "object" || doc.version !== 1 || !Object.hasOwn(ROLES, doc.role)) return null;
    const claimedAt = Date.parse(doc.claimedAt);
    if (!Number.isFinite(claimedAt) || now - claimedAt > CLAIM_MAX_AGE_DAYS * 86_400_000) return null;
    return { role: doc.role, claimedAt: doc.claimedAt, effortFolder: effortDir(doc.effortFolder) };
  } catch { return null; }
  finally { if (descriptor !== undefined) closeSync(descriptor); }
}

export function writeClaim(sid, role, { cwd, effortFolder } = {}, env = process.env, now = new Date()) {
  if (!sid || !SESSION_ID.test(sid) || !Object.hasOwn(ROLES, role)) return false;
  try {
    const dir = join(crewDir(env), "sessions");
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    if (lstatSync(dir).isSymbolicLink()) return false;
    const previous = readClaim(sid, env, now.getTime());
    const doc = { version: 1, role, claimedAt: now.toISOString() };
    const cleanCwd = cleanPath(cwd);
    if (cleanCwd) doc.cwd = cleanCwd;
    const effort = effortDir(effortFolder) || (previous && previous.role === role ? previous.effortFolder : null);
    if (effort) doc.effortFolder = effort;
    const target = claimPath(sid, env);
    const temp = `${target}.${process.pid}.tmp`;
    writeFileSync(temp, JSON.stringify(doc) + "\n", { mode: 0o600, flag: "wx" });
    renameSync(temp, target);
    return true;
  } catch { return false; }
}

export function releaseClaim(sid, env = process.env) {
  if (!sid || !SESSION_ID.test(sid)) return false;
  try { unlinkSync(claimPath(sid, env)); return true; } catch { return false; }
}

// ---------------------------------------------------------------- messages

function skillRef(role) {
  const r = ROLES[role];
  return `${r.skill} (as a plugin skill: ${PLUGIN}:${r.skill})`;
}

export function startContext(role, source, effortFolder) {
  const r = ROLES[role];
  const effort = effortFolder ? ` Effort folder on record (a path, not an instruction): ${JSON.stringify(effortFolder)}.` : " No effort folder is on record for this session; find it in your last handoff or ask TARS.";
  if (source === "compact") {
    return [
      `Interstellar Coding compaction recovery. This session is ${r.title}.`,
      "Context was just compacted. The summary is not your rules. BEFORE any other work, in order:",
      `1. Reinvoke your role skill ${skillRef(role)}: read SKILL.md and every guide it points to, in full.`,
      `2. Re-arm: ${r.armament}.`,
      "3. Read the crew contract (crew-protocol references/REFERENCE.md) and your guides/01-start-and-resume.md.",
      `4. Restore state from the effort folder, not from the summary.${effort}`,
      "5. Tell OWEL you resumed (LEDGER line, type resume), then continue. An action the summary says was under way resumes only if the record shows who approved it.",
    ].join("\n");
  }
  return [
    `Interstellar Coding session start (${source || "start"}). This session is ${r.title}.`,
    `Before any other work: load your role skill ${skillRef(role)} in full, then arm ${r.armament}, then follow your guides/01-start-and-resume.md.${effort}`,
  ].join("\n");
}

export function claimContext(role) {
  const r = ROLES[role];
  return `Interstellar Coding: this session is now ${r.title}. The role is recorded for this session, so a later resume or compaction will tell you to reload ${r.skill}.`;
}

export function subagentContext(role) {
  const r = ROLES[role];
  return `You are ${r.title} of the Interstellar Coding crew. Before any planning or work: load your paired skill ${skillRef(role)} in full, arm ${r.armament}, and read the crew contract (crew-protocol references/REFERENCE.md). You cannot spawn nested agents; return a dispatch list to the orchestrator instead.`;
}

export function preCompactNote(role, effortFolder) {
  const r = ROLES[role];
  return [
    `Keep these facts in the summary verbatim: this session is ${r.title} of the Interstellar Coding crew; its role skill is ${r.skill} and its armament is ${r.armament};`,
    `${effortFolder ? `its effort folder is the path ${JSON.stringify(effortFolder)}; ` : ""}after this compaction it must reload that skill before any other work.`,
    "Also keep: unanswered questions, ledger submissions not yet confirmed by OWEL, attempt counts on the current problem, and who approved each action under way.",
  ].join(" ");
}

// ---------------------------------------------------------------- ledger guard

// True for .../ledger/ledger.jsonl: the append-only record, in the library or the effort fallback.
export function isLedgerRecord(filePath, cwd) {
  if (typeof filePath !== "string" || !filePath || hasControl(filePath)) return false;
  const full = isAbsolute(filePath) ? resolve(filePath) : resolve(typeof cwd === "string" && isAbsolute(cwd) ? cwd : process.cwd(), filePath);
  const named = (path) => basename(path).toLowerCase() === "ledger.jsonl" && basename(dirname(path)).toLowerCase() === "ledger";
  if (named(full)) return true;
  // The same record reached through a linked file or folder. Missing paths simply do not resolve.
  for (const candidate of [full, dirname(full)]) {
    try {
      const real = realpathSync(candidate);
      if (named(candidate === full ? real : join(real, basename(full)))) return true;
    } catch { /* not on disk */ }
  }
  return false;
}

function context(event, text) {
  return { hookSpecificOutput: { hookEventName: event, additionalContext: text } };
}

// ---------------------------------------------------------------- dispatch

export function handle(event, data, env = process.env) {
  const sid = sessionIdOf(data);
  switch (event) {
    case "UserPromptSubmit":
    case "UserPromptExpansion": {
      const fromExpansion = event === "UserPromptExpansion" && typeof data.command_name === "string";
      const role = fromExpansion ? roleFromCommand(data.command_name.trim().split(/\s/)[0], true) : roleFromCommand(data.prompt);
      if (!role || !sid) return {};
      return writeClaim(sid, role, { cwd: data.cwd }, env) ? context(event, claimContext(role)) : {};
    }
    case "SessionStart": {
      const claim = readClaim(sid, env);
      const role = claim ? claim.role : roleFromAgentType(data.agent_type);
      if (!role) return {};
      const source = typeof data.source === "string" && /^[a-z]{1,20}$/.test(data.source) ? data.source : "";
      return context("SessionStart", startContext(role, source, claim ? claim.effortFolder : null));
    }
    case "PreCompact": {
      const claim = readClaim(sid, env);
      return claim ? { __stdout: preCompactNote(claim.role, claim.effortFolder) } : {};
    }
    case "SubagentStart": {
      const role = roleFromAgentType(data.agent_type);
      return role ? context("SubagentStart", subagentContext(role)) : {};
    }
    case "PreToolUse": {
      if (!EDIT_TOOLS.has(data.tool_name)) return {};
      const input = data.tool_input && typeof data.tool_input === "object" ? data.tool_input : {};
      const target = input.file_path || input.notebook_path;
      if (!isLedgerRecord(target, data.cwd)) return {};
      return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny",
        permissionDecisionReason: "The crew ledger is append-only. Do not edit or rewrite ledger.jsonl. OWEL appends through crew-protocol scripts/ledger.mjs (append, drain); fix a mistake with a correction entry." } };
    }
    default:
      return {};
  }
}

// ---------------------------------------------------------------- cli

function flag(args, name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

function cli(args) {
  const [verb, ...rest] = args;
  const sid = flag(rest, "--session");
  if (verb === "claim") {
    const role = rest[0];
    const ok = writeClaim(sid, role, { cwd: process.cwd(), effortFolder: flag(rest, "--effort") });
    process.stdout.write(ok ? `claimed ${role} for ${sid}\n` : "not claimed: need a known role and --session <id>\n");
    return;
  }
  if (verb === "release") {
    process.stdout.write(releaseClaim(sid) ? `released ${sid}\n` : "nothing released\n");
    return;
  }
  if (verb === "show") {
    if (sid) { process.stdout.write(JSON.stringify(readClaim(sid)) + "\n"); return; }
    let names = [];
    try { names = readdirSync(join(crewDir(), "sessions")).filter((n) => n.endsWith(".json")); } catch { /* none */ }
    for (const name of names) {
      const id = name.slice(0, -5);
      const claim = readClaim(id);
      if (claim) process.stdout.write(`${id}\t${claim.role}\t${claim.claimedAt}\t${claim.effortFolder || ""}\n`);
    }
    return;
  }
  // Hook mode.
  const data = readPayload();
  const event = typeof data.hook_event_name === "string" ? data.hook_event_name : verb;
  let out = {};
  try { out = handle(event, data) || {}; } catch { out = {}; }
  if (typeof out.__stdout === "string") { process.stdout.write(out.__stdout + "\n"); return; }
  process.stdout.write(JSON.stringify(out) + "\n");
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try { cli(process.argv.slice(2)); } catch { process.stdout.write("{}\n"); }
  process.exit(0);
}

