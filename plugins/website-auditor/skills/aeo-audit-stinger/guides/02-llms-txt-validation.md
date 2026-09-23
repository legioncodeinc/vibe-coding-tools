# 02. llms.txt validation

Grounded in `references/research/distilled-aeo-audit.md` Section 2. Run `shared/scripts/aeo-technical.py llms-txt --url <site>/llms.txt` first.

## Location

Must be at site root (`https://yourdomain.com/llms.txt`), not a subdirectory, not a meta tag. Per this archive, engines that do not find it at root do not look elsewhere - there is no documented fallback path. If the customer's site serves llms.txt from a non-root location, treat root-absence as a real finding even if the file exists elsewhere. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Minimum content

Site name, one-line description, primary content sections with URLs, and optionally agent-specific directives for blocking certain crawlers. The script's shape heuristic checks for a leading Markdown H1 (conventional site-identity marker) and at least one Markdown link to a content section - these are heuristics, not a validated parser, confirm by reading the file directly before scoring a shape failure as Critical. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Length

No specified character limit in this archive, but most engines reportedly truncate parsing after roughly 2,000 characters on initial parse (one vendor's stated heuristic, not a disclosed spec value). If the file is long, check that the critical lines (site name, description, top section links) are front-loaded rather than buried past that point. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Formal audit status (flag, do not overstate)

As of May 2026, Google Lighthouse is reported to formally audit llms.txt under an "Agentic Browsing" category, with a missing file failing that category outright. This is one vendor source's specific claim about Lighthouse behavior, not independently corroborated by an official Lighthouse changelog in this archive - present it as "per one source in this archive" rather than as a confirmed, verified fact if the auditor has not independently checked Lighthouse's own current audit categories. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Weighting disagreement (present both readings)

The AEO Report frames llms.txt as the non-negotiable Pillar 1 foundation of its entire checklist. Ranki.io independently ranks it 4th of 15 signals, behind two schema signals (FAQPage, Article) and one content-shape signal (definitional first paragraph), in its third-of-four "crawl tier." Neither is more authoritative than the other, both are single-vendor heuristics (distillation Section 1) - report the presence/absence finding as fact and the relative-importance framing as attributed opinion from two named sources. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
