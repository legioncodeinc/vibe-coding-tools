#!/usr/bin/env node
// Interstellar Coding crew ledger: an append-only, hash-chained JSON Lines record.
// OWEL is the only writer of the record. Any role may spool an entry to the outbox
// when OWEL cannot be reached; OWEL drains the outbox later. Nothing here edits,
// reorders, truncates or deletes an existing entry.
//
// Usage:
//   node ledger.mjs append --ledger <ledger.jsonl> --role TARS --type progress --effort <slug>
//                          --text "<one line>" [--evidence <ref>] [--by <who>] [--corrects L-000012] [--at <ISO UTC>]
//   node ledger.mjs spool  --outbox <dir> --role ... --type ... --effort ... --text ... [same optional flags]
//   node ledger.mjs drain  --ledger <ledger.jsonl> --outbox <dir>
//   node ledger.mjs verify --ledger <ledger.jsonl>
//   node ledger.mjs tail   --ledger <ledger.jsonl> [--n 10] [--json]
//
// Entry (one JSON object per line, keys in this order):
//   id, at, recorded_at, role, type, effort, text, evidence, by, corrects?, prev, hash
//   prev = hash of the previous entry ("genesis" for the first).
//   hash = SHA-256 over the JSON of the entry without the hash key.
// Exit codes: 0 ok, 1 broken chain or refused input, 2 usage.
//
// What verify proves, and what it does not. It detects an edited entry, an entry removed from the
// middle, and reordering. It cannot detect entries cut off the end, or a file rewritten and
// re-chained from scratch, because nothing outside the file remembers the old head. The head hash
// that verify prints is that outside memory: OWEL records it somewhere the file's editor cannot
// reach (a commit message, a message to TARS) and compares it on the next pass.
// The role and by fields are what the submitter says they are; the script does not authenticate them.
import { createHash, randomBytes } from "node:crypto";
import { closeSync, constants, existsSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync, writeSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROLES = ["TARS", "KIPP", "CASE", "LADY", "MOON", "OWEL", "COOP", "MURPH", "OWNER"];
export const TYPES = ["progress", "decision", "ruling", "dissent", "finding", "intervention", "handoff", "gate", "intake", "doc", "owner", "correction", "resume"];
const MAX_TEXT = 2000;
const MAX_FIELD = 400;
const LOCK_STALE_MS = 30_000;
// Control characters other than tab, newline and carriage return, plus C1 controls and Unicode separators.
function hasControl(value) {
  for (let i = 0; i < value.length; i += 1) {
    const c = value.charCodeAt(i);
    if ((c < 0x20 && c !== 9 && c !== 10 && c !== 13) || (c >= 0x7f && c <= 0x9f) || c === 0x2028 || c === 0x2029) return true;
  }
  return false;
}

export function hashOf(entryWithoutHash) {
  return createHash("sha256").update(JSON.stringify(entryWithoutHash)).digest("hex");
}

function oneLine(value, max) {
  if (typeof value !== "string") return "";
  if (hasControl(value)) throw new Error("control characters are not allowed in a ledger field");
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

// Validate and normalize the caller's fields. Throws with a plain reason.
export function draft(fields, now = new Date()) {
  for (const key of ["role", "type", "effort", "text", "evidence", "by", "corrects", "at"]) {
    if (fields[key] === true) throw new Error(`--${key} needs a value (write --${key}=<value> when the value starts with two hyphens)`);
  }
  const role = String(fields.role || "").toUpperCase();
  const type = String(fields.type || "").toLowerCase();
  if (!ROLES.includes(role)) throw new Error(`unknown role: ${fields.role}`);
  if (!TYPES.includes(type)) throw new Error(`unknown type: ${fields.type}`);
  const text = oneLine(fields.text, MAX_TEXT);
  if (!text) throw new Error("text is required");
  const at = fields.at ? new Date(fields.at) : now;
  if (Number.isNaN(at.getTime())) throw new Error("at is not a valid time");
  const corrects = fields.corrects ? String(fields.corrects) : "";
  if (corrects && !/^L-\d{6,}$/.test(corrects)) throw new Error("corrects must look like L-000012");
  if (type === "correction" && !corrects) throw new Error("a correction must name the entry it corrects (--corrects)");
  const out = {
    at: at.toISOString(), role, type,
    effort: oneLine(fields.effort || "unspecified", MAX_FIELD),
    text,
    evidence: oneLine(fields.evidence || "none", MAX_FIELD),
    by: oneLine(fields.by || role, MAX_FIELD),
  };
  if (corrects) out.corrects = corrects;
  return out;
}

export function parseLines(text) {
  return text.split("\n").filter((line) => line.trim() !== "");
}

// Returns { ok, count, head, problem?, line? }.
export function verifyText(text) {
  const lines = parseLines(text);
  let prev = "genesis";
  for (let i = 0; i < lines.length; i += 1) {
    let entry;
    try { entry = JSON.parse(lines[i]); } catch { return { ok: false, count: i, head: prev, line: i + 1, problem: "not valid JSON" }; }
    const { hash, ...rest } = entry;
    const expectedId = `L-${String(i + 1).padStart(6, "0")}`;
    if (entry.id !== expectedId) return { ok: false, count: i, head: prev, line: i + 1, problem: `id is ${entry.id}, expected ${expectedId} (an entry was removed, inserted or reordered)` };
    if (entry.prev !== prev) return { ok: false, count: i, head: prev, line: i + 1, problem: "prev does not match the previous entry's hash (an earlier entry was edited or removed)" };
    if (hash !== hashOf(rest)) return { ok: false, count: i, head: prev, line: i + 1, problem: "hash does not match the entry's content (this entry was edited)" };
    prev = hash;
  }
  return { ok: true, count: lines.length, head: prev };
}

// lstat sees a link even when its target is missing; existsSync does not.
function isLink(path) {
  try { return lstatSync(path).isSymbolicLink(); } catch { return false; }
}

function withLock(ledger, work) {
  const lock = `${ledger}.lock`;
  if (isLink(lock)) throw new Error("the ledger lock path is a symbolic link; remove it and try again");
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const fd = openSync(lock, "wx", 0o600);
      closeSync(fd);
      try { return work(); } finally { try { unlinkSync(lock); } catch { /* already gone */ } }
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      try { if (Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) unlinkSync(lock); } catch { /* raced */ }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw new Error("ledger is locked by another writer; try again");
}

// Append one drafted entry. Refuses to write onto a broken chain.
export function append(ledgerPath, fields, now = new Date()) {
  const ledger = resolve(ledgerPath);
  if (basename(ledger) !== "ledger.jsonl") throw new Error("the ledger file must be named ledger.jsonl");
  const body = draft(fields, now);
  mkdirSync(dirname(ledger), { recursive: true });
  if (isLink(ledger)) throw new Error("refusing to write through a symbolic link");
  return withLock(ledger, () => {
    if (isLink(ledger)) throw new Error("refusing to write through a symbolic link");
    const current = existsSync(ledger) ? readFileSync(ledger, "utf8") : "";
    const state = verifyText(current);
    if (!state.ok) throw new Error(`ledger chain is broken at line ${state.line}: ${state.problem}. Not appending. Preserve the file and tell TARS and the owner.`);
    if (current && !current.endsWith("\n")) throw new Error("ledger does not end with a newline; a write was cut short. Not appending.");
    const { at, ...rest } = body;
    const entry = { id: `L-${String(state.count + 1).padStart(6, "0")}`, at, recorded_at: now.toISOString(), ...rest, prev: state.head };
    const line = JSON.stringify({ ...entry, hash: hashOf(entry) }) + "\n";
    const fd = openSync(ledger, constants.O_WRONLY | constants.O_APPEND | constants.O_CREAT | (constants.O_NOFOLLOW || 0), 0o644);
    try { writeSync(fd, line); } finally { closeSync(fd); }
    return entry.id;
  });
}

export function spool(outboxDir, fields, now = new Date()) {
  const body = draft(fields, now);
  const dir = resolve(outboxDir);
  mkdirSync(dir, { recursive: true });
  const name = `${body.at.replace(/[:.]/g, "")}-${body.role}-${randomBytes(3).toString("hex")}.json`;
  writeFileSync(join(dir, name), JSON.stringify(body) + "\n", { flag: "wx", mode: 0o644 });
  return join(dir, name);
}

// Append every spooled entry in time order, then move each file to <outbox>/recorded/.
export function drain(ledgerPath, outboxDir, now = new Date()) {
  const dir = resolve(outboxDir);
  if (!existsSync(dir)) return [];
  const done = [];
  for (const name of readdirSync(dir).filter((n) => n.endsWith(".json")).sort()) {
    const source = join(dir, name);
    let fields;
    try { fields = JSON.parse(readFileSync(source, "utf8")); } catch { done.push({ file: name, error: "not valid JSON; left in place" }); continue; }
    try {
      const id = append(ledgerPath, fields, now);
      mkdirSync(join(dir, "recorded"), { recursive: true });
      renameSync(source, join(dir, "recorded", `${id}-${name}`));
      done.push({ file: name, id });
    } catch (error) { done.push({ file: name, error: error.message }); if (/chain is broken|cut short/.test(error.message)) break; }
  }
  return done;
}

function flags(args) {
  const out = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!args[i].startsWith("--")) continue;
    const equals = args[i].indexOf("=");
    if (equals > 2) { out[args[i].slice(2, equals)] = args[i].slice(equals + 1); continue; }
    const key = args[i].slice(2);
    out[key] = i + 1 < args.length && !args[i + 1].startsWith("--") ? args[(i += 1)] : true;
  }
  return out;
}

