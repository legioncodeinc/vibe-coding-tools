#!/usr/bin/env node
/** Validate edited Drone and Stinger components across supported harnesses. */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

function payload() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function isCursor(data) {
  return Boolean(data.cursor_version || data.cursorVersion) ||
    String(data.hook_event_name || data.hookEventName || "").startsWith("post");
}

function emit(data, message = "") {
  if (!message) process.stdout.write("{}");
  else if (isCursor(data)) process.stdout.write(JSON.stringify({ additional_context: message }));
  else process.stdout.write(JSON.stringify({ systemMessage: message }));
  process.exit(0);
}

function patchPaths(command) {
  return String(command || "").split(/\r?\n/)
    .map((line) => line.match(/^\*\*\* (?:Add|Update) File: (.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

const data = payload();
const input = data.tool_input || data.toolInput || {};
const paths = (input.command ? patchPaths(input.command) :
  [input.file_path, input.filePath, input.path])
  .filter((value) => typeof value === "string" && value);
if (!paths.length) emit(data);

const pluginRoot = process.env.PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || process.cwd();
const candidates = [
  resolve(pluginRoot, "skills/queen-wasp-stinger/references/scripts/per-type-validation.py"),
  resolve(pluginRoot, "src/skills/queen-wasp-stinger/references/scripts/per-type-validation.py"),
  resolve(process.cwd(), "src/skills/queen-wasp-stinger/references/scripts/per-type-validation.py"),
  resolve(pluginRoot, ".claude/skills/queen-wasp-stinger/references/scripts/per-type-validation.py"),
  resolve(process.cwd(), ".claude/skills/queen-wasp-stinger/references/scripts/per-type-validation.py"),
];
const validator = candidates.find(existsSync);
if (!validator) emit(data);

// Fail-open: this runs on every edit, so an unexpected payload shape must produce an
// empty result rather than an uncaught throw. `target` is rebuilt from the regex match
// (never from the raw path) and passed to execFileSync as an argv element, so it can
// carry neither a shell metacharacter nor a traversal into the validator invocation.
const failures = [];
try {
  for (const path of paths) {
    const rel = relative(process.cwd(), path).split(sep).join("/");
    const match = rel.match(/^(src|\.(?:claude|cursor))\/(skills\/[^/]+|agents\/[^/]+\.md)(?:\/|$)/);
    if (!match) continue;
    const target = `${match[1]}/${match[2]}`;
    const type = match[2].startsWith("skills/") ? "skill" : "agent";
    try {
      execFileSync(process.platform === "win32" ? "python" : "python3", [
        validator, target, "--type", type, "--harness", "all",
      ], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 20000 });
    } catch (error) {
      const output = `${error.stdout || ""}${error.stderr || ""}`;
      failures.push(...output.split("\n").filter((line) => line.startsWith("ERROR")).slice(0, 8));
    }
  }
} catch {
  emit(data);
}

emit(data, failures.length
  ? `Wasp Nest validator found component problems:\n${failures.join("\n")}\nFix them before registration.`
  : "");
