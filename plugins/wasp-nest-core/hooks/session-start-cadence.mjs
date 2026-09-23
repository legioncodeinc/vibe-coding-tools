#!/usr/bin/env node
// Session-start cadence hook (one script, every harness).
// Injects the operating cadence at session start by reading
// time-blocked-turns/hooks/session-start-context.md from whichever skills
// root is installed. Full protocol: time-blocked-turns/references/agent-instructions.md
//
// Usage:  node session-start-cadence.mjs [claude|codex|cursor|zcode]
// Output contract differs per harness:
//   claude/codex/zcode -> {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}
//   cursor             -> {"additional_context":"..."}
// Fail-open: on any error print {} and exit 0. A hook must never block the host.
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const flavor = (process.argv[2] || "claude").toLowerCase();
const candidates = [".claude", ".agents", ".zcode", ".cursor", ".codex"].map((d) =>
  join(homedir(), d, "skills", "time-blocked-turns", "hooks", "session-start-context.md"),
);

try {
  const path = candidates.find((p) => existsSync(p));
  if (!path) {
    process.stdout.write("{}");
  } else {
    const text = readFileSync(path, "utf8");
    const out =
      flavor === "cursor"
        ? { additional_context: text }
        : { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: text } };
    process.stdout.write(JSON.stringify(out));
  }
} catch {
  process.stdout.write("{}");
}
process.exit(0);
