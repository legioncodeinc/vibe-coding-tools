#!/usr/bin/env node
// TARS session registry CLI. TARS runs this via Bash so the compaction hook
// (src/hooks/tars-compaction.mjs, Claude Code Core plugin or home) knows which session is TARS
// and where its state folder lives. This is a CLI, not a hook: it prints one
// line and exits nonzero with a message on any error.
//
// Usage: node tars-registry.mjs <register <state-folder> | unregister | show> [--session <id>]
//   register <state-folder>  record this session as TARS for <state-folder>
//                            (resolved to an absolute real path; must be an
//                            existing directory). Also prunes entries whose
//                            state folder no longer exists.
//   unregister               remove this session's entry (no-op if absent)
//   show                     print this session's entry as one line of JSON
// Session id: --session <id>, else $CLAUDE_CODE_SESSION_ID (Claude Code exports
//   it to Bash; it equals the hook payload's session_id). Neither is an error.
//   Ids must match ^[A-Za-z0-9._-]{1,120}$.
//
// Registry: ${WASP_TARS_DIR:-~/.wasp-nest/tars}/active.json
//   {"version":1,"sessions":{"<session_id>":{"stateFolder":"<absolute path>",
//     "registeredAt":"<ISO UTC>","cwd":"<absolute path>"}}}
//   Directory 0700, file 0600, written atomically (temp file in the same
//   directory, then rename). A symlinked registry file or directory is refused.
//   A malformed registry is refused, never overwritten: fix or remove it by hand.
//   The hook ignores a state folder over 256 characters or with control
//   characters, so register refuses those too.
import {
  closeSync, constants, chmodSync, fstatSync, fsyncSync, lstatSync, mkdirSync, openSync,
  readFileSync, realpathSync, renameSync, statSync, unlinkSync, writeSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const SESSION_ID = /^[A-Za-z0-9._-]{1,120}$/;
const MAX_PATH = 256; // keep in step with tars-compaction.mjs
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
const MAX_REGISTRY_BYTES = 1_000_000;

class CliError extends Error {}

function registryDir() {
  return resolve(process.env.WASP_TARS_DIR || join(homedir(), ".wasp-nest", "tars"));
}

function parseArgs(argv) {
  const positional = [];
  let session = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--session") {
      if (i + 1 >= argv.length) throw new CliError("--session needs a value");
      session = argv[++i];
    } else if (argv[i].startsWith("--")) {
      throw new CliError(`unknown option ${argv[i]}`);
    } else {
      positional.push(argv[i]);
    }
  }
  return { command: positional[0], rest: positional.slice(1), session };
}

function sessionId(flag) {
  const sid = flag ?? process.env.CLAUDE_CODE_SESSION_ID;
  if (!sid) throw new CliError("no session id: pass --session <id> or run inside Claude Code (CLAUDE_CODE_SESSION_ID)");
  if (!SESSION_ID.test(sid)) throw new CliError("invalid session id (allowed: A-Z a-z 0-9 . _ -, 1 to 120 characters)");
  return sid;
}

function lstatOrNull(path) {
  try { return lstatSync(path); } catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

function ensureDir(dir) {
  const seen = lstatOrNull(dir);
  if (seen && seen.isSymbolicLink()) throw new CliError(`refusing symlinked registry directory: ${dir}`);
  if (seen && !seen.isDirectory()) throw new CliError(`registry directory is not a directory: ${dir}`);
  if (!seen) mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
}

function readRegistry(dir) {
  const path = join(dir, "active.json");
  const seen = lstatOrNull(path);
  if (!seen) return { version: 1, sessions: {} };
  if (seen.isSymbolicLink()) throw new CliError(`refusing symlinked registry file: ${path}`);
  if (!seen.isFile() || seen.size > MAX_REGISTRY_BYTES) throw new CliError(`registry is not a regular file under 1 MB: ${path}`);
  const descriptor = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0) | constants.O_NONBLOCK);
  let text;
  try {
    if (fstatSync(descriptor).ino !== seen.ino) throw new CliError(`registry changed while reading: ${path}`);
    text = readFileSync(descriptor, "utf8");
  } finally { closeSync(descriptor); }
  let doc;
  try { doc = JSON.parse(text); } catch { doc = null; }
  if (!doc || typeof doc !== "object" || Array.isArray(doc) || doc.version !== 1 ||
      !doc.sessions || typeof doc.sessions !== "object" || Array.isArray(doc.sessions)) {
    throw new CliError(`registry is malformed; fix or remove it by hand: ${path}`);
  }
  return doc;
}

