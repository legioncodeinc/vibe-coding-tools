# react-stinger

Cursor skill that equips **react-worker-bee** to be the Hive's authority on bleeding-edge React architecture, patterns, and code quality for 2025-2026. Encodes the bulletproof-react architectural pillars, the awesome-react curated ecosystem, and React 19/Compiler idioms into guides, examples, templates, and scanning scripts.

Entry point: `SKILL.md`.

## Scope

- **Owns:** project structure, component composition, state management, data layer, error boundaries + Suspense, forms, performance, testing strategy, TypeScript patterns, React 19 idioms, Server Components, anti-patterns, ecosystem selection.
- **Does not own:** visual design (ux-ui-svelte-worker-bee), SEO / Next.js metadata (seo-aeo-worker-bee), security audits (security-worker-bee), PRD authoring (library-worker-bee), post-refactor QA (quality-worker-bee).

## Layout

```
react-stinger/
  SKILL.md              Navigation + hard rules
  guides/               14 numbered guides (principles -> ecosystem catalog)
  examples/             ADR, code review, refactor proposal
  templates/            ADR, project-structure, provider-stack, error-boundary, test-setup, eslint config, review-output template
  scripts/              scan-anti-patterns, bundle-budget-check, react-version-audit
  research/             Dated research notes + react-version-log
```

## Output convention

Reports are written into the host repo's `library/` tree, never into this Stinger:

- **Standalone reviews** → `library/requirements/reports/react/<date>-<topic>.md`
- **Feature-tied** → `library/requirements/<lifecycle>/fea-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied** → `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
