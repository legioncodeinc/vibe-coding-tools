# Guide 3: anchor-text quality and cannibalization

## 1. The four scoring dimensions

`link-graph.py` scores every page's inbound-anchor profile across the four
dimensions distilled section 4 identifies, twice per page (all inbound, and
contextual-only): [raw/unveilseo-com-internal-link-audit.md]

| Dimension | What it measures | Cited flag threshold |
|---|---|---|
| Generic ratio | Share of anchors that are "click here," "read more," "learn more," and similar | Greater than 30% |
| Diversity | Count of unique anchor-text strings pointing at the page | Fewer than 3 unique anchors |
| Topical relevance | Word overlap between anchor text and the destination page's own title/H1 | Zero word overlap on any inbound anchor |
| Length | Word count of the anchor text | Mostly 1-word or empty anchors |

Treat the specific percentage cutoffs as single-vendor heuristics, not an
independently corroborated or Google-documented standard; say so in the
report whenever citing them. [raw/unveilseo-com-internal-link-audit.md]

## 2. Why the script reports contextual-only separately

A link in the body of an article that a reader actually benefits from
carries materially more topical/equity signal than the identical URL
appearing in global navigation, footer, or sidebar boilerplate present on
every page by construction. Filtering to `placement: main` edges when
judging whether an important page is genuinely under-linked avoids the
false reassurance of "it has 40 inbound links" when 39 of them are the same
nav bar repeated on every page. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md]

Always report and judge the `anchor_quality_contextual_only` column for
"is this page genuinely well-linked," and use the `anchor_quality_all_inbound`
column only as supporting context, never as the primary judgment.

## 3. Why surrounding context matters, even when this Drone cannot fully measure it

Google is described (secondhand, vendor framing, not independently verified
in this archive) as reading a window of surrounding text around a link, not
just the anchor string, to determine what signal it carries; an empty or
generic anchor embedded in a generic sentence transmits close to nothing
regardless of inbound link count. [raw/unveilseo-com-internal-link-audit.md]
`link-graph.py` scores the anchor string itself, not the surrounding
paragraph; note this as a scope limitation when a page's anchors score well
numerically but the surrounding prose is still generic, that gap is real
and this pair's tooling does not close it.

## 4. Anchor-text cannibalization

Identical exact-match anchor text pointing at two or more distinct
destination URLs sends conflicting signals about which page the phrase
should rank for. `link-graph.py`'s `find_cannibalization` groups all
non-generic, non-navigational anchor labels by normalized text and flags
any label with 2+ distinct destinations. [raw/unveilseo-com-internal-link-audit.md]

1. Review every flagged pair. For each, decide: pick one canonical
   destination and repoint the other link, differentiate the anchor
   phrasing so it is no longer identical, or (if the two pages should
   genuinely be one page) merge them.
2. Do not flag navigational/boilerplate anchor reuse (Home, Contact, About,
   and similar) as cannibalization; that reuse is expected site structure,
   not a ranking-signal conflict. The script already excludes these labels
   from the cannibalization table; if a genuine cannibalization case is
   accidentally excluded because its label happens to match the exclusion
   list, note that explicitly in the report rather than silently missing
   it.

## 5. Over-optimization caveat

Repeating the identical exact-match keyword anchor across many links to the
same URL reads as manipulated rather than natural and can trigger the same
concern Google's anchor-spam detection is tuned for. There is no single
disclosed numeric Google threshold in this archive; the practitioner rule
of thumb is to vary anchor text (primary keyword sometimes, synonym
sometimes, a longer descriptive phrase sometimes, branded/navigational
anchors for a meaningful share). [raw/library-linkbot-com-internal-link-audit.md]

## 6. Populate sections 4 and 5 of the report template

Write the per-page anchor-quality table and the cannibalization table into
`references/templates/internal-linking-report-template.md` sections 4 and 5.
