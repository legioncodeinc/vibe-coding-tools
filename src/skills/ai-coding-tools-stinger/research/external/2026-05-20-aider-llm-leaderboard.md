---
source_url: https://aider.chat/docs/leaderboards/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: benchmarks
stinger: ai-coding-tools-stinger
---

# Aider LLM Leaderboard and Model Routing (2026)

## Summary

Aider maintains its own polyglot coding leaderboard: a complement to SWE-bench Verified that tests across multiple programming languages, not just Python. It also documents recommended model pairings and cost-optimization strategies for the architect/editor two-model pattern. As of May 2026, GPT-5 and Gemini 2.5 Pro top the leaderboard.

## Key quotations / statistics

- "GPT-5 (high reasoning effort): 88.0% pass rate (second attempt)" (top of Aider's polyglot leaderboard)
- "Gemini 2.5 Pro: 83.1% pass rate"
- "o3-pro (high): 84.9% pass rate"
- "For cost optimization, Aider uses a two-model architecture with phase-aware routing"
- "This approach achieves 3-5x cost reduction. With additional phase detection for test generation and documentation, costs can drop 70-90% compared to using a single premium model throughout."
- "CodeRouter provides automated phase-aware routing on top of Aider's architect mode, reducing monthly costs from ~$450 (all-Opus) to ~$29-$99 depending on token usage."

## Aider polyglot leaderboard top performers (May 2026)

| Model | Pass Rate (2nd attempt) |
|-------|------------------------|
| GPT-5 (high reasoning) | 88.0% |
| o3-pro (high) | 84.9% |
| Gemini 2.5 Pro | 83.1% |
| GPT-5 (medium reasoning) | 86.7% |
| GPT-5 (low reasoning) | 81.3% |

## Aider recommended models (from official docs)

- Gemini 2.5 Pro
- DeepSeek R1 and V3
- Claude 3.7 Sonnet
- OpenAI o3, o4-mini and GPT-4.1

## Aider architect/editor two-model routing pattern

Aider supports a `--architect` flag that separates planning from editing:

- **Architect phase** (planning, reasoning): Strong reasoning model: GPT-5.2, Claude Opus, DeepSeek R1
- **Editor phase** (applying diffs to files): Fast, cheap model: DeepSeek V3, Sonnet 4.6, Haiku

Cost impact: 3-5x reduction vs single-model usage. With phase detection for test generation and documentation, 70-90% cost reduction is achievable vs all-Opus workflows.

## Aider configuration

Aider behavior is configured via `.aider.conf.yml` in the project root or `~/.aider.conf.yml` for global settings. Key configuration options:

- `model:`: primary model (architect in two-model mode)
- `editor-model:`: editor model for applying changes
- `auto-commits:`: automatic git commits per change (default: true)
- `git:`: enable/disable git integration
- `read:`: additional files to load into context

## Annotations for stinger-forge

- `guides/03-model-routing.md`: Aider section should document the architect/editor pattern prominently. The cost reduction numbers (3-5x) are the single best argument for Aider over Claude Code for token-budget-conscious developers.
- `guides/04-prompt-and-context-discipline.md`: `.aider.conf.yml` structure and recommended settings deserve a dedicated callout block
- `guides/02-benchmark-data.md`: Aider's leaderboard covers polyglot languages vs SWE-bench's Python-only focus: document both as complementary sources with different coverage
- The auto-commit behavior is both a strength (clean git history) and a footgun (commits before the user reviews): mention in `guides/05-footguns.md`
