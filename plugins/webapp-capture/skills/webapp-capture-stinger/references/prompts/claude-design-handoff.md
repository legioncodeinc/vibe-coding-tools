<!-- Template. inventory/design-handoff.mjs fills the {{...}} values and writes it as CLAUDE-DESIGN-INSTRUCTIONS.md at the root of the handoff zip. -->

# Claude Design brief: {{APP_NAME}} design system

Prepared by the Webapp Capture plugin (designed and built by Legion Code Inc.) on {{DATE}}.

Upload this whole zip to Claude Design, then send: **"Read CLAUDE-DESIGN-INSTRUCTIONS.md and follow it."**

## What this is

A measured capture of the live {{APP_NAME}} app ({{APP_CONTEXT}}), taken at {{ORIGIN}} in the **{{THEME}}** theme across {{ROUTES}} routes and {{STATES}} page states. Nothing here was designed by hand: every value was read from the running app. Your job is to turn this evidence into a coherent brand token guide and design system.

## What is in the package

| Path | What it holds | How to use it |
| --- | --- | --- |
| `CLAUDE-DESIGN-INSTRUCTIONS.md` | This brief | Read first, in full |
| `ledger.json` | {{COMPONENTS}} components: name, kind, layer, variants, parts, instance counts, routes, related components, plus `inconsistencies[]` | The index. Start here |
| `components/<name>/component.md` | Purpose, anatomy, variants with described values **and values measured in the browser**, states, tokens observed, usage | The spec for each component |
| `components/<name>/styles.json` | Computed styles per variant (exact colors, sizes, spacing, radius, shadow) | Ground truth when descriptions disagree |
| `components/<name>/screenshots/` | Real crops of each variant | What it actually looks like |
| `tokens/candidate.tokens.json` | Candidate tokens in the DTCG Format Module 2025.10 shape, named after the app's own CSS variables where they matched, with use counts under `$extensions` | Starting palette and scales |
| `tokens/tokens-summary.md` | The most used colors, type sizes, radii, spacing, and shadows, with counts | Quick read of the current system |
| `audit/` | Visual inconsistency findings: near-duplicate colors, scale sprawl, component drift{{CODE_AUDIT_NOTE}} | What to consolidate |
| `pages/` | One screenshot of the top of every captured page | Layout and context |
| `assets/icons.json`, `assets/images.json` | Icon font glyphs ({{ICON_FONT}}) and images, with the components that use them | Iconography inventory |
{{SHADCN_ROW}}

## Your task

Produce a brand token guide and design system for {{APP_NAME}} that keeps what already works, resolves what is inconsistent, and is ready for engineers to implement.

1. **Foundations.** Define semantic color roles (surface, surface raised, border, text primary, text muted, accent, success, warning, danger, info) from `tokens/candidate.tokens.json`. Collapse near-duplicates listed in `audit/` into single tokens, keeping the most used value unless it fails contrast.
2. **Typography.** A type scale (sizes, line heights, weights, families) from the observed values. Remove rare one-off sizes; keep what carries real usage.
3. **Spacing, radius, elevation, motion.** Scales grounded in the observed values, snapped to a consistent grid. Note every value you removed and what replaces it.
4. **Components.** For each component in `ledger.json`, specify anatomy, variants, states, and the tokens it uses. Merge components that the ledger or audit shows are the same thing rendered differently.
5. **Inconsistency resolutions.** For every item in `ledger.json` `inconsistencies[]` and every medium or higher audit finding, state the decision and the affected components.
6. **Deliverables.** A visual guide (foundations, then components with variants and states), and a final `tokens.json` in the DTCG 2025.10 format with semantic names and aliases to primitive values.

## Rules

- **Measured beats described.** When a component's described values and its measured table or `styles.json` disagree, trust the measurement.
- **Evidence only.** Do not invent components, variants, or states that are not in the package. If something is missing (hover states, empty states, dialogs, light theme), list it as a gap rather than guessing.
- **Only the {{THEME}} theme was captured.** Derive other themes as proposals and label them proposals.
- **Accessibility.** Text must meet WCAG 2.2 contrast: 4.5:1 for normal text, 3:1 for large text and for UI component boundaries. Flag any existing pairing that fails.
- **Keep the brand.** Preserve the app's name, logo usage, and signature accents (for example gradients or brand colors that appear across many routes).
- **Show your decisions.** Every consolidation lists the values it replaced and their use counts.

## Key numbers

{{KEY_NUMBERS}}

## Top inconsistencies to resolve

{{TOP_INCONSISTENCIES}}
