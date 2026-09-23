# {{ComponentName}}

**Built on:** {{library-name}} {{library-version}} — see `research/library-versions.md`.
**Source:** `components/<product>/{{ComponentName}}.tsx`.
**Primitive wrapped:** `{{path-to-primitive}}`.

## Purpose

{{One-paragraph description in product vocabulary. What this component does, where it appears, what problem it solves.}}

## Contract

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual weight. {{Constraint, e.g., "Alternating CTA pairs are secondary-left / primary-right."}} |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height / padding preset. |
| `asChild` | `boolean` | `false` | When `true`, renders as `Slot`, composing onto the child element. For use with Radix primitives. |
| `...rest` | native `{{Element}}` props | — | Spread onto the root element. |

### Variants

- `primary` — {{description + token refs}}
- `secondary` — {{description + token refs}}
- `outline` — {{description + token refs}}
- `ghost` — {{description + token refs}}

## Why wrap

This component wraps `{{primitive}}` because it encodes:

- **Tokens:** {{which tokens the wrapper applies — e.g., `--color-primary`, `--radius-button`, `--dur-fast`}}.
- **Variants:** the product's `variant` vocabulary (not the library's), per the brief.
- **Motion:** {{which named bucket drives press / hover / focus transitions}}.

## Accessibility

- **APG pattern:** {{link to relevant WAI-ARIA APG pattern, e.g., https://www.w3.org/WAI/ARIA/apg/patterns/button/}}.
- **Focus ring:** `focus-visible:outline focus-visible:outline-[color:var(--color-focus-ring)]`.
- **Keyboard:** {{Enter / Space activation; Tab to focus.}}
- **Screen reader:** {{aria-label expectations, if any.}}

## Example

```tsx
<{{ComponentName}} variant="primary" size="md" onClick={handleClick}>
  {{Children}}
</{{ComponentName}}>
```

Composed into a Radix Trigger:

```tsx
<Dialog.Trigger asChild>
  <{{ComponentName}} variant="secondary">Open</{{ComponentName}}>
</Dialog.Trigger>
```

## Replaces (in current code)

- `{{path-to-legacy-component-1}}`
- `{{path-to-legacy-component-2}}`
- Inline implementations at `{{path:line-range}}`.

## Related

- `{{path-to-related-component}}` — {{relationship}}.

## Changelog

- {{YYYY-MM-DD}} — initial author. {{commit-sha}}.
