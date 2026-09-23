# 02. GTM hydration and downstream tags

Why detecting Google Tag Manager is the start of the census, not the end of it.

## What GTM actually is

Google Tag Manager is a tag container, not an analytics tool itself, it is the loader that injects
every other marketing and tracking script [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Its
presence is a cue that other vendors are very likely loaded through it rather than directly, per the
research's own framing: "whatever else is tracking the user is very likely being loaded through it"
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md].

## Detecting GTM itself

`references/vendor-lookup-table.md` lists all seven researched GTM signals across three channels
(JavaScript global, HTML source, script src URL). `shared/scripts/vendor-census.py` checks all
seven; per the source's own detection tool description, "each signal alone is rarely conclusive,"
cross-reference all of them and weight by confidence rather than firing on a single match
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Confirming the JavaScript globals
(`window.google_tag_data`, `window.google_tag_manager`, `window.googletag`) requires the actual
executed page; this script cannot confirm them from static evidence alone and marks them
"expected-not-confirmed" when other channels already fired, per its own code comments. If your
browser-automation tool can evaluate JavaScript in the live page, check these globals directly and
record a confirmed hit.

## Do not stop at "GTM detected"

A real-world stack commonly puts Google Analytics plus ad-conversion pixels from Meta, LinkedIn, and
TikTok, and any number of marketing tags fired without a code deploy, behind the same GTM container
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Once GTM is detected, cross-reference every
other vendor row in `references/vendor-lookup-table.md` against the *same* network-request log from
the *same* page load. This is the concrete mechanism that answers PRD-004's requirement to include
"anything GTM injects at runtime": those injected vendors show up as their own separate network
requests during the JS-executed load (`guides/01-headless-capture-procedure.md`), not as children of
the GTM request itself. There is no separate "unwrap the GTM container" step, the census IS the
unwrap: every third-party origin seen during the load is a candidate row, whether it arrived via GTM
or was hardcoded directly in the page.

## Version detection is usually a non-finding

GTM ships as a hosted SaaS product, not a bundled package, so version-specific detection generally
is not possible; report "GTM present, version unknown" as the expected, correct outcome in the
overwhelming majority of cases, not a gap to keep digging at
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Only surface a version if the platform leaks
one via a response header or generator meta tag.

## Other tag managers, named but unresearched

Adobe Launch (`_satellite` global, `assets.adobedtm.com` paths) and Tealium (`utag.js`) are named in
the same source purely for comparison, with no full signature set documented beyond those two
fragments [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. If either matches, report it with
that limited grounding stated, do not imply the same seven-signal depth of confidence GTM has.
