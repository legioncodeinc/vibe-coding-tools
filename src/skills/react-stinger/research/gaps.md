# Research Gaps

Tools or sources that were unavailable or partial at forge time (2026-04-24).

## GitHub rate-limiting

Fetching bulletproof-react docs via the HTML `github.com/.../blob/master/...` URL rate-limited. Worked around by using `raw.githubusercontent.com`: full content of all seven `docs/*.md` files was retrieved. Research notes cite both URLs.

## awesome-react list

The raw README is ~275K tokens: too large to fetch in one call. Curated catalog in `research/2026-04-24-awesome-react-ecosystem.md` is synthesized from WebSearch results plus domain knowledge; primary categories confirmed against known-good picks. If a specific sub-category needs deeper sourcing later, fetch the README in chunks or use the upstream per-section links.

## Next.js 16 (preview)

Next.js 16 is in preview at author time. This Stinger targets Next.js 15 (current stable). `research/react-version-log.md` notes 16 exists; upgrade the Stinger when 16 ships stable.

## None of these block the Stinger's v1 utility.
