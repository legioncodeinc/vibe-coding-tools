# Drift Report: 2026-04-23 (nightly)

**Commit:** abc123def456789
**Branch / PR:** main
**Registry snapshot:** 2026-04-23T02:00:00.000Z
**Generator version:** 0.4.2

## Summary

| Class | Count | Delta vs prior run |
|---|---|---|
| Unregistered | 3 | +2 |
| Orphaned | 1 | 0 |
| Stale | 7 | -2 |
| Mismatched | 2 | +1 |
| Unlinked | 1 | +1 |
| Debt | 4 | 0 |

## Critical (blocks deploy)

- [ ] **Unregistered (feature-bearing)**: `app/src/features/billing/rebilling.ts` declares `@feature billing.rebilling` but no `Feature` row with `key: billing.rebilling` exists. Proposed action: human registers the feature via `guides/assets/01-feature.md`. Owner: `@billing-team`. PRD reference missing.

- [ ] **Orphaned (active)**: `Feature[key=legacy.quest-mode]`: registry row active but no code detected at `codePath: app/src/features/quest-mode/`. Last seen: 2026-02-10. Proposed action: confirm feature was intentionally removed → mark `deprecated` with `sunsetAt: 2026-07-22`.

- [ ] **Unlinked (feature-bearing)**: `Route[key=api.v1.referrals.redeem]` has no `featureKey`. Partner-facing route. Owner needs to assign. Blocks deploy.

## Warnings (fix this week)

- [ ] **Stale**: `Surface[key=pinned-chats-grid]`: file hash mismatch. Generator will re-upsert on next sync run.
- [ ] **Mismatched**: `Page[key=admin-billing-addons]`: human field `planGate: ["pro"]` disagrees with code's `@planGate` annotation `["pro","enterprise"]`. Proposed action: human reviews and reconciles. Generator will not overwrite.
- [ ] **Mismatched**: `ContentEntry[key=legal.tos.version]`: `editableByPlatformAdmin: false` but admin UI shows this as editable. Code audit required.
- [ ] (5 more Stale items, shown in the per-asset breakdown below)

## Informational

- [ ] **Debt**: `FeatureFlag[slug=experimental.old-rollout-2024]`: past `expected_removal_at` (2026-01-15), usage_count=0. Eligible for archive on next human pass.
- [ ] **Debt**: 3 `DesignTokenDefinition` rows deprecated past sunset (180-day window elapsed) with usage_count=0. Eligible for hard delete.
- [ ] **Orphaned (deprecated)**: `Control[key=button-gradient-legacy]`: deprecated since 2025-10. Last seen 2026-02-01. Staying `archived`; will be purge-eligible after 180 days.

## Per-asset breakdown

### Features
| Key | Class | Details | Resolution |
|---|---|---|---|
| `billing.rebilling` | Unregistered | `app/src/features/billing/rebilling.ts` annotation exists; registry row missing | Register via guide 01 |
| `legacy.quest-mode` | Orphaned (active) | Code missing since 2026-02-10 | Mark `deprecated` |

### Pages
| Key | Class | Details | Resolution |
|---|---|---|---|
| `admin-billing-addons` | Mismatched | `planGate` disagrees with code | Human reconcile |

### Routes
| Key | Class | Details | Resolution |
|---|---|---|---|
| `api.v1.referrals.redeem` | Unlinked | No `featureKey` | Owner assigns |
| `api.v1.users.whois` | Unregistered (low-sev) | Internal-only, no `@feature` annotation | Register as internal; not feature-bearing |

### Surfaces
| Key | Class | Details | Resolution |
|---|---|---|---|
| `pinned-chats-grid` | Stale | File hash changed | Auto-upsert on next run |

### Controls
| Key | Class | Details | Resolution |
|---|---|---|---|
| `button-gradient-legacy` | Orphaned (deprecated) | Informational | - |

### DesignTokenDefinitions
| Key | Class | Details | Resolution |
|---|---|---|---|
| `color.legacy-cream` | Debt | Past sunset, usage_count=0 | Eligible for purge |
| `radius.badge-legacy` | Debt | Past sunset, usage_count=0 | Eligible for purge |
| `shadow.flat-deprecated` | Debt | Past sunset, usage_count=0 | Eligible for purge |

### ContentEntries
| Key | Class | Details | Resolution |
|---|---|---|---|
| `legal.tos.version` | Mismatched | `editableByPlatformAdmin` field contradicts UI behavior | Code audit |

### FeatureFlags
| Slug | Class | Details | Resolution |
|---|---|---|---|
| `experimental.old-rollout-2024` | Debt | Past `expected_removal_at`, usage_count=0 | Archive |

## Proposed patches

```sql
-- Deprecation for `legacy.quest-mode`
UPDATE features
  SET status = 'deprecated',
      deprecated_at = now(),
      sunset_at = now() + interval '90 days',
      deprecation_reason = 'Code removed 2026-02-10; confirmed by owner'
  WHERE key = 'legacy.quest-mode';

-- Archive the retired flag
UPDATE feature_flags
  SET retired_at = now()
  WHERE slug = 'experimental.old-rollout-2024' AND retired_at IS NULL;
```

A human must approve before executing any patch. No auto-apply.

## Cross-worker-bee pings

- `@ux-ui-svelte-worker-bee`: `DesignTokenDefinition[color.legacy-cream]` is past sunset and unused. Please confirm no upcoming brief changes that would revive it.
- `@security-worker-bee`: `api.v1.referrals.redeem` is partner-facing and currently unlinked. Please include in next partner-contract review.
- `@library-worker-bee`: `billing.rebilling` has no `prd_ref`. If a PRD exists, please cross-link; if not, a PRD is needed before `active`.

## Next report

Scheduled: 2026-04-24T02:00:00.000Z
