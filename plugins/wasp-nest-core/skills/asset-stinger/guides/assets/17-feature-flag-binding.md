# Guide: `FeatureFlag` binding (17)

> **Applies to:** the bi-directional link between the new `Feature` spine and the existing, robust `FeatureFlag` catalog (see the deploying product's existing schema for the `FeatureFlag` model).

## 1. Purpose

Today, in many deploying products, `FeatureFlag` is a rich but orphan catalog: flags have parent/child relationships (via `parentSlug`), tenant overrides, plan selections, addon bindings, but **no link to a code-side feature**. The feature-flag-binding feature PRD in the deploying product closes that.

Binding is bi-directional:

- `Feature.defaultFlagSlug: String?`: the "default" flag this feature uses for rollout.
- `FeatureFlag.featureKey: String?`: which feature owns this flag.

A feature may have multiple flags (kill-switch, rollout, experiment, permission); one flag may belong to one feature.

## 2. DB impact

No new table. Two column additions on existing models:

| Model | New column | Notes |
|---|---|---|
| `Feature` | `defaultFlagSlug: String?` | soft FK |
| `FeatureFlag` | `featureKey: String?` | soft FK |

Soft FK because: `FeatureFlag` rows predate `Feature` and may outlive features (e.g., platform-wide ops flags that have no owning feature).

## 3. How binding is detected

- On `Feature` registration (`guides/assets/01-feature.md`), the human sets `defaultFlagSlug`.
- On `FeatureFlag` creation (DB-level, admin UI), a human sets `featureKey` (nullable).
- The sync generator does NOT auto-bind; binding is an intent decision.

However: the sync generator runs a **bi-directional consistency check**:

- If `Feature.defaultFlagSlug = "foo"` and `FeatureFlag<slug=foo>.featureKey` is unset or different, drift.
- If a feature has `meterable: true` but no flag exists for its kill-switch intent, drift (warning only, not every feature needs a kill-switch).

## 4. Binding lifecycle

- When a `Feature` is created and `defaultFlagSlug` is set, the admin UI should prompt: "Does flag X exist? If not, create it now." Auto-create is opt-in (define in the feature-flag-binding feature PRD's acceptance criteria).
- When a `FeatureFlag` is created via admin UI without a `featureKey`, it enters the registry as `orphaned`. A drift item fires; a human resolves by either assigning a feature or marking the flag as ops-scoped.
- When a `Feature` is deprecated, its linked flags are flagged with `expected_removal_at = Feature.sunset_at` so flag-debt doesn't accumulate.

## 5. Hand-offs

- **Feature-flag console** (admin UI) reads `FeatureFlag.featureKey` to render "which feature does this flag belong to?"
- **Plan matrix** (admin UI) reads from both `Feature` and `FeatureEntitlement`; the flag-binding is secondary there.

## 6. Pitfalls

- **Silent drift**: a flag created via admin UI (no `featureKey`) that gates production behavior. You don't see it until the nightly audit. Fix: admin UI should require a `featureKey` unless `kind: ops`.
- **Split state**: a feature with `defaultFlagSlug = "a"` but the actual code checks flag `"b"`. The generator can't always detect this. Requires human PR review.
- **Parent/child divergence**: feature A has `defaultFlagSlug = "foo"` (a child flag), but `foo`'s parent is owned by feature B. Legal, but a code smell: usually means ownership is split.

## 7. Example binding

```ts
// In the Feature row
await prisma.feature.update({
  where: { key: "billing.addons" },
  data: { defaultFlagSlug: "billing.addons.enabled" },
});

// In the FeatureFlag row (existing table, new column)
await prisma.featureFlag.update({
  where: { slug: "billing.addons.enabled" },
  data: { featureKey: "billing.addons" },
});
```

## 8. Checklist

- [ ] Feature's `defaultFlagSlug` resolves to a real `FeatureFlag.slug`
- [ ] `FeatureFlag.featureKey` (if set) resolves to a real `Feature.key`
- [ ] No flag used in code is un-catalogued (drift audit covers this)
- [ ] Retired flags (`FeatureFlag.retiredAt` not null) don't block feature deployment
- [ ] Parent/child flag hierarchy aligns with feature ownership (warning, not blocker)
