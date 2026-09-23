---
name: "web-security-posture-stinger"
description: "External, passive security-posture audit: headers, TLS coarse-check, cookies, CSP, injection surface, payment-path integrity. Highest-weighted category (20%); a critical leaf caps the grade at C."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: web-security-posture-wasp-drone
  research-window: 2026-08-18 (single sweep)
  primary-surface: external-website-audit
---

# Web Security Posture Stinger

> **Forge status:** stages 1-6 complete. Stage 7 (Register: pest-controller-suit pairing registration, deploy, sync references across harness targets) has not run yet. Everything below this line is grounded, cited content, not a structural stub; stage 7's remaining work is registration and distribution, not authorship.

You are equipping **web-security-posture-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-014-web-security-posture](../../library/requirements/backlog/prd-014-web-security-posture/prd-014-web-security-posture-index.md).

**This Stinger audits an external, third-party site's public security posture as observed from the outside, at automated-plus-heuristic confidence. It does not audit this plugin's own codebase, and it is not the Wasp Nest's internal application-security specialist.** That role belongs to `security-wasp-drone`/`security-stinger`, which improves a repository this plugin's own operator owns: it reads source, proposes diffs, and runs the Ship Gate. This pair has no source access, no deploy rights, and a hard read-only constraint on the audited site; it cross-links to `security-stinger`'s research archive where the underlying OWASP/header guidance overlaps rather than re-researching or duplicating it (PRD-014 non-goal, PRD-001 non-goal, see `guides/07-relationship-to-internal-security-stinger.md`).

Every factual claim this skill makes traces to a downloaded primary source in `references/research/raw/`, unless explicitly marked as this Stinger's own inference or construction, with the reason stated at the point of use. Read `references/research/distilled-web-security-posture.md` first: two research clusters, four sources, and two named, total gaps (TLS depth beyond one warning sentence, payment-path integrity not covered at all) that this Stinger reports honestly rather than filling from training data.

## When to use this skill

- Wave W5 of every audit run, reading `site-data/` and `01-recon/vendor-inventory.md`, writing only to `07-security/`.
- Any request specifically about the audited site's external security posture: headers, cookies, CSP, coarse TLS reachability, or client-side injection surface.
- Determining whether the critical-security-override should cap this engagement's final grade, and which finding triggered it.
- Deciding whether a header/CSP finding belongs in this pair's own output or should instead cross-link to `security-stinger`'s internal-repo catalog.

## When not to use this skill

- Auditing this plugin's own repository, or any repository the user owns and controls, for source-level vulnerabilities. Use `security-wasp-drone`/`security-stinger` for that; it is a different Drone with a different guardrail set (Ship Gate, source access, remediation).
- Any exploitation, authentication bypass, file-upload testing, or order placement against the audited site. This is a passive, read-only, external-observation-only audit by default; PRD-014 AC-3 requires explicit per-run opt-in, defaulting OFF, before any state-changing step, and even then a real payment instrument is never used.
- Scoring TLS cipher-suite strength, certificate-chain validation depth, or payment-path integrity beyond the coarse, explicitly-labelled checks this pair's archive actually supports. See `guides/05-tls-cookies-and-payment-path-unresearched-gaps.md`.

## Procedure

Full step-by-step in `guides/01-audit-procedure.md`. Summary: confirm `site-data/` and `01-recon/vendor-inventory.md` exist, run `shared/scripts/security-headers.py` against the landing page and any representative crawled URLs, walk the header checklist reconciled with manual CSP-strength judgment, cross-reference the vendor inventory for client-side injection surface, disclose the TLS/payment-path gaps honestly rather than scoring them from no evidence, apply and flag the critical-security-override, and write output plus the evidence-index update per `guides/08`.

