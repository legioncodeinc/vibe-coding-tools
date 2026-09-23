# {{Component Group Name}}

> Section of the UX/UI masterplan. Anchors to [`../00-design-brief.md` §{{N}}](../00-design-brief.md).
> Feeds PRD **{{feature-code}}** (if applicable).

## Variants

{{list of 2-4 variants with aesthetic intent and token composition}}

### `primary`
{{description}}

```css
{{CSS composition}}
```

### `secondary`
{{description}}

### `outline` / `ghost`
{{description}}

## Sizes

| Size | Height | H-padding | Font |
|------|--------|-----------|------|
| `sm` | {{px}} | {{px}} | `{{--text-token}}` / {{weight}} |
| `md` (default) | {{px}} | {{px}} | `{{--text-token}}` / {{weight}} |
| `lg` | {{px}} | {{px}} | `{{--text-token}}` / {{weight}} |

Mobile floor: `md` (44px). Do not ship `sm` on touch-primary surfaces.

## States

- **Rest:** {{token composition}}.
- **Hover:** `color-mix(in srgb, {{base}} 92%, {{direction}})`.
- **Active/press:** `.press-scale` (scale 0.97, opacity 0.92).
- **Focus-visible:** 2px `--color-accent` outline, 2px offset. Never remove.
- **Disabled:** opacity 0.5, `pointer-events: none`.
- **Loading** (if applicable): {{spinner spec}}.

## Tokens consumed

- `{{token-1}}`
- `{{token-2}}`
- `{{token-3}}`

(Any token not on this list is forbidden inside the component.)

## Example

```tsx
{{complete JSX or HTML example}}
```

## Replaces (in current code)

{{list files/classes this spec supersedes, or "N/A, greenfield"}}

## Accessibility

- Role: {{native <button> | role="..."}}.
- Keyboard: {{Enter/Space to activate, Tab to focus}}.
- Touch target: `>= 44x44pt` on mobile.
- Focus-visible outline: 2px `--color-accent`, 2px offset.

## Common mistakes

- {{bug pattern 1}}
- {{bug pattern 2}}
- {{bug pattern 3}}

## Related components

- [`{{other-component}}.md`]({{other-component}}.md): {{relationship}}.
