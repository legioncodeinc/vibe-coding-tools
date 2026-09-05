# 13: Context Continuity

The most critical AI architecture guide. Session state machine, 40-turn compaction with Valkey lock, `reconstructSession()`, TTL discipline.

> **Doc reference:** `library/knowledge/private/ai/context-continuity.md` is canonical and the most load-bearing of the 15 docs. Every feature decision must be evaluated against: *will this cause the coach to lose context?*

---

## 1. The seven ways context is lost

| Loss vector | When | Consequence | Prevention |
|---|---|---|---|
| Context window overflow | Full history exceeds token limit | LLM silently truncates oldest turns | Sliding window + episodic retrieval |
| Session cold restart | User returns after Valkey TTL (2h) | Working memory gone | `reconstructSession()` from Qdrant |
| Summary hallucination | LLM invents facts during compression | False history in future sessions | Structured JSON extraction before narrative |
| Compaction data loss | Compaction job fails mid-run | Irreversible content loss | Valkey lock + retry up to 3 times |
| Agent switch confusion | Different agent lacks previous agent's context | Jarring topic reset | All agents receive same context packet |
| Sub-agent blank slate | Orchestrator routes without passing context | Agent asks member to repeat | `assembleContextPacket()` built before routing |
| Cross-session semantic drift | Goals change but facts aren't updated | Contradictory advice | Consolidation marks episodic memories as `consolidated` |

---

## 2. Session lifecycle state machine

Every `AiChatSession` has a `status` field driven by events:

```
(new session)
    │
    ▼
  ACTIVE
  - Valkey working memory live
  - Full turns in memory
  - appendTurnAndMaybeCompact() on each turn
    │ 40-turn threshold reached
    ▼
  COMPACTING          ◄─── turns still accepted while compacting
  - Async compaction running in background
  - Valkey lock: compact:lock:{sessionId}
    │ compaction writes summary to Qdrant
    ▼
  SUMMARIZED
  - Turns 1-30 replaced by summary turn in Valkey
  - Turns 31-40 retained
  - User continues without interruption
    │ Valkey TTL expires (2h inactivity)
    ▼
  RESUMED
  - Working memory expired
  - reconstructSession() builds context from Postgres + Qdrant
  - New working memory seeded with reconstructed context
    │ reconstruction complete + first new message processed
    ▼
  ACTIVE (continues normally)
```

### State transitions

| From | To | Trigger |
|---|---|---|
| (new) | `active` | First message creates session |
| `active` | `compacting` | Turn count in Valkey reaches 40 |
| `compacting` | `summarized` | `indexSessionSummary()` completes |
| `compacting` | `active` | All retries failed (error recovery) |
| `summarized` | `active` | User sends next message within TTL |
| `active` / `summarized` | `resumed` | Valkey TTL expires; user sends message |
| `resumed` | `active` | `reconstructSession()` complete; new turn processed |

---

## 3. The 40-turn compaction trigger

### Why 40

40 turns (~20 exchanges) ≈ 6,000-10,000 tokens of raw history. Fits comfortably alongside system prompt + knowledge in any current model's context window. Beyond 40 turns, "lost in the middle" degradation begins.

### Implementation

```typescript
const COMPACTION_THRESHOLD = 40;
const RETAIN_AFTER_COMPACT = 10;
const COMPACT_TURNS        = 30;
const WATCHDOG_TTL         = 600;  // 10-minute Valkey lock
const MAX_RETRIES          = 3;

export async function appendTurnAndMaybeCompact(
  sessionId: string,
  turn: SessionTurn,
  ctx: CompactionContext,   // { tenantId, userId, agentType }
): Promise<void> {
  await appendTurn(sessionId, turn);
  const turns = await getWorkingMemory(sessionId);
  if (turns && turns.length >= COMPACTION_THRESHOLD) {
    void triggerCompaction(sessionId, turns, ctx).catch(console.error);
  }
}
```

The compaction job is a `void` promise: runs in background without blocking the user's response.

### Atomicity guarantee

Watchdog lock `compact:lock:{sessionId}` with `NX` flag prevents concurrent compaction. If the job fails all 3 retries:

- `AiChatSession.status` reverts to `"active"`.
- Lock is released.
- Un-compacted turns remain in Valkey (no data loss).

**Adjusting `COMPACTION_THRESHOLD = 40` requires updating `library/knowledge/private/ai/context-continuity.md` and a measured eval pass.**

---

## 4. Compaction flow (detailed)

```
Turn 40 arrives
  ├── appendTurn() → accept and store normally (not blocked)
  └── triggerCompaction() fired asynchronously (fire-and-forget):
       1. Acquire Valkey lock: SET compact:lock:{sessionId} "1" EX 600 NX
          → skip if already locked (prevents double-compaction)
       2. Update AiChatSession.status = "compacting"
       3. Slice turns 1-30 as compactTurns, 31-40 as retainTurns
       4. indexSessionSummary({sessionId, tenantId, userId, coachType, messages: compactTurns})
          → generates session summary and indexes to Qdrant
       5. Create summaryTurn: { role: "assistant", content: "[Session Summary]\n{summary}" }
       6. setWorkingMemory(sessionId, [summaryTurn, ...retainTurns])
       7. Update AiChatSession.status = "summarized"
       8. DEL compact:lock:{sessionId}
```

