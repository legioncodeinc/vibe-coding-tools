# Intake questionnaire template

Copy-ready. This is the literal question sequence `audit-intake-wasp-drone` asks the user, in order, with no reordering and no skipping. Refuse to advance to question N+1 until question N has a non-empty answer (PRD-002 AC-1).

Grounded in the field taxonomy from `references/research/distilled-audit-intake.md` section 3a: all four fields below map onto named fields in an independently-authored, more elaborate intake template (revamp.dev's section A, "project basics") and are corroborated as the two most load-bearing fields (contact identity and final-approval identity) by a second, independent 32-question source (ybug.io). [raw/revamp-dev-website-redesign-client-intake-form-template.md] [raw/ybug-io-blog-web-design-client-questionnaire.md] No source in this archive validates a four-question, no-open-questions design as sufficient on its own; that minimalism is this plugin's own design choice (PRD-002 goals), not a sourced claim.

---

## Question 1 of 4: Auditor name

**Prompt to the user:**
> Who is running this audit? (Your name, or the name of the auditor of record for this engagement.)

- Field key: `auditor_name`
- Maps to: revamp.dev section A's implicit "who is producing this" context; not a named field in any source archive, since the sources are written from the agency's own perspective, not from a tool asking who its own operator is. This field's necessity is a judgment call specific to this plugin (report/XLSX cover-sheet attribution), not sourced.
- Validation: non-empty string. No format constraint.
- Refusal rule: do not proceed to Question 2 until this has a non-empty answer.

## Question 2 of 4: Audited-party contact name

**Prompt to the user:**
> Who is the primary contact at the business being audited? (The person you'd send the report to.)

- Field key: `contact_name`
- Maps to: revamp.dev section A's "Primary contact (name, role, email)" field. [raw/revamp-dev-website-redesign-client-intake-form-template.md] This Drone only asks for the name, not role/email, per PRD-002's exact four-question scope; role/email are out of scope for this pair.
- Validation: non-empty string.
- Refusal rule: do not proceed to Question 3 until this has a non-empty answer.

## Question 3 of 4: Audited-party business name

**Prompt to the user:**
> What is the name of the business that owns this website?

- Field key: `business_name`
- Maps to: revamp.dev section A's "Company / org name" field. [raw/revamp-dev-website-redesign-client-intake-form-template.md]
- Validation: non-empty string.
- Refusal rule: do not proceed to Question 4 until this has a non-empty answer.

## Question 4 of 4: Website URL

**Prompt to the user:**
> What is the URL of the website to audit? (Include the scheme, e.g. `https://example.com`.)

- Field key: `website_url`
- Maps to: revamp.dev section A's "Current website URL(s)" field. [raw/revamp-dev-website-redesign-client-intake-form-template.md]
- Validation: non-empty string; must parse as a URL with a scheme (`http://` or `https://`) and a resolvable-looking host. No source in this archive discusses URL validation or canonicalization mechanics (distilled research section 6, coverage gap); the specific validation rule here (scheme required, no redirect-following, no normalization beyond stripping trailing whitespace) is this Drone's own judgment call, not sourced. Do not silently rewrite `example.com` to `https://example.com`; ask the user to supply the scheme instead, so the recorded value is exactly what the user confirmed.
- Refusal rule: this is the last question; once answered, proceed to workspace scaffolding (see `guides/02-workspace-scaffolding.md`).

---

## What NOT to ask

Per PRD-002 non-goals and Q17 of the build plan: do not add a fifth question asking for authorization or permission to audit the site. The distilled research (section 5) confirms no source in this archive's discovery-process literature describes an audit-authorization step as distinct from a scope/brief sign-off, so this omission tracks the plugin's explicit design choice, not an oversight to "complete."

## Resume behavior

If `_shared/run-ledger.json` already exists in the target workspace, do not ask these four questions again. See `guides/01-intake-procedure.md` for the resume-detection procedure (this exact mechanism is not sourced in the distilled research; distilled research section 6 names it as a coverage gap, and the resume logic here is this Drone's own construct).
