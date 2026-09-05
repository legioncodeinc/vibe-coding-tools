# Biome vs ESLint + Prettier: 2026 tradeoffs, speed, coverage gaps, migration

- URL: https://dev.to/whoffagents/biome-vs-eslint-prettier-in-2026-when-to-switch-and-when-to-stay-1njp
- Fetched: 2026-08-14
- Source type: Blog (practitioner comparison, production-project-based, 2026-04-18)
- Component: Lint/format tooling decision

## Content

### What Biome is

A single Rust binary (formerly the Rome project) that replaces ESLint (linting), Prettier (formatting), and `eslint-plugin-import` (import organization) with one binary and one config file (`biome.json`):

```
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

### Speed (measured, not vendor marketing)

On a 50-file TypeScript project: ESLint ~2.1s + Prettier ~0.8s = ~2.9s combined, vs Biome ~0.09s (roughly 32x faster). On a 300-file Next.js project: ESLint ~11s + Prettier ~3s = ~14s combined, vs Biome ~0.4s (roughly 35x faster). Framed practically: "Waiting 14 seconds for lint+format on every commit is a real developer experience tax" - the speed argument matters most for pre-commit hooks and CI, where it determines whether developers keep the hook enabled or start reaching for `--no-verify`.

### The real coverage gap (this is the actual decision axis, not speed)

ESLint has roughly 2,000 community plugins; Biome ships roughly 250 built-in lint rules (as of this source's writing). For most projects the gap doesn't matter; for specific projects it does. Named rules Biome does **not** cover as of this source:

- `eslint-plugin-react-hooks` - `exhaustive-deps` (explicitly called out as "a real bug-catcher" - the single most commonly cited reason to keep ESLint around in a React/component-heavy codebase)
- `eslint-plugin-jsx-a11y` - accessibility rules
- `@typescript-eslint/strict` - some stricter TS rules are in Biome, not all
- `eslint-plugin-testing-library` - test-quality rules
- `eslint-plugin-security` - basic security patterns

Rules Biome covers well: all standard JS correctness rules, TypeScript type-aware rules (a subset of `@typescript-eslint`), most common React-specific rules, import organization/deduplication, unused variables, unreachable code.

### Migration path

```
npx @biomejs/biome migrate eslint --write
npx @biomejs/biome migrate prettier --write
```

The migration tool reads existing `.eslintrc`/`.prettierrc` and generates an equivalent `biome.json`, described as getting "80% of the way there automatically" - not a perfect 1:1, some rules have no Biome equivalent and surface as a warning during migration. Recommended post-migration step: audit the "has no equivalent" warnings and decide per-rule whether it's catching real bugs (keep, via the hybrid approach below) or is cargo-culted config (drop). The source states most teams find they can drop 30-40% of their inherited ESLint rules without real impact once actually reviewed.

### Hybrid approach (named as a legitimate, common outcome, not just a stopgap)

For projects needing specific ESLint plugins Biome doesn't replace, run Biome for formatting + most linting, and ESLint only for the plugin rules Biome can't cover:

```json
{
  "scripts": {
    "lint": "biome check . && eslint . --ext .ts,.tsx --rule 'react-hooks/exhaustive-deps: error'",
    "format": "biome format --write ."
  }
}
```

Framed as "inelegant but practical" - Biome's speed for ~95% of checks, ESLint scoped narrowly to the handful of rules that matter and that Biome doesn't have.

### CI usage: `biome ci` vs `biome check`

`biome ci` exits non-zero if formatting/lint issues exist and does **not** auto-fix - the correct command for a CI gate. `biome check` also exits non-zero on issues but can optionally auto-fix with `--write` - the correct command for local/pre-commit use. Using `biome check --write` in CI would silently rewrite files instead of failing the build; this distinction is a real footgun if copied from a local script into a CI workflow without adjustment.

### Editor integration note

VS Code: `"editor.defaultFormatter": "biomejs.biome"` plus `codeActionsOnSave` for `quickfix.biome` and `source.organizeImports.biome`. The source explicitly warns to disable the ESLint VS Code extension for any file type now handled by Biome, to avoid conflicting inline diagnostics from both tools firing on the same file.

### The honest verdict (source's own framing)

**Switch to Biome if:** TypeScript-first project (with or without React), starting a new project (zero migration cost), CI lint time is a pain point, existing ESLint config is close to stock `eslint:recommended` + `@typescript-eslint/recommended`.

**Stay on ESLint + Prettier if:** the project depends on `react-hooks/exhaustive-deps`, uses `eslint-plugin-security` or accessibility-rule plugins, has a heavily customized ESLint config that would need real audit effort to migrate, or the team simply isn't bothered by current lint time.

**Hybrid if:** you want Biome's speed but can't give up `exhaustive-deps`, or you're on a large codebase where full migration risk is high but CI speed is a genuine bottleneck.

Author's closing framing for new projects specifically: "For new projects in 2026, Biome is the default I'd reach for." This source is a practitioner blog (not an official Biome or ESLint doc), so treat the specific benchmark numbers as one team's measurement, not a vendor-audited universal figure - but the qualitative shape of the tradeoff (speed win, plugin-ecosystem gap, hybrid as a real third option) is corroborated by the independent comparison pieces in the broader 2026 coverage of this topic.
