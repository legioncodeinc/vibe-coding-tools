# Rust Forge LLM usage policy
- URL: https://forge.rust-lang.org/policies/llm-usage.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Moving-source snapshot: policy file commit `7371d55282853e0ef2a09ae72409fe987eaffb55`, fetched 2026-09-03
- Scope field: `rust-lang/rust`
- Ratifying teams field: compiler, libs, types, rustdoc, bootstrap, and their subteams
- Allowed field: private LLM use
- Banned fields: LLM-created public comments, docs, and diagnostics; replacing human judgment; requiring LLM use
- Conditional field: disclosed LLM-created code under the experiment criteria and disclosed LLM review
- Non-critical exception field: members of the `rust-lang` organization are exempt; the source strongly discourages using the exception
- Prior-policy exception field: PRs written before the policy took effect are exempt from the non-critical clause
- Procedure field: LLM-created PRs use the `llm-assisted` label

## Archived facts

- This moderation policy applies to `rust-lang/rust` and the compiler, libraries, types, rustdoc, bootstrap, and ratifying subteams.
- It does not automatically govern other `rust-lang` repositories, submodules, crates.io dependencies, or teams that have not ratified it.
- Private LLM use for analysis, explanation, checking, and review is broadly allowed.
- Public LLM-created comments, issue bodies, pull request descriptions, diagnostics, and non-trivial documentation are generally prohibited.
- LLM-created code intended for review is conditionally allowed under a disclosed experiment with pre-arranged review, high quality, tests, and full human understanding. Non-critical scope is the normal rule.
- Members of the `rust-lang` organization are exempt from the experiment's non-critical clause, although the policy strongly discourages using that exception. Pull requests written before the policy took effect also have a stated non-critical-clause exception.
- LLM review is advisory and cannot substitute for author self-review or required human review.

## Stinger relevance

Before contributing to `rust-lang/rust`, read the live policy and the affected team's current procedures. Apply the conservative non-critical default unless an authorized upstream reviewer confirms an exception. Do not project this repository-specific policy onto an unrelated Rust project.

## Refresh caveat

This is a living policy. Re-fetch it before preparing an upstream contribution.
