# Reports

This folder collects font loading audit reports produced by `font-loading-worker-bee`.

## Naming convention

```
font-loading-audit-YYYY-MM-DD-{project-slug}.md
```

Example: `font-loading-audit-2026-05-20-acme-marketing.md`

## Report structure

Each report contains:

1. **Summary scorecard**: pass/fail for each section of `guides/06-performance-checklist.md`
2. **Font inventory**: list of all `@font-face` rules found, with `font-display` values and file sizes
3. **CLS findings**: measured CLS contribution from fonts (before and after fixes, if applicable)
4. **Preload audit**: list of preload hints, correctness check, double-fetch detection
5. **Remediation priority list**: ordered list of fixes by impact (Critical / High / Medium / Low)
6. **Next steps**: specific actions for the developer

## When to save a report

Save a report when:
- Conducting a full audit of an existing project (the user asks "audit our font setup")
- Completing a migration (e.g., from manual Google Fonts to `next/font`)
- Measuring CLS before and after metric-matched fallback implementation

For inline answers (quick `font-display` questions, template generation), do not save a report.
