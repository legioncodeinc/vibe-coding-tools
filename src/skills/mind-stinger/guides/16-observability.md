# 16: Observability

`AiTrace` schema, `traceAICall()` fire-and-forget, every-call-traced rule, the routing-call gap, the dashboard metrics, the LangFuse-not-built note.

> **Doc reference:** `library/knowledge/private/ai/observability-evaluation.md` is canonical.

---

## 1. The four dimensions measured

| Dimension | Question | Why it matters |
|---|---|---|
| **Retrieval quality** | Did we retrieve the right context? | Wrong context → wrong response regardless of LLM quality |
| **Generation quality** | Did the LLM produce a good coaching response? | Even perfect context can produce bad responses |
| **Routing accuracy** | Did the orchestrator select the correct agent? | Wrong agent = wrong persona + wrong specialized knowledge |
| **Sycophancy rate** | Is the coach challenging or just agreeing? | Agreement-only coaching does not produce growth |

---

## 2. The `AiTrace` Prisma model

```prisma
model AiTrace {
  id                   String   @id @default(cuid())
  tenantId             String
  userId               String
  sessionId            String
  traceType            String   // "chat_turn" | "routing" | "rag_retrieval" | "summarization"
  userQuery            String   // truncated at 500 chars
  agentTypeRouted      String
  routingReason        String?
  retrievedChunks      Json     // [{ text: truncated 500, score, contentType }]
  knowledgeChunks      Json
  retrievalLatencyMs   Int?
  composedPromptTokens Int?
  completionTokens     Int?
  llmLatencyMs         Int?
  modelUsed            String
  assistantResponse    String
  retrievalScore       Float?   // populated by eval worker
  faithfulnessScore    Float?   // populated by eval worker
  routingCorrect       Boolean? // populated by eval worker
  agreementScore       Float?   // populated by eval worker
  error                String?  // non-null on failed calls
  createdAt            DateTime @default(now())
}
```

`traceAICall()` writes one row fire-and-forget, never blocks or fails the caller.

---

## 3. `traceAICall()`: the only sanctioned path

```typescript
export async function traceAICall<T>(options: TraceOptions<T>): Promise<T>;

interface TraceOptions<T> {
  tenantId:           string;
  userId?:            string;
  sessionId?:         string;
  traceType:          "chat_turn" | "routing" | "rag_retrieval" | "summarization";
  model:              string;
  coachType?:         string;
  routingReason?:     string;
  userQuery?:         string;
  retrievedChunks?:   TraceChunk[];
  knowledgeChunks?:   TraceChunk[];
  retrievalLatencyMs?: number;
  call:               () => Promise<T>;
}
```

**Every LLM call is traced.** Untraced calls are **must-fix**. Even router calls. Even fire-and-forget calls.

The `call` function is the actual LLM request. `traceAICall` executes it, records latency, extracts token counts from the OpenAI response, and writes the trace row asynchronously.

### Required fields per trace type

| traceType | Required minimum |
|---|---|
| `chat_turn` | `tenantId`, `userId`, `sessionId`, `model`, `coachType`, `userQuery`, `assistantResponse` (filled by `traceAICall`) |
| `routing` | `tenantId`, `userId`, `sessionId`, `model`, `userQuery`, `agentTypeRouted` (filled post-call) |
| `rag_retrieval` | `tenantId`, `userId`, `model`, `userQuery`, `retrievedChunks`, `knowledgeChunks`, `retrievalLatencyMs` |
| `summarization` | `tenantId`, `userId`, `sessionId`, `model`, `userQuery: truncatedTranscript` |

---

## 4. The recurring tracing-gap patterns

