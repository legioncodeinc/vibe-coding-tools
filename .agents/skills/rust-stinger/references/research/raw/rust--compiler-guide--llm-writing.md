# Writing code with LLMs
- URL: https://rustc-dev-guide.rust-lang.org/llm-guidance/writing.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Snapshot commit: `14e906fb365fca09065b1eb388b199e10d0bdac8` (2026-09-02)
- Required sequence recorded by the source: find a willing reviewer, write restricted material yourself, disclose use, self-review, and run automated tests
- Restricted material named by the source: doc comments, `// SAFETY` comments, diagnostics, soundness-critical code, PR descriptions, and public comments
- Short source excerpt: "Tests are absolutely required"

## Archived facts

- An LLM-created rustc change needs a willing reviewer before the pull request is opened.
- Contributors must personally write public documentation, diagnostics, safety comments, pull request descriptions, public comments, and soundness-critical code.
- Automated tests are required, and a regression test must be verified failing before and passing after the fix.
- The contributor must understand and be able to explain the change, its invariants, and its edge cases.
- The guide recommends small, targeted changes, complete self-review, and deterministic tools for mechanical rewrites.
- A different model can provide adversarial local review, but it does not replace the author's own review.

## Stinger relevance

Apply these requirements only when working in the policy's upstream scope. For other repositories, discover and follow that project's own contribution and AI-use rules.
