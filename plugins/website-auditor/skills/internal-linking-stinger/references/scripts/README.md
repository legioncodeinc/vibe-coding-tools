Deterministic scripts for this audit domain live in the shared
`shared/scripts/` folder at the plugin root by default; see that folder's
README for the full centrally shared script list. None of the eleven
scripts listed there cover link-graph mechanics (BFS click depth, anchor
scoring, internal-PageRank-style equity flow), so this pair carries one
script of its own:

| Script | Purpose |
|---|---|
| `link-graph.py` | Builds the internal link graph from a `site-data/` crawl output, computes click depth via BFS from a defined entry-point set, scores anchor-text quality (generic ratio, diversity, topical relevance, length), flags orphan/dead-end pages and anchor-text cannibalization, and computes an internal-PageRank-style equity distribution (damping factor, dangling-node handling). Grounding and every threshold's provenance are documented in the script's own docstring; read that before trusting a number it prints. |

Run it once per audit, after `site-crawler-wasp-drone` has finished writing
`site-data/`, before authoring `03-seo/internal-linking.md` from
`references/templates/internal-linking-report-template.md`. See
`guides/01-graph-construction-and-orphan-detection.md` for the full
procedure this script fits into.
