# Example: Cost-Constrained Workflow: Solo Founder, API Budget

*Demonstrates `guides/01-selection-rubric.md` and `guides/03-model-routing.md`*

---

## Scenario

A solo founder building a SaaS product in Python/FastAPI + React. Self-funded; hard budget cap of $30/month for all AI tools. Autonomy tolerance: 2-3. Uses VS Code. Cannot afford $20+/month subscriptions, must pay per API call only. Has been spending $80/month on Claude directly via the API and wants to cut costs without sacrificing too much quality.

---

## Running the five-question intake

**Q1: Autonomy tolerance:** 2-3 (hybrid-agent, but cost-conscious)
- **Outcome:** Tier 2. But budget constraint rules out Claude Code Pro ($20/month subscription) as the primary tool when combined with other API costs.

**Q2: Monthly budget:** $30/month hard cap; API billing only
- **Outcome:** Aider is the dominant fit. No subscription tools. Aider with architect/editor routing using cheap models.

**Q3: Editor:** VS Code
- **Outcome:** No constraint. Aider runs in terminal; VS Code for editing.

**Q4: Language:** Python + React (polyglot)
- **Outcome:** Aider's polyglot leaderboard is the relevant benchmark (not SWE-bench Python-only). Use models that rank well on Aider's leaderboard.

**Q5: Task type:** Feature development, bug fixes, iterative product work
- **Outcome:** Tier 2 hybrid-agent confirmed.

---

## Recommendation output

**Primary recommendation: Aider with architect/editor model routing**

**Estimated monthly cost at 2 hours/day heavy usage: $15-25/month**

The key insight: Aider routes the expensive "planning" phase to a powerful model and the cheap "editing" phase to a fast, inexpensive model. The developer's current $80/month spend on Claude directly (single model, all phases) can be cut 60-80% without meaningful quality regression.

**Aider config for this scenario:**

```yaml
# .aider.conf.yml
# Architect model: used for planning/reasoning (expensive model, fewer tokens)
model: deepseek/deepseek-r1      # High reasoning, much cheaper than Claude Opus

# Editor model: used for applying diffs to files (cheap model, many tokens)
editor-model: deepseek/deepseek-chat  # DeepSeek V3: excellent edit quality at very low cost

# Alternatively if using OpenAI:
# model: o3-mini-high             # Good reasoning, cheaper than GPT-5
# editor-model: gpt-4.1-mini      # Fast and cheap for edits

auto-commits: true
show-diffs: true
git: true
```

**Cost breakdown (approx. at moderate usage):**

| Component | Model | Estimated monthly cost |
|-----------|-------|----------------------|
| Architect (planning) | DeepSeek R1 | ~$5-8 |
| Editor (diffs) | DeepSeek V3 | ~$3-5 |
| Cursor Tab (optional) | Cursor Pro | $20/month (optional add-on) |
| **Total (no Cursor)** | | **~$8-13/month** |
| **Total (with Cursor)** | | **~$28-33/month** |

Source: `research/external/2026-05-20-aider-llm-leaderboard.md` (3-5x cost reduction claim, $29-99/month range vs $450/month all-Opus).

---

## When to upgrade

This configuration is the right starting point. Upgrade triggers:
- If code quality drops noticeably on complex tasks: upgrade architect model to Claude Opus or GPT-5 (cost goes up but stays <$50/month)
- If the founder wants interactive completions while typing: add Cursor Pro ($20/month) alongside Aider for the terminal

---

## Edge case: What if the founder is on JetBrains?

Replace Aider with Continue.dev configured with local Ollama models or the same DeepSeek API. Continue.dev is free (open source) and has first-class JetBrains support. Cost is API calls only. Source: `research/external/2026-05-20-continue-dev-open-source.md`.

---

## Sources cited

- Intake rubric: `guides/01-selection-rubric.md`
- Aider architect/editor pattern: `research/external/2026-05-20-aider-llm-leaderboard.md`
- Cost estimates: `guides/03-model-routing.md`
- Continue.dev JetBrains support: `research/external/2026-05-20-continue-dev-open-source.md`
