---
source_url: https://w3techs.com/technologies/details/ce-http3
retrieved_on: 2026-05-20
source_type: blog
authority: community
relevance: high
topic: http3
stinger: http-rest-fundamentals-stinger
---

# W3Techs HTTP/3 Usage Statistics: May 2026

Published: N/A (live stats). W3Techs survey of top websites.

## Summary
W3Techs tracks HTTP/3 adoption across the top 10 million websites. As of May 2026, HTTP/3 is used by 39.2% of all websites surveyed, up from ~26-28% in the 2024 Web Almanac. The APNIC global measurement (May 12-18, 2026) shows HTTP/3 on the first query at 20.1% worldwide, rising to 70.2% on the second query (after Alt-Svc is cached). Northern America leads with 47.4% first-query adoption. The HTTP Archive Web Almanac (2024 edition) documented ~85% of all HTTP/3 responses coming from CDNs, reinforcing that self-hosted HTTP/3 remains rare at the origin layer.

## Key quotations / statistics
- W3Techs: "HTTP/3 is used by 39.2% of all the websites." (May 2026)
- APNIC survey (May 12-18, 2026): HTTP/3 first query: 20.1% (world), 47.4% (Northern America), 30.7% (Europe), 17.3% (Asia).
- APNIC second query (Alt-Svc cached): 70.2% (world), 78.3% (Europe), 65.8% (Asia).
- Web Almanac 2024: "~85% of all HTTP/3 responses came from a CDN."
- Web Almanac 2024: "Only 0.46% of the 8.5 million pages not loaded via a CDN had a DNS HTTPS record configured for HTTP/3."
- Cloudflare leads DNS HTTPS record adoption for HTTP/3 at 50%+ of its hosted sites.

## Annotations for stinger-forge
- `guides/06-http2-http3.md`: use the stats to frame when HTTP/3 matters. For teams behind a CDN (Cloudflare, Vercel, Fastly), HTTP/3 is already on. For self-hosted origins, it requires active effort with low current adoption.
- The "20% first-query, 70% second-query" pattern illustrates the Alt-Svc discovery gap: the browser doesn't know about h3 until the first HTTP/2 response includes Alt-Svc.
- Use the CDN centralization stat (85% of HTTP/3 traffic via CDN) to calibrate guidance: "most projects get HTTP/3 for free via CDN; origin HTTP/3 is an advanced topic."
- Pairs well with the httptoolkit.com "HTTP/3 is everywhere but nowhere" blog (2025) which explains the open-source library gap despite browser/CDN adoption.
