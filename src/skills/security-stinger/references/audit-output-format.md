# Security audit output format

## Where the completed write-up goes

Per Library Schema v2 ([library/requirements/reports/README.md](../../../../library/requirements/reports/README.md)):

- Standalone audit (not tied to a specific PRD/IRD): `library/requirements/reports/<YYYY-MM-DD>-security-audit.md`
- Audit tied to a feature PRD: `library/requirements/{backlog,in-work,completed}/prd-<###>-<slug>/qa/<YYYY-MM-DD>-security-audit.md`
- Audit tied to an issue IRD: `library/issues/{backlog,in-work,completed}/ird-<###>-<slug>/qa/<YYYY-MM-DD>-security-audit.md`

Use whichever applies to the branch under audit. When in doubt, ask rather than guess the destination.

## Skeleton

```markdown
# Security audit - <YYYY-MM-DD> - <branch or feature name>

## Executive summary

- Scope: <files/surfaces covered>
- Coverage: <full pass | reduced coverage, and why>
- Findings: <N> Critical, <N> High, <N> Medium, <N> Low
- Ship Gate status: <blocked | cleared to proceed to quality-stinger>

## Surface coverage checklist

State "None detected" explicitly for any surface with zero findings - do not omit the section.

### SvelteKit attack surface
<findings or "None detected">

### Authorization and tenancy (Drizzle / Neon)
<findings or "None detected">

### Secrets and environment
<findings or "None detected">

### Webhooks and third-party intake
<findings or "None detected">

### Dependencies and supply chain
<findings or "None detected">

### Headers and transport
<findings or "None detected">

### AI-generated code patterns
<findings or "None detected">

### PII and logging hygiene
<findings or "None detected">

## Findings detail

For each finding:

### [SEVERITY] <short title>

- **Location:** `path/to/file.ts:LINE`
- **Surface:** <which checklist section>
- **Description:** <what the code does and why it's a problem>
- **Evidence:** <exact vulnerable pattern, quoted>
- **Remediation:** <what was changed, or what must change>
- **Status:** <fixed in this session | documented for follow-up | NEEDS HUMAN REVIEW>

## Remediation summary

| Severity | Count | Fixed this session | Documented only |
|---|---|---|---|
| Critical | | | |
| High | | | |
| Medium | | | |
| Low | | | |

## Re-evaluation

If any Medium-or-above finding required a fix, confirm here that a full re-evaluation pass was run against the updated code, and its outcome:

<re-evaluation summary, or "N/A - no Medium-or-above findings required fixes">

## Next step

<Clearance to invoke quality-stinger, or list of blockers preventing that>
```
