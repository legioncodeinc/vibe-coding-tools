# 05: Prompt Versioning

Every prompt change is recorded in `PromptVersion`. The `recordPromptVersion()` and `recordPromptBlockChanges()` functions are the audit-on-change discipline.

> **Doc reference:** `library/knowledge/private/ai/prompt-cascade-architecture.md §5`, `library/knowledge/private/ai/observability-evaluation.md §6`.

---

## 1. The `PromptVersion` model

```prisma
model PromptVersion {
  id          String   @id @default(cuid())
  layer       String   // "platform" | "tenant" | "coach"
  tenantId    String?  // null for platform layer
  agentType   String?  // null for tenant-wide blocks
  blockId     String   // the prompt block's key (e.g., "foundation", "brandVoice", coachType)
  content     String   // full prompt content at this version
  changedById String
  createdAt   DateTime @default(now())

  @@index([layer, tenantId])
  @@index([blockId])
  @@index([createdAt])
}
```

**Retention:** PromptVersions are NEVER automatically deleted. They are compliance / audit records.

---

## 2. The two write functions

### `recordPromptVersion()`

Single-block write. Used when a single prompt block changes:

```typescript
export async function recordPromptVersion(params: {
  layer:       "platform" | "tenant" | "coach";
  tenantId?:   string;
  agentType?:  string;
  blockId:     string;
  content:     string;
  changedById: string;
}): Promise<void>
```

### `recordPromptBlockChanges()`

Diff-based write. Compares old vs. new block maps and records a version for each changed block only:

```typescript
export async function recordPromptBlockChanges(params: {
  layer:          "platform" | "tenant";
  tenantId?:      string;
  changedById:    string;
  previousBlocks: Record<string, string | undefined>;
  newBlocks:      Record<string, string | undefined>;
}): Promise<void>
```

This is the function called from the SA AI Configuration screen and the admin tenant settings screen: only blocks that actually changed get a version row.

---

## 3. The audit-on-change discipline

| When | What |
|---|---|
| SA edits `PlatformConfig.systemPromptBlocks` | `recordPromptBlockChanges({ layer: "platform", ... })` |
| Admin edits `Tenant.promptBlocks` | `recordPromptBlockChanges({ layer: "tenant", tenantId, ... })` |
| Admin edits `AiCoachConfig.systemPrompt` | `recordPromptVersion({ layer: "coach", tenantId, agentType: coachType, blockId: coachType, content: newPrompt, changedById: adminUserId })` |
| Admin edits `CoachModuleConfig.systemPrompt` | `recordPromptVersion({ layer: "coach", tenantId, agentType: \`module_${moduleType}\`, ... })` |
| `Tenant.onboardingAgentName` change | NOT a prompt change (display name only). No version row. |

**Any prompt block write that does NOT call one of the recording functions is a must-fix finding.**

---

## 4. Why we version prompts

Three use cases:

1. **Rollback**: restore a previous version after a quality regression. The `content` column holds the full text, not a diff, so restoring is a single `UPDATE`.
2. **Audit**: know exactly what instructions the AI operated under during any session. Correlate with `AiTrace.createdAt` to determine which `PromptVersion` was active.
3. **Correlation / debugging**: identify when prompt changes caused quality changes (e.g., sycophancy spike after a brand voice edit).

---

## 5. Querying for versions

```typescript
// Latest version for a specific block
const latest = await prisma.promptVersion.findFirst({
  where: { layer, tenantId, blockId },
  orderBy: { createdAt: "desc" },
});

// All versions for a tenant's coach over a window
const window = await prisma.promptVersion.findMany({
  where: {
    layer:    "coach",
    tenantId,
    agentType: coachType,
    createdAt: { gte: from, lte: to },
  },
  orderBy: { createdAt: "asc" },
});

// What was active at session time?
// Take the latest version with createdAt <= session.createdAt
const activeAtTime = await prisma.promptVersion.findFirst({
  where: { layer, tenantId, blockId, createdAt: { lte: sessionCreatedAt } },
  orderBy: { createdAt: "desc" },
});
```

---

## 6. Correlation with `AiTrace`

To understand whether a coaching quality change correlates with a prompt change:

1. Find the relevant `PromptVersion` row(s): when did the prompt change?
2. Pull `AiTrace` rows for the same `tenantId` (and `coachType` if relevant) before and after.
3. Compare aggregates: `retrievalScore`, `agreementScore`, `routingCorrect`, latency.
4. If a metric shifts at the change boundary → strong signal that the prompt change is the cause.

---

## 7. Rollback procedure

When a coach prompt edit causes a quality regression:

1. Identify the regression in `AiTrace` aggregates (eval review).
2. Find the `PromptVersion` row immediately before the regression (`createdAt: { lt: badEditTime }`).
3. Copy `content` from that row.
4. `UPDATE AiCoachConfig.systemPrompt = '<previous content>'` for the affected coach.
5. **The rollback itself is a prompt change**: call `recordPromptVersion()` for the rollback. Do NOT skip this; the version log should reflect the actual state of the prompt at every point in time.
6. Invalidate the Valkey cache: `coach:persona:{tenantId}:{coachType}` (TTL 600s, but explicit invalidation is faster).

---

## 8. The five things that ARE versioned

1. `PlatformConfig.systemPromptBlocks.foundation` (Layer 1 `[PLATFORM_FOUNDATION]`).
2. `PlatformConfig.systemPromptBlocks.guidelines` (Layer 1 `[PLATFORM_GUIDELINES]`).
3. `PlatformConfig.systemPromptBlocks.safetyRules` (Layer 1 `[PLATFORM_SAFETY_RULES]`).
4. `Tenant.promptBlocks` (Layer 2, three sub-blocks: `brandVoice`, `topicRestrictions`, `overrideInstructions`).
5. `AiCoachConfig.systemPrompt` and `CoachModuleConfig.systemPrompt` (Layer 3 per-coach personality).

---

## 9. The four things that are NOT versioned (and why)

| Not versioned | Why |
|---|---|
| `[SYSTEM_FOUNDATION]` (Layer 0) | Hardcoded in `composeSystemPrompt()`: versioned via git. |
| `[COACHING_QUALITY]` block | Hardcoded: versioned via git. |
| `[INSTRUCTION_HIERARCHY]` block | Hardcoded: versioned via git. |
| Onboarding agent system prompt | Hardcoded in `onboarding-ai.ts`: versioned via git. |

For these, the version trail lives in the repository's git log, not `PromptVersion`.

---

## 10. The `enableGraphRAG` flag in `systemPromptBlocks`

`PlatformConfig.systemPromptBlocks.enableGraphRAG: boolean` is stored in the same JSON field but is NOT a prompt block. Toggling it does NOT call `recordPromptBlockChanges()` for the flag (or shouldn't).

If a SA edits the flag in the same admin write that touches a prompt block, only the prompt-block changes are recorded. The flag toggle should be tracked separately (a `PlatformConfigAudit` table is a future enhancement; until then, git log + admin action log are the trail).

---

## 11. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Prompt block written without `recordPromptBlockChanges()` or `recordPromptVersion()` | must-fix | this guide §3 |
| Prompt rollback that doesn't write a new `PromptVersion` row | must-fix | this guide §7 |
| `PromptVersion` rows being deleted (retention violated) | must-fix | this guide §1 |
| Coach prompt cached in Valkey not invalidated after admin edit | should-refactor | `guides/04-prompt-engineering.md` |
| `enableGraphRAG` flag flip recorded as a prompt version | should-refactor | this guide §10 |
| `recordPromptVersion()` called with empty `changedById` | must-fix | audit hygiene |
