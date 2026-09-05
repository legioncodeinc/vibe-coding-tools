# Research summary: ux-ui-svelte-stinger

> The manifest stinger-forge reads before forging guides. Depth tier, time
> window, top sources, open questions.

## Depth and scope

- **Depth:** normal (focused on two pillars: shadcn-svelte 1.x + Tailwind v4).
- **Time window:** 2026-current (the docs are version-tagged, not date-tagged;
  the current `@latest` of both libraries targets Svelte 5 + Tailwind v4).
- **Scope cut (per decision owner):** Bits UI and Svelte 5 runes are supporting
  context inside the shadcn-svelte dumps, not separate pillars. No standalone
  Bits UI deep-dive.

## File counts

- shadcn-svelte pillar: 6 dumps
- Tailwind v4 pillar: 2 dumps
- Supporting: 3 files (library-versions, this summary, index)
- **Total:** 11 files

## Top 5 most influential sources

1. **shadcn-svelte-theming.md**: the token convention is the single most
   important concept. Every copy-in component is written against
   `--background`/`--primary`/etc., so re-pointing these tokens re-skins the
   library. This is the ADR-007 token bridge.
2. **tailwind-v4-theme-variables.md**: the `@theme inline` mechanism is the
   actual bridge implementation. The `inline` keyword is essential and
   non-obvious; the monorepo-sharing section is the cross-app token strategy.
3. **shadcn-svelte-tailwind-v4-migration.md**: the destination `app.css` shape
   (`:root` + `.dark` + `@theme inline` + `@layer base`) is the template OSPRY's
   `app.css` should match after Phase 0.
4. **shadcn-svelte-button-component.md**: the copy-in source shape. Teaches
   `tailwind-variants` (the Svelte CVA equivalent), `$props()` runes, the `child`
   snippet (the Svelte `asChild` equivalent). Universal pattern for every
   component.
5. **tailwind-v4-upgrade-guide.md**: the `@tailwindcss/vite` plugin is the
   install path; the `@reference` rule for Svelte `<style>` blocks is the
   coexistence rule during phased rollout.

## Open questions: ALL RESOLVED (2026-06-30)

The decision owner resolved all four open questions on 2026-06-30. They are
recorded here as resolved for the audit trail; the guides carry the
prescriptive version.

1. **Dark-first inversion strategy → Option A (ratified).** Keep `:root` as
   the dark theme (matching OSPRY's `tokens.css`); carry the light theme under
   `[data-theme="light"]` (the attribute selector `tokens.css` already uses,
   not a `.light` class: important correction discovered when reading
   `tokens.css`). Prescriptive in `../guides/04-dark-mode-inversion.md`.

2. **Exact token-name mapping → ratified.** The 1:1 mapping table is the
   contract. The canonical reviewable artifact is the **reverse brand guide**
   at `references/design-system/ospry-shadcn-svelte-token-bridge-guide.html`
   (open in a browser; toggle theme; walk the rendered elements). Two mapping
   refinements vs the original proposal: `--destructive` →
   `var(--severity-critical)` (not a literal oklch; OSPRY has a severity-red
   token), and `--radius` → `8px` (matching PRD-071 `--radius-md`, not
   `0.5rem`). Prescriptive in `../guides/02-token-bridge.md`.

3. **Upstream-sync cadence → monthly + same-day-for-security (ratified).**
   Monthly `shadcn-svelte diff` run as a standing task, with a single merge PR
   per month for behavior/accessibility patches. Same-day hotfix PR for any
   security advisory from shadcn-svelte / Bits UI / Melt UI / tailwind-variants.
   Prescriptive in `../guides/06-surface-migration.md`.

4. **Tailwind escape-hatch enforcement → lint rule (ratified).** A CI lint rule
   blocks PRs that violate the bright-line rules: arbitrary-value color
   utilities (`bg-[#...]`), literals in copy-in `tv({...})` factories, and
   `style={` interpolations. The rest of the guardrails stay reviewer-enforced.
   Prescriptive in `../guides/07-violations-and-guardrails.md`.

## Sources flagged for deeper context (deferred)

- **Melt UI internals**: the lowest layer. Not needed for using shadcn-svelte,
  only for debugging headless-behavior edge cases. Out of scope.
- **`tailwind-variants` full API**: surfaced via the Button component dump.
  Deeper reading at https://www.tailwind-variants.dev if custom variant design
  becomes a Phase 2+ need.

## Verdict for stinger-forge

The research corpus is sufficient to forge the guides. The four open questions
are real but do not block guide authorship: each has a documented working
assumption and a `> TODO` marker pointing at the follow-up PRD for ratification.
