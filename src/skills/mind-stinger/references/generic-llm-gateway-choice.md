# Generic LLM Gateway Choice (DEMOTED: the deploying product uses OpenRouter exclusively)

> **Status:** Demoted reference. the deploying product routes ALL LLM inference through OpenRouter (`https://openrouter.ai/api/v1`) via the OpenAI-compatible SDK.

---

## Why OpenRouter is canonical for the deploying product

1. **OpenAI API-compatible**: same SDK, same shape; trivial swap if needed.
2. **450+ models**: model swaps via the SA AI Configuration screen, no infrastructure change.
3. **Provider failover built in**: if a provider is down, OpenRouter routes to a fallback if configured.
4. **Single auth surface**: one API key, one base URL.
5. **Prepaid credit model**: predictable spend; auto-reload + low-balance webhook.
6. **Mature for the deploying product's scale**: handles millions of LLM calls/month.

---

## The alternatives (for context)

### Portkey

- **Pitch:** LLM gateway + prompt management + observability bundled.
- **Pros vs OpenRouter:** Built-in prompt versioning (the deploying product does this in `PromptVersion` already); observability layer; A/B testing primitives.
- **Cons vs OpenRouter:** Adds a vendor for capabilities the deploying product implements directly (`PromptVersion`, `AiTrace`); pricing scales with traffic.
- **When it'd be the right call:** Greenfield product without an existing observability stack.

### LiteLLM (proxy mode)

- **Pitch:** Self-hostable LLM proxy. OpenAI-compatible.
- **Pros vs OpenRouter:** Self-hosted (no vendor); no per-request markup; full control.
- **Cons vs OpenRouter:** Operational burden (run the proxy, manage failover, monitor health); fewer integrations than OpenRouter; pre-built UI doesn't match OpenRouter's quality.
- **When it'd be the right call:** Strict data-residency requirements that prevent routing through a third-party gateway.

### Direct provider calls (Anthropic SDK, OpenAI SDK pointed at OpenAI, Google API, etc.)

- **Pros:** Lowest latency (no gateway hop); direct provider features.
- **Cons:** Multiple SDKs to maintain; no failover; no single audit point; vendor lock-in per call site.
- **product policy:** **Direct provider calls are must-fix findings.** All inference goes through OpenRouter.

### Helicone (proxy mode)

- **Pitch:** OpenAI-compatible proxy with observability. Lighter than Portkey.
- **Pros vs OpenRouter:** Built-in observability layer (similar to LangFuse).
- **Cons vs OpenRouter:** Per-request analytics overhead; vendor lock-in for the obs layer specifically.
- **When it'd be the right call:** Minimal-spend gateway with built-in obs.

### Vercel AI Gateway (preview)

- **Pitch:** Vercel-hosted gateway, integrated with Vercel AI SDK.
- **Pros vs OpenRouter:** Tight Vercel integration.
- **Cons vs OpenRouter:** Vendor lock-in; only as good as Vercel's infrastructure investment.
- **When it'd be the right call:** Already-Vercel-hosted Next.js product.

---

## Why we don't combine multiple gateways

**Single gateway = single auth, single audit, single billing surface.** the deploying product's `traceAICall()` is the audit; OpenRouter is the gateway; `AiTrace` is the storage. Adding a second gateway would require either dual-routing (every call goes through both, wasteful) or splitting calls across gateways (audit fragmentation).

Combining `AiTrace` (host-side observability) with OpenRouter (provider routing) gives the same effective coverage as Portkey + LiteLLM combined, without the second vendor relationship.

---

## Operational requirements (for OpenRouter, must-fix)

Per `guides/19-llm-provider-config.md §8`:

1. **Auto-reload** in OpenRouter dashboard: minimum balance + auto-reload amount.
2. **Low-balance webhook** → Slack/PagerDuty alert.
3. **Monitor `OPENROUTER_BALANCE`** in observability dashboard.

At $0 balance, all AI features silently fail (HTTP 402 from upstream). The auto-reload + alert is **must-fix** before going live.

---

## Migration path if substitution is approved

If the deploying product ever needs to swap OpenRouter (e.g., for a self-hosted requirement):

1. Replace `_client = new OpenAI({ baseURL: ..., apiKey: ... })` in `ai-client.ts` with the new gateway's configuration.
2. Confirm OpenAI-API compatibility (most gateways do this; Portkey/LiteLLM do).
3. Re-test all paths: coaching, routing, matching, onboarding, summarization, vision.
4. Migrate the model slot defaults if names differ.
5. Update `library/knowledge/private/ai/coach-architecture.md §3` and `library/knowledge/private/ai/README.md`.
