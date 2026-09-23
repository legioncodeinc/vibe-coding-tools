# Scripts for keyword-intelligence-stinger

Unlike most other Stingers in this plugin, this domain has no entry in the central
`shared/scripts/README.md` table: no other pair shares keyword-source-priority logic, so this
Stinger's one deterministic script lives locally instead of in `shared/scripts/`.

## `fallback-chain-decision.py`

Given the outcome of checking each tier (is a Search Console MCP connected and does it have data,
does a customer Trends export exist, how many candidates has inference produced so far, is a
paid-API budget approved), returns which tier's output to use and why, as one auditable JSON
decision. This is what makes PRD-006 AC-1/AC-2's "record which tier actually produced each
keyword" and "no user-visible error on fallthrough" requirements concrete and checkable, instead of
an implicit judgment made mid-run.

```
python3 skills/keyword-intelligence-stinger/references/scripts/fallback-chain-decision.py \
  --target-type keywords \
  --gsc-mcp-connected --gsc-has-data \
  --candidate-count 82
```

Read the script's own module docstring before running it: it states explicitly what the script
does not do (it never calls the MCP, Trends export, inference, or paid API itself; it only decides
which already-gathered result to use), and why Tier 4 is never auto-selected as a simple "Tier 3
failed" fallback.

See `guides/05-fallback-chain-and-provenance.md` for the full decision procedure this script
implements, and `references/templates/keywords-template.md` /
`references/templates/questions-template.md` for where the resulting tier tag and provenance
summary land in the output files.
