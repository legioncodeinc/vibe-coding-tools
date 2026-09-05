# 05: Authoring Component Briefs

Each file in `03-components/<group>.md` is one component group's contract.
Target: 8 to 15 briefs for a real product. 80 to 300 lines each.

> Template: `../templates/component-spec.md`.
> Research backing: `../research/2026-04-24-shadcn-radix-patterns.md`.

## Group components thoughtfully

Group by *role*, not by element:

- `buttons-and-ctas.md`: all button variants together (primary, secondary,
  outline, ghost, link).
- `badges-and-pills.md`: all small-label surfaces together.
- `cards-and-surfaces.md`: card, card-hero, card-nested, list-item.
- `inputs-and-search.md`: text input, textarea, select, search.
- `nav-<location>.md`: one per nav zone (top, bottom, left, right).

Typical count: 8 to 15 groups for a full product.

## The canonical doc shape

Every component brief follows this exact shape:

```markdown
# <Component Group Name>

> Section of the UX/UI masterplan. Anchors to [`../00-design-brief.md` §<N>](...).
> Feeds PRD **<feature-code>** (if applicable).

## Variants

<List + visual/semantic description of each variant. 2–4 variants typical.>

## Sizes

<Table: size · height · padding · font>

## States

<Rest, hover, active/press, focus-visible, disabled, loading.>

## Tokens consumed

<Bullet list of tokens this component reads. Any token not on this list
is forbidden inside the component.>

## Example

<JSX or HTML + CSS, complete, copy-pasteable.>

## Replaces (in current code)

<If the product has existing code, list the files/classes this spec
supersedes. For greenfield, omit this section or write "N/A — greenfield".>

## Accessibility

<ARIA role, keyboard, focus, touch-target minimum.>

## Common mistakes

<Short list of bug patterns specific to this component.>
```

## Variants

Four is the common ceiling. More than four signals the group is too
broad: split it.

For buttons:
- `primary`: one per screen, the main CTA.
- `secondary`: the "glass CTA" / default button.
- `outline`: transparent, for tertiary actions.
- `ghost`: toolbar / row actions.

Describe each with:
- The aesthetic intent ("the glass CTA, most buttons").
- The exact token composition.
- A representative use ("Send DM", "Cancel", "Expand").

## Sizes

Table with height + horizontal padding + font. Example:

| Size | Height | H-padding | Font                          |
|------|--------|-----------|-------------------------------|
| `sm` | 36px   | 12px      | `--text-12` / 600             |
| `md` | 44px   | 16px      | `--text-14` / 600             |
| `lg` | 52px   | 20px      | `--text-16` / 700             |

Mobile floor: 44px (Apple HIG). Do not ship `sm` on touch-primary.

## States

All five, always:

1. **Rest**: the default.
2. **Hover**: token-derived hover tint via `color-mix()`.
3. **Active/press**: `.press-scale` or equivalent.
4. **Focus-visible**: 2px brand outline, 2px offset. Never remove.
5. **Disabled**: opacity 0.5, `pointer-events: none`.

Some components add: loading (spinner or skeleton), error, success.

## Tokens consumed

Explicit list. Example for a primary button:

- `--color-accent`, `--color-accent-dark` (gradient).
- `--color-text-inverse` (label).
- `--radius-button`.
- `--shadow-elevated`, `--shadow-gold-glow`.
- `--dur-instant`, `--ease-out-subtle`.

This is the audit trail: `ux-ui-svelte-worker-bee` later enforces that component
code uses only tokens on this list.

## Example

Complete, copy-pasteable JSX (if React/Vue) or HTML + scoped CSS:

```tsx
<button
  className="flex-1 press-scale h-11 rounded-[var(--radius-button)] font-semibold text-white"
  style={{ background: "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)" }}
>
  Send Referral
</button>
```

Prefer semantic class names over raw Tailwind utilities where the recipe
is non-trivial: the CSS utility layer exists to eliminate the inline
gradient shown above.

## "Replaces (in current code)": load-bearing for migrations

If the product has shipped code, name the files/classes this brief
supersedes:

```markdown
## Replaces (in current code)

- `app/src/components/ui/Button.tsx` — the `variant="gold"` and
  `variant="blue"` props are collapsed into `variant="primary"`.
- `app/src/components/ui/CTAButton.tsx` — merged into Button with
  `variant="primary"`.
- All inline `style={{ background: "#C5A44E" }}` occurrences — replaced
  by `variant="primary"` class.
```

This section is the migration receipt. `ux-ui-svelte-worker-bee` uses it to
enforce.

For greenfield products, write `N/A — greenfield`.

## Accessibility

At minimum:
- ARIA role (or "native `<button>`" if applicable).
- Keyboard contract: which keys activate, focus moves where.
- Touch target: `>= 44x44pt` on mobile.
- Focus visible outline spec.
- Any specific screen-reader considerations.

## Common mistakes

Short list. Each bullet is a bug pattern a reviewer should flag. For
buttons:

- Inline hex values for background.
- Mixing `primary` and `outline` in a pair (the alternating-pair rule).
- Removing focus-visible outline in a "style polish" pass.
- Using `sm` size on mobile primary CTAs.

## Group interconnection

A component brief may reference another component brief. Example:
cards reference badges (for the "status badge on a card" pattern).
Link explicitly:

```markdown
See [`badges-and-pills.md`](badges-and-pills.md) for the badge spec.
```

## Component brief health check

Before closing a brief, verify:

- [ ] All variants, sizes, states present.
- [ ] Tokens consumed listed exhaustively.
- [ ] One complete, copy-pasteable example.
- [ ] "Replaces" section (or N/A).
- [ ] Accessibility subsection.
- [ ] Cross-links to other components it depends on.
- [ ] Anchors back to `../00-design-brief.md` §N.
