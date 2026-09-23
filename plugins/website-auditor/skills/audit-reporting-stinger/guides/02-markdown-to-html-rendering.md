# 02. Markdown-to-HTML rendering procedure

Grounded in [references/research/distilled-audit-reporting.md section 7](../references/research/distilled-audit-reporting.md) (the mcp-md-html-pdf tool's own documentation, the only source in this pair's research cluster that addresses templated Markdown-to-branded-HTML rendering) and demonstrated concretely in [references/scripts/render-report.py](../references/scripts/render-report.py), which implements this procedure end to end against a sample data dict.

## The four artifacts and how they relate

- `references/templates/brand.json` - the brand definition: logo, a four-color palette (`primary`/`accent`/`muted`/`surface`), a separate severity-color palette, two prose font stacks (heading, body) plus a third mono stack reserved for technical strings, named style presets, and footer toggles. Shape follows the research's brand.json pattern.
- `references/templates/{customer,auditor}-report-template.md` - the content template: section structure and placeholder syntax, rendered against real data into a plain, portable Markdown document. This IS the customer/auditor Markdown deliverable once rendered - no further step needed for the `.md` output.
- `references/templates/{customer,auditor}-report-template.html` - the styled HTML shell: header, inline CSS driven by `brand.json`'s values, a `content` injection point, and a footer carrying the credit line, mark, and website link exactly once.
- `references/scripts/render-report.py` - the reference renderer. Not production infrastructure; it is a short, dependency-free demonstration proving the pipeline below actually runs.

## Template syntax (the placeholder convention used across all four templates)

Documented once, in full, at the top of `customer-report-template.md`, and referenced from the other three files rather than repeated:

| Syntax | Meaning |
|---|---|
| `{{ path.to.value }}` | Variable substitution. Dot-notation lookup into the data dict passed to the renderer. |
| `{% for item in list_path %} ... {% endfor %}` | Repeats the block once per item in the list at `list_path`, exposing `item` inside the block body. |
| `{% if flag_path %} ... {% endif %}` | Includes the block only when the value at `flag_path` is truthy. |
| a hash-brace comment marker | Stripped entirely before rendering, never appears in output. Used for the template-syntax documentation blocks themselves and for structure-rationale notes. |

This is a Jinja2-style convention (chosen because it is the most widely recognized templating syntax, so any future move to real Jinja2 is a drop-in), but `render-report.py` implements it with a small hand-rolled regex-based engine rather than a `jinja2` dependency, so the demonstration script has zero external dependencies and runs anywhere Python 3 runs. If this Drone is ever extended to use real Jinja2 (or another engine), the template files themselves should not need to change, only the renderer.

## Rendering procedure, per report pair

1. **Load `brand.json`.** This is the single source of brand truth for a run. See guide 03 for the override-layering model if a specific engagement needs a different brand file.
2. **Build the data context.** One dict, containing `brand` (from step 1) plus `report`, `scorecard`, `findings`, `customer_findings`, `recommendations`, `verification_log`, and related keys sourced from `scoring/findings-register.csv`, `scoring/audit-scorecard.xlsx`, and `_shared/evidence-index.md`. `render-report.py`'s `build_sample_context()` shows the full expected shape against sample data - use it as the field-name reference when wiring in real data.
3. **Render the `.md` template against the context.** Produces the final Markdown text. This text, written as-is to `reports/{customer,auditor}-report.md`, is the complete Markdown deliverable.
4. **Convert the rendered Markdown to an HTML content fragment.** `render-report.py` includes a small hand-rolled Markdown-to-HTML converter (headers, bold/italic, inline code, links, unordered lists, pipe tables, blockquotes, horizontal rules, paragraphs) sufficient for these four templates' structure. It is not a general-purpose Markdown implementation; if the report structure grows to need footnotes, nested lists, or fenced code blocks, extend the converter or swap in a real Markdown library at that point.
5. **Strip the Markdown document's own trailing footer paragraph before conversion.** The `.md` templates end with their own plain-text `*credit line - website*` line, because Markdown has no separate "document footer" region. The HTML shell supplies the same information through a dedicated, styled `<footer>` element. Injecting the unmodified Markdown body into the HTML shell would print the credit line twice, violating prd-021 AC-3 ("exactly once per document, not repeated per section"). `render-report.py`'s `_strip_trailing_footer_credit()` removes that trailing paragraph (and its preceding separator) from the copy used to build the HTML content fragment only - the standalone `.md` file is unaffected and keeps its own footer line.
6. **Render the `.html` shell template against the context, with `content` set to the fragment from step 5.** Produces the final, self-contained HTML page: inline CSS (no external stylesheet dependency), brand colors and fonts substituted from `brand.json`, and the footer's mark/credit-line/website-link block rendered from the same `footer` object.
7. **Write both outputs to `reports/`.** `reports/customer-report.md` + `.html`, `reports/auditor-report.md` + `.html`. Four files, one rendering pass, one shared data context - this is what keeps prd-021 AC-1's "no finding silently absent from one variant" guarantee mechanical rather than a manual audit after the fact.
8. **Verify before treating the run as done.** At minimum: no unresolved `{{` placeholder remains in any output (a template field the context did not supply), and the footer credit-line string appears exactly once in each HTML file. `render-report.py`'s `main()` runs both checks as assertions on its own sample output - the real render step should run equivalent checks on real output.

## Style presets are layout, not identity

`brand.json`'s `style_presets` maps `customer` to `"executive"` and `auditor` to `"technical"` - naming which layout personality a document uses, per the research's stated separation of concerns (presets change typography emphasis and density, never the brand's own colors or fonts). The two HTML shell templates in this repo already encode this split directly in their CSS (the auditor shell uses tighter table padding and heavier monospace emphasis for evidence pointers and IDs) rather than deriving it dynamically from the preset name at render time - a future refactor could make the preset name drive shared CSS fragments if a third report type is ever added.
