<!-- Template. inventory/shadcn-prepare.mjs fills {{APP_NAME}}, {{APP_CONTEXT}}, {{SHADCN_DIR}}, {{INVENTORY_DIR}}, {{CATALOG}} and saves it as <SHADCN_DIR>/MAP-INSTRUCTIONS.md. -->

# shadcn/ui component map task

You are mapping {{APP_NAME}}'s captured UI components ({{APP_CONTEXT}}) onto a shadcn/ui component library, so an engineer (or an AI) can rebuild every captured component with shadcn/ui. Accuracy matters more than coverage: a wrong mapping costs more than a gap.

## Inputs

- Your batch file (path given in your task): up to 30 components from `ledger.json`, each with name, kind, layer, purpose, anatomy, parts, variants (with measured visual values), states, tokens observed, instance count, routes, related components, and `folder` (the component's folder under `{{INVENTORY_DIR}}/components/`).
- Each component's `component.md` and `screenshots/` in its folder. Open the screenshots with Read when the mapping is not obvious from the text.
- The shadcn/ui catalog (the only valid component names, variants, and theme tokens):

```json
{{CATALOG}}
```

## How to map

For every component in the batch, choose one strategy:

| Strategy | Use when | Example |
| --- | --- | --- |
| `direct` | One shadcn component with an existing variant fits | outline button to `button` variant `outline` |
| `variant` | One shadcn component fits, but the look needs a new variant added to its cva variants | brand gradient CTA to `button` with a new `gradient` variant |
| `compose` | Several shadcn components (and their subcomponents) combine to build it | provider card to `card` + `badge` + `switch` + `button` |
| `custom` | Nothing in the catalog fits; build it from Tailwind and theme tokens, optionally inside a shadcn shell | topology diagram node |
| `skip` | Not a UI component to rebuild (layout fragment, third-party logo image, pure text) | provider logo image |

Rules:

- Use only component names from the catalog. `data-table` and `date-picker` are guides: map to their building blocks (`table` with TanStack Table; `popover` and `calendar`). Never use `toast`; use `sonner`.
- `props` values are single values: exactly one catalog value, or exactly the `name` of an entry you declare in `newVariants` (no lists, no `a | b`, no `(new)` or other annotations). When a component switches variant by state or tone, set `props` to its most common variant and list every state or tone in `variantMap`, declaring each non-catalog value in `newVariants`.
- Use only variant and size values the catalog lists for `button`, `badge`, and `alert`. Anything else is a `newVariants` entry with an exact name and the Tailwind or token recipe.
- Name subcomponents using shadcn/ui React exports (for example `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`, `TabsList`, `TabsTrigger`, `SelectTrigger`) only when you are confident they exist; otherwise describe the structure in `structure`.
- Map colors to theme tokens (`primary`, `muted-foreground`, `destructive`, `border`, `ring`, `sidebar-accent`, and so on). If the captured color has no token role, propose a custom token (for example `success`, `warning`, `info`, `brand-gradient`) in `customTokens`.
- Preserve measured values in `recipe` when they matter (radius, height, padding), referencing the component's measured table.
- Record interaction states you can see or infer from `states` (hover, active, disabled, selected, checked) and which shadcn prop or data attribute carries them.
- Be honest: set `confidence` low and explain in `notes` when you are guessing.

## Output

Write ONE file at the output path given in your task: a JSON array with one object per input component, in input order:

```json
{
  "name": "button-primary-gradient",
  "strategy": "direct | variant | compose | custom | skip",
  "shadcn": [
    { "component": "button", "import": "@/components/ui/button", "subcomponents": [], "props": { "variant": "default", "size": "sm" }, "role": "root" }
  ],
  "variantMap": [
    { "captured": "icon-and-label", "shadcn": "variant=default size=sm", "notes": "leading icon via data-icon=\"inline-start\"" }
  ],
  "newVariants": [
    { "component": "button", "prop": "variant", "name": "gradient", "recipe": "background: linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to)); color: white; express as Tailwind utilities in the project's Tailwind version", "tokens": ["brand-gradient"] }
  ],
  "customTokens": [ { "name": "brand-gradient-from", "value": "#e54d5e", "reason": "signature CTA gradient start used on 4 routes" } ],
  "tokens": { "background": "primary", "text": "primary-foreground", "border": "none", "radius": "radius-md", "ring": "ring" },
  "states": [ { "state": "disabled", "shadcn": "disabled prop" } ],
  "structure": "JSX-like outline of the composition, for compose and custom strategies",
  "install": ["button"],
  "svelte": "shadcn-svelte equivalent in one line (namespace imports such as Card.Root)",
  "gaps": ["anything the capture did not show that the implementation will need"],
  "notes": "",
  "confidence": "high | medium | low"
}
```

Before finishing: every input component appears exactly once; every `shadcn[].component` and every `install` entry is in the catalog; the file is valid JSON (`python3 -m json.tool`). Do not create or modify any other file. Never use em dashes or en dashes.

Final reply: counts per strategy and the number of low-confidence mappings.
