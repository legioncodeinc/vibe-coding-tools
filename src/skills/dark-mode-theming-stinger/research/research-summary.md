---
depth_tier: normal
pages_consumed: 18
files_written: 8
date: 2026-05-20
---

# Research Summary: dark-mode-theming-stinger

## Depth consumed

Normal tier. Synthesized from `next-themes` repo, Tailwind v4 docs, MDN, web.dev, and Next.js App Router docs. Time window: 2025-11 to 2026-05.

## Five most influential sources

1. **`next-themes` GitHub repo**: canonical API for `ThemeProvider`, `storageKey`, `enableSystem`, `disableTransitionOnChange`, and the documented FOWT-prevention script that ships with the library.
2. **Tailwind CSS v4 docs (Oxide engine)**: `@custom-variant dark (&:where(.dark, .dark *))` replaces `darkMode: 'class'` in v4; `darkMode: 'selector'` strategy is now stable.
3. **MDN `prefers-color-scheme`**: spec-level authority on the media query; confirms it is read-only and cannot be spoofed by JS (important for SSR trust model).
4. **web.dev "Adapting to Users' Preferred Color Scheme"**: authoritative patterns for `color-scheme` CSS property and `meta[name="color-scheme"]` for OS-level chrome (scrollbars, form controls).
5. **CSS-Tricks "A Complete Guide to Dark Mode on the Web"**: comprehensive survey of all four strategies (media query only, class-based, `data-theme` attribute, cookie-based SSR).

## Open questions that survived research

1. **CSP nonce for FOWT script**: inline scripts require a nonce in strict CSP environments; Next.js middleware nonce injection is not yet seamlessly wired to `next-themes`'s inline script. Flag as TODO in `guides/03-fowt-prevention.md`.
2. **Tailwind v4 `@custom-variant` and third-party libs**: some component libraries (shadcn/ui, Radix) may lag behind v4's variant system; test compatibility before migrating. Flag in `guides/05-tailwind-v4-dark-mode.md`.
3. **Server-cookie first paint match**: the technique of reading a `theme` cookie in `middleware.ts` and setting `data-theme` before sending HTML is powerful but requires careful cookie `SameSite` / `Secure` policy. Flag in `guides/04-ssr-hydration-safety.md`.
4. **Multi-brand token isolation**: when two brands share the same app, `data-brand` attribute overrides must not leak across nested brand contexts. Flag in `guides/06-multi-brand-runtime-swap.md`.
5. **`prefers-reduced-motion` intersection**: theme transitions should be disabled when `prefers-reduced-motion: reduce` is active; `next-themes`'s `disableTransitionOnChange` partially covers this. Flag in `guides/02-next-themes-wiring.md`.

## Sources to re-fetch on next refresh

- `next-themes` CHANGELOG for any v3.x breaking changes post 2026-05
- Tailwind v4.1+ release notes for dark-mode selector refinements
