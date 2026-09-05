# Source: Frontier Model Landscape (2026)

**Source type:** Provider documentation + pricing pages + benchmarks
**Authority:** High
**Date fetched:** 2026-05-20
**URLs:** anthropic.com/pricing, openai.com/api/pricing, cloud.google.com/vertex-ai/pricing

## Key findings

### Anthropic Claude (2026)

- Claude 3.7 Sonnet: current production frontier model; 200K context; extended thinking mode for complex reasoning; $3/$15 per 1M tokens (input/output).
- Claude 3.7 Opus: highest quality tier; $15/$75 per 1M tokens; use sparingly.
- Claude 3.5 Sonnet (previous gen): still excellent; same pricing as 3.7 Sonnet in most scenarios.
- Claude Haiku 3.5: fast and cheap; $0.80/$4.00 per 1M tokens; excellent for classification and summarization.
- Prompt caching: supported; cached tokens at 10% of standard input rate; 5-minute TTL (extended with each hit).
- Context window quality: Claude maintains quality at 200K context better than most competitors.

### OpenAI GPT (2026)

- GPT-4.1: current flagship; 1M context; $2/$8 per 1M tokens; strong at code and function calling.
- o3: reasoning model; $10/$40 per 1M tokens; best for math, science, multi-step logic chains.
- o4-mini: efficient reasoning; $1.10/$4.40 per 1M tokens; strong cost-performance.
- GPT-4o: vision + text; $2.50/$10 per 1M tokens; excellent multimodal.
- GPT-4o-mini: fast/cheap tier; $0.15/$0.60 per 1M tokens; remarkably capable for the price.
- Prompt caching: automatic for prompts > 1024 tokens; 50% discount on cached tokens.
- Batch API: 50% discount; 24-hour processing window.

### Google Gemini (2026)

- Gemini 2.5 Pro: best long-context model; 1M context; $1.25/$10 per 1M tokens; strong multimodal.
- Gemini 2.0 Flash: the cost-performance leader; 1M context; $0.10/$0.40 per 1M tokens; 10x cheaper than Sonnet-class.
- Gemini 1.5 Flash: ultra-cheap; $0.075/$0.30 per 1M tokens; adequate for simple generation at extreme volume.
- Context caching: explicit cache creation; 25% of standard input rate for cached tokens.
- Vertex AI availability: all Gemini models available on Vertex with enterprise auth.

### The cheap-fallback table (synthesis)

| Frontier model | Fast/cheap equivalent | Cost ratio |
|---|---|---|
| Claude 3.7 Sonnet ($3/$15) | Claude Haiku 3.5 ($0.80/$4) | ~4x cheaper |
| GPT-4.1 ($2/$8) | GPT-4o-mini ($0.15/$0.60) | ~13x cheaper |
| Gemini 2.5 Pro ($1.25/$10) | Gemini 2.0 Flash ($0.10/$0.40) | ~12x cheaper |

*All prices as of 2026-Q2. Verify at provider pricing pages.*
