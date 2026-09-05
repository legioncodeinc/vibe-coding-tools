# Bifrost versioning and freeze policy

Grounded in [raw/07](research/raw/07-tags-and-changelog.md).

## Tag scheme

- Namespaced annotated tags: `core/vX.Y.Z`, `transports/vX.Y.Z`, `cli/vX.Y.Z`.
- Docker image tags (`maximhq/bifrost:v1.6.7`) track transports tags.
- Module version numbers are independent: at transports/v1.6.11 the transport module requires core v1.7.10. Never assume core and transports version numbers align.
- `<tag>^{}` dereferences an annotated tag to its commit; pin the commit SHA in any provenance record.

## Reference points (verified 2026-09-04)

| Ref | Go directive | Notes |
|---|---|---|
| transports/v1.6.7 | (v1.6 line) | What the stayfrosty deployment originally ran (image `maximhq/bifrost:v1.6.7`) |
| transports/v1.6.11 | go 1.26.5 (core v1.7.10) | Tip of the v1 line; WebSocket panic fixes; no DB migrations |
| transports/v2.0.0 | go 1.27.0 | First stable 2.0; explicit breaking changes; migration guide at docs.getbifrost.ai/migration-guides/v2.0.0 |

## Freeze policy (as adopted by the stayfrosty product reset)

- Pin the exact tag + commit in the fork's provenance file; build gateway, plugins, and UI from that one commit.
- Watch upstream releases. Take: CVEs, provider schema breaks, features the product explicitly wants. Skip: cosmetic UI, Enterprise, drive-by refactors.
- Upgrades are deliberate merges of the upstream tag diff onto the fork's commits, never a re-vendor from scratch (local commits would be lost).
- When taking a v2.x upgrade: read the migration guide, diff `docs/openapi/` for endpoint moves (e.g. routing endpoints relocated in v2.0.0), and update every UI/proxy consumer in the same change.
