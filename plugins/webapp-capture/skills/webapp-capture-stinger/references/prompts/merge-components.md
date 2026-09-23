<!-- Template. Fill {{APP_NAME}}, {{APP_CONTEXT}}, {{RAW_DIR}} (absolute) and save as <RAW_DIR>/ai/MERGE-INSTRUCTIONS.md before dispatching agents. -->

# Component merge task

You are consolidating a UI component inventory for {{APP_NAME}}, {{APP_CONTEXT}}. A UX/UI AI will use your result to write the brand token guide and design system. Your job is the canonical component list: what the real, reusable components are, and which extracted groups are variants of each.

## Input

`{{RAW_DIR}}/ai/merge-input.json`: an array of group descriptions. Code clustered DOM elements into groups; one Sonnet agent per batch described them without seeing other batches. Each entry has the description fields (`gid`, `name`, `kind`, `purpose`, `anatomy`, `variants`, `states`, `visual`, `tokens_observed`, `usage`, `same_as`, `confidence`) plus `instances`, `variantCount`, `routes`, `regions`, `category`, `icons`, and `sheet` (absolute path to a composite image, or null).

Because batches were described independently, expect: the same component under different names, the same name for different components, and parent/child fragments described as separate things (a card, its footer row, its heading).

## Process

1. Read the whole input.
2. Group entries that are the same reusable component. Merge when purpose, anatomy, and visual treatment match, even if the HTML tag differs. Keep separate when the visual treatment or role meaningfully differs (for example a primary gradient button and a ghost button are separate components; the same button in red for destructive use is a variant).
3. When unsure whether two entries match, open their `sheet` images with the Read tool and compare. Do this for every merge you are not certain about.
4. Treat parts of a larger component (card footer row, card heading, icon tile inside a card) as `parts` of the parent component, not as separate components, unless they are reused on their own elsewhere.
5. Icons: collapse all Material Symbols icon groups into ONE `icon` component whose variants are the distinct size and color treatments. List glyph names in `glyphs`.
6. Choose clear, stable kebab-case names. Prefer `<role>-<modifier>` (for example `button-primary`, `button-ghost-icon`, `badge-status`, `card-provider`).

## Output

Write ONE file: `{{RAW_DIR}}/ai/components.json`

```json
{
  "components": [
    {
      "name": "button-primary",
      "kind": "button",
      "layer": "primitive | composite | layout | brand | icon",
      "purpose": "2-4 sentences for an AI reader: what it is for in {{APP_NAME}} and when to use it",
      "anatomy": "ordered parts",
      "parts": [{"name": "footer-row", "gids": ["g0006"], "description": "..."}],
      "variants": [
        {"name": "default", "gids": ["g0035"], "description": "concrete visual difference", "visual": {"background": "", "text": "", "border": "", "radius": "", "shadow": "", "typography": "", "padding": "", "size": ""}}
      ],
      "states": ["default", "hover (from classes)", "disabled"],
      "tokens_observed": ["surface #1a1a1a", "radius 8px"],
      "usage": "pages and regions, with approximate instance counts",
      "glyphs": [],
      "related": ["other component names"],
      "gids": ["every gid folded into this component, including parts"],
      "confidence": "high | medium | low",
      "notes": "anything the design-system author should know (inconsistencies, one-offs, accessibility gaps)"
    }
  ],
  "unassigned": [{"gid": "g0000", "reason": "why it is not a component"}],
  "inconsistencies": ["cross-component observations useful for tokens, e.g. 'two different card surfaces: #161b22 and #111520'"]
}
```

## Rules

- Every one of the input gids must appear exactly once across all `components[].gids` and `unassigned[].gid`. Verify this with a script (python3 or node) before finishing and fix any gaps or duplicates.
- Ground every claim in the input descriptions or the images. Do not invent components, variants, or states.
- Do not create or modify any other file. Do not read files outside `{{RAW_DIR}}/`.
- Never use em dashes or en dashes.
- Validate JSON with `python3 -m json.tool` before finishing.

Final reply: number of components, number unassigned, number of sheets you opened, and the 5 most important inconsistencies in one line each.
