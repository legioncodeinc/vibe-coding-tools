# Edge-level audit data model template

Copy-ready record shape for capturing one internal link as a full edge
record, per distilled section 6, rather than collapsing to a destination
count. This is what `references/scripts/link-graph.py` emits per edge
internally; use this table to inspect or hand-verify a specific edge
without re-running the script. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

| Field | Example | Purpose |
|---|---|---|
| `source_key` | `/guides/crawling` | Which canonical page emits the edge |
| `observed_href` | `../tools/crawler?ref=guide` | The literal href as authored, before resolution |
| `destination_key` | `/tools/crawler` | Canonical identity the edge resolves to (or `null` if uncrawled/external) |
| `label` | `crawler architecture tool` | The anchor text itself |
| `placement` | `main` or `template` | Contextual (in-body) vs. nav/header/footer/sidebar boilerplate |
| `nofollow` | `false` | Whether `rel="nofollow"` is present; excluded from equity computation if `true` |
| `artifact_ref` | `site-data/guides-crawling.html` | Reproducibility reference for the specific crawl observation |

## Worked example row set

| source_key | observed_href | destination_key | label | placement | nofollow | artifact_ref |
|---|---|---|---|---|---|---|
| index | /guides/crawling | guides-crawling | "crawling guide" | main | false | site-data/index.html |
| index | /orphan-target | null (uncrawled) | "click here" | main | false | site-data/index.html |
| about | /guides/crawling | guides-crawling | "crawling architecture guide" | main | false | site-data/about.html |
| index | https://external.example/thing | null (external) | "external link" | main | false | site-data/index.html |

Use `placement: template` links to explain WHY a page's raw inbound count
can be misleadingly high (every page's nav contributes identical edges) and
filter to `placement: main` when computing "under-served" status, per
distilled section 6's contextual-vs-template distinction. [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md]
