# Guide 05: Footguns: Known Failure Modes and How to Avoid Them

*Sources: `research/external/2026-05-20-cline-footguns.md`, `research/external/2026-05-20-aider-llm-leaderboard.md`, `research/external/2026-05-20-devin-replit-agent.md`, `research/external/2026-05-20-bolt-new-webcontainer.md`*

---

## Cline failure modes (HIGH priority: read before recommending Cline)

Five documented failure modes from GitHub issues as of 2026-05-20. Source: `research/external/2026-05-20-cline-footguns.md`.

> **TODO: open question**: Verify which of these failure modes have been resolved in Cline releases after May 2026. The issue report dates span 2025-early 2026.

### 1. Claude Code + Cline tool name clash (Severity: HIGH)

- **Trigger:** Using Claude Code (Anthropic's CLI agent) as the API provider within the Cline VS Code extension simultaneously.
- **Symptom:** "tools: Tool names must be unique" error; Cline becomes non-functional.
- **Root cause:** Both Claude Code and Cline define overlapping tool names; when Cline routes through Claude Code's API, the names clash.
- **Fix:** Set environment variable `CLAUDE_CODE_AUTO_CONNECT_IDE=false` before starting Cline.
- **Prevention:** Do not use Claude Code as Cline's API provider. Use Anthropic's direct API instead.

### 2. Command execution hang (Severity: MEDIUM)

- **Trigger:** Cline executes GitHub CLI commands (`gh pr create`, `gh pr submit`) that succeed on GitHub's end but produce no terminal response.
- **Symptom:** Cline chat blocks indefinitely; no progress; no error.
- **Fix:** Manually interrupt the Cline task (Ctrl+C), run the gh command manually, then resume.
- **Prevention:** For tasks involving GitHub CLI, prefer Claude Code (better terminal handling) or run gh commands manually before instructing Cline.

### 3. Terminal integration conflict (Severity: LOW)

- **Trigger:** Running Cline alongside VS Code extensions that inject terminal startup commands (e.g., Node version managers, virtual env activators).
- **Symptom:** Multiple startup commands merge into a garbled single-line command; terminal session fails immediately.
- **Fix:** Switch Cline to Background Execution Mode or increase shell integration timeout in VS Code settings.
- **Prevention:** Keep terminal-injecting extensions minimal when using Cline.

### 4. File editing reliability (Severity: HIGH)

- **Trigger:** Large files (>500 lines), files with complex whitespace or mixed line endings, high-frequency edit operations.
- **Symptom:** "Diff Edit Mismatch" errors; infinite retry loops; content truncation.
- **Fix:** Use `write_to_file` (full file replacement) instead of `replace_in_file` (diff-based) for large files. Add to Cline's system prompt.
- **Prevention:** Instruct Cline via system prompt: "Prefer `write_to_file` over `replace_in_file` for files over 500 lines."

### 5. Task history corruption (Severity: MEDIUM)

- **Trigger:** Context windows exceeding 8MB, files with binary content in context, terminal output with ANSI escape sequences.
- **Symptom:** Task history disappears; cannot resume a previously paused task.
- **Fix:** Keep context lean; avoid including binary files; clear ANSI escape sequences from terminal output before including in context.
- **Prevention:** Set a context window warning in the Cline system prompt; periodically archive completed task histories.

---

## Aider footguns

### Auto-commit without review (Severity: MEDIUM)

Aider auto-commits every accepted change to git by default (`auto-commits: true`). If the developer accepts a change without reviewing the diff, the commit is in the history and harder to undo than a file modification.

- **Fix:** Always review diffs before accepting (`show-diffs: true` in config; this is the default). Set `auto-commits: false` if you prefer to commit manually.
- **Prevention:** Keep `show-diffs: true` and treat Aider's diff view as a mandatory review gate, not a notification.

Source: `research/external/2026-05-20-aider-llm-leaderboard.md`

### Context-loss on large repos (Severity: MEDIUM)

Aider's context is file-based, not semantic. In large repos (>500 files), it may load irrelevant files or miss relevant ones.

- **Fix:** Use `/add <specific-file>` and `/drop <file>` to curate context explicitly per task.
- **Prevention:** Use `read:` in `.aider.conf.yml` only for always-relevant reference files (ARCHITECTURE.md, API contracts). Never add entire directories to `read:`.

---

## Devin footguns

### Scope creep (Severity: HIGH for production repos)

Devin is a fully-autonomous agent with repo write access. Given an open-ended task, it may make changes across more files and modules than intended.

- **Fix:** Scope tasks as narrowly as possible in the Devin task description. "Add a `deactivate_user` endpoint to `src/users/routes.py`" is better than "Improve user management."
- **Prevention:** Configure Devin's GitHub App with the narrowest repo scope needed. Review every PR Devin opens before merging; do not enable auto-merge.
- **When to escalate:** If the user is considering Devin for a production repo, surface the scope-creep risk explicitly before recommending.

Source: `research/external/2026-05-20-devin-replit-agent.md`

---

## Bolt.new footguns

### WebContainer hard limits (Severity: HIGH for affected use cases)

Bolt runs entirely in a browser-based WebContainer. Hard limits as of 2026:

| Limit | Value |
|-------|-------|
| Storage | 300MB |
| RAM | 512MB |
| Native modules | Not supported |
| Docker | Not supported |
| Persistent compute | Not available |

- **Consequence:** Any project requiring native Node modules (`node-gyp`, SQLite3 native bindings, sharp, etc.) will fail silently or with cryptic errors in Bolt.
- **Consequence:** Projects that grow beyond 300MB of dependencies (common in monorepos) will hit storage limits.
- **Fix:** Use Bolt only for web-first prototypes without native dependencies. Migrate to a proper development environment (Cursor, Claude Code, Aider) as soon as native dependencies are needed.

Source: `research/external/2026-05-20-bolt-new-webcontainer.md`

---

## Cursor footguns

### Cline installed inside Cursor (Severity: LOW-MEDIUM)

Installing Cline as a VS Code extension inside Cursor IDE creates redundant agentic systems that occasionally conflict. Cursor already has Composer/Agent Mode; Cline in Cursor adds a second agent with similar capabilities but different UX.

- **Fix:** Choose one: use Cursor's built-in Agent Mode, or use Cline. Running both in the same Cursor window is not recommended.

---

## Windsurf footguns

### Ownership uncertainty post-Cognition acquisition (Severity: LOW-MEDIUM for long-term projects)

Windsurf is now owned by Cognition AI (makers of Devin). The product trajectory (whether Windsurf is maintained independently or merged into the Devin platform) was not definitively resolved as of 2026-05-20. Recommending Windsurf as a long-term primary tool for a team carries acquisition-uncertainty risk.

- **Fix:** For short-term or individual use, Windsurf is fine. For long-term team adoption, flag the uncertainty and recommend a backup tool (Cursor, Claude Code) in parallel.
