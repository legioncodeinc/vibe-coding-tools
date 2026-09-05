# drift (ryanwaits/drift) - detecting TypeScript docs drift from code

- URL: https://github.com/ryanwaits/drift
- Fetched: 2026-08-14
- Source type: open-source tool README
- Component: doc-to-code sync - CI drift detection for TypeScript/CLI packages

## What it does

`drift` extracts a machine-readable spec from a TypeScript package's exported API surface (auto-detected from `package.json` fields: `types`, `exports`, `main`, `module`, `bin`), then checks documentation (JSDoc/TSDoc comments and markdown docs) against it. It targets libraries, SDKs, and CLI packages that publish an exported API surface - explicitly not a fit for apps with no exported API, or teams that don't use JSDoc/markdown as part of their release workflow.

## Fifteen drift types across four categories

| Category | Count | What it catches |
|---|---|---|
| structural | 7 | JSDoc types/params that no longer match the real function signature |
| semantic | 3 | Deprecation mismatches, visibility mismatches, broken `{@link}` cross-references |
| example | 4 | `@example` code blocks that error or don't actually work |
| prose | 1 | Markdown docs that import or reference exports that no longer exist |

Every finding includes `filePath` and `line`, explicitly so an agent (or a human) can jump straight to the fix.

## Command surface

| Command | Use |
|---|---|
| `drift scan` | Full package audit locally before opening a PR (coverage + lint + prose drift + health) |
| `drift lint` | Find signature/JSDoc mismatches with file/line data |
| `drift coverage --min 80` | Enforce a documentation-coverage floor |
| `drift ci --all --min 80` | Gate PRs/CI - fail the build when docs quality drops below a threshold |
| `drift list --undocumented` | Build a backlog of missing-docs work |

All commands emit structured `{ok, data, meta}` JSON, human-readable in a terminal. The tool's own framing: "Detection is the tool's job. Mutation is the agent's job" - it diagnoses, an agent or human edits the code/docs.

## CI integration

```yaml
- uses: ryanwaits/drift/action@v1
  with:
    min-coverage: 80
```

Recommended adoption path: run `drift scan` locally and review, set a baseline (`drift ci --all --min 80`), then add the GitHub Action to enforce the gate on every PR.

## Applicability to this skill

This is a concrete, working example of the doc-sync discipline this stinger already teaches in the abstract (`guides/04-doc-sync.md`'s "gate sync in CI so drift cannot merge silently"). Where the existing guide sketches a hand-rolled CI workflow (grep the tool names out of source, diff the changelog version), a tool like `drift` (or the same category: `docs-drift`, `doc-sync-check`, `docgap` - all following the same pattern of AST-extract-the-real-signature-then-diff-against-the-docs) is the more mature, off-the-shelf version of the same idea for a TypeScript codebase specifically. Worth naming as an option alongside the hand-rolled template, not a replacement for the principle.
