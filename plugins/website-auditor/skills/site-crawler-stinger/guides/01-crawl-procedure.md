# 01. Crawl procedure

The end-to-end procedure for a single site-crawler-wasp-drone run. Read this first; the other
guides in this folder go deep on one step each.

## 0. Preconditions

- `_shared/target-profile.json` exists and has non-null `platform`, `rendering`, and `confidence`
  fields. This file is written by `stack-fingerprint-wasp-drone` in wave W1a, and this Drone runs in
  wave W4, sync, "needs stack type" per the build plan's dependency graph and PRD-007's `Depends
  on: prd-003`. If `target-profile.json` is missing, stop and hand back to the orchestrating agent
  rather than guessing a platform.
- The audit workspace's `site-data/` directory does not yet exist, or is empty. This Drone writes it
  once; it is not designed to be re-run mid-engagement without an explicit re-crawl decision (see
  `guides/05-politeness-and-scope-limits.md`).

## 1. Read the platform classification

Read `platform` and `rendering` out of `_shared/target-profile.json`. Do not re-detect the stack;
PRD-003's binding contract is that later Drones "read `target-profile.json` instead of re-detecting."

## 2. Select the platform traversal strategy

Per PRD-007 AC-1, the crawl must use "that platform's specific traversal strategy rather than a
generic link-follow." See `guides/02-platform-traversal-strategies.md` for the seed-path table per
platform and the honesty note on how thin the direct research grounding is here.

## 3. Run the frontier crawl

Run `shared/scripts/crawl-extract.py` (see `references/scripts/README.md` for the exact command),
or reproduce its algorithm by hand if the script cannot run in the current environment. The
frontier is breadth-first: seed URLs (platform paths, sitemap.xml entries, the homepage) go in
first, then same-domain links discovered on each fetched page are appended to the end of the
queue as they are found.

**"Depth 100" is a page-count budget, not a link-hop depth.** PRD-007's Overview line ("Platform-
aware crawl to a depth of 100 pages") reads ambiguously in isolation, but its own Goals section
("Crawls up to 100 pages") and AC-2 ("up to 100 page pairs") are unambiguous and more precise: the
binding requirement is a total-page cap of 100, enforced across the whole crawl regardless of how
many link-hops any individual page is from the homepage. Resolve the PRD's own internal wording
tension in favor of the Goals/AC text, not the Overview's shorthand. This is a judgment call
recorded here explicitly because no distilled research source addresses it (see
`references/research/distilled-site-crawler.md` section 7's gap note: "crawl depth/breadth
strategy... entirely unresearched in the current archive").

## 4. Store each page

Per PRD-007 Goals: "storing each page's raw HTML and a Markdown extraction under
`site-data/<slug>.html` / `<slug>.md`." See `guides/04-storage-and-manifest-convention.md` for the
exact slugify algorithm and the `manifest.json` index every Wave-5 Drone reads.

## 5. Respect scope limits throughout

Robots.txt, rate limiting, same-domain-only, no authenticated areas, no forms, the 100-page cap
without explicit opt-in. See `guides/05-politeness-and-scope-limits.md`.

## 6. Write the manifest and stop

Once the frontier is exhausted or the 100-page cap is hit, write `site-data/manifest.json`
(the crawl script does this automatically) and stop. This Drone does not analyze what it crawled;
that is every Wave-5 Drone's job, reading `site-data/` read-only per PRD-007's shared workspace
contract ("Writes once; every Wave-5 Drone reads this folder read-only with no write contention").

## 7. Report

Write a short run summary to this engagement's `www.<domain>-audit/_shared/run-ledger.json` entry
(pages fetched, pages unreachable, platform strategy used) per this pair's Drone file's Reporting
expectations section. Do not write a report into this plugin repository's own `library/`; that
destination is for this repo's own Ship Gate reports, not for customer audit output. See
`agents/site-crawler-wasp-drone.md`.
