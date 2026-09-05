# Reports

This folder collects past audit outputs produced by `harness-integration-worker-bee`. Each report is a dated markdown file named `YYYY-MM-DD-<context>.md`.

A typical report includes:
- **Scenario classified:** new component placement / hook event addition / MCP registration / capability-detection or degradation question / portability check / distribution audit / cross-harness contract drift / Hivemind case-study question.
- **Surfaces reviewed:** which harnesses and wiring mechanisms were examined.
- **Findings:** numbered list of issues found, each with severity (Critical / High / Medium / Low), a description, and the relevant guide reference.
- **Recommendations:** concrete next steps for each finding.
- **Handoffs:** items routed to peer Bees (`vector-store-stinger`, `embeddings-runtime-stinger`, `mcp-protocol-stinger`, `ci-release-stinger`).

No reports yet. Reports accumulate here over time as `harness-integration-worker-bee` completes sessions.
