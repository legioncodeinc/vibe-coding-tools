# Accessibility and known gaps versus shadcn/ui (React)

## Accessibility inherited from Bits UI

Bits UI's own claim: "Production-Ready Accessibility... WAI-ARIA compliance, Keyboard navigation by default, Focus management handled for you, Screen reader support built-in" [research/raw/03-bits-ui-foundation.md]. This isn't just marketing copy; concrete mechanics are visible in individual components. Using Alert Dialog as the documented example:

- **Focus trap on by default** (`trapFocus`, default `true`). Disabling it is explicitly flagged as reducing accessibility [research/raw/12-accessibility-bits-ui.md].
- **Auto-focus on open** moves to the dialog's `Content` element by default, so screen readers read it correctly and keyboard users land somewhere interactive. Override via `onOpenAutoFocus`, cancelling the default event and focusing whatever you want instead [research/raw/12-accessibility-bits-ui.md].
- **Auto-focus on close** returns to the trigger element by default. Override via `onCloseAutoFocus` the same way [research/raw/12-accessibility-bits-ui.md].
- **Scroll lock on by default** (`preventScroll`, default `true`) for a native-feeling modal experience.
- **Configurable Escape-key behavior** via `escapeKeydownBehavior` (`close` / `ignore` / `defer-otherwise-close` / `defer-otherwise-ignore`) or a full `onEscapeKeydown` override.
- **Configurable outside-interaction behavior** via `interactOutsideBehavior` or `onInteractOutside`.

[research/raw/12-accessibility-bits-ui.md]

This pattern (trap + auto-focus-in + auto-focus-out + scroll-lock + escape + outside-interaction, each with sane defaults and an escape hatch) repeats across Bits UI's dialog-family components. When reviewing a custom overlay/modal built on Bits UI, check that these five behaviors are still intact if any of the override props were touched.

### Documented conflict: don't trust a single reading of `interactOutsideBehavior`'s default

The Alert Dialog narrative docs say the default `interactOutsideBehavior` is `'ignore'`; the API reference table on the same page says the default is `'close'`. This is an unresolved inconsistency in the source itself, not something this skill smoothed over [research/raw/12-accessibility-bits-ui.md]. If behavior here matters for a specific project, verify against actual runtime behavior rather than trusting either doc block blindly.

### Bits UI tracks WAI-ARIA APG conformance actively, not just attribute presence

Evidence: a merged PR specifically fixed Tab/Shift-Tab handling in dropdown menus to match "the WAI APG Menu pattern" (referencing a filed conformance bug), and a separate PR improved focus-scope handling for single-tabbable-item cases [research/raw/12-accessibility-bits-ui.md]. This is a maintenance signal worth knowing: accessibility issues filed against Bits UI tend to get fixed against the actual WAI-ARIA Authoring Practices Guide pattern, not patched superficially.

### Forms accessibility

The `Form.*` wrapper components (Formsnap-based) apply correct `aria-*` attributes based on field validation state automatically and wire label/input association via `for`/`id` without manual wiring [research/raw/10-forms-formsnap-superforms.md]. See [guides/05-forms-superforms-formsnap.md](05-forms-superforms-formsnap.md).

## Known gaps versus shadcn/ui (React)

### Don't trust the popular comparison table at face value

The most commonly cited comparison tool (`jasongitmail/shadcn-compare`) marks well-known, definitely-shipped components (Button, Dialog, Select, Accordion) as absent for BOTH shadcn (React) and shadcn-svelte, which contradicts both projects' own docs. This strongly suggests a stale or narrowly-scoped crawler, not a real absence. Treat that table's shadcn/shadcn-svelte columns as unreliable; its bits-ui/melt-ui columns (mostly showing primitives present) are more plausible signals of what exists at the primitive layer [research/raw/13-component-gaps-vs-react.md].

### Genuine, corroborated gaps and parity notes

- **Toast is parity, not a gap.** shadcn-svelte uses `svelte-sonner` (a port of `sonner`), not a Bits UI primitive. shadcn/ui React does the exact same thing: it uses `sonner` directly, not a Radix primitive. Same architectural choice, both ecosystems [research/raw/13-component-gaps-vs-react.md].
- **Navigation Menu was historically gated on the underlying Bits UI primitive shipping.** A maintainer confirmed it would land "now that Bits UI v1 is out." The Bits UI primitive is now available. This skill's research could not independently re-verify current presence in the live shadcn-svelte docs component index, only that the blocking dependency has shipped: treat as likely available, verify against current docs before asserting it definitively [research/raw/13-component-gaps-vs-react.md].
- **Drawer (Vaul-based) was historically gated the same way**: shadcn/ui React's Drawer depends on Vaul, a React-only library, so shadcn-svelte needed a Svelte port (`vaul-svelte`) first. That port now exists and appears as a current dependency in the Tailwind v4 upgrade command, so this gap has closed [research/raw/13-component-gaps-vs-react.md], [research/raw/06-tailwind-v4-migration.md].
- **The general pattern**: when a shadcn/ui React component depends on a React-only headless library, shadcn-svelte availability is gated on someone porting that headless dependency to Svelte first, not just re-skinning an existing Svelte-native equivalent. If a component you need doesn't exist yet, check whether its React counterpart depends on a React-only headless library before assuming it's simply unbuilt [research/raw/13-component-gaps-vs-react.md].

### The project's own framing

"Here you can find all the components available in the library. We are working on adding more components." shadcn-svelte is explicitly an actively-growing community port, not released in lockstep with shadcn/ui React [research/raw/13-component-gaps-vs-react.md], [research/raw/14-copy-in-philosophy-and-component-anatomy.md]. When a component genuinely doesn't exist yet, the right move is usually: check the Bits UI component list directly (it's usually ahead of shadcn-svelte's styled wrapper layer), and consider building a thin styled wrapper yourself following the anatomy pattern in [guides/02-component-anatomy.md](02-component-anatomy.md) rather than waiting.
