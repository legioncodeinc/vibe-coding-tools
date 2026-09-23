<!-- Template. Fill {{APP_NAME}}, {{APP_CONTEXT}}, {{RAW_DIR}} (absolute) and save as <RAW_DIR>/ai/INSTRUCTIONS.md before dispatching agents. -->

# Component description task

You are cataloguing UI components of {{APP_NAME}}, {{APP_CONTEXT}}. Your output feeds a UX/UI AI that will write the brand token guide and design system, so it must be precise, specific to this app, and grounded in evidence.

## Input

A batch file (path given in your task) containing up to 10 component groups. Code clustered these from live DOM elements across pages. Each group has:

- `gid`, `category` (HTML tag, ARIA role, `icon`, or `input:<type>`), `instances`, `variantCount`
- `routes`, `regions` (sidebar, header, main), `sections` (nearest section headings), `labels` (form or badge labels)
- `icons` (Material Symbols glyph names used inside), `sampleText`, `classes` (Tailwind)
- `sheet`: absolute path to ONE composite image showing up to 4 variants at 3x, labelled "variant N" (null if no crops)
- `variants[]`: `instances`, `routes`, and an `example` with `text`, `ariaLabel`, `context` (page, section, label, parentText), `rect` (CSS px), computed `style`, truncated `html`

## Required process

For EVERY group in the batch, in order:

1. If `sheet` is not null, open it with the Read tool and look at it. This is mandatory, do not skip it. Your description must reflect what the image shows.
2. Read the examples' `context`, `html`, `style`, `icons`, and `sampleText`.
3. Write the entry.

## Output

Write ONE file at the output path given in your task: a JSON array, one object per group, same order, exactly these fields:

```json
{
  "gid": "g0001",
  "name": "kebab-case, specific and reusable, e.g. provider-card, button-icon-ghost, status-badge, sidebar-nav-item, section-heading",
  "kind": "button | icon-button | link | nav-item | tab | tablist | input | select | switch | checkbox | radio | badge | pill | tag | card | panel | banner | list-item | table | table-header | table-cell | heading | label | text | icon | image | logo | code | kbd | tooltip | dialog | menu | layout | container | other",
  "purpose": "2-3 sentences written for an AI: what the user does with it or learns from it in {{APP_NAME}}, referencing the actual pages/sections where it appears",
  "anatomy": "ordered parts, e.g. 'leading Material icon (18px) + label + trailing count badge'",
  "variants": "what differs between variants (tint color per provider, active vs inactive, size), with concrete values; or 'single'",
  "states": ["only states that are visible or evidenced: default, active, selected, checked, disabled, connected, error, etc."],
  "visual": {
    "background": "hex or hex+alpha",
    "text": "hex",
    "border": "width style hex, or none",
    "radius": "px or full",
    "shadow": "none or short description",
    "typography": "size/line-height weight, family class (system sans, mono, icon font)",
    "padding": "t r b l px",
    "size": "typical w x h CSS px"
  },
  "tokens_observed": ["design values worth tokenizing, e.g. 'surface #1a1a1a', 'radius 14px', 'accent #e54d5e'"],
  "usage": "plain words: which pages/regions and how often",
  "same_as": ["gids in THIS batch that are really the same component (different tag or minor variation)"],
  "is_noise": false,
  "noise_reason": "",
  "confidence": "high | medium | low"
}
```

## Rules

- Convert rgb()/rgba() to hex (append alpha byte when alpha < 1, e.g. #ffffff14). Keep other color syntaxes as given if you cannot convert.
- `is_noise: true` only for pure layout wrappers or fragments with no visual identity of their own. Explain in `noise_reason`.
- Never invent behavior or states you cannot see or infer from text, icons, aria attributes, or HTML.
- Do not create or modify any other file. Do not read files outside `{{RAW_DIR}}/`.
- Never use em dashes or en dashes.
- Validate your output with `python3 -m json.tool <file> > /dev/null` before finishing.

Final reply: one line with the number of groups written, how many sheets you opened, and how many were marked noise.
