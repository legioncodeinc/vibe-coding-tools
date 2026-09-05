# Example 01: Add a New Coach Type

End-to-end walkthrough for adding a new coach type to the canonical lineup. Worked example: adding a hypothetical `pricing_strategist` coach.

> **Reference guides:** `guides/02-coach-architecture.md`, `guides/04-prompt-engineering.md`, `guides/05-prompt-versioning.md`, `templates/coach-default-prompt.md`.

---

## Scenario

A founding member proposes adding a `pricing_strategist` coach focused exclusively on pricing, packaging, and offer monetization. The current `offer_doc` coach covers offer definition; pricing depth is sometimes lost in the broader `main_community` flow.

mind-worker-bee's job: walk the contributor through the canonical add-coach checklist.

---

## Step 1: Update the docs first

```diff
# library/knowledge/private/ai/coach-architecture.md §1

| Coach Type | Display Name | Purpose | Level Gate |
|---|---|---|---|
| `main_community`            | Community Coach          | General Q&A | None |
| `onboarding`                | Onboarding Coach         | Profile setup | None |
| `level_1`                   | Level 1 Coach            | Foundations | Level 1 |
| `level_2`                   | Level 2 Coach            | Scaling     | Level 2 |
| `level_3`                   | Level 3 Coach            | Mastery     | Level 3 |
| `offer_doc`                 | Offer Doc Coach          | Offer crafting | None |
| `special_gift_strategist`   | Special Gift Strategist  | Distinctive value | None |
+| `pricing_strategist`        | Pricing Strategist       | Pricing, packaging, monetization | None |
```

```diff
# library/knowledge/private/ai/prompt-engineering.md §2

+ ### `pricing_strategist` — Pricing Strategist
+
+ ```
+ You are the Pricing Strategist for the community. You help members price their
+ offers with confidence — anchoring on outcome value, not effort. Focus on:
+ pricing models (one-time / retainer / outcome-based), packaging tiers, and
+ pricing conversations with prospects. Be direct about pricing courage. Avoid
+ generic "charge more" advice — diagnose first.
+ ```
+
+ > Added 2026-04-25.
```

Get the doc PR reviewed and merged BEFORE the code change.

---

## Step 2: Update the `AiCoachType` enum

```diff
// api/prisma/schema.prisma

enum AiCoachType {
  main_community
  onboarding
  level_1
  level_2
  level_3
  offer_doc
  special_gift_strategist
+ pricing_strategist
}
```

Run `pnpm prisma migrate dev --name add_pricing_strategist_coach`.

---

## Step 3: Update the routing classifier prompt

```diff
// lib/ai-coach-router.ts (or wherever ROUTING_PROMPT lives)

const ROUTING_PROMPT = (memberLevel: number) => `You are a routing classifier.
Reply with ONLY one of these exact values:
-main_community, onboarding, level_1, level_2, level_3, offer_doc, special_gift_strategist
+main_community, onboarding, level_1, level_2, level_3, offer_doc, special_gift_strategist, pricing_strategist

Guidelines:
- ideal clients, target market → main_community (unless explicitly about offer doc)
- offers, pricing, packaging → offer_doc
+- pricing models, pricing conversations, raising rates, packaging tiers → pricing_strategist
- onboarding, getting started, profile setup → onboarding
- level-specific goals matching the member's current level → level_{n}
- unique strengths, distinctive qualities, personal brand, special gift → special_gift_strategist
- general questions, community topics → main_community
- if unsure → main_community

The member is currently at Level ${memberLevel}.`;
```

Note the disambiguation rule: "offers" stays with `offer_doc`; "pricing models / raising rates / packaging tiers" go to `pricing_strategist`. The router is small (8B): explicit examples reduce ambiguity.

---

## Step 4: Add the default prompt to `getDefaultGlobalPrompt()`

