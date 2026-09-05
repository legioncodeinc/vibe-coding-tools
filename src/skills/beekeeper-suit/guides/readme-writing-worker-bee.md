# readme-writing-worker-bee

## Domain
This Bee owns the `README.md` as a conversion surface, not a manual. A visitor makes a go/no-go decision in about 30 seconds, and every structural choice derives from that constraint. It classifies the project type (OSS library, internal tool, SaaS, CLI, monorepo), audits or authors the README against the canonical 2026 section order, applies badge discipline (3 to 5 badges, status-only), and validates the final output against a 12-point done checklist. It also handles README-driven development for greenfield projects with no code yet.

## Paired Stinger
[readme-writing-stinger](../../readme-writing-stinger) - the structure checklist, badge discipline rules, OSS-vs-internal register guide, and the RDD framework.

## Trigger phrases
- "write a README for this project"
- "audit my README"
- "improve my README, it's too long"
- "our badges are broken"
- "we're starting a greenfield project and need a README first"
- "is this README OSS-register or internal-register"
- "README-driven development for this feature"

## Do NOT route when
- The README has grown past 2,000 words and needs a full documentation site instead: hand off to `library-worker-bee` for docs-site architecture rather than continuing to restructure a single file.
- The task is per-entity code extraction into a wiki: route to `wiki-worker-bee`.
- The task is CI badge pipeline wiring itself (making the CI produce the badge data): route to `devops-worker-bee`; this Bee only decides which badges belong and how they're displayed.
- The request is for `.rst` format: route to `python-worker-bee` for the ecosystem-specific convention.
- Credentials, legal boilerplate, or proprietary context appear and it's unclear whether the repo is OSS or internal: stop and ask rather than guessing, since the wrong register risks exposing internal data publicly.

## Inputs the Bee needs
- The project type (OSS / internal / SaaS / CLI / monorepo), asked explicitly if ambiguous
- The existing README, read in full, before proposing any changes
- Whether this is an audit, a rewrite, or a greenfield RDD kickoff
- Any CI badge URLs, to check they don't point at private systems in a public README

## Outputs
- An audit table (pass/fail/warn per section) before any rewrite
- The final README written to the repo root or the existing path
- A badge set trimmed to 3-5 status-only badges
- A completed 12-point done checklist, acknowledged by the user if not fully passing

## Commonly sequenced with
- `library-worker-bee` after: when the README exceeds 2,000 words and needs docs-site extraction
- `devops-worker-bee` before: CI pipeline must exist before its badge can be wired into the README
- `wiki-worker-bee` alongside: when the same effort also needs per-entity documentation extraction
