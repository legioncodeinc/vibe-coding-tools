# open-questions.md: mind-stinger

Things mind-worker-bee doesn't know definitively. Each is paired with the question we'd answer it with.

---

## 1. The 500-char chunk size lift potential

**Question:** Would migrating from 500-char chunks (~125 tokens) to ~2000-char chunks (~512 tokens) lift `evaluateRetrievalPrecision()` mean enough to justify re-indexing?

**How we'd answer:** Re-index a sample tenant's `knowledge-{tenantId}` at ~2000 chars; A/B against current 500-char index over 2 weeks; compare retrieval precision means.

**Until answered:** stay at 500-char chunks (current canonical).

---

## 2. The routing-call latency cost vs accuracy gain at 70B

**Question:** If `routeToCoach()` ran on `Llama 3.3 70B` instead of `Llama 3.1 8B`, would routing accuracy lift > 2% (worth the 10× cost)?

**How we'd answer:** Run `evaluateRouting()` on 1000-case golden set, both models, same prompt. Compare accuracy.

**Until answered:** stay on 8B (current canonical, target > 90% achieved).

---

## 3. Cohere `rerank-v3.5` vs Voyage `rerank-2` on the deploying product corpus

**Question:** Does Voyage's reranker outperform Cohere's on the deploying product's coaching corpus?

**How we'd answer:** A/B retrieval precision over 2 weeks with both rerankers. Same Qdrant ANN candidates; different rerank.

**Until answered:** Cohere rerank-v3.5 is canonical (paired with Cohere embeddings).

---

## 4. GraphRAG lift on the deploying product's specific coaching domain

**Question:** Does GraphRAG provide a measurable lift on the deploying product's coaching context vs the 20-25% claimed in regulated-vertical case studies?

**How we'd answer:** Per `examples/05-graphrag-enable-for-new-tenant.md`: A/B vector vs vector+graph on a flagship tenant for 2 weeks; measure cross-session-connection rubric and retrieval precision.

**Until answered:** GraphRAG is gated. Enable per-tenant only with the eval-evidence procedure in the example.

---

## 5. Anthropic contextual retrieval on the deploying product's knowledge corpus

**Question:** Would prepending LLM-generated context to each chunk before embedding lift retrieval precision on the deploying product's methodology / coach knowledge docs?

**How we'd answer:** Implement contextualization at ingestion; re-index a sample; eval against current.

**Until answered:** the deploying product prepends document title (lighter version); not adopting full contextual retrieval.

---

## 6. The optimal 40-turn compaction threshold for coaching

**Question:** Is 40 turns the sweet spot, or would 30 / 50 / 60 produce better outcomes?

**How we'd answer:** A/B at different thresholds; measure (a) coaching rubric scores post-compaction, (b) "lost in the middle" failures, (c) compaction cost per session.

**Until answered:** 40 is canonical. Calibrated for ~6,000-10,000 token raw history fitting alongside system prompt + knowledge.

---

## 7. Sycophancy regression after model upgrades

**Question:** When OpenRouter swaps the underlying provider for a model slot, does sycophancy creep without prompt change?

**How we'd answer:** Track `agreementScore` over each provider transition (visible in OpenRouter logs).

**Until answered:** monitor `agreementScore` trends; if it rises without `PromptVersion` writes, suspect provider swap.

---

## 8. Multimodal embedding for visual similarity

**Question:** Would adopting a CLIP-style multimodal embedder improve retrieval of visually similar content (whiteboard photos with similar diagrams, slide screenshots)?

**How we'd answer:** Index a sample with both text-of-vision-description (current) and CLIP visual embedding; eval retrieval on visual-similarity queries.

**Until answered:** text-embedding-of-vision-description is canonical.

---

## 9. Module path migration to Qdrant: measured lift

**Question:** Will migrating `buildCoachingPrompt()` (module path) from Postgres-only to Qdrant + rerank actually lift coaching quality?

**How we'd answer:** A/B for one module type (e.g., `goals`), Postgres-only vs Qdrant, for 2 weeks; compare retrieval precision + coaching rubric.

**Until answered:** module path RAG gap is one of the recurring gap patterns. Migration is must-fix per `guides/20-common-failure-modes.md §1.4`. Eval lift is the validation step, not the precondition.

---

## 10. Calibration drift cadence

**Question:** How often does `evaluateRetrievalPrecision()` judge calibration (Llama 3.1 8B as judge) drift below 0.7 kappa?

**How we'd answer:** Run quarterly calibration passes; track kappa over time.

**Until answered:** assume quarterly is sufficient; re-calibrate on `modelFast` slot change OR if eval scores trend without obvious cause.
