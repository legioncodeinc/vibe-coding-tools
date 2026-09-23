# Template: LLM-as-Judge Eval Rubric

Canonical shape for an LLM-as-judge prompt that returns `{ score, reasoning }`. Use for retrieval precision, faithfulness, routing accuracy, or any custom eval.

> **Source-of-truth:** `library/knowledge/private/ai/observability-evaluation.md §3` + `guides/17-evaluation-discipline.md`.

---

## 1. The judge prompt shape

```
SYSTEM:
You are a {dimension} judge. You evaluate whether the {input thing} {meets the criterion}.
Return ONLY valid JSON of the form:
{
  "score":     <0.0-1.0 float>,
  "reasoning": "<one to three sentences explaining the score>"
}

USER:
Criterion: {what we're judging}

{Input data}:
{input}

{Optional: examples}
- Score 1.0: {example of perfect}
- Score 0.5: {example of borderline}
- Score 0.0: {example of clear failure}

Evaluate now. Return only JSON.
```

### Required:

- **One dimension per judge.** Don't judge "retrieval AND faithfulness AND tone" in one call: calibrate separately.
- **0.0-1.0 score range.** Don't use 0-10, 1-5, A/B/C, etc. Standardizes thresholds.
- **`reasoning` field.** Required for human spot-checks. The judge must justify itself.
- **Calibration anchors (1.0 / 0.5 / 0.0 examples)** when possible: improves judge consistency.
- **`response_format: json_object`** in the LLM call, or parse-and-retry on parse failure.

---

## 2. Worked example: retrieval precision

```typescript
const RETRIEVAL_PRECISION_JUDGE_SYSTEM = `You are a retrieval-quality judge. You evaluate whether the retrieved chunks are relevant to the user's query.

Return ONLY valid JSON of the form:
{
  "score":     <0.0-1.0 float>,
  "reasoning": "<one to three sentences>"
}`;

const buildJudgePrompt = (query: string, chunks: { text: string; score: number }[]) => `Criterion: How many of the retrieved chunks are directly relevant to answering the user's query?

User query:
${query}

Retrieved chunks (ranked by similarity):
${chunks.map((c, i) => `${i + 1}. (sim=${c.score.toFixed(3)}) ${c.text.slice(0, 300)}`).join("\n\n")}

Calibration:
- 1.0: All 5 chunks are directly on-topic.
- 0.7: 3-4 chunks are relevant; 1-2 are tangential or off-topic.
- 0.4: 2 chunks are relevant; the rest are off-topic.
- 0.0: No chunk is relevant.

Evaluate now. Return only JSON.`;
```

### Targets

- **> 0.7** healthy.
- **0.4-0.7** watch list.
- **< 0.4** sustained over 100 traces → **alert** (per `guides/17-evaluation-discipline.md §1`).

---

## 3. Worked example: routing correctness

```typescript
const ROUTING_JUDGE_SYSTEM = `You are a routing-correctness judge. You evaluate whether the selected coach is the best fit for the user's query.

Return ONLY valid JSON of the form:
{
  "correct":     <true|false>,
  "better_route": <"coach_type" | null>,
  "reasoning":    "<one sentence>"
}`;

const buildRoutingJudgePrompt = (query: string, routedCoach: string, memberLevel: number) => `Criterion: Was the routing decision correct?

Coach types and their domains:
- main_community:  general business / referral / networking
- onboarding:      profile setup / getting started
- level_1:         foundations (members at Level 1)
- level_2:         scaling (members at Level 2)
- level_3:         mastery (members at Level 3)
- offer_doc:       offer definition / one-sentence referrability
- special_gift_strategist: distinctive value / personal brand

User query (member at Level ${memberLevel}):
${query}

Routed coach: ${routedCoach}

Evaluate now. Return only JSON.`;
```

**Target:** > 90% routing accuracy (per `guides/17-evaluation-discipline.md §1`).

---

## 4. Worked example: faithfulness (RAG hallucination)

```typescript
const FAITHFULNESS_JUDGE_SYSTEM = `You are a faithfulness judge. You evaluate whether the response is supported by the retrieved context, or whether the model hallucinated beyond it.

Return ONLY valid JSON of the form:
{
  "score":     <0.0-1.0 float>,
  "reasoning": "<one to three sentences citing which part is supported / unsupported>"
}`;

const buildFaithfulnessPrompt = (response: string, contextChunks: { text: string }[]) => `Criterion: How well is the response supported by the retrieved context?

Retrieved context:
${contextChunks.map((c, i) => `[${i + 1}] ${c.text.slice(0, 400)}`).join("\n\n")}

Response:
${response}

Calibration:
- 1.0: Every claim in the response is directly supported by the context.
- 0.7: Most claims supported; minor claims slightly extrapolated.
- 0.4: Some claims unsupported.
- 0.0: Major claims invented.

Evaluate now. Return only JSON.`;
```

---

## 5. Calibration discipline

Per `guides/17-evaluation-discipline.md §3`:

1. **Sample 50-100 cases** from a golden set.
2. **Have a human label** them (pass/fail or 0-1).
3. **Run the judge** on the same set.
4. **Measure agreement** (Cohen's kappa or simple accuracy).
5. **If agreement < 0.7**, refine the judge prompt or switch judge models.
6. **Re-calibrate quarterly** or when the judge model changes.

**Calibration is not optional.** Uncalibrated judges produce biased findings.

---

## 6. Required: every judge call is traced

```typescript
return traceAICall({
  tenantId, userId,
  traceType: "rag_retrieval",   // or appropriate type
  model:     fastModel,
  userQuery: params.userQuery,
  retrievedChunks: params.retrievedChunks,
  call: async () => { /* judge call */ },
});
```

See `templates/ai-trace-record.ts` example 3.

---

## 7. Anti-patterns

| Anti-pattern | Why bad |
|---|---|
| Multi-dimension judge ("score retrieval, faithfulness, AND tone") | Each dimension calibrates differently |
| 0-10 score (instead of 0.0-1.0) | Diverges from the rest of the eval suite |
| No `reasoning` field | Cannot human-audit the judge |
| `temperature` > 0.2 | Judge output should be near-deterministic |
| `response_format` not `json_object` | Parse failures inflate variance |
| Judge prompt copied from a vendor blog without calibration | Vendor's rubric ≠ the deploying product's rubric |
| Judge model swapped without recalibration | Different model = different bias |
