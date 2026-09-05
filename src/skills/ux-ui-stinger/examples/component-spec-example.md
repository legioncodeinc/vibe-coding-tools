# Example — authoring a new component spec (NavSectionHeader)

> A worked example of `guides/01-enforcement-procedure.md` step 11 — extending the design-system folder when it doesn't cover the question. Also demonstrates `guides/06-lucide-react-icons.md` and `guides/08-wrapper-authoring.md`.
>
> Scenario: a feature PR asked "what should a section header inside the left nav look like?" — the brief didn't have an answer. Before merging anything, the Angel authored this spec into `library/knowledge-base/ux-ui/03-components/nav-section-header.md` and *then* ruled on the PR.

---

# NavSectionHeader

**Built on:** system-native; no external primitive wrapped.
**Source:** `components/<product>/NavSectionHeader.tsx`.

## Purpose

NavSectionHeader is the small label that groups rows inside the left navigation — "Workspaces", "Recent", "Pinned". It is visually de-emphasized relative to the nav rows it introduces; its job is orientation, not action.

## Contract

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | The section title. Uppercase is applied via CSS; authors supply sentence case. |
| `icon` | `keyof typeof Lucide` | — | Optional leading icon, rendered through `<Icon tone="left-nav" size="sm" />`. |
| `collapsed` | `boolean` | `false` | When the left nav is collapsed, headers hide their label and render only the icon (if present). |
| `className` | `string` | — | Additional classes for the root. |

### Variants

None. Section headers are uniform across the app — that is the point of the primitive.

## Styling

- **Root element:** `<div role="presentation">`. Not a `<button>`; not interactive.
- **Height:** 24px.
- **Horizontal padding:** `ps-3 pe-3` (logical properties).
- **Typography:** `text-[11px] font-medium uppercase tracking-[0.08em]`.
- **Color:** `text-[color:var(--color-icon-muted)]`.
- **Margin-block:** `mt-4 mb-1`.
- **Icon (if present):** `<Icon tone="left-nav" size="sm" />`, `ms-0 me-2`.
- **Collapsed state:** `label` visually hidden via `sr-only`; icon remains.

## Why wrap

This is a system-native primitive, not a library wrapper. It exists because three places in the product had drifting variants of the same pattern (two used `<h4>`, one used `<span>`, they had three different colors). Consolidation eliminates the drift.

## Accessibility

- **Role:** `presentation` — the header is visual structure, not a heading (the nav already has a landmark role).
- **Screen reader:** when `icon` is supplied without `label` (collapsed state), the icon's `aria-label` equals the hidden `label` text so screen-reader users still hear the section name.
- **Keyboard:** not focusable. Tab order skips it.

## Example

```tsx
<NavSectionHeader label="Pinned" icon="Pin" />
<NavRow href="/inbox">Inbox</NavRow>
<NavRow href="/favorites">Favorites</NavRow>

<NavSectionHeader label="Recent" />
<NavRow href="/projects/alpha">Alpha</NavRow>
```

## Replaces (in current code)

- `src/app/nav/LeftNav.tsx:54-59` (inline `<h4 className="text-xs uppercase text-gray-500 ...">`).
- `src/app/nav/sections/PinnedSection.tsx:22-28` (inline `<span>` variant).
- `src/app/nav/sections/RecentSection.tsx:18-24` (inline `<span>` variant with different color).

## Related

- `nav-row.md` — the row pattern this header introduces.
- `icon.md` §3 — `tone="left-nav"` rules that govern the optional icon.

## Changelog

- 2026-04-24 — initial author (ux-ui-worker-bee). Commit: `ux-ui: components: add nav-section-header`.
