#!/usr/bin/env node
/** Block em and en dashes in prose for Claude Code, Codex, and Cursor. */

import { readFileSync } from "node:fs";
import { extname, relative, sep } from "node:path";

const PROSE_EXTENSIONS = new Set([".md", ".mdc", ".mdx", ".txt"]);
const DASH = /[—–]/;

function payload() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function isCursor(data) {
  return Boolean(data.cursor_version || data.cursorVersion) ||
    String(data.hook_event_name || data.hookEventName || "").startsWith("pre");
}

function finish(data, reason = "") {
  if (!reason) process.stdout.write("{}");
  else if (isCursor(data)) {
    process.stdout.write(JSON.stringify({
      permission: "deny",
      user_message: reason,
      agent_message: "Replace the em or en dash before retrying the write.",
    }));
  } else {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }));
  }
  process.exit(0);
}

function patchWrites(command) {
  const writes = [];
  let current = null;
  for (const line of String(command || "").split(/\r?\n/)) {
    const header = line.match(/^\*\*\* (?:Add|Update) File: (.+)$/);
    if (header) {
      current = { path: header[1].trim(), chunks: [] };
      writes.push(current);
      continue;
    }
    if (line.startsWith("*** ")) { current = null; continue; }
    if (current && line.startsWith("+") && !line.startsWith("+++")) {
      current.chunks.push(line.slice(1));
    }
  }
  return writes.map(({ path, chunks }) => ({ path, text: chunks.join("\n") }));
}

function directWrites(input) {
  const path = [input.file_path, input.filePath, input.path]
    .find((value) => typeof value === "string" && value) || "";
  const text = [input.content, input.new_string, input.newString, input.text]
    .filter((value) => typeof value === "string").join("\n");
  return path ? [{ path, text }] : [];
}

const data = payload();

// Fail-open: a malformed payload (a non-string path, an unexpected shape) must never
// crash this hook. A guard that throws instead of deciding is a guard the host cannot
// trust, so every unexpected input falls through to the allow path.
try {
  const input = data.tool_input || data.toolInput || {};
  const writes = input.command ? patchWrites(input.command) : directWrites(input);

  for (const write of writes) {
    if (typeof write.path !== "string" || typeof write.text !== "string") continue;
    const rel = relative(process.cwd(), write.path).split(sep).join("/");
    const normalized = rel.startsWith("../") ? write.path.replaceAll("\\", "/") : rel;
    if (normalized.includes("references/research/raw/")) continue;
    if (!PROSE_EXTENSIONS.has(extname(normalized).toLowerCase())) continue;
    if (!DASH.test(write.text)) continue;
    const line = write.text.split("\n").find((value) => DASH.test(value))?.trim().slice(0, 160);
    finish(data, `Dash guard: ${normalized} contains an em dash or en dash. ` +
      `Use a comma, colon, parentheses, period, or semicolon. Offending line: ${line}`);
  }
} catch {
  finish(data);
}

finish(data);
