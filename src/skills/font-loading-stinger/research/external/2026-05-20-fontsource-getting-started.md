---
url: https://fontsource.org/docs/getting-started
fetched: 2026-05-20
source_type: official-docs
authority: high
relevance: medium
topic: self-hosting
---

# Fontsource: Getting Started

## Summary

Fontsource is an npm-based self-hosting strategy for open-source fonts (1500+ fonts), providing a version-locked, privacy-preserving alternative to loading fonts from Google Fonts CDN. Each font is packaged as an individual npm package (e.g., `@fontsource/inter`). Key advantages: eliminates third-party DNS lookup and TCP connection overhead, version-locks fonts (Google pushes silent updates), enables offline use, and supports fonts outside the Google ecosystem.

## Key quotations / statistics

- Performance: "Self-hosting fonts can significantly improve website performance by eliminating the extra latency caused by additional DNS resolution and TCP connection establishment that is required when using a CDN like Google Fonts."
- Study reference: "This can help to prevent doubled visual load times for simple websites, as benchmarked [here](https://github.com/HTTPArchive/almanac.httparchive.org/pull/607)."
- Version locking: "Google often pushes updates to their fonts without notice, which may interfere with your live production projects. Manage your fonts like any other NPM dependency."
- Privacy: "Google does track the usage of their fonts and for those who are extremely privacy concerned, self-hosting is an alternative."
- Offline: "Your fonts load offline. This feature is beneficial for Progressive Web Apps."
- Ecosystem: "Support for fonts outside the Google Font ecosystem."

## Annotations for stinger-forge

- Fontsource is the recommended self-hosting path when using a bundler (React, Next.js, Vite) and you want npm dependency management. For pure Next.js projects, `next/font/google` is preferred because it also handles `adjustFontFallback` automatically.
- The Fontsource approach does NOT automatically provide metric-override fallbacks: that remains the developer's responsibility. This distinction should be noted in `guides/04-nextjs-font.md`.
- The docs are thin at the intro level. The stinger should link to the Fontsource variable fonts docs (not covered in the intro) for more detail on subsetting configuration.
- Key difference for stinger: Fontsource packages the font file but does NOT inline `@font-face` rules with `unicode-range` splitting. The developer is responsible for the full `@font-face` stack.
- Contradiction with web.dev note: web.dev found that CDN-hosted fonts sometimes outperform self-hosted fonts in practice (Web Almanac data). Fontsource's self-hosting advantage is most pronounced when combined with a CDN and HTTP/2.
