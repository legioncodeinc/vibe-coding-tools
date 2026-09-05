# Example: `Surface` row

A well-formed glass-card surface. Demonstrates the `tokensConsumed` derivation and the `uxuiBriefRef` linkage to ux-ui-svelte-worker-bee's brief.

## Code

```tsx
// app/src/components/cards/CardGlass.tsx

/**
 * @surface card-glass
 * @kind card
 * @feature generic-ui
 * @ownerTeam ux
 * @prd FEA-132
 */
export default function CardGlass(props: CardGlassProps) {
  return (
    <div className="glass-surface depth-1">{props.children}</div>
  );
}
```

Stylesheet (for generator's `tokensConsumed` extraction):

```css
/* app/src/components/cards/CardGlass.module.css — excerpt */
.glass-surface {
  background: var(--color-surface-glass-bg);
  backdrop-filter: blur(var(--blur-md));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glass);
  padding: var(--space-4);
}
```

## Registry row

```ts
{
  id: "clxcardglass",
  key: "card-glass",
  kind: "card",
  depthLevel: "glass",
  statesSupported: ["default", "hover", "elevated"],
  tokensConsumed: [
    "color.surface-glass-bg",
    "blur.md",
    "radius.lg",
    "shadow.glass",
    "space.4"
  ],
  featureKey: "generic-ui",
  uxuiBriefRef: "library/knowledge/private/ux-ui/03-components/cards-and-surfaces.md#glass-card",
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "ux",
  prdRef: "FEA-132",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-04-22T12:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  // Generator-owned
  codePath: "app/src/components/cards/CardGlass.tsx",
  exportName: "default",
  fileHash: "3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d",
  propsSchemaDigest: "8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c",
  detectedAt: "2026-04-22T12:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## What the generator did

1. Walked `app/src/components/**/*.tsx` and found `@surface` annotation.
2. Extracted `key` (`card-glass`), `kind` (`card`), `feature` (`generic-ui`), owner, prd.
3. Walked imports to find `CardGlass.module.css`.
4. Grep-extracted `var(--*)` references to populate `tokensConsumed`.
5. Hashed the component source for `fileHash`.
6. Hashed the exported TypeScript prop types for `propsSchemaDigest`.
7. Upserted the row. Human filled `description`, `statesSupported`, `uxuiBriefRef`, then flipped `status: active`.

## Checklist (filled)

- [x] Component file exists with `@surface` annotation
- [x] `kind: card` matches role
- [x] `depthLevel: glass` aligns with ux-ui brief §2
- [x] All `tokensConsumed` resolve to `DesignTokenDefinition` rows
- [x] `uxuiBriefRef` resolves to a real brief section
- [x] No hex literals: all colors via tokens
