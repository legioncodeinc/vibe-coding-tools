# Model Selection Reference for Bee Dispatch

Use this matrix to choose a model for an agent, not to declare a universal winner. The correct model is the least expensive model that passes your own evaluation set for the task.

Last verified: **2026-08-14**. Provider names, availability, and prices change quickly. Recheck the linked official pages before making a purchasing or production decision.

## The short version

| Work shape | Start with | Move up when | Move down when |
| --- | --- | --- | --- |
| Hard, ambiguous, cross-domain work in Codex | `gpt-5.6-sol` | Already at the top Codex tier; raise reasoning effort first | The task is narrow, repeatable, or high volume |
| Everyday implementation in Codex | `gpt-5.6-terra` | Representative evals expose reasoning or autonomy failures | Terra passes comfortably and cost or latency still matters |
| Narrow, high-volume Codex work | `gpt-5.6-luna` | Accuracy or instruction-following misses the acceptance bar | The task can be handled deterministically without a model |
| Maximum capability in Claude API or Claude Code | `claude-fable-5` | No higher generally available Claude tier | Opus or Sonnet passes the same evals |
| Complex agentic coding in Claude | `claude-opus-5` | Only when Fable's additional capability is worth the premium | Sonnet passes the task-specific evals |
| Everyday Claude production work | `claude-sonnet-5` | Long-horizon or difficult reasoning fails | Haiku passes latency and quality targets |
| Fast Claude classification or subagent work | `claude-haiku-4-5` | Quality misses the bar | A deterministic classifier is enough |
| Cursor-native coding loops | `composer-2.5` or Cursor Auto | A hard task benefits from a frontier model exposed in the current Cursor UI | The work is simple enough for a cheaper supported choice |
| Google high-throughput agentic work | `gemini-3.6-flash` | A preview Pro model proves materially better on your data | Flash-Lite passes and volume dominates |
| Google low-cost automation | `gemini-3.5-flash-lite` | Accuracy or planning depth misses the bar | Deterministic code can do the job |

## Models this repository can dispatch directly in Codex

These are the current model identifiers exposed to this repository's Codex multi-agent runtime. Do not invent suffixes such as `-medium` or `-thinking-high`. Reasoning effort is a separate dispatch setting.

| Model ID | Best fit | Supported reasoning efforts | Relative cost | Default routing judgment |
| --- | --- | --- | --- | --- |
| `gpt-5.6-sol` | Complex reasoning, coding, design judgment, and multi-file autonomous work | low, medium, high, xhigh, max, ultra | Highest | Use when failure is expensive or the work crosses several domains |
| `gpt-5.6-terra` | Balanced everyday implementation and review | low, medium, high, xhigh, max, ultra | Medium | Default for bounded engineering tasks |
| `gpt-5.6-luna` | Narrow, well-specified, high-volume work | low, medium, high, xhigh, max | Lowest 5.6 tier | Use for extraction, classification, inventory, and simple edits |
| `gpt-5.5` | Compatibility fallback for prior routing plans | low, medium, high, xhigh | Legacy premium | Keep only where a validated workflow depends on it |
| `gpt-5.4` | Compatibility fallback for prior routing plans | low, medium, high, xhigh | Legacy | Migrate representative work to the 5.6 family |

OpenAI positions Sol as the flagship, Terra as the intelligence-cost balance, and Luna as the cost-sensitive, high-volume option. All three API models have a 1.05M-token context window and 128K maximum output. Current list pricing should be checked on the official model page because OpenAI reduced Terra and Luna prices on 2026-07-30.

## Current provider model facts

This table uses provider-published positioning and specifications. It avoids mixing benchmark scores from different harnesses, prompts, tool sets, and dates, because those numbers are not directly comparable.

