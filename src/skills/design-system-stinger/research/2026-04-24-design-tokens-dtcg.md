# Design Tokens Community Group (W3C) Specification

**Sources:**
- https://www.designtokens.org/tr/drafts/format/
- https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
- https://www.w3.org/community/design-tokens/

**Retrieved:** 2026-04-24

## Summary

The Design Tokens Community Group (DTCG) published the first stable
specification (2025.10) in October 2025. It defines a JSON file format for
exchanging design tokens across tools (Figma, Style Dictionary, CSS, iOS,
Android). Key features:

- JSON structure where tokens are keyed objects with `$value` and `$type`
  properties. `$value` is a reserved key.
- Groups can nest tokens; `$extends` inherits tokens and properties.
- File extensions: `.tokens` or `.tokens.json`.
- Supports OKLCH, hex, P3, Rec.2020 and all CSS Color Module colors.
- Token references via `{group.token.name}` alias syntax.
- Component-level references for sophisticated systems.

## Example

```json
{
  "color": {
    "brand": {
      "primary": { "$value": "#1B2B4B", "$type": "color" },
      "accent":  { "$value": "#C5A44E", "$type": "color" }
    }
  },
  "radius": {
    "card":    { "$value": "14px", "$type": "dimension" },
    "button":  { "$value": "12px", "$type": "dimension" }
  }
}
```

## Relevance to this stinger

- The Bee's canonical source of truth is `01-master-tokens.css` (CSS custom
  properties), not DTCG JSON. Rationale: CSS custom properties are directly
  usable by the runtime with zero tooling.
- DTCG JSON is useful as an **export target** when the product needs to sync
  to Figma or emit iOS/Android tokens. Treat it as a downstream format.
- `guides/03-authoring-tokens.md` notes the translation path (a small Node
  script can walk `01-master-tokens.css` and emit `.tokens.json`) but keeps
  DTCG out of the bootstrap scope.
- The token **naming** in `01-master-tokens.css` should be DTCG-friendly so
  a future round-trip is mechanical: dot-nested semantic names
  (`color.brand.primary`) translate cleanly to both CSS custom properties
  (`--color-brand-primary`) and DTCG JSON groups.
