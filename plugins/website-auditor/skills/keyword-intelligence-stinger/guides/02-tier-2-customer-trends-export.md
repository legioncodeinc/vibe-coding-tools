# 02. Tier 2: customer-supplied Google Trends export

Grounded in `references/research/distilled-keyword-intelligence.md` section 2
(`raw/searchspy-io-google-trends-download-data.md`).

## This tier is manual and customer-provided, not an automated pull

There is no official Google Trends API. The unofficial `pytrends` library that scrapes the site is
explicitly documented as "not suitable for production use," rate-limited, and prone to breaking on
UI changes. This tier's binding shape, per PRD-006's Overview and Shared workspace contract, is
therefore: the customer runs the export themselves (no account or sign-in required, three separate
CSV downloads per search from trends.google.com's Interest Over Time / Interest By Region / Related
Queries modules) and hands the file(s) to this Drone. Do not attempt to scrape or automate a Trends
pull as a substitute for this tier; that is out of scope and unsupported by the research archive.

## The two caveats that must survive into every downstream use of this data

1. **Relative scale, never absolute volume.** Every score in a Trends export is 0-100, relative to
   that export's own peak, "not how many people searched." A score of 87 does not mean 87 anything.
   Tier-2-sourced entries in `content-targets/keywords.md`/`questions.md` must carry this relative
   score in the Volume column, and the Notes column must make clear it is a Trends interest score,
   never phrase it as a search-volume number.
2. **Cross-file normalization trap.** If the customer supplies multiple separate export files
   (e.g. one export per search term, downloaded independently), each file's scores are normalized
   to its own independent 0-100 scale. Do not merge or rank scores from different files against
   each other as if they shared one scale; only terms compared together within the SAME export are
   on a shared scale. When in doubt about whether two files came from a combined or separate
   export, treat them as separate (the safer, more conservative reading).

## Ingestion procedure

1. Receive the customer's raw CSV file(s). Do not edit, reformat, or "clean" them.
2. Copy them unmodified into `content-targets/trends-raw/`, per PRD-006 AC-4. Use
   `references/templates/trends-raw-readme-template.md` to file the accompanying manifest README.
3. Parse a working copy (not the archived original) for extraction into
   `content-targets/keywords.md`/`questions.md`. Expect a short metadata header row before the data
   rows (search term, parameters used); skip it when parsing, but never strip it from the archived
   original.
4. Tag every resulting entry `customer-trends`, with the relative score preserved as-is.

## What "unavailable" looks like for this tier

No customer-supplied file exists in the run's intake material. This is not an error; it is the
normal condition that causes fallthrough to Tier 3, and should be recorded as such in the
provenance summary (`references/templates/keywords-template.md`'s "Provenance summary" block) and
in the run ledger, per PRD-006 AC-2's "no user-visible error, only a note in the run ledger."
