# Bifrost versioning scheme and changelog excerpts
- URL: https://github.com/maximhq/bifrost (git tags and transports/changelog.md, fetched 2026-09-04)
- Fetched: 2026-09-04
- Source type: official repo (tags + changelog)

## Tag scheme (monorepo, namespaced)

- `core/vX.Y.Z` - core Go module releases (observed up to core/v1.8.4 as of 2026-09-04)
- `transports/vX.Y.Z` - gateway/HTTP transport releases (observed up to transports/v1.6.11 on the v1 line; transports/v2.0.0 plus three v2.0.0 prereleases)
- `cli/vX.Y.Z`, `bifrost-migration-cli/v0.1.0`
- Tags are annotated; `<tag>^{}` dereferences to the commit. The Docker image tag `maximhq/bifrost:v1.6.7` corresponds to `transports/v1.6.7`.
- Module versions are independent per directory: at tag transports/v1.6.11, transports/go.mod requires `core v1.7.10` (core and transports version lines are NOT the same numbers).

## transports/v1.6.11 changelog highlights (from transports/changelog.md)

Features: URL sources inlined for AWS-hosted Claude; quarterly budgets for customers; fiscal year start in budget labels; flexible entity selector width.
Fixes (selection): WebSocket writes after disconnect (fasthttp hijacked-connection recycling could panic on nil connection or deliver to an unrelated client); realtime heartbeat panic on disconnect; stop sequences dropped for Nova/Titan; reasoning replay rejections; thinking signature strips; reasoning.content rejections by non-gpt-oss models; reasoning effort for current Grok models; empty structured-output streams; HTTP 529 treated as transient (retried) rather than rotating credentials.
Database migrations: none in this release.

## transports/v2.0.0 changelog highlights

"v2.0.0 is the first stable release on the 2.0 line. This changelog rolls up 2.0.0-prerelease1 (based on v1.6.3), 2.0.0-prerelease2, 2.0.0-prerelease3 and the final release window... the complete delta for a deployment upgrading from any v1.6.x release."
"Breaking changes. Read the v2.0.0 migration guide before upgrading." (docs.getbifrost.ai/migration-guides/v2.0.0)
Selected features: batch accounting (new batch_jobs table); input/output cost split on every log; Bifrost overhead latency breakdown; notification center (`GET/POST /api/notifications`); topbar and responsive dashboard; video edits; routing plugin split (endpoints moved to `/api/routing/rules` and `/api/routing/complexity-analyzer-config` with deprecated `/api/governance/*` aliases); `HTTPTransportPreAuthHook` plugin phase; MCP per-user OAuth overhaul; dimension scope ceiling on grouped log analytics.
Core at v2.0.0 declares `go 1.27.0`; at v1.6.11 `go 1.26.5`.
