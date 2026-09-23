# Generic Eval Platforms (DEMOTED: the deploying product uses homegrown ai-eval.ts + AiTrace)

> **Status:** Demoted reference. the deploying product uses a homegrown eval suite in `lib/ai-eval.ts` (`evaluateRetrievalPrecision`, `evaluateRouting`, `computeAgreementRate`) writing to `AiTrace` Postgres.

---

## Why the deploying product's homegrown eval is canonical

1. **First-class integration with `AiTrace`**: eval scores are columns on the same trace row, no join across systems.
2. **Coaching-specific dimensions**: `agreementScore` is calibrated for sycophancy detection in coaching, not generic faithfulness.
3. **`fast` model (Llama 3.1 8B) as judge**: already in the stack; no new vendor relationship.
4. **No additional service to run**: Postgres + the application; same observability discipline as the rest.

LangFuse is a planned enhancement (a UI layer over `AiTrace`) but **not built**. See `guides/16-observability.md §7`.

---

## The alternatives (for context)

### Langfuse (open-source)

- **Pitch:** Open-source LLM observability + eval + prompt management.
- **Pros vs homegrown:** Trace visualization UI; eval pipeline primitives; sample-and-eval workflows; self-hostable.
- **Cons vs homegrown:** Adds a service; pulls trace data out of `AiTrace` into Langfuse's own store (or dual-writes); duplicates `PromptVersion` features.
- **When it'd be the right call:** Engineering team would benefit from a better trace-visualization UI more than they'd lose from the data split. **Currently planned but not built.**

### Braintrust (commercial)

- **Pitch:** Eval-first platform with experiments, prompt comparison, golden datasets.
- **Pros vs homegrown:** Strongest experiment / A-B / golden-set tooling on the market.
- **Cons vs homegrown:** Commercial; duplicates work the deploying product does in `ai-eval.ts`; integration cost.
- **When it'd be the right call:** Heavy A/B-testing culture; budget for eval-platform vendor.

### RAGAS

- **Pitch:** Open-source RAG eval framework: faithfulness, answer relevance, context relevance.
- **Pros vs homegrown:** Pre-built metrics; widely cited in RAG literature.
- **Cons vs homegrown:** Python-only (the deploying product is TS); metric implementations are configurable but not coaching-specific; would require running a Python service.
- **When it'd be the right call:** Python-first AI codebase needing fast eval-metric coverage.

### DeepEval

- **Pitch:** Pytest-style LLM eval. Open-source.
- **Pros vs homegrown:** Pytest integration; extensive metric library.
- **Cons vs homegrown:** Python-only; designed for pytest workflows.
- **When it'd be the right call:** Python-first AI codebase, pytest culture.

### Helicone (eval mode)

- **Pitch:** Lightweight gateway + eval. Less heavyweight than Langfuse/Braintrust.
- **Pros vs homegrown:** Bundled with the gateway proxy.
- **Cons vs homegrown:** Couples gateway and eval; vendor lock-in.
- **When it'd be the right call:** Want a gateway + obs + eval bundle in one vendor.

### TruLens

- **Pitch:** Open-source eval for LLM apps. Strong on RAG metrics.
- **Pros vs homegrown:** Pre-built metric implementations.
- **Cons vs homegrown:** Python-first; another service to integrate.

### Arize AI Phoenix

- **Pitch:** Open-source observability + eval; strong on production trace analysis.
- **Pros vs homegrown:** Production-grade tracing; ML engineer-friendly.
- **Cons vs homegrown:** Heavyweight setup; designed for broader ML workflows.

---

## What the deploying product's eval suite covers and what it doesn't

| Coverage | homegrown | Frameworks above |
|---|---|---|
| Retrieval precision (LLM-as-judge) | ✓ `evaluateRetrievalPrecision` | ✓ |
| Routing correctness | ✓ `evaluateRouting` | partial (custom metric) |
| Sycophancy / agreement rate | ✓ `computeAgreementRate` | rare |
| Faithfulness | partial (column exists, judge prompt TBD) | ✓ |
| Answer relevance | (rolled into rubric) | ✓ |
| Tool-call correctness | not built | ✓ (some) |
| Toxicity / bias | not built | ✓ |
| Cost per task | partial (token tracking in AiTrace) | ✓ |
| Trace visualization UI | none (raw SQL) | ✓ |
| Golden dataset versioning | manual (jsonl in repo) | ✓ |
| Sample-and-eval workflow | manual | ✓ |

The gap most worth filling: **trace visualization UI**. LangFuse integration (planned, not built) would be the way.

---

## What WOULDN'T add value if adopted

- **Generic faithfulness frameworks**: the deploying product's coaching-specific rubric (5 dimensions) does what the LLM-coaching workflow needs; generic faithfulness is too narrow.
- **Generic agreement-rate detectors**: sycophancy in coaching is a domain-specific pattern; the regex-based `computeAgreementRate()` is calibrated for the deploying product's voice.

---

## Migration path if substitution is approved

For LangFuse specifically (the most likely path because it's planned):

1. `pnpm add langfuse` in `api/`.
2. Wrap `traceAICall()` to also emit a LangFuse trace.
3. Configure sampling: 10% for automated eval, 2% for human eval.
4. Continue writing to `AiTrace` (no replacement).
5. Add LangFuse dashboard URLs to the observability runbook.

LangFuse complements `AiTrace`; it doesn't replace it.
