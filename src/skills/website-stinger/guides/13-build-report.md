# 13: Build Report Discipline

This guide is process-only. No framework-specific content; applies to all website-stinger builds.

---

## Purpose

The Build Report (`build-report.md` in the target repo root) is the primary deliverable the user receives. It must be legible, honest, and citeable. Every row tells the user what was built, whether it passed, and which source PRD backs the decision.

---

## Update cadence

Update the Build Report **after every phase completes**, not at the end of the build. Each phase gets a one-line evidence string:

| Phase | Status | Evidence | PRD section |
|---|---|---|---|
| 1 (Monorepo) | pass | `pnpm dev` returns 200 in both apps/web and apps/cms | prd-phase-01 §Monorepo Setup |
| 2 (Performance) | pass | `pnpm build` clean; security headers in response | prd-phase-02 §Security Headers |
| ... | ... | ... | ... |

---

## Status semantics

| Status | Meaning |
|---|---|
| `pass` | Acceptance criteria met; smoke-check evidence captured |
| `fail` | Attempted, criteria NOT met; blocking issue documented |
| `skip` | Phase explicitly opted out by user; one-line rationale logged |

A `fail` must include the specific failing criterion ID, the error or observation, and the recommended remediation. Never mark a phase `pass` without running the smoke check.

---

## Commit message format

Every phase ends with a commit:

```
feat(phase-N): <short phase name> — <source-prd-section>
```

Examples for the SvelteKit + Payload build:

```
feat(phase-1): pnpm monorepo + apps/web SvelteKit + apps/cms Payload — prd-phase-01 §Monorepo Setup
feat(phase-2): security headers + fontsource + enhanced-img — prd-phase-02 §Security Configuration
feat(phase-5): Supabase schema + RLS + dual-namespace Payload — prd-phase-05 §Schema Design
feat(phase-7): Payload admin + CORS + payload-types.ts — prd-phase-07 §Payload Admin Setup
feat(phase-9): blog routes from Payload REST + entries() prerender — prd-phase-09 §Blog Content
```

---

## Risks and Open Questions section

Walk every source PRD for `R-N:` (Risk) and `Q-N:` (Open Question) tags. Surface applicable ones in the Build Report's Next Steps section.

Example:

```markdown
## Next steps / Risks

- R-1: Payload Lexical JSON → HTML conversion on SvelteKit side is not yet standardized. Options: (a) Payload afterChange hook writes HTML to a separate field; (b) use community payload-lexical-svelte package; (c) wait for official Payload Svelte renderer.
- Q-1: Does `@payloadcms/db-postgres` support Supabase's pgbouncer transaction-mode connection pooler? Test with `?pgbouncer=true` in PAYLOAD_DATABASE_URI before production.
- R-2: CORS misconfiguration is the most common Payload production bug. Verify `PUBLIC_SITE_URL` is correct in apps/cms `.env` before deploying.
```

---

## Overall status

Calculate from phase rows:

| Condition | Overall status |
|---|---|
| All phases pass | Green |
| Any phase fail | Red |
| Some phases skip, all non-skipped pass | Yellow (partial build) |

---

## Final pass checklist

Before handing the Build Report to the user:

- [ ] Every phase has a status (pass / fail / skip)
- [ ] Every pass has an evidence string
- [ ] Every skip has a one-line rationale
- [ ] Every phase cites the source PRD section
- [ ] Risks and Open Questions populated from source PRDs
- [ ] Overall status calculated
- [ ] Repo path and recommended downstream Bees listed

---

## Downstream Bee recommendations

At the end of the Build Report, recommend:

- `seo-aeo-worker-bee` (SvelteKit track): post-build SEO audit
- `security-worker-bee`: CSP header tightening
- `db-worker-bee`: schema indexing review
- `quality-worker-bee`: implementation-vs-PRD verification
