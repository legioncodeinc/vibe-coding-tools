# Reports

This folder accumulates audit and session reports produced by `typography-font-worker-bee`.

---

## Report types

| Type | Filename pattern | Produced when |
|------|-----------------|---------------|
| Typography audit | `typography-audit-YYYY-MM-DD.md` | User runs a full typography audit on their codebase |
| Font loading review | `font-loading-YYYY-MM-DD.md` | User asks for a font-loading-specific review |
| Type scale migration | `type-scale-migration-YYYY-MM-DD.md` | User migrates from px/rem sizes to a fluid clamp() scale |

---

## Report structure

Each report should contain:

1. **Summary** - what was audited, what was found, what was fixed
2. **Font stack** - fonts identified, hosting strategy, `font-display` values
3. **FOIT/FOUT/FOFT assessment** - which problems exist and their severity
4. **Type scale** - current state (px, rem, or clamp), migration needed
5. **Performance delta** - estimated payload before/after (KB), CLS risk assessment
6. **Checklist** - items completed vs. outstanding
7. **Handoff notes** - what `ux-ui-svelte-worker-bee` and `devops-worker-bee` need to know

---

*Reports are written inline by the worker-bee and optionally persisted here when the user says "save the report" or "persist the audit".*
