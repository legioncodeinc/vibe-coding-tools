# 01. Intake procedure

How `audit-intake-wasp-drone` runs the four-question intake, start to finish. This is the procedural spine for wave W0; `02-workspace-scaffolding.md` and `03-template-hydration.md` supply the depth for the two steps that follow it.

## Phase 1: check for an existing workspace first

Before asking anything, check whether a `www.<domain>-audit/` workspace already exists for a domain the user has named, or whether the user has pointed at an existing workspace directly.

- If `_shared/run-ledger.json` exists in that workspace: **do not re-ask the four questions.** Read the ledger, report the current per-Drone status back to the user, and offer to resume the run from the next incomplete wave (PRD-002 AC-4). This is the resume path; it is a hard requirement, not a nicety, because re-asking would risk clobbering `00-intake/` and any downstream artifacts that were already hydrated from the first answer set.
- If no such workspace exists, or the user is explicit that this is a new engagement, proceed to Phase 2.

No source in this pair's research archive describes this exact resume-detection mechanism (distilled research section 6 names it directly as a coverage gap: "No source discusses resuming an interrupted intake against an already-scaffolded workspace"). The check itself, and the "detect the ledger, offer to resume" behavior, are this Drone's own construct required by PRD-002 AC-4, not a sourced procedure. The adjacent principle from the workspace-scaffolding research ("sessions end in capture," implying a workspace should always be in an inspectable, resumable state [raw/github-krsnczky-agency-icm-builder.md]) supports the general shape of this check without specifying its mechanics.

## Phase 2: ask the four questions, in order, one at a time

Use `references/templates/intake-questionnaire-template.md` verbatim for the prompt text. Ask Question 1, wait for a non-empty answer, then Question 2, and so on. Do not batch all four into one prompt and do not accept a placeholder answer ("TBD", "n/a", empty string) as satisfying a question - PRD-002 AC-1 requires refusing to proceed past question N until question N-1 has a genuine non-empty answer.

The four fields, and why this exact order and set is defensible: `references/research/distilled-audit-intake.md` section 3a maps all four fields onto named fields in an independently-authored, more elaborate intake template (revamp.dev's section A, "project basics": company/org name, primary contact, final approver, current website URL) [raw/revamp-dev-website-redesign-client-intake-form-template.md], and a second independent source corroborates contact identity and approval authority as the two most load-bearing fields across intake designs [raw/ybug-io-blog-web-design-client-questionnaire.md]. That said: no source in this archive validates a four-question, no-open-questions design as *sufficient on its own* - every source describes a fuller multi-section form. Treat the minimalism of this Drone's intake as this plugin's deliberate design choice (per PRD-002's own stated goals), not as an independently sourced best practice.

Do not add a fifth question about authorization to audit the site. This is a deliberate scope exclusion per PRD-002's non-goals and the build plan's Q17 answer, not an oversight; `references/research/distilled-audit-intake.md` section 5 confirms no source in this archive's discovery-process literature describes an audit-authorization step distinct from a scope/brief sign-off, so there is nothing here that argues for adding one back.

## Phase 3: derive the domain and confirm before scaffolding

Once Question 4 (website URL) is answered, derive the workspace domain key per `references/templates/workspace-folder-tree-scaffold.md`'s derivation rule (strip scheme, strip a leading `www.`, strip path/query/fragment). If the URL has an unusual shape (a port, a non-`www` subdomain, an IP-address host), do not guess silently - state the derived folder name back to the user and ask for confirmation before creating it. No source addresses domain-to-folder-name edge cases; this confirmation step is this Drone's own risk-mitigation, not sourced.

## Phase 4: hand off to scaffolding, then hydration

Once all four answers are recorded and the domain is confirmed, proceed to `02-workspace-scaffolding.md`. Scaffolding and template hydration happen in the same pass, at intake time, not deferred to a later step - PRD-002's goals state hydration happens "at scaffold time, not at report time, so a mid-run failure doesn't lose intake data."

## Non-negotiable operating rules

1. Exact order, no skipping: auditor name, contact name, business name, website URL.
2. Refuse empty/placeholder answers; do not advance past an unanswered question.
3. Never add an authorization/consent question. Not this Drone's job, by explicit design.
4. Detect an existing `run-ledger.json` before asking anything; resume, do not re-ask.
5. Do not fetch the landing page itself here - that is `stack-fingerprint-wasp-drone`'s and `vendor-inventory-wasp-drone`'s job in wave W1. This Drone only records the URL.
