---
name: "dark-mode-theming-stinger"
description: "Audits and implements dark mode for React/Next.js: CSS tokens, next-themes wiring, FOWT prevention, SSR hydration, Tailwind v4 config, multi-brand theming. Use for dark mode setup or flashing bugs."
license: MIT
---

# Dark Mode Theming Stinger

The dark-mode theming surface is one of the most deceptively complex areas of a modern React/Next.js stack. Getting it right requires aligning four systems: CSS token architecture, a theme provider library, SSR hydration semantics, and (in multi-brand apps) a runtime CSS variable override layer. Getting any one of them wrong produces visible flashes, hydration warnings, inaccessible OS-native controls, or cross-tenant token leakage.

This Stinger encodes the 2026 consensus patterns for all of these. Read `SKILL.md` for the overview and task routing; follow the specific guide for deep implementation.

---

## When to use this skill

Load this skill when `dark-mode-theming-worker-bee` is invoked, or the user says:

- "Set up dark mode"
- "next-themes keeps flashing"
- "Dark mode on SSR"
- "Multi-brand theming"
- "CSS variable token layer"
- "Tailwind v4 dark mode"
- "prefers-color-scheme in Next.js"
- "White-label theme runtime swap"

This skill covers the full dark-mode theming surface for React/Next.js applications: CSS variable token architecture (semantic vs. primitive), `next-themes` wiring (ThemeProvider, storageKey, enableSystem), FOWT (flash-of-wrong-theme) prevention via a blocking inline script, SSR hydration safety (suppressHydrationWarning, typeof window guards, mounted guard pattern), Tailwind v4 dark-mode configuration (@custom-variant, selector strategy), and multi-brand/white-label runtime theme swapping via CSS variable overrides.

Do NOT use for palette creation or source-of-truth token file authorship (`design-system-worker-bee`), per-component visual deltas (`ux-ui-svelte-worker-bee`), or persisted-preference schema design (`db-worker-bee`). See the scope boundary table below for the full routing map.

---

## Task routing

| Task | Guide |
|------|-------|
| Understand principles and token contract | `guides/00-principles.md` |
| Build the `:root` / `.dark` CSS variable layer | `guides/01-css-token-architecture.md` |
| Wire `next-themes` ThemeProvider | `guides/02-next-themes-wiring.md` |
| Eliminate flash-of-wrong-theme | `guides/03-fowt-prevention.md` |
| Fix SSR hydration warnings / mounted guard | `guides/04-ssr-hydration-safety.md` |
| Configure Tailwind v4 dark mode | `guides/05-tailwind-v4-dark-mode.md` |
| Implement multi-brand / white-label theming | `guides/06-multi-brand-runtime-swap.md` |
| Happy-path example (App Router + next-themes + Tailwind v4) | `examples/happy-path-app-router.md` |
| Edge-case example (cookie-based SSR match) | `examples/edge-case-cookie-ssr.md` |
| Token layer skeleton template | `templates/tokens.css.template.md` |
| Audit report template | `templates/audit-report.template.md` |

---

## The six non-negotiables

These are the directives from the Command Brief, repeated here as the guardrails for every implementation:

1. **Never emit raw hex in component code.** All color references go through `var(--token-name)`. See `guides/00-principles.md`.
2. **Always inject the FOWT-prevention script before first paint.** See `guides/03-fowt-prevention.md`.
3. **Distinguish `prefers-color-scheme` (system preference) from persisted preference (localStorage / cookie).** System preference is the fallback, not the override. See `guides/02-next-themes-wiring.md`.
4. **Flag `typeof window` guards in every SSR-executed code path that reads theme state.** See `guides/04-ssr-hydration-safety.md`.
5. **Scope multi-brand overrides to CSS variables, not JS state.** CSS variable overrides are zero-JS and zero-rerender. See `guides/06-multi-brand-runtime-swap.md`.
6. **Separate semantic tokens from primitive tokens.** `--color-primary` must point to a semantic alias, not a raw hex value. See `guides/01-css-token-architecture.md`.

---

## Scope boundary

| In scope | Out of scope: route to |
|----------|------------------------|
| CSS variable token layer (`:root`, `.dark`, per-brand blocks) | Palette creation, token source-of-truth file: `design-system-worker-bee` |
| `next-themes` wiring (ThemeProvider, props, storageKey) | Per-component visual deltas (which token for which role): `ux-ui-svelte-worker-bee` |
| FOWT prevention (inline script, script placement) | Persisted-preference DB schema (`user_preferences.theme`): `db-worker-bee` |
| SSR hydration safety (`suppressHydrationWarning`, guards) | CSS variable injection input validation: `security-worker-bee` |
| Tailwind v4 dark mode (`@custom-variant`) | Tailwind config beyond `darkMode`: `ux-ui-svelte-worker-bee` |
| Multi-brand CSS variable overrides | Auth-gated per-user theme (server-side preference + RBAC): `auth-worker-bee` + `db-worker-bee` |

---

## Quick-start checklist

For a standard Next.js 15 App Router + `next-themes` + Tailwind v4 stack:

- [ ] Token layer: `:root` semantic tokens + `.dark` overrides in `globals.css`
- [ ] `color-scheme` CSS property set on `:root` and `.dark`
- [ ] `meta[name="color-scheme"]` in `layout.tsx`
- [ ] `ThemeProvider` in a `"use client"` providers component
- [ ] `suppressHydrationWarning` on `<html>`
- [ ] `disableTransitionOnChange` enabled on `ThemeProvider`
- [ ] Tailwind: `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`
- [ ] No raw hex values in any component `.tsx` file

---

*Research trail: `research/research-summary.md` | Command Brief: `ai-tools/command-briefs/dark-mode-theming-worker-bee-command-brief.md`*