```diff
// lib/ai-prompt-builder.ts

const PRICING_STRATEGIST_DEFAULT = `You are the Pricing Strategist for the community. You help members price their offers with confidence — anchoring on outcome value, not effort. Focus on: pricing models (one-time / retainer / outcome-based), packaging tiers, and pricing conversations with prospects. Be direct about pricing courage. Avoid generic "charge more" advice — diagnose first.`;

function getDefaultGlobalPrompt(coachType: string): string {
  switch (coachType) {
    case "main_community":           return MAIN_COMMUNITY_DEFAULT;
    case "onboarding":               return ONBOARDING_STANDARD_DEFAULT;
    case "level_1":                  return LEVEL_1_DEFAULT;
    case "level_2":                  return LEVEL_2_DEFAULT;
    case "level_3":                  return LEVEL_3_DEFAULT;
    case "offer_doc":                return OFFER_DOC_DEFAULT;
    case "special_gift_strategist":  return SPECIAL_GIFT_DEFAULT;
+   case "pricing_strategist":       return PRICING_STRATEGIST_DEFAULT;
    default:                         return MAIN_COMMUNITY_DEFAULT;
  }
}
```

See `templates/coach-default-prompt.md` for the canonical shape.

---

## Step 5: Level gate (none for this coach)

`pricing_strategist` is not level-gated. No change needed in the level-gating logic.

If it WERE level-gated, the seed `AiCoachConfig` row for each tenant would include `levelAccess: 2` (or appropriate level), and the route layer would already enforce gating per `guides/02-coach-architecture.md §5`.

---

## Step 6: Seed `AiCoachConfig` per tenant

A migration script creates an `AiCoachConfig` for each existing tenant:

```typescript
// scripts/seed-pricing-strategist.ts
const tenants = await prisma.tenant.findMany();
for (const t of tenants) {
  await prisma.aiCoachConfig.upsert({
    where:  { tenantId_coachType: { tenantId: t.id, coachType: "pricing_strategist" } },
    create: {
      tenantId:    t.id,
      coachType:   "pricing_strategist",
      name:        "Pricing Strategist",
      description: "Pricing, packaging, monetization",
      status:      "active",
      systemPrompt: PRICING_STRATEGIST_DEFAULT,
      levelAccess: null,
    },
    update: {},
  });
}
```

For each row, also call `recordPromptVersion()`:

```typescript
await recordPromptVersion({
  layer:       "coach",
  tenantId:    t.id,
  agentType:   "pricing_strategist",
  blockId:     "pricing_strategist",
  content:     PRICING_STRATEGIST_DEFAULT,
  changedById: SYSTEM_USER_ID,
});
```

---

## Step 7: Update `AgentContextConfig` defaults

`pricing_strategist` is a global coach: defaults to `cross_session` per `getDefaultScope()`. Add a platform default row:

```typescript
await prisma.agentContextConfig.upsert({
  where:  { agentType_tenantId: { agentType: "pricing_strategist", tenantId: null } },
  create: { agentType: "pricing_strategist", threadScope: "cross_session", isEnabled: true },
  update: {},
});
```

---

## Step 8: Add eval cases

Extend the golden routing dataset with 5 to 10 cases:

```jsonl
{"query": "How do I price my new retainer offer?", "expected": "pricing_strategist"}
{"query": "Should I charge $5K or $10K for a 3-month engagement?", "expected": "pricing_strategist"}
{"query": "I want to raise my rates next quarter — how do I tell existing clients?", "expected": "pricing_strategist"}
{"query": "Should my offer be one-time or recurring?", "expected": "offer_doc"}
{"query": "Can you help me describe my offer in one sentence?", "expected": "offer_doc"}
```

The boundary cases between `pricing_strategist` and `offer_doc` are most important: they're where the router will struggle.

---

## Step 9: Hand off

- **`asset-worker-bee`**: register `pricing_strategist` in the coach asset registry.
- **`db-worker-bee`**: confirm the `AiCoachConfig` index strategy supports the new coach type.
- **`library-worker-bee`**: author the PRD if this is being shipped as a feature.

---

## Step 10: Verify

After deploy:

1. Run `scripts/coach-routing-audit.ts` on the next 7 days. `pricing_strategist` should have ≥ 90% accuracy.
2. Sample 10 traces routed to `pricing_strategist`: verify quality with the coaching rubric (`guides/17-evaluation-discipline.md §2`).
3. Verify `AiTrace.agentTypeRouted` shows the new value (no schema migration needed: it's a string).

If routing accuracy < 90%, the levers are §3's classifier prompt and the coach descriptions in §4. Refine the boundary rules between `offer_doc` and `pricing_strategist`.
