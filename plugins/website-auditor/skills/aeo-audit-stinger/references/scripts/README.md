Deterministic scripts for this audit domain live in the shared `shared/scripts/` folder at the plugin root, not duplicated per Stinger. See that folder's [README.md](../../../../shared/scripts/README.md) for the full script list and which pairs use which script.

This Stinger's script is **`shared/scripts/aeo-technical.py`**, stdlib-only Python 3, no absolute paths. It implements the two objective/technical checks grounded in `references/research/distilled-aeo-audit.md` sections 2-3:

| Subcommand | What it checks | Reads from |
|---|---|---|
| `llms-txt` | Presence, HTTP status, length against the ~2,000-character practical-truncation heuristic, and a shape heuristic (leading site-identity heading, Markdown links to content sections) | `--url` (live fetch of `/llms.txt`) or `--file` |
| `robots-access` | Per-engine AI-crawler robots.txt access for GPTBot/ChatGPT-User, PerplexityBot, ClaudeBot, Googlebot, Google-Extended, Cohere-AI, plus the GPTBot-blocked-but-CCBot-allowed trap | `--robots-url` or `--robots-file` |
| `all` | Both checks for one site, from `--site https://example.com` | derives `/llms.txt` and `/robots.txt` under that host, or accepts explicit `--llms-url`/`--robots-url` |

Every finding carries a `checkpoint`, `severity_hint`, `evidence`, `detail`, and a `source` citation. These are **technical** findings only, per PRD-009 AC-1/AC-2 - the script never scores or asserts anything about subjective topical alignment; that stays a separate, explicitly `[subjective]`-labelled read. See [guides/02-llms-txt-validation.md](../../guides/02-llms-txt-validation.md), [guides/03-ai-crawler-robots-access.md](../../guides/03-ai-crawler-robots-access.md), and [guides/05-subjective-topical-alignment.md](../../guides/05-subjective-topical-alignment.md).

Run it with `python3 shared/scripts/aeo-technical.py <subcommand> --help` from the plugin root for the full flag list.

**Not covered by this script**: schema/structured-data signals (FAQPage, Article, Organization, BreadcrumbList, SpeakableSpecification) require reading the crawled page content in `site-data/`, not a live fetch of two site-root files - see `references/templates/schema-signals-checklist.md`, worked by hand or with a JSON-LD extraction pass against `site-data/*.html`, not by this script.
