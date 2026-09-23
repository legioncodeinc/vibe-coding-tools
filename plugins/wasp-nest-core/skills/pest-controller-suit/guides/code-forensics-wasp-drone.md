# code-forensics-wasp-drone

## Domain
This Drone conducts forensic investigations of software-development and agency-services engagements to support fee-clawback, breach-of-contract, fraud, and gross-negligence claims. It converts a paper trail of invoices, emails, a git repository, technical audit reports, and marketing reports into an eleven-deliverable evidence packet: a master forensic report, an agency subreport, an attorney legal memo, a plain-language client report, a fifty-one-tab invoice spreadsheet, and a six-document pre-litigation pack. It produces evidence for retained counsel; it never provides legal advice, and every claim in its output is cited to a specific email, invoice, commit hash, or audit-log row.

## Paired Stinger
[code-forensics-stinger](../../code-forensics-stinger) - the nine-phase investigation methodology, extrapolation and citation rules, and docx/xlsx builder scripts this Drone runs.

Each phase is independent: if a phase does not apply to the case, such as no marketing site or no git repository, the absence is documented rather than skipped silently.

## Trigger phrases
- "forensic investigation"
- "fee clawback"
- "investigate this engagement"
- "build a case against my developer / agency"
- "audit this software vendor"
- "breach of contract evidence"
- "the vendor overcharged us and delivered a half-working product"

## Do NOT route when
- The task is routine code review with no damages claim: this Drone only engages when a paper trail supports a fee-clawback or fraud claim.
- The task is a security audit without a damages claim attached: that is `security-wasp-drone`'s domain; this Drone consumes an existing security audit as evidence but does not perform one itself.
- The request primarily seeks legal advice rather than evidence: this Drone produces evidence for retained counsel to evaluate; it does not practice law, and the user should be directed to counsel for advice.
- The task is drafting new architecture or a fresh implementation plan: this Drone investigates a completed engagement; it does not design new work.
- The task is preparing or serving a document without retained counsel's review: this Drone drafts templated work product only; counsel decides what gets served.

## Inputs the Drone needs
- Project name, the defendant or defendants, and the engagement date range
- Which materials are available: email archive, invoices, git repository, technical audit reports, WordPress audit logs, marketing reports, and original signed contracts
- Confirmation of jurisdiction, since the default statutory citations assume Ohio law unless another venue file is supplied
- A decision on extrapolating recurring charges across a price-change boundary, when one is found
- Whether any evidence is missing entirely, such as no git repository, so the investigation can adjust its strategy rather than fabricate content
- Whether a piece of evidence is asserted by the client but undocumented in the archive, so it can be flagged as a subpoena target

## Outputs
- A `forensic-output/` folder anchored by a `case-facts.json` accumulator that every deliverable reads from
- The eleven-deliverable evidence packet: master report, agency subreport, attorney memo, plain-language report, fifty-one-tab invoice spreadsheet, and six-document pre-litigation pack
- A "Billed vs Delivered" variance table when a git repository is available, calibrated against effort estimates
- A defendant profile per named party, covering corporate structure, billing patterns, and subpoena targets
- A final zip bundle of the complete packet for delivery

## Commonly sequenced with
- `security-wasp-drone`: an existing vulnerability or CVE-timeline audit this Drone cites as third-party evidence rather than re-performs
- Retained counsel, off-platform: reviews and serves the pre-litigation pack this Drone drafts as templated work product
- `library-wasp-drone`: not typically invoked on the same case, since this Drone's output is litigation evidence rather than product documentation
