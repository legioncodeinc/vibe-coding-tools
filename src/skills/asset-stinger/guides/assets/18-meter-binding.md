# Guide: `Meter` binding (18)

> **Applies to:** the link between the new `Feature` spine and the existing `Meter` table (see the deploying product's schema).

## 1. Purpose

Meters today measure usage (tokens, API calls, storage, SMS sent) but have no queryable link to the feature that consumes the usage. The deploying product's meter-binding feature PRD closes that with `Meter.featureKey`.

## 2. DB impact

No new table. One column addition:

| Model | New column | Notes |
|---|---|---|
| `Meter` | `featureKey: String?` | soft FK into `Feature.key` |

Soft FK because: platform-level meters (cross-feature storage, for example) may not have a single owning feature.

## 3. How binding is detected

- On `Feature` registration with `meterable: true`, the human must also register or select a `Meter` and set `featureKey`.
- The sync generator checks: any `Feature<meterable=true>` with no `Meter` pointing at it triggers a drift warning.

## 4. Rules

- A feature can have multiple meters (e.g., `ai.coaching` might use `ai.tokens.input`, `ai.tokens.output`, `ai.inference.count`).
- A meter can belong to one feature only (if `featureKey` is set).
- Meters with no `featureKey` are allowed but render with a warning in the meter-catalog UI: "consider assigning a feature."

## 5. Hand-offs

- **Billing engine** reads `Meter` to emit usage events and compute invoices. It does not care about `featureKey` at runtime.
- **Admin UI** uses `featureKey` to group meters by feature in the catalog view.
- **The meter-binding feature** also adds `MeterFloorRate`, `PlanMeterMarkup`, `AddOnMeterMarkup` cross-links to `Feature` for the plan-matrix view (already-in-schema tables, need relationships extended).

## 6. Pitfalls

- A feature's code starts recording usage against an unregistered meter key. The recorder should fail loud; if it fails silent, drift audit must catch it.
- A deprecated meter still referenced by `Feature.meterable: true`: block the deprecation until all features are cut over.

## 7. Example binding

```ts
await prisma.meter.update({
  where: { key: "ai.tokens.input" },
  data: { featureKey: "ai.coaching" },
});
```

## 8. Checklist

- [ ] `Meter.featureKey` (if set) resolves to a real `Feature.key`
- [ ] Every `Feature<meterable=true>` has at least one `Meter` pointing at it
- [ ] No `Meter` deprecated while any feature still records against it
- [ ] Cross-field consistency: `Feature.meterable` matches reality (a feature with no meters shouldn't claim meterable)
