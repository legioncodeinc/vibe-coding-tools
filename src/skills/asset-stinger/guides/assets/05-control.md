# Guide: `Control` (05)

> **Applies to:** interactive UI primitives: buttons, inputs, toggles, selects, sliders, checkboxes, radios, links, menu-items. Anything whose primary job is "capture user intent."

## 1. Purpose

The `Control` catalog enumerates every interactive primitive. Unlike `Surface` (containers), controls have states (hover, active, focus-visible, disabled, loading) and variants (primary, secondary, ghost, destructive).

## 2. DB table

| Model | Role |
|---|---|
| `Control` | Platform-owned catalog of interactive primitives |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `button-primary`, `toggle-standard` |
| `kind` | `enum(button/input/toggle/select/slider/checkbox/radio/link/menu_item)` | human | yes | |
| `variants` | `String[]` | human | yes | e.g., `["primary","secondary","outline","ghost"]` (buttons) |
| `statesSupported` | `String[]` | human | yes | `default`, `hover`, `active`, `focus_visible`, `disabled`, `loading` |
| `tokensConsumed` | `String[]` | generator | yes | |
| `featureKey` | `String?` | human | no | |
| `uxuiBriefRef` | `String` | human | yes | e.g., `library/knowledge/private/ux-ui/03-components/buttons-and-ctas.md` |
| `codePath` | `String` | generator | yes | |
| `exportName` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |
| `propsSchemaDigest` | `String` | generator | yes | |

## 3. Code location and detection

- **Scan path:** `app/src/components/**/*.tsx`
- **Detection:** JSDoc `@control <key>`.
- **Required annotations:** `@control <key>`, `@kind <kind>`, `@ownerTeam <slug>`.

## 4. Registration fields

### Human fields
`kind`, `variants`, `statesSupported`, `uxuiBriefRef`, plus Shared Metadata.

### Generator fields
`tokensConsumed`, `codePath`, `exportName`, `fileHash`, `propsSchemaDigest`.

## 5. Lifecycle

Standard. Control deprecation is usually tied to a variant rename or a broader design-system shift. Cross-check the `ux-ui-svelte-worker-bee` brief before deprecating.

## 6. Relationships

**Control references:** `DesignTokenDefinition[]`, `Feature`.

**Referenced by:** `Page.controlsUsed`, `Cta.control` (FK elevated from a string-keyed `Cta` reference via the deploying product's component-binding feature PRD), `MenuItemLabelBinding` targets (via elevation).

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: enforces "four button variants only" (primary / secondary / outline / ghost). If a `variants` array lists a fifth (e.g., `gradient`), flag.
- **security-worker-bee**: controls that accept user input (`kind: input`, `select`, `slider`) review for input validation coverage during feature-PRD security review.

## 8. Pitfalls

- Registering a `button` control with five variants. Brief says four. Flag.
- Missing `loading` state on controls that trigger async work.
- `statesSupported` listing `hover` for a touch-only control: violates accessibility and brief.
- Confusing a `link` (navigation) with a `button` (action). A link has `href`; a button has `onClick`. Register correctly; the a11y contract differs.

## 9. Example

```ts
await prisma.control.create({
  data: {
    key: "button-primary",
    kind: "button",
    variants: ["primary", "secondary", "outline", "ghost"],
    statesSupported: ["default", "hover", "active", "focus_visible", "disabled", "loading"],
    tokensConsumed: [
      "color.navy", "color.gold", "radius.button", "shadow.btn-primary",
      "dur.fast", "ease.out-subtle"
    ],
    featureKey: "generic-ui",
    uxuiBriefRef: "library/knowledge/private/ux-ui/03-components/buttons-and-ctas.md",
    codePath: "app/src/components/buttons/Button.tsx",
    exportName: "Button",
    fileHash: "b1c2d3...",
    propsSchemaDigest: "e4f5a6...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] Component file exists with `@control` annotation
- [ ] `kind` is correct (button vs link vs input, critical for a11y)
- [ ] `variants` count and names match the ux-ui brief
- [ ] `statesSupported` includes every state the component implements (no more, no less)
- [ ] `uxuiBriefRef` cites the controlling brief doc
- [ ] Input-taking controls have server-side validation guidance in the feature PRD
