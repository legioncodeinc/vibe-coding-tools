Deterministic scripts for this audit domain live in the shared `shared/scripts/` folder at the plugin root, not duplicated per Stinger. See that folder's [README.md](../../../../shared/scripts/README.md) for the full script list and which pairs use which script.

This Stinger's script is **`shared/scripts/seo-technical.py`**, stdlib-only Python 3, no absolute paths. It implements three checks grounded in `references/research/distilled-technical-seo.md` sections 3-6:

| Subcommand | What it checks | Reads from |
|---|---|---|
| `robots` | robots.txt reachability, blanket-disallow, per-agent group parsing, Sitemap: directive presence | `--robots-url` (live fetch of the site-root file) or `--robots-file` (a copy already saved somewhere in the run workspace) |
| `sitemap` | XML well-formedness, urlset vs. sitemapindex, optional live URL-honesty sampling (`--verify-urls --max-verify N`) | `--sitemap-url` or `--sitemap-file` |
| `canonicals` | canonical-tag presence/multiplicity/target-mismatch/cross-domain, noindex presence and canonical/noindex conflict, H1 count | `--site-data-dir` (reads only already-crawled `site-data/*.html`, never re-fetches a crawled page) |
| `all` | Runs all three in one pass | combination of the above |

Every finding in the script's JSON output carries a `checkpoint`, `severity_hint` (not a final 0-6 score, that judgment stays with the Drone), `evidence`, `detail`, and a `source` citation back into the distilled research archive. See [guides/01-audit-procedure.md](../../guides/01-audit-procedure.md) for where this script's output feeds into the page-level scorecard, and the script's own module docstring for the read-only/site-root judgment call it makes about robots.txt and sitemap.xml not counting as a "re-crawl" under PRD-008.

Run it with `python3 shared/scripts/seo-technical.py <subcommand> --help` from the plugin root for the full flag list.

**Not covered by this script**, and not invented: keyword-frequency scoring and long-tail semantic-gap scoring have no deterministic mechanics in the research archive (see distillation Section 12). Those two checks are worksheet-driven judgment calls - see `references/templates/keyword-frequency-worksheet.md` and `references/templates/long-tail-semantic-gap-worksheet.md`.
