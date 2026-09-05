# UX/UI Review — PR #1842: Dashboard Project Card refresh

**Reviewer:** ux-ui-worker-bee
**Target:** `src/app/dashboard/ProjectCard.tsx` and `src/app/dashboard/ProjectCard.module.css`
**Date:** 2026-04-24
**Design-system folder consulted:** `library/knowledge-base/<product>-ux-ui/`

> This is a worked example of the 12-step procedure in `guides/01-enforcement-procedure.md` running against a (fictional) PR. It demonstrates `guides/00-principles.md`, `guides/02-token-and-utility-enforcement.md`, `guides/03-motion-rules.md`, `guides/06-lucide-react-icons.md`, `guides/07-framer-motion.md`, and `guides/10-common-violations.md` rows 1, 2, 3, 7, 9.

## Verdict

**Changes requested.** Four blocking findings before merge.

## Governing sections quoted

> Per `00-design-brief.md` §6.3 "Surfaces":
> "Every interactive card is a `.glass-surface` with the three-cue shadow stack. No inline backdrop-filter stacks. No hex literals for the surface color."

> Per `00-design-brief.md` §14 "Motion":
> "Sheet/tray/card enter-exit uses `--dur-default` / `--ease-spring-soft`. Hover / focus / press uses `--dur-fast` / `--ease-out-subtle`. No bespoke durations; no bespoke curves. `prefers-reduced-motion: reduce` collapses transforms to opacity-only."

> Per `03-components/icon.md` §2:
> "Feature code imports `<Icon>` from `@/components/<product>/Icon`. Never `import { ... } from 'lucide-react'`. The `tone` prop dictates stroke color and weight; never override inline."

## Findings

### Finding 1 — Inline glass-surface re-implementation

**Severity:** blocking

**Location:** `src/app/dashboard/ProjectCard.tsx:18-26`

**Current code:**
```tsx
<div
  className="rounded-xl p-4"
  style={{
    backdropFilter: 'blur(12px)',
    background: 'rgba(245, 240, 230, 0.65)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  }}
>
```

**Violation:** `guides/02-token-and-utility-enforcement.md` Rule 2 (inline utility re-implementation); `guides/10-common-violations.md` row 2; governing section §6.3 above.

**Proposed delta:**
```tsx
<div className="glass-surface depth-1 rounded-[var(--radius-card)] p-4">
```

**Rationale:** `.glass-surface` and `.depth-1` already encode the three-cue shadow stack and the beige-glass backdrop. Inline re-implementation loses the edge-highlight cue and drifts on alpha value.

---

### Finding 2 — Hex literal where token exists

**Severity:** blocking

**Location:** `src/app/dashboard/ProjectCard.tsx:31`

**Current code:**
```tsx
<h3 className="text-[#1f3a5f] font-semibold">{project.name}</h3>
```

**Violation:** `guides/02-token-and-utility-enforcement.md` Rule 1 (hex literal where token exists); `guides/10-common-violations.md` rows 1 and 5. Color `#1f3a5f` is the product's navy, already registered as `--color-navy` with tenant-override support.

**Proposed delta:**
```tsx
<h3 className="text-[color:var(--color-navy)] font-semibold">{project.name}</h3>
```

**Rationale:** hard-coding navy breaks tenant theming. Tenants override `--color-navy` in `[data-tenant="..."]` blocks; the literal bypasses that path entirely.

---

### Finding 3 — Bespoke Framer Motion duration

**Severity:** blocking

**Location:** `src/app/dashboard/ProjectCard.tsx:44-50`

**Current code:**
```tsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.237, ease: [0.07, 0.91, 0.29, 0.99] }}
>
```

**Violation:** `guides/03-motion-rules.md` Rule 1 (bespoke durations/curves); `guides/07-framer-motion.md` (bucket-keyed variants); governing section §14 above; `guides/10-common-violations.md` row 3.

**Proposed delta:**
```tsx
<Motion bucket="sheet-in">
```

`<Motion>` is the product's motion wrapper (see `templates/motion-wrapper.tsx`). The `sheet-in` bucket resolves to `--dur-default` / `--ease-spring-soft` and applies opacity-only fallback under `prefers-reduced-motion`.

**Rationale:** bespoke durations drift from each other and from the rest of the app. The bucket system is the consistency enforcement mechanism — bypassing it is exactly the kind of one-off style §14 rejects.

---

### Finding 4 — Raw Lucide import

**Severity:** blocking

**Location:** `src/app/dashboard/ProjectCard.tsx:3`, `:36`

**Current code:**
```tsx
import { ArrowUpRight } from 'lucide-react'
// ...
<ArrowUpRight size={18} strokeWidth={2.5} color="#c69d2b" />
```

**Violation:** `guides/06-lucide-react-icons.md` Rule 1 (always `absoluteStrokeWidth`), Rule 2 (pinned sizes), Rule 3 (tone maps to nav zone); governing section `03-components/icon.md` §2; `guides/10-common-violations.md` rows 7 and 12.

**Proposed delta:**
```tsx
import { Icon } from '@/components/<product>/Icon'
// ...
<Icon name="ArrowUpRight" tone="inherit" size="md" />
```

…with the surrounding text context setting `color: var(--color-gold-ink)` via `text-[color:var(--color-gold-ink)]` on the parent (if the gold tone is genuinely required per brief §5.2 "Accent text").

**Rationale:** direct Lucide imports bypass the wrapper's stroke-width-stability logic (`absoluteStrokeWidth`) and the tone → nav-zone mapping. Size `18` is off-preset.

---

## Library-integration notes

- shadcn/ui is not involved in this PR.
- Framer Motion usage should move to the `<Motion>` wrapper — see `guides/07-framer-motion.md` and `templates/motion-wrapper.tsx`.

## Tokens / utilities introduced

None. All tokens and utilities referenced in the proposed deltas already exist.

## Follow-ups

- No follow-up issues. The four deltas should resolve the PR.

## Citations

- `library/knowledge-base/<product>-ux-ui/00-design-brief.md` §6.3 "Surfaces"
- `library/knowledge-base/<product>-ux-ui/00-design-brief.md` §14 "Motion"
- `library/knowledge-base/<product>-ux-ui/03-components/icon.md` §2
- `guides/01-enforcement-procedure.md` steps 1–10
- `guides/02-token-and-utility-enforcement.md` Rules 1, 2
- `guides/03-motion-rules.md` Rule 1
- `guides/06-lucide-react-icons.md` Rules 1–3
- `guides/07-framer-motion.md` "The `<Motion>` wrapper" section
- `guides/10-common-violations.md` rows 1, 2, 3, 7, 12
