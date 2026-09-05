# Example: `DesignTokenDefinition` row

A brand-color token with light/dark values and tenant overridability.

## Code

```css
/* library/knowledge/private/ux-ui/01-master-tokens.css — excerpt */
:root {
  --color-primary: #1B2B4B;
}

[data-theme="dark"] :root {
  --color-primary: #0F1D35;
}

[data-theme="high-contrast"] :root {
  --color-primary: #000000;
}
```

## Registry row

```ts
{
  id: "clxtokprimary",
  key: "color.primary",
  cssVarName: "--color-primary",
  category: "color",
  defaultValueLight: "#1B2B4B",
  defaultValueDark: "#0F1D35",
  defaultValueHighContrast: "#000000",
  tenantOverridable: true,
  semanticRole: "Primary brand color used on CTAs, active nav states, and key accents",
  replacementKey: null,
  uxuiBriefRef: "library/knowledge/private/ux-ui/01-master-tokens.css#colors",
  featureKey: null,
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "ux",
  prdRef: "FEA-167d",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-04-23T15:00:00.000Z",
  updatedAt: "2026-04-23T15:00:00.000Z",

  codePath: "library/knowledge/private/ux-ui/01-master-tokens.css",
  fileHash: "ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12",
  detectedAt: "2026-04-23T15:00:00.000Z",
  lastSeenAt: "2026-04-23T15:00:00.000Z",
}
```

## Tenant-override relationship

Tenant A's `TenantTheme.tokens` JSON:

```json
{
  "version": 1,
  "core": {
    "primary": "#7A2B4B"
  }
}
```

The theme-projector resolves `color.primary` → Tenant A's `#7A2B4B` at SSR time. The catalog row defines the key exists, is overridable, and what the fallback value is.

## What ux-ui-svelte-worker-bee filled vs what the generator filled

| Field | Filled by |
|---|---|
| `key`, `cssVarName`, `category` | sync-generator (from CSS) |
| `defaultValueLight`, `defaultValueDark`, `defaultValueHighContrast` | sync-generator (from CSS) |
| `tenantOverridable` | ux-ui-svelte-worker-bee (defaults to true; opt-out only) |
| `semanticRole` | **ux-ui-svelte-worker-bee** (human meaning, you never write this) |
| `uxuiBriefRef` | ux-ui-svelte-worker-bee |
| `status`, `ownerTeam`, `prdRef`, `description` | human (platform admin or PRD-driven) |
| `codePath`, `fileHash`, `detectedAt`, `lastSeenAt` | sync-generator |

## Checklist (filled)

- [x] CSS var declared in `01-master-tokens.css`
- [x] `category` matches prefix (`--color-*` → `color`)
- [x] `defaultValueLight` present
- [x] `semanticRole` authored by ux-ui-svelte-worker-bee
- [x] `tenantOverridable: true`
