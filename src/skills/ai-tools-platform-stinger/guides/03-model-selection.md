# Model Selection: 2026 Frontier Landscape

## The three-tier rule

Every production system should be designed with three tiers, routing each task to the appropriate tier:

- **Frontier tier**: maximum capability; use only where quality is the dominant factor and cost is secondary.
- **Mid tier**: production workhorse; strong capability at reasonable cost.
- **Fast/cheap tier**: classification, summarization, simple generation; sub-cent per 1K tokens.

## 2026 model landscape

### Anthropic Claude

| Model | Tier | Context | Input ($/1M) | Output ($/1M) | Best for |
|---|---|---|---|---|---|
| Claude 3.7 Sonnet | Frontier | 200K | $3.00 | $15.00 | Complex reasoning, agentic, long-context analysis |
| Claude 3.7 Opus | Frontier | 200K | $15.00 | $75.00 | Highest-quality tasks; rare use |
| Claude 3.5 Sonnet | Mid | 200K | $3.00 | $15.00 | General production; excellent at coding |
| Claude Haiku 3.5 | Fast/cheap | 200K | $0.80 | $4.00 | Classification, summarization, high-volume |

**Claude's strengths:** Long-context handling, instruction following, coding, nuanced writing.
**Claude's weaknesses:** Slower than GPT-4o at simple tasks; no native image generation.

### OpenAI GPT

| Model | Tier | Context | Input ($/1M) | Output ($/1M) | Best for |
|---|---|---|---|---|---|
| GPT-4.1 | Frontier | 1M | $2.00 | $8.00 | Agentic, coding, instruction following |
| o3 | Frontier | 200K | $10.00 | $40.00 | Math, science, complex reasoning chains |
| o4-mini | Mid | 200K | $1.10 | $4.40 | Reasoning at lower cost |
| GPT-4o | Mid | 128K | $2.50 | $10.00 | Multimodal (vision), general |
| GPT-4o-mini | Fast/cheap | 128K | $0.15 | $0.60 | High-volume; cheapest capable model |
| o3-mini | Fast/cheap | 200K | $1.10 | $4.40 | Reasoning tasks at cheap tier |

**GPT's strengths:** Best-in-class for code generation, function calling, multimodal; fastest API.
**GPT's weaknesses:** Higher cost for long-context vs Claude; less consistent on nuanced writing.

### Google Gemini

| Model | Tier | Context | Input ($/1M) | Output ($/1M) | Best for |
|---|---|---|---|---|---|
| Gemini 2.5 Pro | Frontier | 1M | $1.25 | $10.00 | Long-context, multimodal, code |
| Gemini 2.0 Flash | Fast/cheap | 1M | $0.10 | $0.40 | Cheapest 1M-context model; multimodal |
| Gemini 1.5 Flash | Fast/cheap | 1M | $0.075 | $0.30 | Ultra-cheap high-volume |

**Gemini's strengths:** Best long-context value; cheapest per-token at Flash tier; strong multimodal.
**Gemini's weaknesses:** Less consistent on complex instruction following vs Claude/GPT; Flash quality gaps on nuanced tasks.

### Open-weight models (via Groq, Together, Fireworks, Ollama)

| Model | Context | Speed (Groq) | Best for |
|---|---|---|---|
| Llama 3.1 70B | 128K | ~2000 tok/s | Open-weight production workhorse |
| Llama 3.1 8B | 128K | ~5000 tok/s | Fast classification; local dev |
| Llama 3.2 3B | 128K | ~8000 tok/s | Ultra-fast; simple extraction |
| Llama 3.2 11B Vision | 128K | - | Multimodal; local-capable |
| Mistral 7B Instruct | 32K | ~4000 tok/s | European-hosted; fast; GDPR-friendly |
| Gemma 3 9B | 128K | ~3000 tok/s | Strong on reasoning; local-capable |
| Phi-3.5 Mini | 128K | ~6000 tok/s | Excellent size-to-quality; local |

## Use-case routing guide

| Use case | Recommended model | Cheap fallback |
|---|---|---|
| Complex reasoning / agents | Claude 3.7 Sonnet or GPT-4.1 | GPT-4o-mini |
| Code generation | GPT-4.1 or Claude 3.5 Sonnet | Llama 3.1 70B (Groq) |
| Long document analysis | Claude 3.7 Sonnet or Gemini 2.5 Pro | Gemini 2.0 Flash |
| Classification / routing | GPT-4o-mini or Haiku 3.5 | Llama 3.1 8B |
| Summarization (high volume) | Gemini 2.0 Flash | Gemini 1.5 Flash |
| Multimodal (vision) | GPT-4o or Gemini 2.0 Flash | Llama 3.2 11B Vision |
| Structured output / JSON | Claude 3.5 Sonnet or GPT-4o | GPT-4o-mini |
| RAG retrieval scoring | Cohere Rerank v3.5 | N/A |
| Embeddings | text-embedding-3-large | text-embedding-3-small |
| Local / privacy-first | Llama 3.1 8B (Ollama) | Phi-3.5 Mini |

## Prompt caching: reduces cost significantly

Both Anthropic and OpenAI support prompt caching for repeated system prompts:

- **Anthropic:** Cache prefix up to 4K tokens; 90% discount on cached tokens; TTL 5 min (extendable).
- **OpenAI:** Automatic for prompts > 1024 tokens in the same session; 50% discount.
- **Google:** Context caching for Gemini; charged at 25% of standard input token rate.

For production RAG systems with a large, repeated system prompt, enabling prompt caching is usually a 40-70% cost reduction. See `guides/04-cost-optimization.md` for the full recipe.

## Context window guide

When choosing between providers for long-context tasks:

- **< 32K tokens:** All frontier models; use cost and capability as primary factors.
- **32K - 200K:** Claude or GPT-4.1 (full quality maintained).
- **200K - 1M:** Gemini 2.5 Pro or GPT-4.1 (Gemini is cheaper at this range).
- **> 1M:** Gemini 2.5 Pro (only model with verified quality at extreme context).

Note: Claude and GPT-4.1 advertise 200K and 1M respectively but quality degrades at extreme ends. Verify with your specific use case.
