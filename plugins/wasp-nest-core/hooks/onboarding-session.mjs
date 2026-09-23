#!/usr/bin/env node
// Read-only first-session check. The assistant asks for consent and Get Started
// performs writes only after the user agrees. Fail open on all hook errors.
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";

const flavor = (process.argv[2] || "claude").toLowerCase();

function repositoryRoot(start) {
  let path = resolve(start);
  while (true) {
    if (existsSync(join(path, ".git"))) return path;
    const parent = dirname(path);
    if (parent === path || path === parse(path).root) return null;
    path = parent;
  }
}

function context(input) {
  if (input.agent_type || input.is_background_agent || input.source === "compact" || input.source === "fork") return "";
  const home = homedir();
  const workspace = Array.isArray(input.workspace_roots) ? input.workspace_roots[0] : null;
  const root = repositoryRoot(input.cwd || workspace || process.cwd());
  const homeLock = join(home, ".legioncodeinc.lock");
  const repoLock = root ? join(root, "wasp-nest.lock") : null;
  if (!existsSync(homeLock)) {
    return "Wasp Nest onboarding, step 1 of 2. Explain to the user that global AGENTS.md and CLAUDE.md teach supported coding harnesses their operating preferences. Existing files will be backed up and merged into a marked, updateable section. Ask whether they want to install these global instructions. Do not write or run setup until they explicitly agree. If yes, ask for their preferred name and organization, then load get-started-stinger and run its global-instructions action. After that succeeds, check the current repository's wasp-nest.lock and offer step 2 if it is absent. Keep the user's current request in view and do not claim the hook itself installed anything.";
  }
  if (repoLock && !existsSync(repoLock)) {
    return "Wasp Nest onboarding, step 2 of 2. Explain that the Library records project knowledge, PRDs, IRDs, and accepted CTR contracts so agents can work with shared context. Ask whether the user wants to run the Get Started playbook in this repository. Do not write until they explicitly agree. If yes, load get-started-stinger, preserve existing files, and for a repository with existing code run the knowledge-stinger playbook before marking setup complete. Write wasp-nest.lock only after verification. Do not let this invitation displace the user's current request.";
  }
  return "";
}

try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  const message = context(input);
  const output = !message
    ? {}
    : flavor === "cursor"
      ? { additional_context: message }
      : { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: message } };
  process.stdout.write(JSON.stringify(output));
} catch {
  process.stdout.write("{}");
}
process.exit(0);
