# AI Gateways: Portkey, OpenRouter, LiteLLM

An AI gateway sits between your application code and the underlying model provider. It abstracts provider-specific SDKs, enables fallback routing, provides spend controls, and surfaces observability. For any production application calling more than one provider, a gateway is almost always worth the overhead.

## When you need a gateway

- You want to switch providers without code changes (virtual keys).
- You need automatic fallback (provider down → retry on another).
- You need spend caps or per-feature budget attribution.
- You want a single observability dashboard across all LLM calls.
- You're running multi-provider A/B tests.

If you're building a quick prototype with a single provider and no production SLA, skip the gateway; add it when the pain arrives.

## Portkey

**Best for:** Production multi-provider setups; teams that want ops-grade observability; per-user or per-feature spend attribution.

**Key features (2026):**
- Virtual keys: one secret in your app, Portkey maps to the actual provider key stored in its vault.
- Fallback routing: `strategy: fallback` with ordered provider list; automatic retry on 429 / 5xx.
- Budget caps: per virtual key, per workspace, per time window.
- Caching: semantic and exact-match caching to reduce spend.
- Guardrails: PII detection, toxicity filtering, regex checks, applied before/after the model call.
- Observability: traces per request, cost attribution, latency percentiles, error breakdown.
- OpenAI-compatible API: drop-in replacement, just change `baseURL`.

**Setup pattern (TypeScript):**
```typescript
import Portkey from "portkey-ai";

const portkey = new Portkey({
  apiKey: process.env.PORTKEY_API_KEY,
  virtualKey: process.env.PORTKEY_VIRTUAL_KEY_ANTHROPIC, // maps to Anthropic key
});

const response = await portkey.chat.completions.create({
  model: "claude-3-5-haiku-20241022",
  messages: [{ role: "user", content: "Hello" }],
});
```

**Config file (portkey.config.json) with fallback:**
```json
{
  "strategy": { "mode": "fallback" },
  "targets": [
    { "virtualKey": "anthropic-prod", "weight": 1 },
    { "virtualKey": "openai-fallback", "weight": 1 }
  ]
}
```

**Pricing (as of 2026-Q2):** Free tier (10K requests/month). Growth: $49/month. Scale: custom. Plus pass-through provider costs.

## OpenRouter

**Best for:** Accessing 200+ models through one API without managing provider relationships; developers who want the cheapest route to a capability without ops overhead.

**Key features (2026):**
- Single API key for every major provider (Anthropic, OpenAI, Google, Mistral, Meta, etc.).
- Automatic model fallback and load balancing across providers.
- Cost-based routing: OpenRouter can pick the cheapest provider for a given model family.
- Streaming support, function calling, vision: all normalized.
- No built-in budget caps per-key (use Portkey on top for that).
- OpenAI-compatible: `baseURL: "https://openrouter.ai/api/v1"`.

**Setup pattern (TypeScript):**
```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://your-app.com",
    "X-Title": "Your App Name",
  },
});

const response = await client.chat.completions.create({
  model: "anthropic/claude-3-5-haiku",
  messages: [{ role: "user", content: "Hello" }],
});
```

**Pricing (as of 2026-Q2):** Pass-through provider cost + small margin (~5-10%). No monthly fee.

## LiteLLM

**Best for:** Self-hosted gateway; enterprise environments that cannot send traffic through a third-party proxy; teams running their own Kubernetes cluster.

**Key features:**
- 100% open source; self-hosted via Docker.
- Proxy mode: drop-in OpenAI-compatible endpoint for all providers.
- Budget controls via SQLite/PostgreSQL backend.
- Load balancing, fallback, retry built in.
- Higher ops overhead than Portkey/OpenRouter.

**When to use:** Your security policy prohibits routing through a third-party proxy. Otherwise Portkey or OpenRouter is easier.

## Decision matrix

| Criterion | Portkey | OpenRouter | LiteLLM (self-hosted) |
|---|---|---|---|
| Setup time | 15 min | 10 min | 2-4 hours |
| Ops overhead | Low (SaaS) | Low (SaaS) | High (self-hosted) |
| Budget caps | Yes | No | Yes |
| Observability | Full traces | Basic | Configurable |
| Model coverage | 20+ providers | 200+ models | All providers |
| Self-hosted option | No | No | Yes |
| Data residency | US/EU | US | Your infra |
| Pricing | Freemium | Pass-through | Free (infra cost) |

**Recommended path:**
1. **Prototype:** OpenRouter (instant access, no configuration).
2. **Production (SaaS):** Portkey (budget caps, observability, fallback).
3. **Enterprise (private):** LiteLLM self-hosted.

## Fallback chain recipe (Portkey)

A robust production setup with primary Anthropic and fallback to OpenAI:

```json
{
  "strategy": { "mode": "fallback", "on_status_codes": [429, 500, 502, 503] },
  "targets": [
    { "virtualKey": "anthropic-prod", "override_params": { "model": "claude-3-5-sonnet-20241022" } },
    { "virtualKey": "openai-fallback", "override_params": { "model": "gpt-4o" } }
  ],
  "cache": { "mode": "semantic", "max_age": 3600 }
}
```

## Virtual key plan template

For every provider in your stack:
1. One virtual key per environment (dev, staging, prod).
2. One virtual key per feature area (chat, embeddings, agents) if you want per-feature spend attribution.
3. Budget cap per key: set at 2x expected monthly spend for the environment.
4. Rotation policy: quarterly or on team member departure (see security-worker-bee for vault integration).
