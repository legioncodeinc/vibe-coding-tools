# Guide 00: Tool Tiers: The 2026 AI Coding Tool Taxonomy

*Sources: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`, `research/external/2026-05-20-windsurf-cursor-2026.md`, `research/external/2026-05-20-devin-replit-agent.md`, `research/external/2026-05-20-continue-dev-open-source.md`, `research/external/2026-05-20-cursor-agent-mode-2026.md`, `research/external/2026-05-20-bolt-new-webcontainer.md`*

---

## The four-tier model

AI coding tools in 2026 fall cleanly into four tiers defined by autonomy level, context scope, and where in the developer workflow they sit.

### Tier 1: Interactive-pair

**Tools:** Cursor (Tab + Composer), Continue.dev

**Characteristics:**
- Real-time completions and in-editor chat
- Human reviews and accepts every suggestion
- Low autonomy: the human is always in control
- Context scope: file-level to open-files level

**Best for:** Day-to-day coding with an AI pair-programmer; developers who want suggestions, not autonomous execution.

**Cursor** is the market leader in this tier (as of May 2026). It spans into Tier 2 via Agent Mode. Its "Composer" feature handles multi-file edits with human approval; Tab handles inline completions. Source: `research/external/2026-05-20-cursor-agent-mode-2026.md`.

**Continue.dev** is the only open-source option with first-class JetBrains support (none of the other tools in scope have official JetBrains extensions). Apache 2.0 license. Ideal for privacy-sensitive environments and teams that cannot use cloud IDE plugins. Source: `research/external/2026-05-20-continue-dev-open-source.md`.

---

### Tier 2: Hybrid-agent

**Tools:** Claude Code, Aider, Cline, Windsurf (Cascade)

**Characteristics:**
- Terminal or sidebar agent that can execute multi-step tasks
- Human checkpoints at key decision points
- Medium autonomy: the agent proposes and executes, the human reviews
- Context scope: repository-wide (with search/indexing)

**Best for:** Feature-level work, refactors, bug hunts, test generation: tasks where you want autonomous execution but stay in the loop.

**Claude Code** is a standalone CLI agent from Anthropic (launched 2025, post-Console separation). Locks to Claude models only. Best code quality scores (9.5/10). Strongest at complex multi-file reasoning. Source: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`.

**Aider** is an open-source CLI tool with 100+ model support via LiteLLM. Best-in-class cost efficiency via the architect/editor two-model pattern (3-5x cost reduction). Best for git-focused workflows (auto-commits, clean history). Source: `research/external/2026-05-20-aider-llm-leaderboard.md`.

**Cline** is an open-source VS Code extension (formerly Claude Dev). Multiple backend models. Most appropriate for VS Code-native developers. Has documented reliability issues in production: see `guides/05-footguns.md` before recommending. Source: `research/external/2026-05-20-cline-footguns.md`.

**Windsurf (Cascade)** uses a proprietary agentic model (Cascade) with context-aware reasoning across the full codebase. **Note: Windsurf is owned by Cognition AI (makers of Devin), NOT OpenAI.** OpenAI's $3B acquisition was blocked by Microsoft in July 2025; Cognition AI acquired Windsurf for ~$250M in December 2025. Product trajectory under Cognition ownership is in flux (see `research/external/2026-05-20-windsurf-cursor-2026.md`); a freshness flag is recommended for any Windsurf guidance.

> **TODO: open question**: Is Windsurf being sunset in favor of Devin, or are they maintained as separate products under Cognition AI? Not definitively resolved in research. Surface to user when recommending Windsurf for long-term projects.

---

### Tier 3: Fully-autonomous

**Tools:** Devin 2.0, Cursor Background Agents

**Characteristics:**
- Operates without human in the loop
- High autonomy: may plan, execute, commit, and open PRs unattended
- Context scope: full repository + external web/docs
- Requires explicit scope-limiting and approval gates

**Best for:** Well-specified tasks on a branch where the output is reviewed via PR; long-running jobs (dependency upgrades, test generation at scale).

**WARNING:** Never recommend Tier 3 tools for production repos without surfacing the scope-creep and irreversibility risk. Autonomous write access can produce wide-ranging changes that are difficult to audit after the fact.

**Devin 2.0** from Cognition AI is the original "software engineer AI agent". Operates via a GitHub App with configurable repo access scope. Improved substantially from Devin 1.x early benchmarks. Requires Agent Compute Units (ACU): pricing is per-compute, not per-token. Source: `research/external/2026-05-20-devin-replit-agent.md`.

**Cursor Background Agents** allow Cursor to run tasks asynchronously (on Cursor's infrastructure or locally) while the developer does other work. Shares context engine with Cursor's interactive features. Less isolated than Devin; best for teams already on Cursor.

---

### Tier 4: Rapid-scaffold

**Tools:** Bolt.new, Replit Agent

**Characteristics:**
- Generates a full working application from a text prompt
- Extremely low friction to start; limited customization afterward
- Context scope: project-level (greenfield only)

**Best for:** Prototyping, hackathon projects, proof-of-concept apps, no-code-adjacent workflows. Not suitable for adding features to existing large codebases.

**Bolt.new** runs in a WebContainer (browser-based Node.js runtime). Hard limits: 300MB storage, 512MB RAM, no native modules, no Docker. Best for web app prototypes. See `guides/05-footguns.md` for the full WebContainer constraint list. Source: `research/external/2026-05-20-bolt-new-webcontainer.md`.

**Replit Agent** operates in Replit's cloud IDE with persistent compute. Better for backend-heavy projects than Bolt. Suitable for demos that need to stay live without hosting setup.

---

## Special case: Cursor spans Tier 1 and Tier 2

Cursor is the only tool in scope that spans interactive-pair AND hybrid-agent. In Tab mode it is Tier 1; in Agent Mode with Background Agents it approaches Tier 2/3. This makes Cursor the most feature-complete single tool for teams that want to avoid tool-switching.

---

## Examples

- Happy-path selection: `examples/happy-path-selection.md`
- Cost-constrained workflow: `examples/cost-constrained-workflow.md`
