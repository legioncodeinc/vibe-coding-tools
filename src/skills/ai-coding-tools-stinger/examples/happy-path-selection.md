# Example: Happy Path Selection: Senior Dev, TypeScript Monorepo

*Demonstrates `guides/01-selection-rubric.md` and `guides/04-prompt-and-context-discipline.md`*

---

## Scenario

A senior software engineer working on a TypeScript/Node.js monorepo (12 packages, ~150k lines of code). Uses VS Code. Has a $50/month budget for AI tools. Autonomy tolerance: 3 (wants autonomous execution but reviews every PR before merging). No JetBrains requirement.

---

## Running the five-question intake

**Q1: Autonomy tolerance:** 3 (hybrid-agent tier; wants execution + review)
- **Outcome:** Tier 2 tools (Claude Code, Aider, Cline, Windsurf) are in scope

**Q2: Monthly budget:** $50/month
- **Outcome:** Claude Code Pro ($20/month) or Aider with API costs (~$20-50/month). Both fit.

**Q3: Editor:** VS Code
- **Outcome:** No JetBrains constraint. All tools in scope.

**Q4: Language/framework:** TypeScript dominant
- **Outcome:** No polyglot edge case; all Tier 2 tools handle TypeScript well. Note SWE-bench is Python-only: Aider's polyglot leaderboard is more relevant.

**Q5: Task type:** Feature development (multi-file, supervised)
- **Outcome:** Tier 2 hybrid-agent is confirmed.

---

## Recommendation output

**Primary recommendation: Cursor + Aider (architect/editor pattern)**

1. **Cursor Tab** for inline completions (interactive-pair, always-on)
2. **Aider** in terminal for multi-file feature work and refactors

**Rationale:**
- Aider's architect/editor pattern gives 3-5x cost reduction vs Claude Code at comparable quality (8.4/10 vs 9.5/10): within budget at ~$20-35/month
- Cursor handles the interactive layer so Aider focuses on autonomous batch tasks
- TypeScript monorepo + Aider: use `read: [ARCHITECTURE.md, packages/*/package.json]` in `.aider.conf.yml` to keep monorepo structure in context

**Aider config for this scenario:**

```yaml
# .aider.conf.yml
model: claude-opus-4-5         # Architect: quality model for planning
editor-model: deepseek/deepseek-chat  # Editor: cheap for applying diffs
auto-commits: true
show-diffs: true
read:
  - ARCHITECTURE.md
  - docs/api-contracts.md
```

**CLAUDE.md structure for this scenario (if switching to Claude Code later):**

```markdown
# Project: [Name] Monorepo

## Architecture
12 packages under `packages/`. Shared utilities in `packages/shared`. 
API in `packages/api`. Frontend in `packages/web`.

## Development Commands
- `pnpm install` — install all dependencies
- `pnpm build` — build all packages
- `pnpm test` — run all tests
- `pnpm dev` — start dev server

## Coding Conventions
- TypeScript strict mode in all packages
- Named exports only (no default exports)
- `packages/shared/types.ts` is the source of truth for shared types

## Do Not Touch
- `packages/generated/` — auto-generated; run `pnpm generate` instead
- `pnpm-lock.yaml` — do not edit manually
```

---

## Sources cited

- Intake rubric: `guides/01-selection-rubric.md`
- Cost data (Claude Code 3x more expensive): `research/external/2026-05-20-claude-code-aider-cline-comparison.md`
- Aider cost optimization: `research/external/2026-05-20-aider-llm-leaderboard.md`
- Prompt discipline: `guides/04-prompt-and-context-discipline.md`