## References map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `references/research/distilled-web-security-posture.md` | Verifying any header/CSP/injection claim fast, or resolving where a fact came from |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-audit-procedure.md` | Running a full pass end to end |
| `guides/02-header-checklist-and-scoring.md` | Scoring any individual header or cookie checkpoint |
| `guides/03-csp-strategy-nonce-vs-hash.md` | Judging a present CSP's actual strength, not just its presence |
| `guides/04-client-side-injection-and-vendor-crossreference.md` | Interpreting `01-recon/vendor-inventory.md` for GTM script-source risk or content-injection tooling |
| `guides/05-tls-cookies-and-payment-path-unresearched-gaps.md` | Deciding what can and cannot be scored in TLS depth and payment-path integrity |
| `guides/06-critical-security-override-and-grade-cap.md` | Flagging a critical (score-1) finding for the final-grade cap |
| `guides/07-relationship-to-internal-security-stinger.md` | Deciding whether a finding belongs here or should cross-link to `security-stinger` instead |
| `guides/08-report-and-handoff-to-scoring.md` | Writing final output and handing off to `audit-scoring-wasp-drone` |
| `references/templates/security-headers-scoring-checklist.md` | The per-header, per-cookie checklist to work through during a pass |
| `references/templates/client-side-injection-and-vendor-crossref-template.md` | The GTM/content-injection risk cross-reference |
| `references/templates/critical-security-override-flag-template.md` | The override banner, triggered or not |
| `references/templates/tls-and-payment-path-gap-disclosure-template.md` | The honest-gap disclosure wording |
| `references/templates/security-findings-output-template.md` | The exact `07-security/` file skeleton and its evidence-index handoff |
| `shared/scripts/security-headers.py` | Running the automated header/cookie/coarse-TLS scan against a URL, see `references/scripts/README.md` |

## Related drones and stingers

- [web-security-posture-wasp-drone](../../agents/web-security-posture-wasp-drone.md) - this Stinger's paired Drone.
- [security-stinger](../security-stinger) - the Wasp Nest's internal-repo application-security specialist; consult for the underlying OWASP/header research where this external, passive audit's scope overlaps, cross-link rather than duplicate its research archive, per `guides/07`.
- [vendor-inventory-stinger](../vendor-inventory-stinger) - upstream dependency; this pair reads `01-recon/vendor-inventory.md` that pair writes and does not re-detect vendors itself.
- [site-crawler-stinger](../site-crawler-stinger) - upstream dependency; this pair reads `site-data/` that pair writes.
- [audit-scoring-stinger](../audit-scoring-stinger) - reads this pair's `07-security/` output in wave W7 and applies the critical-security-override cap this pair flags but does not itself apply.
- [accessibility-audit-stinger](../accessibility-audit-stinger) - sibling Wave-5 pair; both read `site-data/` independently with no write contention, no shared scope overlap beyond the workspace.

## Quality bar

A pass is done when: `guides/01` through `guides/08` were followed in order, every scored leaf has an evidence pointer and justification, the critical-security-override check ran and is recorded whether triggered or not, the vendor cross-reference used the actual current-engagement `01-recon/vendor-inventory.md` rather than a generic restatement, TLS depth and payment-path integrity are disclosed as explicit gaps rather than scored from unsupported inference, no finding duplicates `security-stinger`'s internal-repo catalog without cross-linking it instead, and `07-security/` plus `_shared/evidence-index.md` are fully written per `references/templates/security-findings-output-template.md`.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [web-security-posture-wasp-drone](../../agents/web-security-posture-wasp-drone.md) - this Stinger's paired Drone.
  - [security-stinger](../security-stinger) - internal-repo application-security specialist; consult for the underlying OWASP/header research where this external, passive audit's scope overlaps, do not re-research it from scratch.

## Ship Gate decision

Does not apply. The Ship Gate (security-stinger, then quality-stinger, then github-repo-health-stinger) governs committing code changes to a repository this plugin's own operator owns. This Stinger equips an external, read-only, passive audit of a third-party site's public security posture; it produces report artifacts inside the engagement workspace (`07-security/`), not a code change to this plugin's own repository, so no Ship Gate applies to its own output. If this pass's findings lead the audited party (or this plugin's own operator, for a self-audit) to edit a repository they own based on this report, that edit would separately go through the Ship Gate via `security-wasp-drone`/`quality-wasp-drone`/`github-repo-health-wasp-drone`, not through this pair.