function main(argv) {
  const [verb, ...rest] = argv;
  const f = flags(rest);
  const need = (key) => { if (typeof f[key] !== "string") { process.stderr.write(`missing --${key}\n`); process.exit(2); } return f[key]; };
  try {
    if (verb === "append") { process.stdout.write(`RECORDED ${append(need("ledger"), f)}\n`); return 0; }
    if (verb === "spool") { process.stdout.write(`SPOOLED ${spool(need("outbox"), f)}\n`); return 0; }
    if (verb === "drain") {
      const results = drain(need("ledger"), need("outbox"));
      for (const r of results) process.stdout.write(r.id ? `RECORDED ${r.id} from ${r.file}\n` : `SKIPPED ${r.file}: ${r.error}\n`);
      if (!results.length) process.stdout.write("outbox empty\n");
      return results.some((r) => r.error) ? 1 : 0;
    }
    if (verb === "verify") {
      const path = need("ledger");
      const state = verifyText(existsSync(path) ? readFileSync(path, "utf8") : "");
      process.stdout.write(state.ok ? `OK ${state.count} entries, head ${state.head}\n` : `BROKEN at line ${state.line}: ${state.problem}\n`);
      return state.ok ? 0 : 1;
    }
    if (verb === "tail") {
      const path = need("ledger");
      const lines = parseLines(existsSync(path) ? readFileSync(path, "utf8") : "").slice(-(Number(f.n) > 0 ? Number(f.n) : 10));
      for (const line of lines) {
        if (f.json) { process.stdout.write(line + "\n"); continue; }
        const e = JSON.parse(line);
        process.stdout.write(`${e.id} ${e.at} ${e.role} ${e.type} [${e.effort}] ${e.text} (evidence: ${e.evidence}; by: ${e.by}${e.corrects ? `; corrects: ${e.corrects}` : ""})\n`);
      }
      return 0;
    }
  } catch (error) { process.stderr.write(`refused: ${error.message}\n`); return 1; }
  process.stderr.write("usage: ledger.mjs <append|spool|drain|verify|tail> [flags]; see the header of this file\n");
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) process.exit(main(process.argv.slice(2)));
