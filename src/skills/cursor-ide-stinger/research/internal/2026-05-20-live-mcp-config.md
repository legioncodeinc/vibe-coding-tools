---
source_type: internal-artifact
authority: high
relevance: high
topic: mcp-integration
url: C:/Users/mario/.cursor/mcp.json
fetched: 2026-05-20
---

# Live mcp.json Configuration (User-Global)

## Summary

The user's global `~/.cursor/mcp.json` demonstrates real-world MCP server registration patterns across four transport types. This is a production example that `stinger-forge` can use to derive concrete examples and gotchas for `guides/03-mcp-integration.md`.

Seven servers are registered:

1. **GitKraken** (stdio, absolute path to `.exe`): Shows the Windows path pattern and `--host=cursor` arg for IDE-aware servers.
2. **Chrome DevTools** (stdio, `npx` with `@latest`): Shows the `npx -y` shorthand for zero-install servers.
3. **perplexity** (stdio, `npx`, env var `PERPLEXITY_API_KEY`): Shows env-based secret injection.
4. **Supabase** (remote HTTP, `url` field only, empty `headers`): Shows the minimal remote server config; demonstrates that `headers` can be an empty object when auth is handled differently.
5. **replicate** (remote HTTP via `mcp-remote@latest` wrapper): Shows the pattern of wrapping SSE endpoints with `mcp-remote` for clients that only support stdio.
6. **cloudflare-api** (remote HTTP, URL only): Another minimal remote server, Cloudflare-hosted.
7. **userback** (remote HTTP, trailing slash in URL): Real example that path-including URLs are valid.
8. **dbhub-bayleebooks** (stdio, `@bytebase/dbhub`, long arg list including DSN): Shows how database connection strings are passed as args rather than env vars.
9. **beeper** (remote HTTP, localhost URL): Shows localhost HTTP servers for locally-running daemons.

## Key observations

- No `type: "stdio"` field is needed for stdio servers; it is the default and Cursor infers it from presence of `command`.
- Sensitive credentials appear in both `env` (perplexity key) and `args` (database DSN). The `args` approach is less secure; `env` is preferred.
- Remote servers with `url` field do NOT need `command` or `args`.
- The `headers` field on remote servers is optional; an empty object `{}` is valid.
- No `disabled` flags are present; all servers are active.

## Annotations for stinger-forge

- Use GitKraken and perplexity entries as stdio examples in `guides/03-mcp-integration.md`.
- Use Supabase and cloudflare-api entries as minimal remote server examples.
- Use replicate (`mcp-remote` wrapper) as the SSE-via-stdio pattern example.
- Note the DSN-in-args antipattern from dbhub; flag it in the security section of guide 03.
- The `beeper` localhost entry is a good example of local daemon registration.
