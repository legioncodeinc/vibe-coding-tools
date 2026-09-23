# Hosted provider: Voyage AI

Grounded in `references/research/raw/voyageai--text-embeddings-model-choices.md`, `references/research/raw/voyageai--flexible-dimensions-and-quantization.md`, and `references/research/raw/voyageai--pricing.md`.

## Models

| Model | Context (tokens) | Dimension options | Price/M tokens | Notes |
|---|---|---|---|---|
| `voyage-4-large` | 32,000 | 256 / 512 / 1024 (default) / 2048 | $0.12 | Best general-purpose + multilingual retrieval quality |
| `voyage-4` | 32,000 | 256 / 512 / 1024 (default) / 2048 | $0.06 | General-purpose + multilingual |
| `voyage-4-lite` | 32,000 | 256 / 512 / 1024 (default) / 2048 | $0.02 | Optimized for latency and cost |
| `voyage-code-4` | 32,000 | 256 / 512 / 1024 (default) / 2048 | $0.12 | Optimized for code retrieval / coding-agent use cases |
| `voyage-finance-2` / `voyage-law-2` | 32,000 / 16,000 | 1024 fixed | $0.12 | Domain-tuned; smaller free tier (50M vs 200M tokens) |

All voyage-4-series models are cross-compatible (comparable in the same vector space). First 200M tokens/account free for the voyage-4 family and `voyage-code-4`.

## Open-weight option: `voyage-4-nano`

Voyage publishes `voyage-4-nano` as an open-weight model on Hugging Face, the same voyage-4 vector space, runnable locally instead of via the hosted API. This is the one path that lets a project use Voyage's embedding space without a per-call API dependency, worth knowing when a workload starts hosted and later needs to move some volume to self-hosted per `guides/00-selection-matrix.md`'s escape-hatch reasoning, without changing vector spaces.

## `input_type`: recommended, not required

Optional parameter (`query` or `document`, default `None`). When set, Voyage prepends a fixed instructional prefix before embedding:

- Query: `"Represent the query for retrieving supporting documents: "`
- Document: `"Represent the document for retrieval: "`

Embeddings generated with and without `input_type` are technically comparable, but Voyage's own guidance is that specifying it materially improves retrieval accuracy. Because it's optional rather than required (unlike Cohere), the discipline of applying it consistently between the write and query paths rests on the calling code, not the API; treat an inconsistent or missing `input_type` between write and query paths as a should-refactor finding at minimum, same class of risk as Cohere's `input_type` mismatch even though Voyage won't reject the call.

## Dimension and quantization

`output_dimension` (voyage-4 family, `voyage-code-3`, `voyage-3-large`, `voyage-3.5` family): `2048`, `1024` (default), `512`, `256`, via Matryoshka Representation Learning. `output_dtype`: `float` (default), `int8`, `uint8`, `binary`, `ubinary`. Binary/ubinary pack 8 quantized single-bit values per byte, a returned array 1/8 the nominal dimension, using an offset-binary encoding for the signed `binary` variant. Combined with dimension truncation, quantization can cut storage 4x (int8) to 32x (binary) versus float32 at full width; see `references/research/raw/voyageai--flexible-dimensions-and-quantization.md` for the exact packing mechanics if implementing manual quantization on already-generated vectors.

## Request limits

Up to 1,000 texts per call; total token cap per call varies by model (1M for `voyage-4-lite`; 320K for `voyage-4`; 120K for `voyage-4-large`/`voyage-code-4`/domain models). `truncation` (bool, default `True`) controls whether an over-length input is silently truncated or raises an error.

## Pricing and batch discount

Token-based, billed per thousand/million tokens (see the table above). A **Batch API** offers a 12-hour completion window at a 33% discount versus the synchronous endpoint; free per-account token credits do not apply to batch usage (batch tokens always bill at the discounted rate). Use it for backfills and model-swap re-embeds per `guides/01-batching.md`.

## When to reach for this guide

Compare against `guides/hosted-01-openai.md` when retrieval quality on this project's actual data matters more than call-shape simplicity (Voyage's domain-tuned models, `voyage-code-4`, `voyage-finance-2`, `voyage-law-2`, have no OpenAI equivalent), or when cost at high volume matters (Voyage's lite tier and OpenAI's small model are comparably priced; verify against current pricing pages before committing, per the freshness caveat in `references/research/distilled-embeddings-runtime.md`). Also the natural choice if an eventual move to self-hosted, without a vector-space migration, is a design goal (see `voyage-4-nano` above).
