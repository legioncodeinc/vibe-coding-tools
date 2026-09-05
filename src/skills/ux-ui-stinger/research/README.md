# research/

Raw research notes and the version audit for this Stinger. Every factual claim in `guides/` should trace back to a note here.

## Index

| File | Topic |
| --- | --- |
| `research-plan.md` | Original queries, sources, open questions for the forge. |
| `library-versions.md` | Pinned library versions reviewed at forge time + maintenance flags. |
| `open-questions.md` | Non-blocking questions for the user. |
| `2026-04-24-shadcn-ui-wrapping.md` | shadcn/ui wrapping patterns, folder discipline, CVA conventions. |
| `2026-04-24-mantine-theme-tokens.md` | Mantine 7 theme provider, `cssVariablesResolver`, `theme.other`. |
| `2026-04-24-lucide-react-icons.md` | Default stroke width, `absoluteStrokeWidth`, icon-wrapper patterns. |
| `2026-04-24-framer-motion-reduced-motion.md` | `MotionConfig reducedMotion="user"`, `useReducedMotion`, bucket pattern. |
| `2026-04-24-radix-primitives-composition.md` | `asChild` + `@radix-ui/react-slot` + ref-forwarding requirement. |
| `2026-04-24-tailwind-v4-theme-tokens.md` | `@theme` directive, CSS-first tokens, tenant theming overrides. |
| `2026-04-24-wai-aria-apg.md` | Keyboard + focus contract floor for widget-role components. |
| `2026-04-24-cva-variant-architecture.md` | CVA factory shape, typed variants, `VariantProps`. |

## Refresh cadence

Re-run the research pass when:

- Any library in `library-versions.md` ships a major version bump.
- A new library is added to the reference set in the Command Brief.
- A user-reported issue traces to outdated guidance in a guide.

Always write the new research note first (dated), *then* update the guide.
