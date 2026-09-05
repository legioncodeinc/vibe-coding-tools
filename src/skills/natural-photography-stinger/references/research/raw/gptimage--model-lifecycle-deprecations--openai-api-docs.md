# Deprecations — OpenAI API (image models, as of Aug 2026)
- URL: https://developers.openai.com/api/docs/deprecations
- Fetched: 2026-08-17
- Source type: official-docs

Definitive answer to "which image models are actually available and for how
long."

## Upcoming: GPT Image model deprecations

**Announced 2026-06-02. Shutdown 2026-12-01.**

| Model | Replacement |
|---|---|
| `gpt-image-1-mini` | `gpt-image-2` |
| `gpt-image-1.5` | `gpt-image-2` |
| `chatgpt-image-latest` | `gpt-image-2` |

Implication: as of **2026-08-17**, three of the four GPT Image identifiers are
already on a shutdown clock with ~3.5 months left. **`gpt-image-2` is the only
image model with no announced end-of-life.**

Second implication for photorealism work: `input_fidelity` is supported only on
the models being retired (`gpt-image-1.5`, `gpt-image-1`, and the minis) and is
**disabled on `gpt-image-2`**. So the explicit likeness-fidelity knob disappears
from the platform on 2026-12-01; after that, reference fidelity must be carried
entirely by multi-image inputs on `/v1/images/edits` plus explicit
preserve-list prompting.

Note: `gpt-image-1` itself is not listed in the June 2026 batch, but the
cookbook labels it "Compatibility only."

## Past: DALL·E model snapshots

**Announced 2025-11-14. Shutdown 2026-05-12.** (older than 12 months at time of
announcement — labelled accordingly)

| Model | Replacement |
|---|---|
| `dall-e-2` | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |
| `dall-e-3` | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |

DALL·E 2 and 3 were **shut down on 2026-05-12**. Any prompting advice that
relies on DALL·E-3's `style: "natural"` / `"vivid"` parameter, or on DALL·E-2
`/v1/images/variations`, is dead. GPT Image models have no `style` parameter.

## Legacy endpoints (historical, older than 12 months)

**Announced 2023-07-06, shut down 2024-01-04:** `/v1/edits` → `/v1/chat/completions`.

No separate deprecation entries exist for `/v1/images/variations` or
`/v1/images/edits`, but `variations` was DALL·E-2-only and is therefore
effectively dead with the DALL·E shutdown.
