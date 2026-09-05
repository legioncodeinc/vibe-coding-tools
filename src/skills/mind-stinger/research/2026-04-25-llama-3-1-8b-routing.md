# Llama 3.1 8B: Classification at `temperature: 0`, `max_tokens: 20`

**Source:** Meta Llama 3.1 model card; Llama documentation; production routing patterns from public posts
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the routing parameter contract. Cited in `guides/02-coach-architecture.md §3`.
**Numbers tag:** vendor-directional on absolute accuracy; the parameter contract (`temperature: 0, max_tokens: 20`) is benchmarked production practice.

---

## TL;DR

Llama 3.1 8B Instruct is the canonical classifier model for the deploying product's `routeToCoach()`:

- ~10× cheaper than Llama 3.3 70B for routing.
- Classification accuracy at `temperature: 0` is sufficient (target > 90%).
- `max_tokens: 20` keeps the call cheap; one-word response is expected.
- Falls back to `main_community` on any unrecognized output.

---

## Why these specific parameters

| Parameter | Value | Why |
|---|---|---|
| `model` | `Llama 3.1 8B Instruct` | ~10× cheaper than 70B. Routing accuracy at 8B is sufficient. |
| `temperature` | `0` | Routing must be deterministic: same input → same coach. Stochasticity here is a bug, not a feature. |
| `max_tokens` | `20` | One-word response. Higher wastes tokens. |
| `response_format` | (default) | The classifier returns plain text; JSON mode adds overhead for one word. |

---

## Routing prompt structure

The classifier prompt explicitly enumerates valid coach types and gives guidelines:

```
You are a routing classifier. Reply with ONLY one of:
main_community, onboarding, level_1, level_2, level_3, offer_doc, special_gift_strategist

Guidelines:
- ideal clients, target market → main_community
- offers, pricing, packaging → offer_doc
- onboarding, getting started → onboarding
- level-specific goals → level_{n}
- unique strengths, distinctive qualities, personal brand, special gift → special_gift_strategist
- general questions, community topics → main_community
- if unsure → main_community

The member is currently at Level {memberContext.level}.
```

The `if unsure → main_community` rule is the safety net. Combined with the runtime fallback (`if (!VALID_COACH_TYPES.has(raw)) return "main_community"`), the system never panics.

---

## Why 8B is sufficient for routing

Routing is a closed-set classification (7 + module variants). 8B handles this well at `temperature: 0`. Going to 70B for routing is a should-refactor (cost) finding: the precision lift is < 2% on closed-set classification, not worth the 10× cost.

---

## When 8B isn't enough

- **Many-class classification (50+ classes):** consider 70B or a fine-tuned classifier.
- **Ambiguous boundary classes** (e.g., `offer_doc` vs `pricing_strategist`): refine the prompt's disambiguation rules first; only escalate to 70B if prompt iteration plateaus.

---

## The routing-call tracing gap

`runOrchestrator()` does NOT trace the routing call. This is one of the recurring gap patterns. Once fixed, routing accuracy can be measured directly via `evaluateRouting()` against the `AiTrace.agentTypeRouted` column.

See `guides/16-observability.md §4`.

---

## Implications

- `temperature: 0` and `max_tokens: 20` are required. Drift is **must-fix**.
- Routing using `modelChat` (70B) is **should-refactor** (cost).
- See `guides/02-coach-architecture.md §3`.
