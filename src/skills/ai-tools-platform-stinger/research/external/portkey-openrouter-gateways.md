# Source: Portkey and OpenRouter AI Gateways (2026)

**Source type:** Official documentation + blog
**Authority:** High
**Date fetched:** 2026-05-20
**URLs:** portkey.ai/docs, openrouter.ai/docs

## Key findings

### Portkey (2026)

- Portkey positions as the "AI Gateway for Enterprises": observability, reliability, and governance layer.
- Virtual keys abstract provider credentials; one app secret maps to N provider keys in Portkey vault.
- Budget caps enforced per virtual key, per workspace, or per time window.
- Fallback routing: define ordered target list; Portkey retries on specified HTTP status codes.
- Semantic caching: cosine similarity threshold on stored prompt/response pairs; configurable TTL.
- Guardrails: PII detection, toxicity filtering, regex patterns, applied pre/post model call without code changes.
- Load balancing: weighted round-robin or least-latency routing across multiple provider accounts.
- OpenAI-compatible API: `baseURL: "https://api.portkey.ai/v1"` is drop-in for any OpenAI SDK.
- Pricing: Free (10K requests/month), Growth ($49/month), Scale (custom). Provider costs are pass-through.

### OpenRouter (2026)

- OpenRouter indexes 200+ models from 30+ providers under a single API key.
- Model IDs follow `{provider}/{model-name}` convention (e.g., `anthropic/claude-3-5-sonnet`).
- Automatic provider fallback within a model family when a provider is degraded.
- Cost-based routing: optional flag to prefer cheapest provider for a given model.
- No budget caps per-key; no built-in observability dashboard.
- OpenAI-compatible API: `baseURL: "https://openrouter.ai/api/v1"`.
- Pricing: pass-through provider cost + ~5-10% margin. No monthly fee.

## Synthesis for stinger

- **Portkey = production ops platform.** Use when you need budget caps, observability, guardrails, semantic caching. More setup, higher monthly cost at scale.
- **OpenRouter = model access aggregator.** Use when you want instant access to 200+ models without managing provider relationships. Lower setup, no ops features.
- **LiteLLM = self-hosted.** Use when data sovereignty prevents routing through third-party proxies.
- **Common pattern:** OpenRouter for development and model exploration; Portkey for production with budget control.
- The two are complementary: Portkey can route through OpenRouter as one of its targets.
