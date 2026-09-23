# 02. CDN and caching headers

Scores the CDN-presence leaf (3% of Technical deployment) and the caching-header-strategy leaf (4%). **Grounding notice, read this before anything else in this guide:** per `references/research/distilled-performance-cwv.md` section 7, neither raw source in this Stinger's research archive documents CDN caching behavior, header-level interpretation, edge/CDN provider fingerprinting, or caching-strategy methodology in any depth, the only mention is the vendor blog naming "CDN edge delivery" once, in passing, as a contributing factor to general LCP improvement. Everything below this notice is general, long-standing HTTP and CDN-vendor convention (RFC 9111 semantics, publicly documented vendor edge headers), not a finding from this Stinger's own research sweep. Treat it accordingly in any report output, and do not present it as archive-grounded.

## Capturing the evidence

Run `references/scripts/cdn-header-scan.py` against the sampled page set. It performs a read-only HEAD (falling back to a GET only if HEAD is rejected) and returns the raw headers verbatim, this raw capture is the evidence pointer for both leaves in this guide, never a paraphrase of it. See `references/templates/cdn-header-checklist.md` for the full header list and what each one indicates.

## Scoring CDN presence (3%)

- **1 (F, critical) or 6 (A, none), boolean:** either a CDN/edge-delivery layer is identifiable from the captured headers (a clear vendor-specific signal, e.g. a `CF-Ray` or `X-Amz-Cf-Id` header, not just a generic `Server: nginx`) or it is not. This leaf resolves to 6 or 1 only, per the plugin-wide boolean-checkpoint rule, since "is there a CDN in front of this site" is itself a yes/no fact once you have the header evidence.
- Do not name a specific vendor from a single ambiguous header (a bare `Server: nginx` does not name a CDN vendor, `nginx` is also the most common origin web server). Require a clear, vendor-specific signal before naming one, per `references/templates/cdn-header-checklist.md`.
- If headers are genuinely ambiguous (no CDN-identifying signal, but also nothing ruling one out), score 1 (no CDN evidence found) and note the ambiguity in the justification rather than guessing.

## Scoring caching-header strategy (4%)

This leaf is NOT boolean, apply the full 0-6 scale, and be explicit about where the score is grounded (presence/absence, internal consistency) versus where it would require an adequacy judgment this archive doesn't yet support:

- **1 (F, critical):** `Cache-Control` is absent entirely across the sampled HTML responses, and no CDN-level caching signal (`Age`, `X-Cache`) is present either. No evidence of any caching strategy.
- **2 (D, high):** Caching headers present but inconsistent, e.g. static assets served with no `Cache-Control` at all while HTML pages carry one, or contradictory directives on the same resource type across different sampled pages.
- **3 (C, medium):** `Cache-Control` present and consistent across the sampled set at a baseline level, even if the specific values look conservative.
- **4 (B minus, low):** Consistent, plus at least one signal of deliberate tuning (`Age` values confirming cache hits, an `ETag` supporting revalidation, a `Vary` header scoped narrowly rather than defeating caching broadly).
- **5-6 (B/A):** Strong, internally consistent, evidence of edge caching actually serving hits (`Age` > 0 on repeat-fetched static assets), no findings beyond cosmetic.

**What you may NOT do on this leaf:** assert that a specific `max-age` number is objectively correct or incorrect for a specific page type (e.g. "this HTML page's `max-age=0` is wrong"). That is an adequacy judgment this Stinger's archive does not currently support with a primary source. If you believe a specific value is suboptimal, label the finding `[subjective]`, state the reasoning plainly, and keep it separate from the quantified presence/consistency findings above, per conduct rule 3.

## CDN vendor identification reference

See `references/templates/cdn-header-checklist.md` for the full table of vendor-identifying headers (`CF-Ray`/`CF-Cache-Status` for Cloudflare, `X-Amz-Cf-Id` for CloudFront, `X-Akamai-*` for Akamai, `X-Vercel-Cache` for Vercel, `X-Nf-Request-Id` for Netlify, and the generic `Via`/`X-Served-By`/`X-Cache` conventions used by many providers).

## Closing this gap

If a future forge pass adds primary-source research on caching-strategy audit methodology or CDN-header interpretation standards, update this guide, `references/templates/cdn-header-checklist.md`, and the grounding notice at the top of `references/research/distilled-performance-cwv.md` together, don't leave the guide's advice ungrounded once a source exists to ground it.