Up to `MAX_RETRIES = 3` attempts on failure.

---

## 5. Sliding window for active sessions

`buildConversationWindow(turns, tokenBudget = 12_000)` constructs the messages array for each LLM call:

```
MAX_ALWAYS_INCLUDE = 10  // most recent always included

1. Split turns into recentTurns (last 10) and olderTurns (the rest)
2. Count chars consumed by recentTurns (heuristic: 4 chars ≈ 1 token)
3. Fill remaining char budget from olderTurns in reverse order
4. Return all selected turns in chronological order
```

---

## 6. Context reconstruction on resume: `reconstructSession()`

```typescript
export async function reconstructSession(
  sessionId: string,
  userId:    string,
  tenantId:  string,
  userMessage: string,  // semantic search query for episodic retrieval
): Promise<void>
```

### Algorithm

```
Step 1: Check Valkey — if key exists (race-safe), return
Step 2: Load AiChatSession from Postgres
        → Get last RECONSTRUCT_RECENT = 10 raw messages as recentMessages
Step 3: If QDRANT_URL + COHERE_API_KEY set:
          → embedQuery(userMessage || "coaching session")
          → Search conversations-{tenantId}:
              filter: tenant_id, user_id,
                      content_type IN ["session_summary", "episodic_summary", "semantic_fact"]
              limit: RECONSTRUCT_EPISODIC_CANDIDATES = 20
          → applyDecay(results) — temporal scoring
          → Take top RECONSTRUCT_EPISODIC_TOP = 5 by finalScore
          → Format: "[Session {date}] {summary text}"
Step 4: Build reconstructed turns:
          - If episodic exists:
              → Prepend synthetic assistant turn:
                { role: "assistant", content: "[CONTEXT SUMMARY]\nCOACHING HISTORY:\n{summaries}\n[END CONTEXT SUMMARY]" }
          - Append recentMessages
Step 5: setWorkingMemory(sessionId, turns)  // TTL reset to 2h
Step 6: Update AiChatSession.status = "resumed"
```

The reconstruction block is stored in Valkey but **NOT** appended to `AiChatSession.messages`: it's ephemeral working context, not canonical session history.

---

## 7. Sub-agent context scoping (`AgentContextConfig.threadScope`)

| Scope | Memory access |
|---|---|
| `thread_scoped` | Current conversation thread only |
| `cross_thread` | Multiple sessions of same agent type |
| `cross_session` | All sessions, all agent types |

### Default scope (`getDefaultScope()`)

| Agent pattern | Default |
|---|---|
| `"onboarding"` or `"offer_doc"` | `thread_scoped` |
| starts with `"module_"` | `cross_thread` |
| everything else | `cross_session` |

If `AgentContextConfig.isEnabled === false`, scope defaults to `cross_session` (disabled = unrestricted).

**Scope is NOT a security boundary.** Security is enforced by `tenant_id` and `user_id` filters on every Qdrant query, always present regardless of scope.

---

## 8. Failure recovery procedures

### Valkey outage

- All active sessions immediately fall to `RESUMED` state.
- `reconstructSession()` runs against Qdrant on every turn.
- Performance degrades but functionality is maintained.
- Do NOT return empty context: always reconstruct from Qdrant.

### Qdrant outage

- Session resumption fails (no episodic memory).
- Knowledge base context unavailable.
- Fallback: serve raw last-10 turns from Postgres only.
- Log a critical alert: severe degradation.

### Compaction job failure

- Un-compacted turns remain in Valkey (no data loss).
- Session continues in `COMPACTING` state.
- Retry on next `appendTurnAndMaybeCompact()` call.
- After 3 failed retries, status reverts to `"active"` and lock is released.

---

## 9. Testing context continuity

Every change to session/memory must validate:

1. **Long session test:** simulate a 50-turn session. Verify compaction fires at turn 40. Verify turns 31-40 still accessible after compaction. Verify turns 1-30 summary retrievable from Qdrant.
2. **Resume test:** create a 5-turn session. Manually delete the Valkey key. Send a new message. Verify response demonstrates awareness of previous 5 turns via Postgres + Qdrant.
3. **Race test:** send two concurrent messages to the same session. Verify both stored, neither lost.
4. **GDPR test:** delete a user. Verify all vectors deleted from all Qdrant collections via `deleteUserVectors()`. Verify Postgres records cascade-delete.

These belong in `quality-worker-bee`'s eval suite as audit evidence.

---

## 10. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Compaction without Valkey lock (`NX` flag missing) | must-fix | this guide §3 |
| `COMPACTION_THRESHOLD` drift from 40 without doc update | must-fix | this guide §3 |
| `MAX_RETRIES` drift from 3 | should-refactor | this guide §3 |
| `WATCHDOG_TTL` drift from 600s | should-refactor | this guide §3 |
| `reconstructSession()` not checking Valkey before Postgres+Qdrant | must-fix (race) | this guide §6 |
| `reconstructSession()` writing to `AiChatSession.messages` | must-fix | this guide §6 |
| Reconstruction skipping `applyDecay()` | should-refactor | this guide §6 |
| Sliding window's 10-most-recent rule violated | must-fix | this guide §5 |
| `AgentContextConfig.threadScope` used as security boundary | must-fix | this guide §7 |
| Compaction blocking the user response (not fire-and-forget) | must-fix | this guide §3 |
