# Upstream rust-lang/rust LLM contribution policy

Load this reference only when work targets `rust-lang/rust` and the owning team has ratified the Rust Forge policy. Both conditions are required. It is not a default policy for every Rust repository.

## Scope check

1. Confirm the target is `rust-lang/rust`.
2. Confirm the owning team is in the live policy scope.
3. Re-fetch the Rust Forge policy and rustc development guide before creating public material.
4. If the target is another Rust project, stop and read that project's own contribution and AI-use rules instead.

## Conservative operating subset, fetched 2026-09-03

- Private LLM analysis, explanation, checking, and review are generally permitted.
- Public LLM-created comments, issue bodies, pull request descriptions, diagnostics, and non-trivial documentation are generally prohibited.
- Contributors must personally author safety comments and soundness-critical rustc code.
- The experimental path for LLM-created code normally requires disclosure, a willing reviewer, non-critical scope, high quality, strong automated tests, and complete human understanding.
- The live policy exempts `rust-lang` organization members and pre-policy pull requests from the non-critical clause under stated conditions. This Stinger does not invoke that exception on a contributor's behalf; confirm it with the authorized upstream reviewer.
- A regression fix needs proof that the test fails before and passes after the change.
- LLM reviews are advisory. They cannot replace deterministic tooling, self-review, or human review.

## Required Bee behavior

- Confirm the change targets `rust-lang/rust` and its owning team has ratified the policy before applying it.
- Do not draft prohibited public text for submission.
- Do not claim a change is non-critical, or invoke an exception to that rule, when its soundness impact or authority is unclear. Route that classification to the upstream reviewer.
- Preserve the contributor's own explanation of invariants, edge cases, test behavior, and uncertainty.
- Use a second model only as an adversarial aid and independently verify every finding.

## Sources

- `research/raw/rust--project-policy--llm-usage.md`
- `research/raw/rust--compiler-guide--llm-writing.md`
- `research/raw/rust--compiler-guide--llm-reviewing.md`
