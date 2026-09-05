# Research Summary: modal-toast-dialog-stinger

**Depth consumed:** normal
**Time window:** 2025-11 to 2026-05
**Date:** 2026-05-20

## Executive summary

The React overlay ecosystem in 2026 has converged on a small set of high-quality primitives. Radix Primitives (Dialog, AlertDialog, Popover) remain the de facto standard for modal overlays in the React/shadcn/Tailwind stack. Vaul (now at v1.x) has become the canonical drawer/sheet primitive, offering snap points, nested drawers, and scroll locking. Sonner v2 is the production standard for toast notifications, with rich-colors mode and direct shadcn/ui integration. cmdk v1 is the standard for command menus/palettes. Headless UI Dialog remains viable but is secondary in the Tailwind ecosystem when Radix is already installed.

## Five most influential sources

1. **Radix UI Dialog docs (radix-ui.com, 2025-2026)**: canonical API for `Dialog`, `AlertDialog`, `asChild`, `onOpenChange`, focus trap behavior, portal mounting.
2. **WAI-ARIA APG Dialog (Modal) pattern (w3.org)**: normative specification for focus trap, `aria-modal`, `aria-labelledby`, `aria-describedby`, scroll lock, Escape key, focus return.
3. **Vaul README (github.com/emilkowalski/vaul, 2026)**: snap points API, `shouldScaleBackground`, nested drawer pattern, scroll-inside-drawer, requires `"use client"`.
4. **Sonner docs (sonner.emilkowal.ski, 2026)**: `toast()` API, `<Toaster>` placement, rich-colors, shadcn integration, portal behavior, dismiss patterns.
5. **cmdk docs + GitHub (cmdk.paco.me, 2026)**: `Command` + `Command.Dialog` wrapper, `CommandInput`, `CommandList`, async loading, keyboard activation pattern.

## Five open questions

1. Does Radix Dialog 2.0 (if released) change the `onOpenChange` contract vs 1.x? Verify in external research.
2. Is Vaul's `shouldScaleBackground` stable API or experimental in v1.1+?
3. Does Sonner v2 introduce breaking changes to the `toast()` imperative API vs v1?
4. WCAG 2.2 added "Focus Appearance" (2.4.11/2.4.12). Does this change focus-visible requirements inside modals?
5. Does cmdk v1 require a peer dependency on Radix or is it standalone?

## Sources to re-fetch if needed

- Radix UI changelog for Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
- Sonner changelog: https://github.com/emilkowalski/sonner/releases
- Vaul changelog: https://github.com/emilkowalski/vaul/releases
