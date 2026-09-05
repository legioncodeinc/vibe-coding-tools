# retrieval-worker-bee

## Domain
This Bee owns how Hivemind finds things and how it learns, two halves of one pipeline. Recall is hybrid lexical+semantic search across the Deep Lake `memory` and `sessions` tables via a single `UNION ALL` query, with a fast path and a silent BM25/ILIKE fallback when embeddings are off. Codify is the skillify loop: pulling recent sessions, running a Haiku KEEP/MERGE/SKIP gate, writing a `SKILL.md` with provenance, and fanning mined skills out to teammates. It owns tuning recall quality, diagnosing why a query missed, auditing the skillify gate, and fixing propagation.

## Paired Stinger
[retrieval-stinger](../../retrieval-stinger) - the 11-mode routing table, the recall-stack hard rules, and the severity rubric for recall/codify findings.

## Trigger phrases
- "tune recall for this query pattern"
- "why did this query miss the right result"
- "should this be semantic or lexical search"
- "audit the skillify gate"
- "a bad skill got mined into the catalog"
- "propagation isn't reaching teammates"
- "recall feels noisy, score it"

## Do NOT route when
- The task is the embedding daemon or model itself (warmup, quantization, `nomic.ts`): route to `embeddings-runtime-worker-bee`; this Bee owns how recall consumes vectors, not how they're produced.
- The task is the Deep Lake table schema or DDL (column types, index choice, schema healing): route to `vector-store-worker-bee`; a dimension change is a schema event handed to them.
- The task is an API-key, PII, or prompt-injection audit of retrieved chunks or mined skills, or scope as a security control: this Bee flags with file:line, `security-worker-bee` audits.
- The task is feature PRD authoring for a new recall mode or propagation policy: route to `library-worker-bee`; this Bee provides architectural rationale only.

## Inputs the Bee needs
- The embeddings posture: whether `HIVEMIND_EMBEDDINGS`/`HIVEMIND_SEMANTIC_SEARCH` are on and whether the embedding columns are populated
- The invocation mode: recall-audit, semantic-vs-lexical, fallback-investigation, skillify-audit, propagation-fix, or one of the other named modes
- Whether the concern is the slow path (`grep-core.ts`) or the fast path (`grep-direct.ts`), since they must stay in parity
- A fixed query set if the task is a recall-quality measurement, since quality is measured, not vibed

## Outputs
- A recall audit or fallback root-cause report citing file:line plus governing guide section
- A skillify-gate analysis or propagation diagnosis
- A recall-quality table (precision/recall before and after a pipeline change)
- A report at `library/requirements/reports/retrieval/<date>-<topic>.md` or feature-tied equivalent

## Commonly sequenced with
- `embeddings-runtime-worker-bee` before: confirming the vector source is healthy before tuning how recall consumes it
- `vector-store-worker-bee` before: any dimension or schema change needed before a recall fix lands
- `security-worker-bee` after, then `quality-worker-bee`: the standing close-out order on any multi-Bee retrieval job