function writeRegistry(dir, doc) {
  const path = join(dir, "active.json");
  const seen = lstatOrNull(path);
  if (seen && (seen.isSymbolicLink() || !seen.isFile())) throw new CliError(`refusing to replace a non-regular registry file: ${path}`);
  const tmp = join(dir, `.active.json.${process.pid}.${Date.now()}.tmp`);
  const descriptor = openSync(tmp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW || 0), 0o600);
  let moved = false;
  try {
    writeSync(descriptor, JSON.stringify(doc, null, 2) + "\n");
    fsyncSync(descriptor);
    closeSync(descriptor);
    renameSync(tmp, path);
    moved = true;
  } finally {
    if (!moved) {
      try { closeSync(descriptor); } catch { /* already closed */ }
      try { unlinkSync(tmp); } catch { /* best-effort temp cleanup */ }
    }
  }
}

function isDirectory(path) {
  try { return statSync(path).isDirectory(); } catch { return false; }
}

function utcSeconds(date = new Date()) {
  return date.toISOString().slice(0, 19) + "Z";
}

function register(folder, flag) {
  if (!folder) throw new CliError("register needs a state folder");
  const sid = sessionId(flag);
  let stateFolder;
  try { stateFolder = realpathSync(resolve(folder)); } catch { throw new CliError(`state folder does not exist: ${folder}`); }
  if (!isDirectory(stateFolder)) throw new CliError(`state folder is not a directory: ${stateFolder}`);
  if (stateFolder.length > MAX_PATH || CONTROL.test(stateFolder)) {
    throw new CliError("state folder path is over 256 characters or has control characters; the hook would ignore it");
  }
  const dir = registryDir();
  ensureDir(dir);
  const doc = readRegistry(dir);
  const sessions = {};
  let pruned = 0;
  for (const [id, entry] of Object.entries(doc.sessions)) {
    const keep = entry && typeof entry === "object" && typeof entry.stateFolder === "string" && isDirectory(entry.stateFolder);
    if (keep) sessions[id] = entry; else pruned++;
  }
  let cwd;
  try { cwd = realpathSync(process.cwd()); } catch { cwd = resolve(process.cwd()); }
  sessions[sid] = { stateFolder, registeredAt: utcSeconds(), cwd };
  writeRegistry(dir, { ...doc, version: 1, sessions });
  return `registered session ${sid} as TARS for ${stateFolder} (pruned ${pruned})`;
}

function unregister(flag) {
  const sid = sessionId(flag);
  const dir = registryDir();
  if (!lstatOrNull(join(dir, "active.json"))) return `session ${sid} was not registered`;
  ensureDir(dir);
  const doc = readRegistry(dir);
  if (!Object.hasOwn(doc.sessions, sid)) return `session ${sid} was not registered`;
  const sessions = { ...doc.sessions };
  delete sessions[sid];
  writeRegistry(dir, { ...doc, sessions });
  return `unregistered session ${sid}`;
}

function show(flag) {
  const sid = sessionId(flag);
  const dir = registryDir();
  const seen = lstatOrNull(dir);
  if (seen && seen.isSymbolicLink()) throw new CliError(`refusing symlinked registry directory: ${dir}`);
  const doc = seen ? readRegistry(dir) : { version: 1, sessions: {} };
  const entry = Object.hasOwn(doc.sessions, sid) ? doc.sessions[sid] : null;
  return JSON.stringify(entry ? { session: sid, registered: true, ...entry } : { session: sid, registered: false });
}

function main(argv) {
  const { command, rest, session } = parseArgs(argv);
  if (command === "register" && rest.length === 1) return register(rest[0], session);
  if (command === "unregister" && rest.length === 0) return unregister(session);
  if (command === "show" && rest.length === 0) return show(session);
  throw new CliError("usage: node tars-registry.mjs <register <state-folder> | unregister | show> [--session <id>]");
}

try {
  process.stdout.write(main(process.argv.slice(2)) + "\n");
  process.exit(0);
} catch (error) {
  const message = error instanceof CliError ? error.message : `failed: ${error.code || error.message}`;
  process.stderr.write(`tars-registry: ${message}\n`);
  process.exit(1);
}
