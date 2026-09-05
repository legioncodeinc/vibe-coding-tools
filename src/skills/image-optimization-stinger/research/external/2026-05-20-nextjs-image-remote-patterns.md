---
url: https://nextjs.org/docs/messages/next-image-unconfigured-host
title: "next/image Un-configured Host - Next.js"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: nextjs-remote-patterns
stinger: image-optimization-stinger
---

# next/image Un-configured Host Error Page

## Summary

Official Next.js error documentation for the "un-configured host" error thrown when a remote image URL's hostname is not in `remotePatterns`. Covers the strict matching rules (protocol, hostname, port, pathname, search must all match), common pitfalls (https vs http mismatch, subdomain vs domain, port inclusion), and the `new URL()` constructor shorthand vs object syntax, including handling of search params.

## Key quotations / statistics

- "Each part of the `src` value is strictly matched against your `images.remotePatterns` definitions. Matching is exact and case-sensitive."
- Matching parts for `https://example.org/images/example?v=1234`: Protocol, Hostname, Port, Pathname, Search.
- "Using `https` in `src` but only allowing `http` (or vice versa)."
- "Loading from a subdomain like `assets.example.com` while only configuring `example.com`."
- "When using the `URL` constructor, if no `search` is specified, then the `search` property is set to an empty string `''`, which means search params are NOT allowed."
- Object form without `search` key (allows any search params):
  ```js
  remotePatterns: [{ protocol: 'https', hostname: 'assets.example.com', port: '', pathname: '/account123/**' }]
  ```
- URL constructor form: `remotePatterns: [new URL('https://assets.example.com/account123/**')]`
- Fix for older Next.js (< 15.3.0): must use object form, not URL constructor.

## Annotations for stinger-forge

- The "search param gotcha" (URL constructor sets search to `''` by default) is a frequent production bug -- document in `guides/04-next-image.md` as a callout.
- The version note (< 15.3.0 cannot use URL constructor form) is important for teams on older Next.js.
- The strict case-sensitivity of hostname matching is another common pitfall for CDN configurations.
- Use this page as the source for the "Common remotePatterns pitfalls" section in `guides/04-next-image.md`.
