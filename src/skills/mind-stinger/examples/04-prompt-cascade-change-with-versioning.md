# Example 04: Prompt Cascade Change with Versioning

End-to-end: editing the `[COACH_PERSONALITY]` block for `level_2` coach with proper `PromptVersion` audit.

> **Reference guides:** `guides/03-prompt-cascade.md`, `guides/04-prompt-engineering.md`, `guides/05-prompt-versioning.md`.

---

## Scenario

Tenant admin reports: "Our Level 2 coach is too generic: members say it could be talking to anyone." The admin wants to make the persona more specific to their community's positioning.

mind-worker-bee's job: walk the admin / engineer through the change with proper versioning.

---

## Step 1: Identify the layer

This is a Layer 3 (`[COACH_PERSONALITY]`) change. Source: `AiCoachConfig.systemPrompt` for `coachType: "level_2"` for the specific tenant.

NOT a platform-level (Layer 1) change: it doesn't apply to all tenants.
NOT a tenant-wide (Layer 2 brand voice) change: it's coach-specific.

---

## Step 2: Read the current value

```typescript
const current = await prisma.aiCoachConfig.findUnique({
  where: { tenantId_coachType: { tenantId, coachType: "level_2" } },
  select: { id: true, systemPrompt: true, name: true, status: true },
});
```

Current `systemPrompt`:

```
You are the Level 2 Coach for the community. You work with members who have completed
Level 1 and are ready to scale. Focus on refining their positioning, developing systematic
referral processes, and deepening community relationships.
```

This is the default from `getDefaultGlobalPrompt("level_2")`: no customization yet. Admin's complaint is real.

---

## Step 3: Check the latest `PromptVersion`

```typescript
const latest = await prisma.promptVersion.findFirst({
  where:   { layer: "coach", tenantId, agentType: "level_2" },
  orderBy: { createdAt: "desc" },
});
```

Result: no rows. The default has never been overridden: confirms no prior customization.

---

## Step 4: Author the new prompt

The admin works with mind-worker-bee to draft:

```
You are the Level 2 Coach for {tenantName}. You work with members who have built their
foundations and are now scaling — typically founders generating $25K-$200K MRR.

Focus on:
- Sharpening positioning so the offer becomes unmistakable in 7 words or less
- Building systematic referral processes (not ad-hoc asks)
- Deepening peer relationships in the community to compound deal flow

Be direct. Push back when you hear "I want to scale" without "to whom and how" defined.
Reference {tenantName}'s methodology when applicable. Avoid generic scaling advice —
diagnose first.
```

This is more specific (Level 2 = $25K-$200K MRR), more directive (push back on vague language), and uses `{tenantName}` as a placeholder for the tenant brand.

**Tonality check**: `[COACHING_QUALITY]` block already mandates anti-sycophancy; this prompt complements it without overriding. ✓

**`[INSTRUCTION_HIERARCHY]` check**: this is a Layer 3 prompt; it doesn't claim authority over Layer 1 (platform) or Layer 0 (system foundation). ✓

---

## Step 5: Update the DB row

```typescript
const updated = await prisma.aiCoachConfig.update({
  where: { id: current.id },
  data:  { systemPrompt: newPrompt },
});
```

---

## Step 6: Record the `PromptVersion` (mandatory)

```typescript
await recordPromptVersion({
  layer:       "coach",
  tenantId,
  agentType:   "level_2",
  blockId:     "level_2",
  content:     newPrompt,
  changedById: adminUserId,
});
```

**Without this call, the change is a must-fix finding.** See `guides/05-prompt-versioning.md §3`.

---

## Step 7: Invalidate the Valkey cache

```typescript
await valkey.del(`coach:persona:${tenantId}:level_2`);
```

The cache TTL is 600 seconds, but explicit invalidation is faster and avoids the up-to-10-minute drift members would experience otherwise. **Missing invalidation is a should-refactor finding.**

---

## Step 8: Verify the change took effect

The next coaching turn for this tenant + Level 2 coach should:

1. Hit the DB (Valkey miss after invalidation).
2. Compose the system prompt with the new `[COACH_PERSONALITY]` block.
3. The LLM call's `composedPromptTokens` should reflect the slightly larger prompt.

Pull a sample trace and inspect `assistantResponse` for tonality:

> Member: "I want to scale to $500K ARR by end of year."
> Coach (new): "Before we map the path to $500K, let me push back: $500K of what offer to whom? Generic 'scale to $500K' is the kind of goal that sounds ambitious but doesn't tell you what to do Monday morning. Walk me through your single best client right now: what they bought, why they bought, what they paid."

The new prompt's "push back when you hear 'I want to scale' without 'to whom and how' defined" directive landed.

---

## Step 9: Eval baseline + watch window

The change is unilateral (no A/B). Mitigate risk by:

1. **Capture baseline**: before the change, snapshot `AiTrace.agreementScore` and human coaching-rubric scores for `level_2` over last 7 days.
2. **Watch 48 hours** post-change. Alert if `agreementScore` rises > 0.1 or rubric mean falls > 0.1.
3. **Sample 10 traces** at 24h and read manually. Flag any sycophancy regression.

---

## Step 10: Document the rationale

In a tenant-internal doc (or in the SA's notes):

```
2026-04-25 — Level 2 prompt customization for tenant clx9vy200012vu8kj0

Reason: admin reported "too generic" feedback from members.
Change: swapped the default for a tenant-specific prompt with more directive tonality.
Versioned: PromptVersion id `pv_2026_0425_a3f9`.
Watching: agreementScore baseline 0.51, rubric baseline 0.68.
Rollback path: restore content from PromptVersion id `pv_default_level_2_2026_03`.
```

---

## Common mistakes to avoid

| Mistake | Severity | Reference |
|---|---|---|
| Editing `AiCoachConfig.systemPrompt` directly without `recordPromptVersion()` | must-fix | `guides/05-prompt-versioning.md` |
| Forgetting to invalidate Valkey cache (members get stale prompt 10 min) | should-refactor | `guides/04-prompt-engineering.md §8` |
| New prompt overrides `[COACHING_QUALITY]` (e.g., "always agree") | must-fix | `guides/03-prompt-cascade.md §5` |
| New prompt embeds `{tenantName}` placeholder that's never substituted | must-fix | (caused by leaking the placeholder unfilled) |
| Editing the prompt to fix a routing problem instead of the routing classifier | should-refactor | `guides/02-coach-architecture.md §3` |
| Not capturing eval baseline before the change | should-refactor | this example §9 |
