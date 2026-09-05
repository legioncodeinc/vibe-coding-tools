# Guide: `DesignTokenDefinition` (09)

> **Applies to:** every CSS custom property declared in `library/knowledge/private/ux-ui/01-master-tokens.css`: colors, radii, shadows, blurs, spacing, typography, motion, z-index, opacity.

## 1. Purpose

Today, in many deploying products, token *values* live in tenant-scoped tables (e.g., `TenantTheme.tokens` JSON) and platform-preset tables (e.g., `PlatformThemePreset.tokens` JSON). But the *catalog* (the authoritative list of which tokens exist, their categories, defaults, and tenant-override rules) typically exists only as CSS.

`DesignTokenDefinition` is that missing catalog. It makes theme-validator and theme-builder queryable.

## 2. DB table

| Model | Role |
|---|---|
| `DesignTokenDefinition` | Platform-owned catalog of every named CSS token |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | the CSS var name with leading `--` stripped, e.g., `color.primary`, `radius.lg`, `shadow.glass`. Dotted form; generator maps `--color-primary` to `color.primary` |
| `cssVarName` | `String @unique` | generator | yes | the actual CSS custom property, e.g., `--color-primary` |
| `category` | `enum(color/radius/shadow/blur/space/typography/motion/z_index/opacity/breakpoint)` | human | yes | |
| `defaultValueLight` | `String` | human | yes | |
| `defaultValueDark` | `String?` | human | no | |
| `defaultValueHighContrast` | `String?` | human | no | |
| `tenantOverridable` | `Boolean @default(true)` | human | yes | whether `TenantTheme.tokens` can override this |
| `semanticRole` | `String?` | human | yes | human description: "primary brand color used on CTAs"; maintained by ux-ui-svelte-worker-bee |
| `replacementKey` | `String?` | human | no | set when deprecated |
| `uxuiBriefRef` | `String` | human | yes | section of `01-master-tokens.css` |
| `featureKey` | `String?` | human | no | usually null (design primitives are shared) |

## 3. Code location and detection

- **Scan path:** `library/knowledge/private/ux-ui/01-master-tokens.css`
- **Detection:** CSS custom property declarations inside `:root` or `@theme`.
- **Required annotations:** none in code; the generator derives `category` from the prefix (`--color-*` to `color`, `--radius-*` to `radius`, etc.). `semanticRole` must be filled by ux-ui-svelte-worker-bee via the admin UI.

## 4. Registration fields

### Human fields
`category` (validated against prefix), `defaultValueLight`, `defaultValueDark`, `defaultValueHighContrast`, `tenantOverridable`, `semanticRole`, `uxuiBriefRef`, plus Shared Metadata.

### Generator fields
`cssVarName`, `key` (derived), `codePath`, `fileHash`.

## 5. Lifecycle

Special: sunset window is **180 days** (not 90). Token deprecation is disruptive; every tenant custom theme may reference the token.

See `guides/04-deprecation-and-sunset.md` §DesignTokenDefinition deprecation for the full dance.

## 6. Relationships

**DesignTokenDefinition referenced by:** `Surface.tokensConsumed`, `Control.tokensConsumed`, `Display.tokensConsumed`, `TenantTheme.tokens` (JSON), `PlatformThemePreset.tokens` (JSON).

## 7. Hand-offs

- **ux-ui-svelte-worker-bee** owns `semanticRole` entirely. You never invent what a token means.
- **Theme validator** (the deploying product's tenant-theme validation feature) reads from this catalog to reject unknown keys in tenant theme writes.
- **Theme builder UI** (the deploying product's theme-builder feature) renders from this catalog.

## 8. Pitfalls

- Adding a token to `01-master-tokens.css` and not letting the sync generator catalog it first; theme-builder panics.
- Renaming a CSS var (`--color-primary` to `--color-brand`) without a successor row. Never. Use `replacementKey` + keep the old row `deprecated` for 180 days.
- Setting `tenantOverridable: false` without explicit ux-ui approval. Most tokens are tenant-overridable by design.
- Hex literal in `defaultValueLight` when the token is supposed to reference another token (chained token). Flag: chained tokens go in the value as `var(--other-token)`.

## 9. Example

```ts
await prisma.designTokenDefinition.create({
  data: {
    key: "color.primary",
    cssVarName: "--color-primary",
    category: "color",
    defaultValueLight: "#1B2B4B",
    defaultValueDark: "#0F1D35",
    defaultValueHighContrast: "#000000",
    tenantOverridable: true,
    semanticRole: "Primary brand color used on CTAs and active nav states",
    uxuiBriefRef: "library/knowledge/private/ux-ui/01-master-tokens.css#colors",
    codePath: "library/knowledge/private/ux-ui/01-master-tokens.css",
    fileHash: "88aa99...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-167d",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/design-token-example.md`.

## 10. Checklist

- [ ] CSS var is declared in `01-master-tokens.css`
- [ ] `category` matches the prefix convention
- [ ] `defaultValueLight` is present (always required)
- [ ] `semanticRole` is filled by ux-ui-svelte-worker-bee (not by you)
- [ ] `tenantOverridable` defaults to `true` unless ux-ui-svelte-worker-bee opts out
- [ ] Value references either a raw literal or a chained `var(--...)`: no broken references
