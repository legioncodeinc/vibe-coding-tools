# 15: Agent Orchestration

`runOrchestrator()` (classify → assemble → dispatch), `assembleContextPacket()` for parallel I/O, `AgentContextConfig` thread-scope policy. The current implementation, the routing-call tracing gap, and the planned full multi-agent dispatcher.

> **Doc reference:** `library/knowledge/private/ai/agent-orchestration.md` is canonical.

---

## 1. `runOrchestrator()`: current architecture

```
runOrchestrator({tenantId, userId, sessionId, userMessage, memberLevel, coachType?})
  │
  ├── 1. routeToCoach() → coachType (or use provided)
  │
  ├── 2. composeSystemPrompt() → systemPrompt (5-layer cascade)
  │
  ├── 3. assembleContextPacket() → contextPacket
  │       ├── buildKnowledgeContextWithMeta() (parallel)
  │       ├── getWorkingMemory()              (parallel)
  │       └── prisma.user.findUnique()         (parallel)
  │
  ├── 4. Build messages array:
  │       [system, ...conversationHistory, user message]
  │
  ├── 5. traceAICall() wrapping openai.chat.completions.create()
  │       model: chat ("meta-llama/Llama-3.3-70B-Instruct")
  │       tools: [SCRAPE_URL_TOOL]
  │       max_tokens: 500, temperature: 0.7
  │
  ├── 6. If scrape_url tool call:
  │       → Execute scrapeUrl(url)
  │       → Second traceAICall() with tool result
  │
  └── 7. Return { response, coachType, contextPacket }
```

`ai-chat.ts` uses the orchestrator for global coach sessions where neither `moduleType` nor `checklistItemId` is provided.

---

## 2. The routing-call tracing gap (always flag)

Current state:

- `routeToCoach()` classifies with Llama 3.1 8B (temperature 0, max_tokens 20).
- `composeSystemPrompt()` builds the appropriate coach personality.
- **The routing call is NOT traced**: only the main LLM call is.

This is one of the recurring gap patterns. Routing accuracy can only be evaluated indirectly. Fix: wrap the routing call in `traceAICall({ traceType: "routing", model: fastModel, ... })`.

---

## 3. Context packet assembly: `assembleContextPacket()`

```typescript
export interface ContextPacket {
  systemPrompt:        string;
  conversationHistory: SessionTurn[];      // windowed from Valkey working memory
  knowledgeMeta:       KnowledgeContextMeta;  // { contextString, chunks, latencyMs }
  memberProfile:       Record<string, unknown> | null;
  agentType:           string;
  threadScope:         string;
}

export async function assembleContextPacket(params: {
  tenantId:    string;
  userId:      string;
  coachType:   string;
  sessionId:   string;
  userMessage: string;
  systemPrompt: string;
}): Promise<ContextPacket>
```

### Steps

1. `getThreadScope()`: reads `AgentContextConfig` (Postgres query).
2. **Parallel I/O:**
   - `buildKnowledgeContextWithMeta()`: Qdrant search + Cohere rerank.
   - `getWorkingMemory()`: Valkey key read.
   - `prisma.user.findUnique()`: member profile fields.
3. `buildConversationWindow(turns, 12_000)`: token-budget windowing.
4. Return `ContextPacket`.

The packet is returned alongside the response, available for tracing and debugging.

**Adding a new context source** (e.g., a feature flag) requires:
- Extending `ContextPacket` shape.
- Adding the parallel I/O call.
- Updating `agent-orchestration.md` doc.
- Updating `assembleContextPacket()` callers.

---

## 4. `AgentContextConfig`: context awareness scope

```prisma
model AgentContextConfig {
  id                    String   @id @default(cuid())
  agentType             String   @map("agent_type")
  tenantId              String?  @map("tenant_id")              // null = platform default
  threadScope           String   @default("cross_session") @map("thread_scope")
  isEnabled             Boolean  @default(true)
  updatedBySuperAdminId String?
  updatedAt             DateTime @updatedAt

  @@unique([agentType, tenantId])
}
```

### Scope options

| Value | Memory access |
|---|---|
| `thread_scoped` | Current conversation thread only |
| `cross_thread` | Multiple sessions of same agent type |
| `cross_session` | All sessions, all agent types |

### Default scope

```typescript
function getDefaultScope(agentType: string): string {
  if (agentType === "onboarding" || agentType === "offer_doc") return "thread_scoped";
  if (agentType.startsWith("module_")) return "cross_thread";
  return "cross_session";
}
```

