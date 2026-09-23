# 06 - Authentication Patterns for Remote/HTTP MCP Servers

New guide - the original Hivemind-only version of this pair had no authentication guide at all, because Hivemind is stdio-only with a local credentials file and never needed one. Any server exposed over HTTP does.

---

## Start with the transport-scoped rule

The MCP Authorization spec is explicit and transport-scoped [external/mcp-spec-authorization.md]:

- **STDIO transport SHOULD NOT follow this spec at all.** Retrieve credentials from the environment instead (an env var, a local config/credentials file). This is a deliberate, spec-sanctioned pattern, not a workaround - see `guides/01-transport.md` and the worked example (`guides/09-hivemind-worked-example.md`) for what this looks like in a real server.
- **HTTP-based transports SHOULD conform to this spec** - i.e. use the OAuth 2.1 flow described below, or a documented lighter-weight alternative (bearer token / API key) with eyes open about what it gives up.
- **Other transports MUST follow established security best practices for their protocol** - the spec does not prescribe a shape for them.

So the first audit question for any remote server is not "is auth implemented correctly" - it's "does this even need the full OAuth flow, or is it stdio and should be using environment credentials instead."

---

## Pattern 1: bearer token / API key (the lightweight option)

HTTP transport supports standard HTTP auth methods including bearer tokens, API keys, and custom headers natively [external/mcp-spec-architecture.md]. A static or rotating token, sent as `Authorization: Bearer <token>` (or a custom header), validated server-side on every request:

- **HTTP is stateless - every single request must independently prove it's authorized**, not rely on a prior handshake or session cookie alone [external/mcp-testing-three-layers-autonoma.md].
- Reject before running any tool logic: a missing or invalid token should be refused at the transport/middleware layer, never caught downstream inside a tool handler.
- Never accept the token in the URL query string - only in a header. Query strings end up in server logs, browser history, and proxy access logs.
- This pattern gives you: simplicity, fast to stand up, no separate authorization-server deployment. It does **not** give you: token audience binding (nothing stops a token meant for a different service from being replayed here unless you build that check yourself), standardized discovery, or scoped permissions beyond whatever you hand-roll.
- **Treat this as an acceptable minimum for a low-stakes internal HTTP server** - escalate to full OAuth 2.1 (below) once the server is exposed publicly, handles sensitive data, or needs per-caller scoping.

---

## Pattern 2: OAuth 2.1 (the spec-conformant option)

For a server the MCP Authorization spec expects to be layered onto (public or higher-stakes HTTP servers), the flow composes existing OAuth 2.0/2.1 standards rather than inventing a new one [external/mcp-spec-authorization.md]:

- **Roles:** the MCP server is an OAuth 2.1 *resource server*; the MCP client is an OAuth 2.1 *client*; a separate (or co-hosted) *authorization server* issues tokens.
- **Server-side MUSTs:**
  - Implement OAuth 2.0 Protected Resource Metadata (RFC 9728) so clients can discover which authorization server(s) to use.
  - Return `WWW-Authenticate: Bearer resource_metadata="<url>"` on `401 Unauthorized` responses.
  - Validate every access token's signature *and* audience - it must have been issued specifically for this server (RFC 8707 Resource Indicators) - before processing any request. Reject invalid/expired tokens with `401`.
  - **Never pass a client-supplied token through unmodified to an upstream API.** If the server itself calls an upstream API on the caller's behalf, it uses its *own*, separately-obtained token there. This is the "confused deputy" / token-passthrough prohibition - forwarding the caller's token lets a downstream API incorrectly trust it as validated by the wrong party.
- **Client-side MUSTs:** send a `resource` parameter (the canonical MCP server URI, e.g. `https://mcp.example.com/mcp` - no fragment, consistent trailing-slash convention) in both the authorization request and the token request; implement PKCE to protect the authorization code from interception; send the access token as `Authorization: Bearer <token>` on every request, never in the query string, even within one logical session.
- **Dynamic Client Registration (RFC 7591)** is a SHOULD, not a MUST - without it, a server needs either a hardcoded client ID or a manual registration UI, which adds friction but is not a spec violation.
- **Security musts regardless of flow details:** HTTPS on every authorization-server endpoint; redirect URIs are `localhost` or HTTPS only, matched *exactly* against pre-registered values (prevents open-redirect phishing); short-lived access tokens; refresh-token rotation for public clients; `state`-parameter verification on the callback.
- **Auth error codes:** `401` missing/invalid token, `403` valid token but insufficient scope, `400` malformed authorization request.

The full discovery-and-token sequence: unauthenticated request -> `401` with `WWW-Authenticate` -> client fetches Protected Resource Metadata -> client fetches Authorization Server Metadata (RFC 8414) -> OAuth 2.1 + PKCE flow with the `resource` parameter -> client obtains an access token -> client retries the MCP request with `Authorization: Bearer` [external/mcp-spec-authorization.md]. Escalate (do not attempt to hand-roll a subset) if a server needs full OAuth 2.1 conformance and none of it exists yet - this is enough moving parts that a partial, ad-hoc implementation is worse than either "no auth, clearly documented as internal-only" or "the full flow."

---

## Deciding which pattern fits

| Situation | Pattern |
|---|---|
| Local, single-user, client-spawned subprocess | Neither - use stdio + environment credentials (`guides/01-transport.md`) |
| Internal/low-stakes HTTP server, small trusted caller set | Bearer token / API key, validated per-request |
| Public HTTP server, sensitive data, multiple independent callers needing different scopes, or a Claude Cowork connector (which requires public HTTP reachability - see `guides/08-harness-registration.md`) | Full OAuth 2.1 per the MCP Authorization spec |

---

## Testing the auth boundary

Auth needs its own test triad, distinct from ordinary functional tests, because none of it is exercised by a normal happy-path integration test [external/mcp-testing-three-layers-autonoma.md]:

1. **Rejection** - a request with no credential, or an invalid one, is refused *before* any tool logic runs, not caught by a downstream error handler.
2. **Scoping** - two valid credentials with different permissions see different tool lists / different results, not the same tools filtered client-side in a way a slightly different request could bypass.
3. **Expiry and refresh** - a token valid when the connection opened but expiring mid-session causes the *next* call to fail cleanly (not a stale-success or a hang); a refreshed token is picked up without requiring a full reconnect.

See `guides/07-testing-mcp.md` for how this fits into the broader testing layers.

---

## Audit checklist (authentication)

- [ ] The transport-scoped rule is followed: stdio uses environment credentials, not the OAuth flow; HTTP uses bearer/API-key or full OAuth 2.1, not a bespoke scheme.
- [ ] Tokens are sent only in the `Authorization` header, never the URL query string.
- [ ] For OAuth servers: RFC 9728 Protected Resource Metadata is implemented; `401` responses include `WWW-Authenticate` with `resource_metadata`; token audience is validated (RFC 8707); PKCE is used; redirect URIs are exact-matched over HTTPS/localhost.
- [ ] No token passthrough to an upstream API - the server obtains and uses its own token for any downstream call it makes.
- [ ] Rejection happens before any tool logic runs, not inside a handler's try/catch.
- [ ] Auth failure tests exist for: no credential, invalid credential, expired token, under-scoped token.

---

*Sources: `research/distilled-mcp-protocol.md`, `research/external/mcp-spec-authorization.md`, `research/external/mcp-spec-architecture.md`, `research/external/mcp-testing-three-layers-autonoma.md`*
