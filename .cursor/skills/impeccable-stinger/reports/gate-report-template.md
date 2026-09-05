# Detector Gate Report

| Field | Value |
|---|---|
| Target | `<file|dir|url>` |
| Command | `npx impeccable detect <target>` |
| Exit code | `0` (no findings) / `2` (findings) / `1` (failed) |
| Findings | `<N>` |
| Resolved | `<N>` |
| Waived | `<N>` |

## Findings

| Rule id | Severity | File:line | Resolution (fix or waiver + reason) |
|---|---|---|---|
| `side-tab` | advisory | `src/components/Card.tsx:52` | Fixed — removed inset stripe |
| `overused-font` | advisory | `src/styles/global.css:14` | Waived — `ignores add-value overused-font "Brand Sans" --reason "Brand font, committed in DESIGN.md"` |

## Verdict

- [ ] Gate clean (0 findings) — close-out may proceed
- [ ] Gate failed (exit 2) — close-out blocked until resolved or waived
