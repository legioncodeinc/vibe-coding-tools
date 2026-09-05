# Research Summary: ai-coding-tools-stinger

- **Depth tier consumed:** normal
- **Time window covered:** 2025-11-01 to 2026-05-20 (6 months)
- **Files written:** 9 external source files + research-plan.md + index.md + this file
- **Queries executed:** 9 (5 canonical + 4 expansion)

---

## Top findings

### 1. Windsurf was NOT acquired by OpenAI: Command Brief contains a factual error

The Command Brief states "Windsurf was acquired by OpenAI in January 2026." This is **incorrect**. The actual timeline:
- OpenAI announced a $3B acquisition in May 2025
- Microsoft blocked the deal in July 2025
- **Cognition AI** (makers of Devin) acquired Windsurf for ~$250M in December 2025

Windsurf is now owned by Cognition AI. stinger-forge must NOT propagate the OpenAI ownership claim into any guides. The two product lines (Windsurf/Cascade + Devin) are now under one company, which creates a unique "IDE + autonomous agent" trajectory.

### 2. SWE-bench 2026 top scores are dramatically higher than 2023 baseline

The benchmark has improved 41× from its October 2023 baseline (1.96%). As of May 2026:
- Claude Mythos Preview: 93.90% (research preview, not production)
- Practical production ceiling: ~80% (Claude Opus 4.5, Gemini 3.1 Pro, GPT-5.2)
- Important caveat: SWE-bench covers Python repos only: Aider's polyglot leaderboard complements it for multilanguage projects

### 3. Tool tier taxonomy (2026)

The four-tier model from the Command Brief is confirmed by research:

| Tier | Tools | Best for |
|------|-------|---------|
| Interactive-pair | Cursor (Tab/Composer), Continue.dev | Editor-integrated pair programming |
| Hybrid-agent | Claude Code, Aider, Cline, Windsurf (Cascade) | Terminal/sidebar autonomous tasks with human in loop |
| Fully-autonomous | Devin 2.0, Cursor Background Agents | Unattended long-running tasks |
| Rapid-scaffold | Bolt.new, Replit Agent | New app generation from scratch |

Cursor spans interactive-pair AND hybrid-agent: it's the most feature-complete single tool.

### 4. Aider's architect/editor two-model routing is the best cost-reduction pattern

For token-budget-conscious developers, Aider's `--architect` flag routes planning to a powerful model (GPT-5.2, Claude Opus, DeepSeek R1) and applies changes with a cheaper model (DeepSeek V3, Haiku). This achieves 3-5x cost reduction vs single-premium-model usage. This pattern is unique to Aider among the tools in scope.

### 5. Cline has documented, unresolved reliability issues

Five distinct failure modes are documented in GitHub issues as of 2025-2026:
- Claude Code + Cline tool name clash (breaks when using both together)
- Command execution hang on GitHub CLI
- Terminal integration conflicts with other VS Code extensions
- File editing reliability (diff mismatches, infinite retries)
- Task history corruption at >8MB context

These are not edge cases: they affect a meaningful portion of production usage.

### 6. Continue.dev is the only tool with first-class JetBrains support

None of the other nine tools in scope (Cursor, Claude Code, Aider, Cline, Windsurf, Replit Agent, Devin, Bolt) have official JetBrains extensions. Continue.dev's Apache 2.0 license and local-first deployment also make it the default for privacy-sensitive environments.

---

## Most influential sources

1. **`external/2026-05-20-windsurf-cursor-2026.md`**: Corrects a factual error in the Command Brief (Windsurf ownership) and provides May 2026 verified acquisition data. stinger-forge must use this as the authoritative source for all Windsurf ownership and trajectory claims.

2. **`external/2026-05-20-swe-bench-leaderboard.md`**: The only authoritative benchmark source. All capability claims in `guides/02-benchmark-data.md` must cite this with retrieval date 2026-05-20. The benchmark is Python-only, a significant caveat for polyglot guidance.

3. **`external/2026-05-20-claude-code-best-practices.md`**: Official Anthropic docs for CLAUDE.md structure and the Explore-Plan-Code workflow. Primary source for `guides/04-prompt-and-context-discipline.md` Claude Code section.

4. **`external/2026-05-20-aider-llm-leaderboard.md`**: Official Aider docs for the architect/editor two-model pattern. The 3-5x cost reduction data is the strongest argument for Aider over Claude Code in cost-constrained workflows.

5. **`external/2026-05-20-cline-footguns.md`**: GitHub issue synthesis documenting five confirmed Cline failure modes. Primary source for `guides/05-footguns.md` Cline section; severity ratings are recommended.

---

## Open questions for stinger-forge to resolve

1. **Devin 2.0 SWE-bench score**: The 14% figure in the Devin source is from Devin 1.x early benchmarks. stinger-forge should fetch the current Devin 2.0 score from the SWE-bench leaderboard before publishing `guides/02-benchmark-data.md`.

2. **Windsurf trajectory post-Cognition**: Under Cognition ownership, is Windsurf being sunset in favor of Devin, or are they maintained as separate products? The research found "merging capabilities" language but no definitive product-line decision. stinger-forge should add a freshness flag to the Windsurf section of all guides.

3. **Multi-tool stacking patterns**: The Command Brief asks whether to include a guide for multi-tool stacking (e.g., Cursor for interactive + Claude Code for autonomous batch tasks). This is an emerging 2026 pattern not fully covered by research. stinger-forge may need a dedicated `guides/06-multi-tool-stacking.md`, this was flagged as a question in the Command Brief IDEAS section.

4. **Cursor model routing specifics**: Cursor uses a "Composer 1.5" proprietary base model in addition to routing to external LLMs. The exact routing logic (when does Cursor use Composer 1.5 vs when does it route to Claude/GPT/Gemini?) was not fully documented in available sources. stinger-forge should consult `cursor-ide-stinger/SKILL.md` for this detail.

5. **Cline 2026 issue resolution status**: The five failure modes documented in cline-footguns.md are from 2025-early 2026 GitHub issues. stinger-forge should verify which (if any) have been resolved in recent Cline releases before publishing `guides/05-footguns.md`.

---

## Sources stinger-forge should re-fetch with deeper context

- `https://aider.chat/docs/leaderboards/`: The raw leaderboard has 1944 lines of model scoring data; the summary here covers the top performers but stinger-forge should fetch the full page to build the complete benchmark table for `guides/02-benchmark-data.md`
- `https://code.claude.com/docs/en/best-practices`: Official source has 551 lines; full fetch recommended for the complete prompt discipline guide
- `https://docs.devin.ai/`: Official Devin docs were not scraped in this run; stinger-forge should fetch for Devin 2.0 SWE-bench scores, GitHub App configuration requirements, and Agent Compute Unit pricing details
