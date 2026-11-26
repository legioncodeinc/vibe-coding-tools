# Document workflows: prepare, refresh and explain

Choose by the result you need. These workflows use the files you provide and report missing evidence. They do not turn a planned feature into proof that it works.

| Need | Workflow | Required plugins | Main result |
| --- | --- | --- | --- |
| Prepare a new or partial app before implementation | App Primer Zero | Core + App Primer Zero | Current-state knowledge, draft foundation plans, contracts, schema and a bounded handoff. |
| Bring many stale repository knowledge docs current | KB Refresh | Core + Documentation Tools; Code Audit Tools for full discovery | Updated owned docs with code citations, drift report, suspect list and Markdown/PDF work report. |
| Explain a product to founders, investors, customers or teammates | Library Packets | Core + Documentation Tools | Supported reader documents in Markdown, editable Word, branded PDF and citations. |

Keep Core enabled. Check [harness capabilities](../reference/HARNESS-CAPABILITIES.md) for the command, skill and agent surfaces your client provides. Native Claude commands below use the owning plugin prefix. Codex exposes the generated `source-command-*` skills; use the selector shown by your client.

## App Primer Zero: prepare the build

Use [App Primer Zero](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/app-primer-zero/skills/app-primer-zero-stinger/SKILL.md) when a repository needs a foundation before developers or agents start a larger build. Its [command procedure](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/app-primer-zero/commands/app-primer-zero.md) composes Core methods for setup, Knowledge, Library and contracts.

Supply the repository or accessible source archive, known stack decisions, existing approvals and available agent capacity. It reads the actual repository, records current state, drafts the foundation PRD, contracts and schema, checks reuse boundaries, and writes a dependency-ordered handoff with exclusive file ownership.

```text
Use App Primer Zero for this repository. Start from its actual stack and current files. Prepare private Knowledge, the foundation PRD, draft contracts, schema and a handoff within this session's available capacity. Ask about missing decisions. Stop before implementation.
```

Claude command: `/app-primer-zero:app-primer-zero`.

Draft contracts remain Draft until you accept their exact terms. A valid planning file proves its structure, not runtime behavior or your approval. The skill stops at preparation unless you separately authorize implementation.

## KB Refresh: bring repository knowledge current

Use [KB Refresh](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/skills/kb-refresh-stinger/SKILL.md) for a repository-wide documentation refresh. Its [command procedure](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/commands/kb-refresh.md) begins with scope and inventory, then runs writers, independent citation checks and ordered security and quality reviews.

Supply the repository, base branch or commit, allowed documentation paths, frozen files and who owns merges. Before a writer fleet runs, review the units, available capacity and projected cost. Each behavioral claim must point to code reopened on the pinned commit. Code issues go into `SUSPECTS.md`; the refresh does not fix them.

```text
Use KB Refresh on this repository. Pin the current base commit. Inventory knowledge docs as keep, update or write. Show the owned file sets, frozen paths and projected cost before launching writers. Deliver current docs, the drift report, SUSPECTS.md and the Markdown/PDF work report. Do not commit, push or open PRs yet.
```

Claude command: `/documentation-tools:kb-refresh`.

Install Core and Documentation Tools; full repository discovery also needs Code Audit Tools for its Swarm methods. The source installer's `refresh-repository-knowledge` profile selects all three. A marketplace install does not imply that profile or the explicit installed-plugin registry exists; follow the [setup guide](GETTING-STARTED.md).

One document needing a change belongs to [Knowledge Stinger](../../skills/knowledge-stinger/SKILL.md). PRD/IRD lifecycle edits belong to [Library Stinger](../../skills/library-stinger/SKILL.md). KB Refresh reports drift in those records rather than editing their lifecycle. Its scope does not authorize code changes. Commits, pushes and ready PRs require your approval.

## Library Packets: share what the sources support

Use [Library Packets](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/skills/library-packets-stinger/SKILL.md) when a library already has enough material to explain a product or system. Its [command procedure](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/commands/library-packets.md) asks only unresolved intake questions, reads the sources and selects supported documents from its catalogue.

Supply an accessible library, subject, readers, decisions the documents should help, public exclusions, research scope, brand assets and output folder. The library need not follow Wasp Nest conventions. It can produce founder, investor, public, sales, service, account or engineering material when the evidence supports it.

```text
Use Library Packets with this library. Prepare a founder brief, a public brief and a sales packet from supported sources. Ask only unresolved intake questions. Keep private detail out of public documents. Deliver Markdown, editable Word, branded PDF and citations for each document, plus a reader index and private gap record. Inspect every final Word-render and PDF page.
```

Claude command: `/documentation-tools:library-packets`.

General explanations target eighth-grade reading; engineering keeps the detail needed to use it. Missing evidence causes a question or deferral, not invented claims. Each final page must be inspected for cutoffs, whitespace, tables, figures and the real Legion Code Inc. icon-plus-word-mark footer. A conversion succeeding is not a review pass.

Claude Code desktop, Cowork and Codex desktop can use the skill through their available tools. Plain ChatGPT uses the [packaged starter](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/skills/library-packets-stinger/references/chatgpt-starter.md) with accessible files and document tools. Missing tools or formats remain explicit gaps. Source changes, publication and sending documents are separate actions.
