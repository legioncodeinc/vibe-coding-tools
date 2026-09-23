# Security findings output template

Copy-ready skeleton for what `web-security-posture-wasp-drone` writes to `07-security/` (build plan section 3). Structured to satisfy `audit-scoring-wasp-drone`'s mandatory-evidence rule (PRD-020 AC-5) on every leaf, and PRD-014 AC-2's requirement that the critical-override banner name its triggering finding explicitly.

## Files this Drone writes

```
07-security/
├── header-scan-findings.json       raw output of shared/scripts/security-headers.py, unmodified
├── header-checklist-results.md     security-headers-scoring-checklist.md, filled in
├── client-side-injection.md        client-side-injection-and-vendor-crossref-template.md, filled in
├── tls-and-payment-path.md         tls-and-payment-path-gap-disclosure-template.md, filled in
├── critical-override.md            critical-security-override-flag-template.md, filled in (triggered or not)
└── summary.md                      this Drone's own handoff summary, see below
```

## `summary.md` skeleton

```markdown
# Web security posture audit summary

**Engagement:** {domain}, {engagement_date}
**URLs checked:** {url_count} (landing page plus any additional crawled pages checked)

## Headline

- **Critical override:** {triggered|not-triggered}, see critical-override.md
- **Category:** Security, 20% weight, the single highest-weighted category in the build plan's rollup (section 4.2)

## Leaf findings

| Checkpoint | Score | Weight | Evidence | Justification | Source |
|---|---|---|---|---|---|
| {checkpoint} | {score} | 1 | {evidence_pointer} | {justification} | {raw_source_or_"this-Stinger's-own-inference"} |

## Explicit unresearched gaps

Per tls-and-payment-path.md, list every scope item this pass could not score with sourced confidence, rather than omitting them silently.

| Scope item | Why unscored | Recommendation |
|---|---|---|
| {item} | {reason} | {recommendation} |

## Rejected/reframed candidates (verification log)

Per conduct rule 4, every candidate finding that failed verification is recorded here with the reason, not silently dropped.

| Candidate | Reason rejected/reframed |
|---|---|
| {candidate} | {reason} |
```

## Evidence-index update

Append every artifact this Drone produced (the six files above) to `_shared/evidence-index.md`, per the shared-workspace contract, with the artifact path, what produced it, and when.

## Relationship to `security-stinger`

Do not copy `security-stinger`'s internal-repo OWASP Top 10/vulnerability catalog into this output. Where this pass's own header/CSP findings overlap with that catalog's underlying guidance, cite `security-stinger`'s research archive as a cross-reference in the justification field rather than re-deriving or re-stating the same OWASP guidance a second time; see `guides/07-relationship-to-internal-security-stinger.md`.
