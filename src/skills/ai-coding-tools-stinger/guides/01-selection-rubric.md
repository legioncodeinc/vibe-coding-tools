# Guide 01: Selection Rubric: Which Tool Fits Your Workflow?

*Sources: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`, `research/external/2026-05-20-devin-replit-agent.md`, `research/external/2026-05-20-continue-dev-open-source.md`*

---

## The five-question intake

Ask these five questions in order. Each eliminates or elevates tiers and tools.

### Q1: What is your autonomy tolerance?

Rate 0-5 where 0 = "I want to approve every line" and 5 = "I want to open my laptop and find a PR waiting."

- **0-1** → Tier 1 (Cursor Tab, Continue.dev)
- **2-3** → Tier 2 (Claude Code, Aider, Cline, Windsurf)
- **4-5** → Tier 3 (Devin 2.0, Cursor Background Agents); first surface the autonomy risk warning

### Q2: What is your monthly AI budget?

| Budget | Best fit |
|--------|---------|
| $0 (no spend) | Continue.dev (local models), Aider (local models via LiteLLM) |
| <$20/month | Aider with DeepSeek V3/R1 (API costs only, very cheap) |
| $20-$50/month | Claude Code ($20/month Pro) or Aider with mid-tier models |
| $100+/month | Claude Code Max ($100/month) or Devin (ACU-based pricing) |
| Flexible API | Aider or Cline with any provider |

Source: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`

**Key cost data point:** Claude Code uses 3x more tokens than Aider for marginally better results on real-world benchmarks (55.5% vs 52.7% combined score). If budget matters, Aider with the architect/editor pattern is the better default. See `guides/03-model-routing.md`.

### Q3: What is your editor/IDE?

| Editor | Best fit |
|--------|---------|
| VS Code | Cursor (native VS Code fork), Cline, Continue.dev |
| JetBrains | **Continue.dev is the ONLY option** with first-class support |
| Neovim / other | Aider (terminal, any editor) |
| No preference | Cursor (highest feature completeness) |

### Q4: What languages/frameworks are in your codebase?

| Context | Consideration |
|---------|--------------|
| Python-dominant | All tools; SWE-bench benchmarks are Python-specific |
| TypeScript/JS-heavy | Cursor (strong TS support), Claude Code, Aider |
| Polyglot codebase | Aider (LLM leaderboard covers polyglot); SWE-bench is Python-only |
| Privacy-sensitive / air-gapped | Continue.dev with local models (Ollama, LM Studio) |

### Q5: What is the task type?

| Task | Recommended tier / tool |
|------|------------------------|
| Inline completions while typing | Cursor Tab (Tier 1) |
| Multi-file refactor (supervised) | Claude Code or Aider (Tier 2) |
| Bug hunt with web search | Devin 2.0 (Tier 3) |
| Greenfield app prototype | Bolt.new or Replit Agent (Tier 4) |
| Dependency upgrade batch | Devin or Cursor Background Agents (Tier 3) |
| JetBrains environment | Continue.dev (Tier 1) |
| Cost-sensitive heavy usage | Aider with architect/editor pattern (Tier 2) |

---

## Decision matrix (compact)

| Criterion | Cursor | Claude Code | Aider | Cline | Windsurf | Continue.dev | Devin | Bolt |
|-----------|--------|------------|-------|-------|----------|--------------|-------|------|
| Editor integration | VS Code fork | Terminal | Terminal | VS Code ext | Standalone IDE | VS Code + JetBrains | Web + GitHub | Web |
| Model flexibility | Medium | Claude only | 100+ models | Multiple | Cascade + 3rd party | Any model | Proprietary | Bolt model |
| Autonomy | Tier 1-2 | Tier 2 | Tier 2 | Tier 2 | Tier 2 | Tier 1 | Tier 3 | Tier 4 |
| Budget floor | $20/month | $20/month | API only | Free | Freemium | Free + API | ACU pricing | Freemium |
| JetBrains | No | No | No | No | No | **Yes** | No | No |
| Open source | No | No | **Yes** | **Yes** | No | **Yes** | No | No |

---

## Worked examples

- Full selection walkthrough: `examples/happy-path-selection.md`
- Budget-constrained scenario: `examples/cost-constrained-workflow.md`