| Provider | Model ID | Provider position | Context | List price per 1M input/output tokens | Important caveat |
| --- | --- | --- | ---: | ---: | --- |
| OpenAI | `gpt-5.6-sol` | Flagship for complex professional work | 1.05M | $5 / $30 | Highest cost in the 5.6 family |
| OpenAI | `gpt-5.6-terra` | Balance of intelligence and cost | 1.05M | $2 / $12 after 2026-07-30 reduction | Confirm the latest price page before budgeting |
| OpenAI | `gpt-5.6-luna` | Cost-sensitive, high-volume work | 1.05M | $0.20 / $1.20 after 2026-07-30 reduction | Quality still needs workload-specific evaluation |
| Anthropic | `claude-fable-5` | Highest generally available Claude capability | 1M | $10 / $50 | Safety classifiers can return a refusal with HTTP 200 |
| Anthropic | `claude-opus-5` | Complex agentic coding and enterprise work | 1M | $5 / $25 | Use only when Sonnet does not meet the bar |
| Anthropic | `claude-sonnet-5` | Best Claude balance of speed and intelligence | 1M | $2 / $10 through 2026-08-31, then $3 / $15 | New tokenizer can change real per-task cost |
| Anthropic | `claude-haiku-4-5` | Fastest Claude model with near-frontier intelligence | 200K | $1 / $5 | Smaller context and lower reasoning ceiling |
| Google | `gemini-3.6-flash` | Agentic and multimodal balance with lower token use | 1M | $1.50 / $7.50 | Google model APIs and sampling behavior changed in this generation |
| Google | `gemini-3.5-flash-lite` | Fastest, lowest-cost 3.5 family model | 1M | $0.30 / $2.50 | Validate complex instruction following before scaling |
| Google | `gemini-3.1-pro` | Advanced intelligence and complex problem solving | See current model page | See current model page | Preview availability can change |
| Cursor | `composer-2.5` | Cursor-native agentic coding and long-running tasks | Cursor-managed | $0.50 / $2.50 standard; $3 / $15 fast | Available only inside Cursor surfaces |

Prices exclude caching, batch discounts, premium processing, tool-call fees, long-context multipliers, taxes, and platform markups.

## Editorial task-fit rubric

The following scores are routing aids, not provider benchmarks. A score of 5 means the model is a strong starting point for that work shape based on provider positioning and the model's available tools. Replace these scores with results from your own evals when you have them.

| Model | Deep reasoning | Agentic coding | Speed | Cost efficiency | Long context | High-volume routing |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `gpt-5.6-sol` | 5 | 5 | 3 | 3 | 5 | 2 |
| `gpt-5.6-terra` | 4 | 4 | 4 | 4 | 5 | 4 |
| `gpt-5.6-luna` | 3 | 3 | 5 | 5 | 5 | 5 |
| `claude-fable-5` | 5 | 5 | 2 | 2 | 5 | 1 |
| `claude-opus-5` | 5 | 5 | 3 | 3 | 5 | 2 |
| `claude-sonnet-5` | 4 | 4 | 4 | 4 | 5 | 4 |
| `claude-haiku-4-5` | 3 | 3 | 5 | 4 | 3 | 5 |
| `gemini-3.6-flash` | 4 | 4 | 5 | 4 | 5 | 5 |
| `gemini-3.5-flash-lite` | 3 | 3 | 5 | 5 | 5 | 5 |
| `composer-2.5` | 4 | 5 | 5 | 5 | 4 | 4 |

## How to choose without guessing

1. Write 20 to 100 representative tasks with pass/fail criteria.
2. Start with the lowest-cost model that appears capable.
3. Run the same task set at a fixed reasoning effort and tool configuration.
4. Record success rate, wall-clock time, input tokens, output tokens, tool failures, and human correction time.
5. Move up only for the task categories that fail.
6. Re-run the evaluation before changing a model alias in production.

The cheapest token is not always the cheapest completed task. A small model that needs three retries and a human repair can cost more than one successful frontier-model call.

## Bee routing rules

- Use `gpt-5.6-sol` for security decisions, architecture, ambiguous cross-domain changes, and final synthesis where mistakes are expensive.
- Use `gpt-5.6-terra` for bounded implementation, documentation, testing, and reviews with clear acceptance criteria.
- Use `gpt-5.6-luna` for inventories, extraction, classification, link checking, and other narrow work that the orchestrator will verify.
- In Claude Code agent files, prefer stable family selectors such as `opus`, `sonnet`, or `haiku` when portability matters. Use exact API IDs only where the harness supports them.
- In Cursor, prefer Auto when availability is changing or use Composer 2.5 for Cursor-native coding loops.
- Never route from marketing benchmark headlines alone. Tool access, system prompts, context construction, and acceptance tests usually matter more.
- Never use a model ID merely because it appears in this document. Confirm that the target harness exposes it.

## Sources

- [OpenAI model catalog](https://developers.openai.com/api/docs/models)
- [OpenAI GPT-5.6 guidance](https://developers.openai.com/api/docs/guides/latest-model)
- [OpenAI 2026-07-30 Terra and Luna price update](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/)
- [Anthropic current model overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Anthropic model selection guidance](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)
- [Google Gemini model catalog](https://ai.google.dev/gemini-api/docs/models)
- [Google latest Gemini model guidance](https://ai.google.dev/gemini-api/docs/latest-model)
- [Cursor Composer 2.5](https://cursor.com/composer)
