# 27 - Biome vs ESLint + Prettier: decision guide

**Applies to either context** (SvelteKit app or npm library/CLI). This is a new decision point this skill didn't previously cover - the Hivemind case (`guides/13-jscpd-and-quality-gate.md`) deliberately runs no linter/formatter at all, which is a different, narrower decision than "which linter/formatter." Use this guide whenever the question is "should this codebase adopt Biome, ESLint+Prettier, or a hybrid."

## The speed argument is real but is not the deciding factor

Biome (a single Rust binary replacing ESLint + Prettier + import organization) measures roughly 30-40x faster than combined ESLint+Prettier in practitioner benchmarks - about 0.09s vs 2.9s on a 50-file project, about 0.4s vs 14s on 300 files. This matters concretely for pre-commit hooks (a slow hook is the single most common reason developers reach for `git commit --no-verify`) and CI wall-clock time. But speed alone doesn't settle the decision - the coverage gap does.

Source: `references/research/raw/biome-vs-eslint-prettier--2026-tradeoffs.md`.

## The actual decision axis: plugin/rule coverage

Biome ships roughly 250 built-in rules against ESLint's roughly 2,000-plugin ecosystem. For most projects that gap is invisible. Named gaps worth checking against this specific project before defaulting to Biome:

- `react-hooks/exhaustive-deps` equivalent - **not applicable here**. This repo is Svelte 5 (runes), not React; Svelte's reactivity model doesn't have a direct analog to React's hooks-dependency-array footgun, which removes the single most commonly cited reason teams keep ESLint. Treat this as an inference specific to this repo's stack, not a claim the research source makes about Svelte directly.
- `eslint-plugin-jsx-a11y` - accessibility rules. Relevant to check: does the project need equivalent accessibility linting for Svelte markup? Biome's accessibility rule coverage should be verified against current docs rather than assumed present or absent.
- `eslint-plugin-security` - basic security pattern rules. Cross-reference with `security-stinger`'s own tooling before treating Biome's absence of this plugin as a gap that needs filling - `security-stinger`'s audit procedure may already cover the same ground through other means.
- `eslint-plugin-testing-library` - test-quality rules for Testing Library usage, relevant if the project adopts `@testing-library/svelte` per `guides/26-vitest-playwright-for-sveltekit.md`.
- Deep `@typescript-eslint` type-aware rules - Biome covers a subset, not all.

## This skill's guidance for a SvelteKit app

Given the React-specific nature of the most commonly cited ESLint-retention reason (`exhaustive-deps`), and that this repo is Svelte-first, Biome is a stronger default here than the "hybrid, keep ESLint for one plugin" pattern common in React codebases. Concretely:

1. **New SvelteKit project or clean adoption**: start with Biome (`npx @biomejs/biome init`), covering formatting + linting + import organization in one pass.
2. **Existing project with an ESLint+Prettier setup already in place**: run the migration tooling before deciding anything by feel:
   ```
   npx @biomejs/biome migrate eslint --write
   npx @biomejs/biome migrate prettier --write
   ```
   This gets roughly 80% of the way automatically and prints which specific rules have no Biome equivalent - audit that printed list per-rule (is it catching real bugs in this codebase, or is it inherited config nobody re-evaluated) rather than assuming either "migrate everything" or "stay put" without looking.
3. **If a specific plugin genuinely earns its keep** (confirmed via the migration audit, not assumed), run the hybrid: Biome for formatting + most linting, that one ESLint plugin scoped narrowly. This is explicitly a legitimate, common outcome per the research - "inelegant but practical," not a failure state.

## CI command discipline

`biome ci` exits non-zero on any formatting/lint issue and does **not** auto-fix - this is the correct command for a CI gate. `biome check --write` auto-fixes and is correct for local/pre-commit use. Using `biome check --write` inside a CI job silently rewrites files instead of failing the build - a **must-fix** if found in a CI workflow, since it defeats the purpose of the gate (a CI run that "passes" by quietly reformatting code instead of blocking a bad PR).

## Common findings

- `biome check --write` (or equivalent auto-fix invocation) used as the CI gate command - **must-fix**.
- A Biome adoption that skipped the migration-tool audit and just deleted the old ESLint config wholesale, with no review of which rules were dropped - **should-refactor**, go back and run the migration/audit step.
- A hybrid setup where ESLint is still running the FULL original rule set alongside Biome (not scoped to the specific gap rules) - **should-refactor**, this doubles the cost the migration was meant to reduce.
- Proposing full ESLint+Prettier for a new Svelte-first project on the strength of React-specific tooling reasoning (e.g. "we need `exhaustive-deps`") without checking whether that reasoning actually transfers to Svelte - **should-refactor**, push back and ask what the actual gap is for this codebase.

## Sources

- `references/research/raw/biome-vs-eslint-prettier--2026-tradeoffs.md`
- `references/research/distilled-typescript-node.md` section 6
