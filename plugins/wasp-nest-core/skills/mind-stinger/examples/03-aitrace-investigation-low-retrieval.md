# Example 03: AiTrace Investigation: Low Retrieval Precision

The investigation pattern when `evaluateRetrievalPrecision()` dips below 0.4.

> **Reference guides:** `guides/16-observability.md §8`, `guides/17-evaluation-discipline.md`, `guides/08-rag-strategy.md`.

---

## Trigger

Operations alerts:

> 🚨 Tenant `clx9vy200012vu8kj0` retrieval precision dropped to 0.32 mean over last 24 hours (sample size 318). Threshold: 0.4.

---

## Step 1: Define the window

The alert time is the inflection. Pull traces:

- 7 days BEFORE the alert (baseline window).
- 24 hours AROUND the alert (incident window).

```sql
-- Baseline
SELECT * FROM "AiTrace"
WHERE tenant_id = 'clx9vy200012vu8kj0'
  AND created_at BETWEEN '2026-04-17' AND '2026-04-24'
  AND retrieval_score IS NOT NULL;

-- Incident
SELECT * FROM "AiTrace"
WHERE tenant_id = 'clx9vy200012vu8kj0'
  AND created_at BETWEEN '2026-04-24 12:00' AND '2026-04-25 12:00'
  AND retrieval_score IS NOT NULL;
```

---

## Step 2: Aggregate

| Window | N | Mean | P25 | P05 |
|---|---|---|---|---|
| Baseline (7d before) | 2,134 | 0.68 | 0.51 | 0.32 |
| Incident (last 24h)  |   318 | 0.32 | 0.18 | 0.06 |

Massive drop. The 0.06 P05 says some traces retrieved nothing relevant.

Per-coach breakdown:

| Coach | Baseline | Incident | Δ |
|---|---|---|---|
| `main_community` | 0.71 | 0.30 | -0.41 |
| `level_1` | 0.65 | 0.33 | -0.32 |
| `level_2` | 0.62 | 0.31 | -0.31 |
| `offer_doc` | 0.72 | 0.78 | +0.06 |

`offer_doc` is fine. The drop is on coaches that use Qdrant retrieval. `offer_doc` typically uses pinned docs (`AiCoachConfig.knowledgeBaseId` JSON array), bypassing Qdrant.

**Hypothesis 1:** Qdrant is returning bad results.
**Hypothesis 2:** A prompt change shifted what users ask, and the corpus doesn't cover it.
**Hypothesis 3:** A code change broke the retrieval pipeline.

---

## Step 3: Find the inflection

Correlate with `PromptVersion` and deploys:

```sql
SELECT * FROM "PromptVersion"
WHERE tenant_id = 'clx9vy200012vu8kj0'
  AND created_at BETWEEN '2026-04-23' AND '2026-04-25'
ORDER BY created_at;
```

No `PromptVersion` writes in the window. **Hypothesis 2 weakened.**

Check deploy log: deploy at 2026-04-24 11:47 UTC, 13 minutes before the alert window. Diff:

```diff
- const KNOWLEDGE_CANDIDATES = 20;
+ const KNOWLEDGE_CANDIDATES = 5;
- const KNOWLEDGE_TOP_N      = 5;
+ const KNOWLEDGE_TOP_N      = 3;
```

**Found.** A contributor "tuned" the constants to reduce token usage without doc update or eval pass. Going from 20 candidates to 5 means the rerank step has only 5 to choose from, and rerank's value comes from selecting from a wider candidate set.

Drift from `guides/08-rag-strategy.md §5` (canonical: 20 / 5).

---

## Step 4: Sample worst traces (confirm)

Pull 10 traces with lowest `retrievalScore` from the incident window. Read each:

> Trace `ai_t_2026_0424_47b1`: query "what's a good way to find my first 3 referral partners". 3 chunks returned, all about offer pricing. Score 0.06. Off-topic.

> Trace `ai_t_2026_0424_91a3`: query "how do I structure my Dream 100 list". 3 chunks returned, only 1 about Dream 100, 2 about onboarding. Score 0.16.

Pattern matches Hypothesis 3: too few candidates to rerank → reranker can't recover from a narrow ANN result.

---

## Step 5: Hypothesis: confirmed

`KNOWLEDGE_CANDIDATES = 5` and `KNOWLEDGE_TOP_N = 3` is the cause.

The contributor was likely trying to reduce token spend on the system prompt. The optimization is upside-down: ANN candidates are cheap (Qdrant); the 20→5 rerank pass is what gives precision; reducing top-N from 5 to 3 trims context but only AFTER rerank has done its job.

---

## Step 6: Remediation

```diff
// lib/knowledge-context.ts

-const KNOWLEDGE_CANDIDATES = 5;
+const KNOWLEDGE_CANDIDATES = 20;
-const KNOWLEDGE_TOP_N      = 3;
+const KNOWLEDGE_TOP_N      = 5;
```

PR opened, reverted to canonical values. Eval suite re-run on golden set: retrieval precision back to 0.69 (close to baseline).

Deploy. Watch the 4 hours after deploy.

---

## Step 7: Verify

| Window | N | Mean |
|---|---|---|
| Baseline | 2,134 | 0.68 |
| Incident | 318 | 0.32 |
| Post-fix (4h) | 89 | 0.66 |

Recovered. ✓

---

## Step 8: Doc update + post-mortem

Update `library/knowledge/private/ai/rag-vector-strategy.md §6` to add:

> **The 20/5 constants are calibrated.** Reducing `KNOWLEDGE_CANDIDATES` below 20 narrows the rerank input set and degrades precision faster than expected. Any change requires a measured eval pass on the golden set with delta > 5%.

Post-mortem at `library/requirements/reports/ai/2026-04-25-incident-retrieval-drop.md`:

- **Cause:** undocumented constant tuning in `knowledge-context.ts`.
- **Detection:** automated alert at 0.32 mean (threshold 0.4).
- **Time to detection:** 13 minutes from deploy.
- **Time to remediation:** 47 minutes.
- **Recurrence prevention:** add `KNOWLEDGE_CANDIDATES` and `KNOWLEDGE_TOP_N` to the "do-not-tune-without-eval" constants list in `guides/00-principles.md §8`. Add a CI check: any PR touching these constants requires the golden eval suite to pass.

---

## Lessons (for future investigations)

1. **Always correlate with deploys + `PromptVersion` writes.** The cause is usually a recent change.
2. **Sample worst traces, not random.** The pattern shows up at the tail.
3. **Eval lift > intuition.** "Reducing candidates saves tokens" feels right; the eval said it cost precision 2× the token savings.
4. **Document the calibrated constants** in the source-of-truth doc so future contributors know they're load-bearing.
