# Guide 06: Multi-Tool Stacking: Combining AI Coding Tools Effectively

*This guide addresses an emerging 2026 pattern not fully covered by research. It is based on the tool tier taxonomy (`guides/00-tool-tiers.md`) and the footguns catalog (`guides/05-footguns.md`). Core data points are sourced from the research files; workflow recommendations are synthesized from the tier taxonomy.*

---

## Why stack tools?

Each tier excels at a different part of the development loop:

- **Tier 1 (interactive-pair):** Fast completions while you type: Cursor Tab
- **Tier 2 (hybrid-agent):** Autonomous multi-file tasks: Claude Code, Aider
- **Tier 3 (fully-autonomous):** Unattended batch jobs: Devin, Cursor Background Agents

A common pattern among high-productivity developers in 2026 is to combine Tier 1 for ongoing interactive work with Tier 2 for autonomous task batches. These combinations are additive rather than redundant.

---

## Recommended stacking patterns

### Pattern A: Cursor (interactive) + Claude Code (batch autonomous)

**Use case:** TypeScript/full-stack team. Cursor handles day-to-day coding with Tab completions and Composer; Claude Code handles complex refactors and test generation sessions.

**How to configure:**
1. Keep Cursor as the primary IDE for all interactive work
2. Open Claude Code in a separate terminal session for autonomous tasks
3. Give Claude Code a clear CLAUDE.md (see `guides/04-prompt-and-context-discipline.md`)
4. Use the Explore-Plan-Code workflow in Claude Code for complex tasks before writing any code

**Why this works:** Cursor and Claude Code do not share tool names or VS Code extension state, so there is no conflict. Claude Code operates in a terminal process; Cursor operates in the editor. They are parallel, not overlapping.

**Cost profile:** Cursor subscription + Claude Code API or subscription. Token cost depends on Claude Code usage volume.

---

### Pattern B: Cursor (interactive) + Aider (cost-efficient batch)

**Use case:** Solo developer or small team with API budget constraint. Cursor for interactive work; Aider with architect/editor routing for batch tasks at 3-5x lower cost than Claude Code.

**How to configure:**
1. Use Cursor Tab for inline completions and Composer for interactive edits
2. Use Aider in a terminal with `.aider.conf.yml` architect/editor configuration for batch tasks
3. Set `auto-commits: true` in Aider to keep git history clean per task

**Cost profile:** Cursor subscription + Aider API costs (DeepSeek V3 editor + reasoning model architect = very low per-task cost). See `guides/03-model-routing.md` for cost estimates.

---

### Pattern C: Cursor (interactive) + Devin (unattended overnight tasks)

**Use case:** Feature-complete team running a maintenance or upgrade job (e.g., dependency upgrade across a large monorepo) while the team focuses on new feature work in Cursor.

**How to configure:**
1. Write a precise task specification for Devin (narrow scope, explicit acceptance criteria)
2. Configure Devin's GitHub App with the minimum required repo scope
3. Review every Devin PR before merging; do not enable auto-merge

**Warning:** This pattern requires high autonomy tolerance (4-5 on the 0-5 scale). Surface the scope-creep risk to the user. See `guides/05-footguns.md` Devin section.

---

### Pattern D: Bolt (scaffold) → Cursor + Claude Code (ongoing development)

**Use case:** Greenfield project. Bolt generates the initial scaffold from a prompt; then development continues in a proper IDE tool.

**Migration steps:**
1. Generate scaffold in Bolt.new
2. Export/download the project files
3. Initialize a git repository
4. Set up Cursor or Claude Code with a CLAUDE.md capturing the scaffold's architecture
5. Continue feature development in the IDE tool

**Why this works:** Bolt is optimized for initial generation speed, not ongoing development. Its WebContainer limits (300MB, no native modules) make it unsuitable for complex ongoing work. The scaffold is the artifact; the IDE tool takes over from there. Source: `research/external/2026-05-20-bolt-new-webcontainer.md`.

---

## Anti-patterns to avoid

### Installing Cline inside Cursor

Cursor already has Agent Mode (Composer + Background Agents). Installing Cline as a VS Code extension inside Cursor creates a redundant agentic layer that occasionally conflicts. Choose one or the other. See `guides/05-footguns.md` Cursor section.

### Running Claude Code and Cline simultaneously

The Claude Code + Cline tool name clash (`tools: Tool names must be unique`) makes this combination non-functional by default. See `guides/05-footguns.md` Cline section for the workaround if the user needs both.

### Stacking two Tier 2 tools on the same task

Running Aider and Claude Code on the same files simultaneously creates git conflicts and unpredictable state. Assign each Tier 2 tool to separate tasks or separate branches.

---

## Choosing which tool owns which task type

| Task type | Recommended tool | Notes |
|-----------|-----------------|-------|
| Inline completions | Cursor Tab | Always-on, lowest friction |
| File-level interactive edits | Cursor Composer | Multi-file with human approval |
| Complex feature work (supervised) | Claude Code (quality focus) or Aider (cost focus) | Choose based on budget |
| Test generation at scale | Aider or Devin | Aider for budget; Devin for unattended |
| Dependency upgrade batch | Devin or Cursor Background Agents | High autonomy tolerance required |
| Greenfield app scaffold | Bolt.new | Exit to IDE tool after scaffold |
| JetBrains environment | Continue.dev | No other tool in scope has JetBrains support |
