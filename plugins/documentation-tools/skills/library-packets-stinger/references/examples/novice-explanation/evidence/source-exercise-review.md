# Review the rendered explanation exercises

These reviews compare actual source files and rendered Markdown, not a list of preencoded Boolean assertions. Exact passages and source identities are in the two JSON ledgers. The automated check verifies their traceability; the following semantic review supplies the reading judgment.

## Draft PRD: preserve the permission and sending sequence

Source: [invoice-note PRD](../fixtures/prd/PRD-001-invoice-notes.md). Reader manuscript: [plain PRD explanation](../../../../examples/plain-invoice-prd.md).

The source gives owners exclusive approval authority in their own workspace, orders review before approval before an explicit send request, and explicitly separates approval from sending. The rendered second paragraph retains all of those requirements. The third paragraph keeps members' narrower read-only authority. The opening retains Draft status; the fourth paragraph leaves automated reminders in future work and retention unresolved. Review: Pass for source fidelity. Human understanding: Pending.

Rejected candidate wording: “Team members approve notes, and the system sends them automatically.” This loses the owner restriction, invents automatic sending and reverses the source's explicit separation. Specific rewrite: “Only an owner may approve a note for an invoice in that owner's workspace. Approval alone does not send it; the owner must separately request sending.” The delivered manuscript uses that correction.

## Repository fixture: do not infer the missing permission implementation

Source: [handler](../fixtures/repo/src/routes/invoices.ts), [data stub](../fixtures/repo/src/data/invoices.ts), [Accepted contract](../fixtures/repo/contracts/invoice-read.md). Reader manuscript: [invoice repository tour](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/knowledge-stinger/examples/beginner-invoice-tour.md).

The handler exposes identity, delegated permission and data branches in that order. The permission implementation is absent, so the rendered tour says the exact access policy cannot be established. The data function throws, and the tour says no database read succeeds in the supplied fixture. The Accepted contract is described as required behavior rather than evidence of implementation. Review: Pass for source fidelity. Human understanding and application execution: Pending/Unproven.

Rejected candidate wording: “The permissions function guarantees that signed-in members only read their workspace's invoices.” No supplied implementation supports that guarantee. Specific rewrite: “The handler asks for a permission decision before reading data. The permission function's implementation is missing, so this source cannot establish which callers it permits.”

## Actual Wasp Nest builder: keep selection separate from native execution

Source: builder snapshot, selection snapshot. Reader manuscript: [actual build journey](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/knowledge-stinger/examples/actual-build-journey.md).

The tour follows the actual main/build entrypoint and imported resolve_plugins function, including Core, prerequisites and unknown/cycle error branches. The ledger preserves exact locations and hashes from the dirty working tree. It describes wrapper/manifest writer functions without claiming those files were built, validated, installed or discovered by a native client in this exercise. Review: Pass for source fidelity. Native execution and learner understanding: Unproven/Pending.

Rejected candidate wording: “Once the wrapper is generated, Codex runs the agent.” A source writer does not establish native discovery or execution. Specific rewrite: “The source writes a wrapper that points to the command procedure. Native discovery and agent execution require separate observed evidence.”

## Learning-method boundary

The glossary and analogy follow the existing Technical Explainer ownership. The analogy in each rendered document includes its stopping point, and the factual account remains visible. Each document asks a concrete teach-back question and records no reader response yet. No grade score, numerical learning lift, comprehension pass, Word/PDF page review or app/runtime qualification is claimed.


Source locators in adjacent JSON ledgers resolve against this owner's loaded skill root. Archived body bytes and claimed source hashes are preserved.
