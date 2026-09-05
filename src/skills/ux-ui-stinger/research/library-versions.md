# Library versions researched against

**Forge date:** 2026-04-24

Library versions drift fast. These are the versions the Stinger's guides were authored against. When a major version bumps, re-read the relevant `guides/` section and re-run the research.

| Library | Version reviewed | Notes |
| --- | --- | --- |
| shadcn/ui | latest CLI, React 19 + Tailwind v4 era (no semver; CLI installs source) | Copy-paste primitives; CVA underneath; Radix under that. |
| Radix UI Primitives | 2.x series (react-slot, react-dialog, etc. as of 2026-04) | `asChild` + `@radix-ui/react-slot` is the canonical composition primitive. |
| Mantine | 7.x (latest major; 8.x rumored but not GA at forge date) | `MantineProvider` + `createTheme` + `cssVariablesResolver`. |
| Lucide-react | 0.4xx series (2026 releases) | Default `strokeWidth=2`; `absoluteStrokeWidth` for constant stroke regardless of size. |
| Framer Motion / Motion | 11.x+ (rebrand to `motion` package underway) | `MotionConfig reducedMotion="user"` + `useReducedMotion()` hook. |
| Tailwind CSS | 4.x | `@theme` directive; CSS-first; OKLCH default color space. |
| class-variance-authority | 0.7.x | `cva()` factory, `VariantProps<>` type helper. |

## Maintenance flag

When any of the following land, this file must be revisited and the affected guides updated:

- Mantine 8 (breaking API changes likely; `theme.other` contract could shift).
- shadcn/ui public npm release (if they ever abandon the CLI-copy model).
- Motion / Framer Motion API restructure under the new `motion` package name.
- Tailwind CSS v5.
- Radix Primitives v3 (the SSR and slot semantics are the likely churn points).

When a bump happens, write a fresh `research/YYYY-MM-DD-<library>-vX-migration.md` note before updating the guide.
