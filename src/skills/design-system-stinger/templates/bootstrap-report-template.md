# Bootstrap Report: {{Product Name}}

**Date:** {{YYYY-MM-DD}}
**Starter kit used:** {{glass-on-beige | flat-modern | editorial-serif | other}}
**Target folder:** `{{path/to/ux-ui-folder/}}`
**Companion Bee:** `ux-ui-svelte-worker-bee`

## Interview summary

- **Product one-liner:** {{...}}
- **Aesthetic anchors:** {{A, B, C}}
- **Aesthetic vetoes:** {{X, Y, Z}}
- **Palette:** primary `{{hex}}`, accent `{{hex}}`
- **Surface metaphor:** {{glass | paper | flat | ...}}
- **Depth tiers:** {{n}}
- **Typography:** {{display}} + {{body}}
- **Motion buckets used:** {{fast | default | ...}}
- **Rendering targets:** {{web | PWA | native; tenant Y/N; dark-mode Y/N; RTL Y/N}}
- **Non-negotiables (verbatim from user):**
  - {{...}}
  - {{...}}

## Artifacts produced

| File / folder | Lines | Notes |
|---|---|---|
| `00-design-brief.md` | {{n}} | |
| `01-master-tokens.css` | {{n}} | |
| `02-{{utility}}.css` | {{n}} | |
| `03-components/` | {{m}} files | {{which groups}} |
| `04-screens/` | {{m}} files | {{which screens}} |
| `05-html-examples/` | {{m}} files + `_shared.css` | |
| `README.md` | {{n}} | |

Total size: ~{{n}} KB across {{n}} files.

## Migration ledger

{{If greenfield: "N/A, greenfield, no pre-existing CSS to migrate."

If migration:
- Files/components to refactor: {{n}}
- Hex values promoted to tokens: {{n}}
- Inline `style={{}}` occurrences to eliminate: {{n}}
- Estimated refactor duration (handled by `ux-ui-svelte-worker-bee`): {{weeks}}
}}

## Open questions handed to ux-ui-svelte-worker-bee

- {{any loose ends for the companion Bee}}

## Deviations from starter kit

{{List of tokens/utilities customized away from the starter kit defaults.
Typical list: palette hexes, one or two added tokens, a renamed utility.}}

## Retrospective

- **Interview quality:** {{how well pinned-down was the aesthetic?}}
- **Starter kit fit:** {{how close was the chosen kit to the final?}}
- **Friction:** {{any steps that felt slower than expected}}
- **Would-do-again:** {{any steps worth promoting to the canonical guide}}

## Next steps

- [ ] `ux-ui-svelte-worker-bee` ownership confirmed in `README.md`.
- [ ] Companion Bee stub authored (if not already present) at
      `.claude/agents/ux-ui-svelte-worker-bee.md`.
- [ ] Migration backlog seeded in the host repo's
      `library/requirements/reports/ux-ui/<date>-migration-backlog.md` (if migration scope).
- [ ] Status table in `README.md` updated after first code-alignment PR.
