# Guide 02: author the fleet script

Start from `../references/templates/swarm-audit-workflow.js`. It already encodes the rules below; this guide says what to replace and what never to change.

## Replace

- `SHARED_BRIEF`: the scout output. Facts the investigators would otherwise re-derive: branches and remotes, PR history with merge behavior, CI coverage, repository layout, product history, live endpoint results, upstream provenance checks, toolchain versions, environment hazards and their workarounds, incidents already disclosed by the repository's own documents.
- `CONSTRAINTS`: read-only rules, secret handling (key names only), the single-owner rule for mutating commands, the scratch path, the evidence labels, the prose rule (no em dashes or en dashes).
- `LENSES`: one entry per concern with a concrete checklist (commands to run, files to read, questions to answer, what to grade). Name the single owner of each mutating command inside the lens title.
- `REPORTS`: the report specs, one per deliverable question. Keep the owner's required plan format inside the next-steps spec, applied to every table, not restated once at the end [../references/research/raw/swarm-audit--evidence--critic-findings-2026-09-07.md].
- `args`: pass `date`, `repo`, `scratch`, `question`, `fleetCap`, `criticRounds`, and optionally `maxVerify` as real JSON values, never a stringified list [../references/research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].

## Never change

- `withRetry()` around every `agent()` that produces or reviews a work product. A null return is a lost product until re-dispatched; the helper retries up to three times with a narrowed prompt and a new label (a new cache key), then lists the product under `unreviewed` so the closing report prints it. The measured run lost a report to a `.filter(Boolean)` on a null [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].
- The rule that a report whose interpreter died after writing the file is carried forward with a PRODUCED BUT UNREVIEWED marker and reviewed by the critic, never dropped.
- `MAX_VERIFY` defaulting to no cap. If the owner sets one, the drop is logged and returned under `not_verified_by_cap`; cap concurrency, not coverage.
- The verdict schema's corrected fields: 71 of 98 measured verdicts were corrections, not confirmations or refutations [../references/research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md].
- The checkpoint scribe after Interpret and after every critic round, so a cut run still has a complete artifact.
- The reconciliation agent after each revision round; revisions run in parallel and must not criticize each other's text [../references/research/raw/swarm-audit--evidence--critic-findings-2026-09-07.md].
- Barriers only where cross-item context is needed (dedup before Verify, all reports before Critique); everything else pipelines.

## Runtime rules that bite

- `meta` is a pure literal; phase titles in `meta.phases` match `phase()` calls exactly.
- No `Date.now()`, `Math.random()`, or argless `new Date()`; no filesystem or Node APIs in the script itself. Agents have tools; the script does not.
- Backslashes in template literals are escapes: use forward slashes in all paths.
- The per-workflow concurrency cap is min(16, CPUs - 2); queued calls still complete. A single `parallel()` or `pipeline()` takes at most 4,096 items; a workflow gets at most 1,000 agents [../references/research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].
- Schemas need `type: 'object'` at the root and `required` a subset of `properties`; unsatisfiable schemas throw at `agent()`.
- The agent's final text is the return value; with a schema the validated object is returned and validation retries happen at the tool layer, but an agent can still exhaust its retries and die, which is what `withRetry()` is for.

## Sharding toward the owner's cap

If the fleet must run wider than the runtime cap, split the lenses (or the verification queue) across two or more scripts launched as separate background workflows, each with its own scratch subfolder and transcript directory, and keep the sum of in-flight agents at or below 100. The observer sums `fleet-status.js` running counts across the directories [../references/observer-protocol.md].

## Launch

Call Workflow with the script inline and the args JSON. Record from the result: the task id (for TaskStop), the transcript directory (for `fleet-status.js`), the persisted script path and run id (for stop, edit, resume). Then go straight to guide 03; the first check-in is due 10 minutes after launch.
