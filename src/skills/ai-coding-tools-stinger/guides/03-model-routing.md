# Guide 03: Model Routing: LLM Defaults, Overrides, and Cost Patterns

*Sources: `research/external/2026-05-20-aider-llm-leaderboard.md`, `research/external/2026-05-20-claude-code-aider-cline-comparison.md`, `research/external/2026-05-20-cursor-agent-mode-2026.md`*

---

## Default model routing per tool (2026)

Always state the routing default explicitly in a recommendation. Defaults change with product updates.

| Tool | Default model | Model lock-in | Override method |
|------|--------------|--------------|-----------------|
| Claude Code | Claude (Opus/Sonnet based on plan tier) | HIGH: Claude only | Cannot change; subscription or API keys |
| Aider | User-configured via `.aider.conf.yml` | NONE: 100+ models via LiteLLM | `aider --model <model-name>` or config file |
| Cline | User-configured; Claude/GPT-4o/Gemini common | LOW: multiple backends | VS Code settings panel |
| Cursor | Proprietary + external routing (Composer routes to Claude/GPT/Gemini) | MEDIUM | Cursor settings > Model |
| Windsurf | Cascade (Cognition AI proprietary) + third-party | MEDIUM | Windsurf settings |
| Continue.dev | User-configured; any OIDC-compatible provider | NONE | `config.json` |
| Devin 2.0 | Proprietary (Cognition AI) | HIGH | Not user-overridable |
| Bolt.new | Bolt model (proprietary) | HIGH | Not user-overridable |
| Replit Agent | Proprietary | HIGH | Not user-overridable |

Sources: `research/external/2026-05-20-claude-code-aider-cline-comparison.md` (Claude Code/Aider/Cline), `research/external/2026-05-20-cursor-agent-mode-2026.md` (Cursor)

---

## The Aider architect/editor two-model pattern

The single most important model-routing optimization for token-budget-conscious developers.

### How it works

Aider's `--architect` flag routes the two phases of code modification to different models:

1. **Architect phase** (planning and reasoning): Expensive, high-capability model
   - Recommended: GPT-5.2, Claude Opus, DeepSeek R1, o3-pro
2. **Editor phase** (applying file changes via diffs): Fast, cheap model
   - Recommended: DeepSeek V3, Claude Sonnet 4.6, Claude Haiku, GPT-4.1-mini

### Cost impact

| Workflow | Monthly cost estimate | Notes |
|----------|-----------------------|-------|
| All-Claude Opus (no routing) | ~$450/month | Single model for all phases |
| Aider architect/editor (default) | ~$29-$99/month | Depends on usage volume |
| Aider with phase detection (test/doc) | 70-90% reduction vs all-Opus | Includes test generation phases |

Source: `research/external/2026-05-20-aider-llm-leaderboard.md`

**3-5x cost reduction is achievable** over single-premium-model usage. This is the strongest argument for Aider over Claude Code in cost-constrained workflows.

### Minimal `.aider.conf.yml` for architect/editor

```yaml
model: gpt-5.2          # Architect: high-reasoning model
editor-model: deepseek/deepseek-chat  # Editor: fast/cheap model
auto-commits: true      # Commit each change (can disable)
git: true               # Enable git integration
```

See `guides/04-prompt-and-context-discipline.md` for a full `.aider.conf.yml` reference.

---

## Cursor model routing specifics

Cursor routes to multiple external providers (Claude, GPT, Gemini) depending on the feature:
- **Tab completions:** Cursor's own fast model ("Cursor-fast" or proprietary)
- **Composer (multi-file chat):** Routes to external models (Claude Opus, GPT-5, Gemini)
- **Agent Mode:** Routes to the model selected in Cursor settings

> **TODO: open question**: The exact routing logic for when Cursor uses its proprietary model vs routes to external providers was not fully documented in available sources as of 2026-05-20. Consult `cursor-ide-worker-bee` for the authoritative current routing behavior.

---

## Claude Code model routing

Claude Code is model-locked to Claude (Anthropic). There is no override. The tier routed depends on the user's Anthropic plan:
- **Claude.ai Pro ($20/month):** Sonnet-class models
- **Claude.ai Max ($100/month):** Opus-class models
- **API key billing:** Billed per token; model selection via `--model` flag

**Key implication:** Claude Code's inability to route to cheaper models (DeepSeek, Gemini Flash, Haiku) means it is 3x more expensive than Aider for comparable real-world benchmark performance. Source: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`.

---

## Recommended model pairings by use case

| Use case | Recommended tool + model | Rationale |
|----------|--------------------------|-----------|
| Best quality, no budget cap | Claude Code (Max plan, Opus) | Highest code quality score |
| Best quality, API billing | Aider + `--architect gpt-5.2 --editor deepseek-v3` | 3-5x cheaper than Claude Code |
| Maximum model flexibility | Aider (LiteLLM, 100+ models) | Swap models without tool change |
| Privacy/local models | Continue.dev + Ollama (Llama 3.x, Mistral) | No cloud API required |
| Polyglot performance | Aider + top Aider leaderboard model (GPT-5, o3-pro) | Aider leaderboard covers non-Python |
| VS Code, multi-model | Cline (configure per-task) | Multiple backends in one extension |
