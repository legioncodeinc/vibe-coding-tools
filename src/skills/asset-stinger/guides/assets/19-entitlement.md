# Guide: `FeatureEntitlement` (19)

> **Applies to:** the grant matrix between `Plan` / `AddOn` and `Feature`: "which features does this plan include, and at what limits?"

## 1. Purpose

Today, plan-to-feature gating is implicit: `FeatureFlag` rows have `PlanFeatureFlag` selections (`enable` / `disable` / `upgrade_lock`) and `AddOnFeatureFlag` bindings. That works, but couples gating to *flags* instead of to *features*.

`FeatureEntitlement` makes it explicit and queryable: "Plan X grants Feature Y with limit Z."

## 2. DB table

New table, introduced by the deploying product's entitlement-and-meter-binding feature PRD:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `featureKey` | `String` | human | yes | FK into `Feature.key` |
| `planKey` | `String?` | human | yes OR addonKey | FK into `Plan.key` |
| `addonKey` | `String?` | human | yes OR planKey | FK into `AddOn.key` |
| `limitValue` | `Int?` | human | no | e.g., `100` seats |
| `limitMeterKey` | `String?` | human | no | FK into `Meter.key` for usage-based limits |
| `softLimit` | `Boolean @default(false)` | human | yes | warn when crossed |
| `hardLimit` | `Boolean @default(false)` | human | yes | block when crossed |
| `gracePeriodDays` | `Int?` | human | no | after hard limit, before block |

Compound unique: `@@unique([featureKey, planKey, addonKey])`.

Constraint: `planKey IS NOT NULL XOR addonKey IS NOT NULL` (exactly one source of the entitlement).

## 3. How entitlements are created

- On `Feature` rollout to a plan, admin UI writes a row.
- On `AddOn` purchase, admin UI writes a row per granted feature.
- The sync generator does not create entitlements; this is pure human intent.

## 4. Runtime semantics

At feature-gate evaluation time, the resolver computes:

```
User has feature F if:
  - User's plan has an entitlement for F, OR
  - User has an active addon that grants F,
  AND the associated FeatureFlag resolves to enabled for the user's tenant/role.
```

Entitlements answer "is this allowed?" Flags answer "is it turned on?" They are orthogonal.

## 5. Lifecycle

Standard. Deprecating an entitlement (a plan loses a feature) triggers notification to every tenant on that plan with 30-day grace (see `guides/04-deprecation-and-sunset.md` §Feature deprecation).

## 6. Relationships

**FeatureEntitlement references:** `Feature`, `Plan` (xor), `AddOn` (xor), `Meter` (for usage limits).

**Referenced by:** entitlement resolver, plan-matrix UI, upgrade-prompt UI.

## 7. Hand-offs

- **Billing engine**: doesn't read entitlements (it reads `Plan`, `AddOn`, `Meter`). Entitlements are product-gating, not billing computation.
- **library-worker-bee**: pricing feature PRDs cross-link here.

## 8. Pitfalls

- Confusing "entitled" with "flagged on." A user may be entitled to a feature but have the flag off (rollout in progress). Both must be true.
- Double-granting a feature via plan + addon: the resolver should return the more permissive limit but not double-count in metering.
- Missing `gracePeriodDays` on a hard limit: users hit the wall with no warning. Bad UX.
- Entitlement row with `planKey` AND `addonKey`: constraint violation, but worth a code review too.

## 9. Example

```ts
await prisma.featureEntitlement.create({
  data: {
    featureKey: "ai.coaching",
    planKey: "pro",
    addonKey: null,
    limitValue: 10000,
    limitMeterKey: "ai.tokens.input",
    softLimit: true,
    hardLimit: true,
    gracePeriodDays: 7,
    status: "active",
    ownerTeam: "billing",
    prdRef: "FEA-167c",
    environments: ["dev", "staging", "prod"],
    createdBy: "platform-admin:user_xyz",
  },
});
```

## 10. Checklist

- [ ] Exactly one of `planKey` / `addonKey` is set
- [ ] `featureKey` resolves to an active `Feature`
- [ ] If `limitValue` is set, `limitMeterKey` is usually also set (for usage-tracked limits)
- [ ] `softLimit` and `hardLimit` both meaningful (e.g., soft at 80%, hard at 100%)
- [ ] `gracePeriodDays` present for any `hardLimit: true`
- [ ] Not a duplicate: compound unique is honored
