# OpenRouter: Llama 3.3 70B in Production

**Source:** OpenRouter docs: https://openrouter.ai/docs, https://openrouter.ai/models/meta-llama/Llama-3.3-70B-Instruct
**Retrieved:** 2026-04-25
**Status:** Informational: operational reference for `guides/19-llm-provider-config.md`.
**Numbers tag:** vendor-directional (rate limits and pricing change).

---

## TL;DR

OpenRouter is the single LLM gateway for the deploying product. OpenAI-API-compatible. Aggregates 450+ models. Prepaid credit balance with auto-reload.

For Llama 3.3 70B at production scale:

- Stable production tier latency: ~1.5-3.5s for typical coaching responses.
- Provider failover via `provider.allow_fallbacks: true`.
- Rate limits sufficient at the deploying product's scale; tier upgrades available.

---

## Configuration in the deploying product

```typescript
// lib/ai-client.ts
_client = new OpenAI({
  apiKey:  process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "https://example.com",
    "X-Title":      "the deploying product",
  },
});
```

`HTTP-Referer` and `X-Title` are OpenRouter conventions for attribution and analytics.

---

## Critical operational safeguards

OpenRouter uses prepaid credit. **At $0 balance, all AI features silently fail** (HTTP 402 from upstream).

Required:

1. **Auto-reload** in OpenRouter dashboard: minimum balance + auto-reload amount.
2. **Low-balance webhook** → Slack/PagerDuty.
3. **Monitor `OPENROUTER_BALANCE`** in observability dashboard.

Absence of any of these is **must-fix** before production.

---

## Provider-preference settings

OpenRouter supports `provider.order` and `provider.allow_fallbacks` via `extra_body`:

```typescript
await openai.chat.completions.create({
  model: "meta-llama/Llama-3.3-70B-Instruct",
  messages: [...],
  extra_body: {
    provider: {
      order:            ["Together", "Fireworks", "DeepInfra"],
      allow_fallbacks:  true,
    },
  },
});
```

Useful for:

- **Cost optimization**: prefer cheaper provider for `modelFast`.
- **Latency optimization**: prefer faster provider.
- **Compliance**: exclude providers that don't meet residency.

Document any usage in `library/knowledge/private/ai/coach-architecture.md`.

---

## Rate limits

OpenRouter has tier-based limits. Production tier is sufficient for current the deploying product's scale. `429` responses are alert-worthy if sustained (contact OpenRouter for tier increase).

---

## Implications

- Direct provider calls bypassing OpenRouter are **must-fix**.
- Hardcoded model names instead of `getAIModels()` are **must-fix**.
- Missing OpenRouter operational safeguards (auto-reload, low-balance alert) are **must-fix**.
- See `guides/19-llm-provider-config.md`.
