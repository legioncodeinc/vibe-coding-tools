# UX/UI Review — {{PR / surface / screen name}}

**Reviewer:** ux-ui-worker-bee
**Target:** `{{path-or-url-under-review}}`
**Date:** {{YYYY-MM-DD}}
**Design-system folder consulted:** `{{path-to-design-system-folder}}`

## Verdict

{{One of: "Approve with deltas" | "Changes requested" | "Escalation to design-system-worker-bee"}}

## Governing sections quoted

{{For each section consulted, quote verbatim with its reference.}}

> Per `{{doc-path}}` §{{section}}:
> "{{direct quote}}"

## Findings

### Finding 1 — {{short title}}

**Severity:** {{blocking | required | nit}}

**Location:** `{{path:startLine-endLine}}`

**Current code:**
```{{lang}}
{{quoted code}}
```

**Violation:** {{which rule from the brief or a guides/ row; cite both}}.

**Proposed delta:**
```{{lang}}
{{exact replacement code}}
```

**Rationale:** {{1–2 sentences connecting the delta to the governing section}}.

---

### Finding 2 — {{short title}}

{{repeat structure}}

---

## Library-integration notes

{{Only if the PR touches shadcn / Mantine / Lucide / Framer Motion. Cite the relevant guide.}}

## Tokens / utilities introduced

{{List any new tokens added to `01-master-tokens.css` or new utilities added to the utility layer in service of these deltas.}}

## Follow-ups

- {{Issue to open / spec to author / escalation to file.}}

## Citations

- `{{doc-path}}` — {{section(s)}}
- `guides/{{n}}-{{name}}.md` — {{row(s)}}
- `research/{{dated-note}}.md` — {{why}}
