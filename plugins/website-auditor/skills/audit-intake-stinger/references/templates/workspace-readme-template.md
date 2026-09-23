# Audit workspace README template

Copy-ready. Write this to `www.<domain>-audit/README.md` at scaffold time, with every `{token}` hydrated from the four intake answers (PRD-002 AC-3: no `{placeholder}` tokens may remain for auditor name, contact name, business name, or domain once scaffolding completes). Shape (run manifest, dependency state, completion ledger) is grounded in the build plan section 3's stated purpose for this file; the build plan does not give a literal README template, so the section headings and prose below are this Drone's own authorship, built to satisfy that stated purpose, not a sourced template.

```markdown
# Website Audit: {business_name}

| Field | Value |
|---|---|
| Auditor | {auditor_name} |
| Audited-party contact | {contact_name} |
| Audited-party business | {business_name} |
| Website | {website_url} |
| Domain (workspace key) | {domain} |
| Engagement reference | {engagement_ref} |
| Intake completed | {intake_timestamp_iso8601} |

## Run manifest

This workspace was scaffolded by `audit-intake-wasp-drone`. All twenty Drone/Stinger pairs in the Website Auditor plugin read and write inside this folder; see `_shared/run-ledger.json` for live per-Drone status.

## Dependency state

Wave order, per the build plan's dependency graph (section 2):

- [x] W0 audit-intake (this workspace's scaffold)
- [ ] W1a stack-fingerprint / W1b vendor-inventory (parallel)
- [ ] W2 icp-positioning (HARD GATE: halts if site focus is undeterminable)
- [ ] W3 keyword-intelligence
- [ ] W4 site-crawler
- [ ] W5 parallel assessment wave (9 Drones)
- [ ] W6 conditional (blog-content and/or ecommerce-catalog, if detected)
- [ ] W7 audit-scoring
- [ ] W8 audit-reporting

Update the checkbox for each wave as it completes; `_shared/run-ledger.json` is the authoritative machine-readable state, this checklist is the human-readable mirror.

## Completion ledger

Populated as each Drone finishes. Empty at scaffold time.

| Drone | Status | Completed | Artifact(s) |
|---|---|---|---|
| audit-intake-wasp-drone | complete | {intake_timestamp_iso8601} | `00-intake/`, this file, `_shared/` stubs |

## Do not

- Do not re-run `audit-intake-wasp-drone`'s four questions against this workspace; it will detect `_shared/run-ledger.json` and offer to resume instead (PRD-002 AC-4).
- Do not hand-edit `_shared/run-ledger.json` outside a Drone's own append; it is append-only, one key per Drone, to avoid write contention (build plan section 3).
```
