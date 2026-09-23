# 02. Signature matching and stack classification

How to turn the three collected channels (`guides/01-fetch-and-collect-signals.md`) into a `stack`
verdict.

## Run the matcher

```
python3 shared/scripts/fingerprint.py --url <target> --out target-profile.json
```

or, against already-captured artifacts:

```
python3 shared/scripts/fingerprint.py \
  --raw-html-file page.html --headers-file headers.json --cookies-file cookies.json \
  --out target-profile.json
```

The script applies `references/fingerprint-signature-table.md`'s table (embedded as `SIGNATURES` in
the script itself; the markdown file is the human-readable copy, kept in sync manually). Do not
hand-roll a second matching pass; if a signature is missing, add it to both the script and the
reference table, cite its grounding, and re-run.

## Precision over recall, always

The single strongest instruction in this Stinger's research archive: match only strings that cannot
appear in ordinary page prose, vendor asset URLs, header names, cookie names, generator tags, never
free-text keywords [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md].
A page whose blog post happens to mention "WordPress" in prose is not a WordPress site by that
mention alone; only `/wp-content/`, `/wp-admin/`, a `PHPSESSID` cookie, or a WordPress generator tag
count as evidence.

## Reading the confidence result

The script weights by matched *channel family* count, not raw hit count, per the EdgeDNS source's
"confidence levels graded by how many pattern families matched"
[raw/edgedns-dev-guides-domain-tech.md]:

- 2+ independent channel families agreeing on the same stack -> `high` (researched rows only)
- Exactly 1 channel family -> `medium` (researched rows only)
- Any judgment-call row -> capped at `low`, regardless of hit count

Never manually upgrade a judgment-call classification to `high` or `medium`, even if it is the only
candidate that matched. Report it at `low` and say explicitly in `01-recon/stack-fingerprint.md`
that the platform (React+Vite, or Magento) has no dedicated signature in this Stinger's research
archive.

## Multiple candidates matching

If more than one stack signature fires (rare, given the precision-first design, but possible on a
migrated or hybrid site), the script picks the highest-confidence, researched-over-judgment-call
winner and records the rest in `other_candidates`. Report both the winner and the runner-up in the
narrative report; do not silently drop the runner-up, it may be the more accurate read for a human
reviewer who knows the client migrated recently.

## Hosting/CDN hints are not stack signals

`cf-ray`, `x-vercel-id`, `x-nf-request-id`, `x-amz-cf-id`, and `x-served-by`-style headers
[raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] tell you who
hosts or fronts the site, not what stack it runs. Vercel hosts plenty of non-Next.js sites. Record
these under `hosting_hints`, never let them influence the `stack` field itself.

## The unrecognized case (PRD-003 AC-2)

If nothing in the signature table matches, `stack` is `unknown` and the script attaches
`raw_signals` (HTML length, header names, cookie names) instead of an evidence list. This is not a
failure state, it is the correct, honest output when the archive's coverage runs out. Never force an
unrecognized site into the nearest known category "because it's probably close enough." Write the
raw signals into `01-recon/stack-fingerprint.md`'s "Unknown-stack handling" section so a human can
classify it later, and set `platform_guide` to `null` so `site-crawler-wasp-drone` knows there is no
platform-specific guide to select and falls back to its own generic strategy.
