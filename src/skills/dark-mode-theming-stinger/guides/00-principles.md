# Principles: dark-mode-theming-stinger

*Covers: scope boundary, token contract, the six non-negotiables, SSR invariants, FOWT definition.*

---

## Scope boundary

`dark-mode-theming-worker-bee` owns exactly one layer: the **runtime theming layer** that sits between the token source-of-truth file (owned by `design-system-worker-bee`) and the component code (audited by `ux-ui-svelte-worker-bee`). It is not a palette author. It is not a component designer. It is the translator that makes tokens theme-aware at runtime.

**Do NOT cross into:**
- Palette creation or source-of-truth token file authorship (`design-system-worker-bee`)
- Per-component visual deltas (`ux-ui-svelte-worker-bee`)
- Persisted-preference DB schema (`db-worker-bee`)
- CSS variable injection input validation for user-controlled inputs (`security-worker-bee`)

---

## The two-tier token contract

Every theming implementation this stinger produces follows the **semantic / primitive split**:

```
Primitive tokens  → named raw values, never referenced in components
                   e.g. --color-blue-500: #3b82f6;

Semantic tokens   → theme-aware aliases, always referenced in components
                   e.g. --color-primary: var(--color-blue-500);      ← light
                        .dark { --color-primary: var(--color-blue-200); } ← dark
```

**Why this matters:** When a component uses `color: var(--color-primary)`, swapping themes is a single CSS selector toggle. No component code changes. No JS re-renders. No runtime cost.

Violations to flag in audit:
- Component code using `#3b82f6` or `color-blue-500` directly
- A semantic token pointing to a hex literal instead of a primitive token
- Dark-mode overrides placed in component CSS instead of the token layer

---

## The six non-negotiables

| # | Directive | Why |
|---|-----------|-----|
| 1 | Never emit raw hex in component code | Raw values bypass the theming system; drift cannot be audited |
| 2 | Always inject FOWT-prevention script before first paint | A visible flash destroys trust; it is not fixable after hydration |
| 3 | Distinguish `prefers-color-scheme` from persisted preference | System preference is the fallback; overwriting localStorage with OS value removes the user's choice |
| 4 | Flag `typeof window` guards in every SSR code path that reads theme state | `next-themes` returns `undefined` during SSR; unguarded reads throw or hydration-mismatch |
| 5 | Scope multi-brand overrides to CSS variables, not JS state | CSS variable overrides are instant and zero-rerender; JS state causes full-tree re-renders |
| 6 | Separate semantic tokens from primitive tokens | Semantic tokens are theme-agnostic; primitive tokens are not |

---

## FOWT (flash-of-wrong-theme) defined

FOWT is the brief appearance of the incorrect theme immediately after the page loads. It occurs because:

1. SSR renders HTML with no theme class (or a hardcoded default)
2. JS loads and reads `localStorage` or `prefers-color-scheme`
3. JS applies the correct theme class: this triggers a repaint

If step 3 is visible to the user (typically when the page is heavy and the class change happens after paint), the user sees a flash from the wrong theme to the correct one.

**FOWT prevention** means ensuring the correct class is applied *before the first paint*, via a blocking inline `<script>` tag that runs synchronously during HTML parsing.

---

## SSR invariants

These must hold for any Next.js implementation this stinger produces:

1. `suppressHydrationWarning` on `<html>`: the theme class will differ between SSR and client; React must not treat this as an error.
2. No direct `localStorage` access outside `typeof window !== "undefined"` guards in Server Components or during SSR execution.
3. No `useTheme()` call that renders differently based on `resolvedTheme` without a `mounted` guard: the server has no resolved theme.
4. `meta[name="color-scheme"]` in `<head>` to tell the browser which scheme to use for OS-native chrome (scrollbars, form inputs) before CSS loads.

*Sources: `research/external/2026-05-20-ssr-color-scheme-detection.md`, `research/external/2026-05-20-next-themes-api.md`*
