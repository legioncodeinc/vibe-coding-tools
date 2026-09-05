# Reviewing code with LLMs
- URL: https://rustc-dev-guide.rust-lang.org/llm-guidance/reviewing.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Snapshot commit: `a6a2b7f4b5bbfb466b121375c05ba4c09c522f5d` (2026-08-17)
- Required PR label: `llm-assisted`
- Banned review areas listed by the source: soundness-affecting code from a non-expert, user-facing diagnostics, public docs, and `// SAFETY` comments
- Short source excerpt: "Treat LLM review as advisory"

## Archived facts

- Prefer deterministic linters, formatters, and other reliable tools instead of or alongside LLM review.
- LLM review should be tuned to avoid false positives and trivial comments.
- The model that created a change should not be its only reviewer.
- Human reviewers remain responsible for every endorsed concern and final judgment.
- Missing tests, disclosure, understanding, or pre-arranged review can make an LLM-created contribution ineligible for review under the upstream policy.

## Stinger relevance

Use LLM review as hypothesis generation. Verify findings against code, tests, compiler behavior, and policy before presenting them as actionable upstream feedback.