1. **Routing call not traced** (`runOrchestrator()` doesn't wrap `routeToCoach()`).
2. **Tool-call second pass**: when the LLM calls `scrape_url` and a second LLM pass runs, BOTH passes must be traced.
3. **Onboarding agent calls**: verify `streamOnboardingChat()` wraps every LLM call.
4. **Matching call**: `runLLMMatching()` must trace.
5. **Eval worker calls**: `evaluateRetrievalPrecision`, `evaluateRouting`, summary generation; must trace (with `traceType: "summarization"` for summaries).

Each unflagged-and-unfixed gap is a **must-fix** at next observability audit.

---

## 5. Eval-worker-populated columns

These columns are populated asynchronously by eval workers, not at trace-write time:

| Column | Populated by | When |
|---|---|---|
| `retrievalScore` | `evaluateRetrievalPrecision()` | Async after trace write: on a sample (e.g., 10-25%) |
| `faithfulnessScore` | LLM-as-judge faithfulness eval | Same |
| `routingCorrect` | `evaluateRouting()` | Same |
| `agreementScore` | `computeAgreementRate()` | Async per-trace; cheap (regex, no LLM call) |

A trace row written without these columns is normal: they fill in later.

---

## 6. Dashboard metrics

### Real-time (every 5 min)

- Active sessions count
- Requests per minute
- LLM latency P50 / P95 / P99
- Qdrant query latency P50 / P95
- Error rate (failed LLM calls, `AiTrace.error IS NOT NULL`)
- OpenRouter credit balance (alert if < $20)

### Daily

- Total coaching sessions
- Unique active members
- Agent routing distribution (which coaches were used)
- Average session length (turn count)
- Compaction jobs completed vs. failed

### Weekly

- Retrieval precision (rolling avg `AiTrace.retrievalScore`)
- Routing accuracy (rolling avg `AiTrace.routingCorrect`)
- Agreement rate trend (`AiTrace.agreementScore`)
- Top 5 routing failures (most common misroutes)

### Monthly

- Sycophancy drift per user cohort
- Token cost breakdown by agent type and tenant
- Cohere embedding API usage

---

## 7. LangFuse: NOT implemented

Per the doc:

> **Status: Not implemented.** As of April 2026, `traceAICall()` writes only to the `AiTrace` Prisma table. LangFuse is not in `api/package.json`. The integration is a planned enhancement.

If LangFuse is added:

1. `pnpm add langfuse` in `api/`.
2. Wrap `traceAICall()` to also emit a LangFuse trace.
3. Configure sampling (10% for automated eval, 2% for human eval).

LangFuse does NOT replace `AiTrace`: it provides a UI layer over the same data.

A push to add LangFuse requires the substitution policy (`guides/01-stack-enforcement.md §2`).

---

## 8. AiTrace investigation pattern

When asked to investigate (low retrieval, bad routing, sycophancy spike, latency):

1. **Define the window.** Last 24h? Last week? Specific incident time?
2. **Pull the relevant traces**: filter by `tenantId`, `traceType`, `createdAt` window.
3. **Aggregate by dimension**: coach type, model, time-of-day, retrieval-score bucket.
4. **Find the inflection**: when did the metric change? Correlate with `PromptVersion.createdAt`, deploys, model slot changes.
5. **Sample failing rows**: read 5-10 worst-scored traces in detail. Look for patterns (specific topic, specific user segment).
6. **Hypothesize**: propose 1-2 causes. Prioritize the falsifiable one.
7. **Test the hypothesis**: A/B if possible (one prompt vs. another); otherwise a targeted code change with measurement before/after.
8. **Document in `library/requirements/reports/ai/<date>-trace-investigation.md`**: see `examples/03-aitrace-investigation-low-retrieval.md`.

---

## 9. Token retention and PII

`AiTrace.userQuery` is truncated at 500 chars. `assistantResponse` is full. Retention is 30 days active (archive planned).

**PII concern:** retrieval contexts and responses can include PII (member names, business details, sensitive coaching topics). The retention is acceptable for the current product but is a topic for `security-worker-bee` to audit (see `guides/05-prompt-versioning.md` for compliance considerations).

---

## 10. Common findings

| Finding | Severity | Reference |
|---|---|---|
| LLM call not wrapped in `traceAICall()` | must-fix | this guide §3 |
| Routing call not traced (`runOrchestrator()` gap) | must-fix (recurring gap pattern) | this guide §4 |
| `traceType` value not in the four-value enum | must-fix | this guide §3 |
| `retrievalLatencyMs` missing on `rag_retrieval` trace | must-fix | this guide §3 |
| Token counts missing on a trace (extraction failed) | should-refactor | this guide §3 |
| Eval worker writing `retrievalScore` synchronously (blocking the user) | must-fix | this guide §5 |
| LangFuse adopted without substitution policy | must-fix | this guide §7 |
| `AiTrace` rows being deleted < 30 days | must-fix | this guide §9 |
| Trace `userQuery` not truncated at 500 chars (full PII stored) | should-refactor | this guide §9 (handoff to security) |
| Tool-call second pass not traced | must-fix | this guide §4 |
