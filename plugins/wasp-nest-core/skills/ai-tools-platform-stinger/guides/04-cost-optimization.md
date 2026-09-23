# Cost Optimization: AI Spend Discipline

## The three levers

AI spend is a function of: (tokens sent) × (price per token) × (call volume). Optimize each:

1. **Token reduction:** prompt caching, shorter prompts, structured outputs, batch chunking.
2. **Price reduction:** model tiering, cheap fallbacks, gateway caching, batch APIs.
3. **Volume reduction:** caching responses, deduplication, async batching.

## Lever 1: Prompt caching

The highest-ROI optimization for production systems with repeated system prompts.

### Anthropic prompt caching

Works for prompts > 1024 tokens. Add `cache_control: { type: "ephemeral" }` to content blocks you want cached:

```typescript
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: systemPrompt, // Your large, repeated system prompt
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: userMessage }],
});
```

- Cache TTL: 5 minutes by default; each hit resets the TTL.
- Cost: cached tokens are charged at 10% of normal input rate.
- Typical savings: 40-70% on prompts with > 2000 token system prompts.

### OpenAI prompt caching

Automatic for prompts > 1024 tokens in the same API key session. No code changes required. 50% discount on cached tokens. Works with GPT-4o and GPT-4o-mini.

### Google Gemini context caching

Explicit cache creation; useful for very large contexts (documents, codebases):

```python
# Via Vertex AI SDK
import vertexai
from vertexai.generative_models import GenerativeModel

cache = caching.CachedContent.create(
    model_name="gemini-2.0-flash",
    contents=[large_document_content],
    ttl=datetime.timedelta(hours=1),
)
```

Cached content charged at 25% of standard input rate. Minimum 4096 tokens to create a cache.

## Lever 2: Model tiering strategy

Design a tiering router before building your LLM pipeline:

```typescript
function selectModel(task: LLMTask): string {
  switch (task.complexity) {
    case "high":   // Agentic, multi-step reasoning
      return "claude-3-7-sonnet-20250219";
    case "medium": // General chat, Q&A, summarization
      return "claude-3-5-haiku-20241022";
    case "low":    // Classification, routing, extraction
      return "gpt-4o-mini";
    default:
      return "claude-3-5-haiku-20241022";
  }
}
```

The key insight: most sub-tasks in an agentic pipeline are `low` or `medium` complexity. Only the final synthesis / reasoning step is `high`. Routing aggressively to the cheap tier reduces average cost by 60-80%.

## Lever 3: Batch APIs

For non-interactive workloads (nightly reports, bulk embedding, document processing):

### OpenAI Batch API

50% discount; 24h turnaround:

```typescript
const batch = await openai.batches.create({
  input_file_id: fileId,
  endpoint: "/v1/chat/completions",
  completion_window: "24h",
});
```

Ideal for: document classification, embedding generation, bulk summarization, offline evaluation runs.

### Anthropic Message Batches

50% discount; up to 24h processing:

```typescript
const batch = await anthropic.messages.batches.create({
  requests: tasks.map((t) => ({
    custom_id: t.id,
    params: { model: "claude-3-5-haiku-20241022", max_tokens: 512, messages: t.messages },
  })),
});
```

## Lever 4: Gateway-level caching (Portkey)

Portkey supports semantic and exact-match caching. For RAG pipelines where similar queries recur frequently:

```json
{
  "cache": {
    "mode": "semantic",
    "max_age": 3600,
    "namespace": "rag-cache"
  }
}
```

Semantic cache hit rate of 20-40% is common for product Q&A use cases. Each hit is zero provider cost.

## Spend telemetry minimum

Every production AI system should track:

- Total tokens per model per day (input + output split).
- Cost per feature area (chat, RAG, agents, embeddings).
- Cache hit rate (prompt cache + gateway cache).
- P95 latency per model per feature.

At minimum, log `{ model, inputTokens, outputTokens, cachedTokens, latencyMs, feature }` per LLM call. Feed into your observability platform (Portkey dashboard, Grafana, or PostHog).

## Monthly cost estimate worksheet

See `templates/cost-estimate.md` for the worksheet. Quick rule of thumb:

| Volume | Model | Estimated monthly cost |
|---|---|---|
| 1M calls × 1K tokens avg | GPT-4o-mini | ~$150/month |
| 1M calls × 1K tokens avg | Claude Haiku 3.5 | ~$800/month |
| 100K calls × 5K tokens avg | Claude 3.5 Sonnet | ~$1,500/month |
| 10K calls × 10K tokens avg | GPT-4.1 | ~$200/month |

*Prices as of 2026-Q2. Verify at provider pricing pages.*