If `isEnabled === false`, scope defaults to `cross_session` (disabled = unrestricted).

### SA configuration

The SA AI Configuration screen at `/super-admin/ai-config` includes an "Agent Awareness" section where each agent's scope can be configured per-tenant or platform-wide.

**mind-worker-bee does NOT silently change scope.** Scope changes are tenant-level decisions recorded in `AgentContextConfig` with `updatedBySuperAdminId`.

---

## 5. Session history (audit trail)

`AiChatSession.messages` stores canonical session history as JSON array:

```typescript
type SessionMessage = {
  role:                "user" | "assistant" | "tool";
  content:             string;
  timestamp?:          string;
  fromVoice?:          boolean;
  agentType?:          string;
  attachmentFilename?: string;
  attachmentUrl?:      string;
  tool_calls?:         Array<{
    id:       string;
    type:     "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?:       string;
};
```

`ai-chat.ts` writes each turn after the LLM response:

```typescript
const updatedMessages = [
  ...pgHistory,
  { role: "user",      content: userContent, timestamp, fromVoice },
  { role: "assistant", content: response,    timestamp, agentType: coachType },
];
await prisma.aiChatSession.update({
  where: { id: sessionId },
  data:  { messages: updatedMessages, updatedAt: new Date() },
});
```

---

## 6. URL scraping tool integration

Main LLM call includes `SCRAPE_URL_TOOL` from `scrape-tool.ts`. Two-pass pattern:

1. First completion returns `tool_calls`.
2. `scrapeUrl(url)` executes: fetches URL, strips HTML, truncates to 8,000 chars.
3. Tool result added to messages.
4. Second `traceAICall()` for the final text response.

Both `runOrchestrator()` and direct path in `ai-chat.ts` implement this.

---

## 7. Planned: full multi-agent dispatcher

> **Not yet implemented.** Current state is a lightweight `routeToCoach()` classifier.

In the planned full orchestrator:

1. The orchestrator LLM call would include all 11+ agents as function definitions.
2. Model returns `transfer_to_{agentType}(routing_reason)` tool call.
3. Orchestrator dispatches to the selected sub-agent with the full context packet.
4. Only sub-agent response shown to user; routing decisions stored as metadata.

### Sub-agent types planned

Coaching agents (`AiCoachType` enum):
`main_community`, `onboarding`, `level_1`, `level_2`, `level_3`, `offer_doc`, `special_gift_strategist`

Module coaches:
`module_goals`, `module_ideal_client`, `module_offer`, `module_positioning`, `module_referral_strategy`

### Anti-patterns to avoid when building

| Anti-pattern | Correct approach |
|---|---|
| Sub-agent receives only the current message | Sub-agent always receives full context packet |
| Each sub-agent writes to session history independently | Only one writer per session (the orchestrator) |
| Orchestrator generates user-visible content | Orchestrator routes silently; user sees sub-agent response only |
| Vague tool descriptions | Include specific "DO NOT use when" examples in every tool description |

---

## 8. Required parameters for the main LLM call (must-fix on drift)

| Parameter | Value | Why |
|---|---|---|
| `model` | `getAIModels().chat` (Llama 3.3 70B) | Coach quality requires the larger model |
| `temperature` | `0.7` | Standard coaching warmth without runaway randomness |
| `max_tokens` | `500` | Coach responses are 1-3 paragraphs |
| `tools` | `[SCRAPE_URL_TOOL]` | URL scraping for global coach + onboarding paths |

---

## 9. Common findings

| Finding | Severity | Reference |
|---|---|---|
| `runOrchestrator()` not tracing the routing call | must-fix (recurring gap pattern) | this guide §2 |
| `assembleContextPacket()` doing serial I/O (not parallel) | must-fix | this guide §3 |
| New context source added to `ContextPacket` without doc update | must-fix | this guide §3 |
| `AgentContextConfig.threadScope` changed in code (silently) | must-fix | this guide §4 |
| Session history written by sub-agent (not orchestrator) | must-fix | this guide §7 |
| Main LLM call drifting from `temperature: 0.7` / `max_tokens: 500` | must-fix | this guide §8 |
| Scrape tool's two-pass not traced (second pass missing `traceAICall`) | must-fix | this guide §6 + `guides/16-observability.md` |
| `getThreadScope()` returning `cross_session` when `isEnabled: true` and value is `thread_scoped` | must-fix | this guide §4 |
| `assembleContextPacket()` failing closed (no fallback) on `getWorkingMemory()` miss | must-fix | this guide §3 + `guides/13-context-continuity.md` |
