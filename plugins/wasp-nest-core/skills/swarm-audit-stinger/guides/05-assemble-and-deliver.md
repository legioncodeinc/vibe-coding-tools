# Guide 05: assemble and deliver

## The editor, or the fallback

The editor agent (Opus, effort max) assembles the master: title, a one-page executive summary that answers the question directly, each report as a section with its title demoted to H2 and nothing dropped, then appendices (verification statistics, findings not verified by cap, unreviewed products, what could not be verified on this machine, evidence index). If the run was cut before the editor, use the latest checkpoint master or concatenate the report files with a header you write from the interpreter summaries, and say so in the header [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

Before delivery, run two deterministic checks on the master: a byte sweep for U+2013 and U+2014 (the owner's rule; the measured 419 KB master passed with zero) and a heading check that only one H1 remains.

## Deliver files first, gated actions second

1. Send the master markdown to the owner as a file, and a rendered page if one exists. Delivery by file is not gated; publishing as an artifact was blocked by the permission classifier in the measured session, and so was an admin merge. Never route around a denial; hand the owner the exact command instead [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].
2. File the audit into the repository's library when the owner asks for it: `library/requirements/reports/<domain>/<date>-<slug>.md` for the master, with `<date>/reports/`, `<date>/lenses/`, and `<date>/verify/` alongside for the evidence chain. Rewrite scratch paths in the evidence index to repository-relative paths, exclude stray non-report files, and scan for credential-shaped strings before staging (grep patterns and references to upstream dummy credentials are fine; values are not).
3. Committing and merging are owner-authorized actions: a fresh branch off main, a documentation-only commit, a PR with the summary and the note that the fleet made no code changes, the mergeability check, and then the owner's merge. State plainly when a review gate cannot be satisfied by the sole code owner.

## The closing report (six fields, every time)

Status (DONE, PARTIAL, BLOCKED, or STOPPED, with the limit that fired and the measured elapsed time); Delivered (paths); Verified (checks run and their actual output, failures quoted); Not done (what was cut and why, including every unreviewed product, every unverified finding, and the resume command); Questions for the owner (numbered, each with a recommended answer); Out of scope, noticed only [../references/research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

## Record what the run taught

Write one memory note with the report location and the headline verified findings so the next session starts from them, and append this run's measured role durations to the thresholds table in `../references/observer-protocol.md` if they moved. The research archive in this stinger is a single sample; every run is a chance to make it two.
