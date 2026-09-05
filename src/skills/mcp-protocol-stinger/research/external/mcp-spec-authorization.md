# Authorization - Model Context Protocol Specification
- URL: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
- Fetched: 2026-08-14
- Source type: official spec
- Component: MCP auth (remote/HTTP servers)

## Why this source

The normative spec for authorizing HTTP-based MCP servers: OAuth 2.1 as the base, Protected Resource Metadata (RFC 9728) for server-side discovery, Authorization Server Metadata (RFC 8414) for client-side discovery, Dynamic Client Registration (RFC 7591), Resource Indicators (RFC 8707) for token audience binding, and the full authorization-code + PKCE flow. This is genuinely new territory for this pair - the old Hivemind-only guides never covered remote/HTTP auth because the Hivemind server is stdio-only with a local credentials file.

## Key facts

- **Authorization is OPTIONAL for MCP overall, but scoped by transport:**
  - HTTP-based transports **SHOULD** conform to this spec.
  - STDIO transport **SHOULD NOT** follow this spec - instead retrieve credentials from the environment (env vars, config files). This is exactly Hivemind's `~/.deeplake/credentials.json` pattern, and it is spec-sanctioned, not a workaround.
  - Other transports **MUST** follow established security best practices for their protocol.
- **Standards composed, not reinvented:** OAuth 2.1 (draft-ietf-oauth-v2-1-13), OAuth 2.0 Authorization Server Metadata (RFC 8414), OAuth 2.0 Dynamic Client Registration (RFC 7591), OAuth 2.0 Protected Resource Metadata (RFC 9728).
- **Roles:** the MCP server is an OAuth 2.1 *resource server*; the MCP client is an OAuth 2.1 *client*; a separate (or co-hosted) *authorization server* issues tokens.
- **Server-side requirements:**
  - MCP servers **MUST** implement OAuth 2.0 Protected Resource Metadata (RFC 9728) so clients can discover the authorization server(s).
  - MCP servers **MUST** return `WWW-Authenticate` with a `resource_metadata` URL on `401 Unauthorized`, per RFC 9728 Section 5.1.
  - MCP servers **MUST** validate access tokens per OAuth 2.1 Section 5.2, and **MUST** validate the token's audience was issued specifically for this server (RFC 8707 Section 2). Invalid/expired tokens get HTTP 401.
  - MCP servers **MUST NOT** accept tokens not issued by their own authorization server, and **MUST NOT** pass through a client-supplied token unmodified to an upstream API (the "confused deputy" / token-passthrough prohibition) - if the server itself calls an upstream API, it must obtain and use its own separately-issued token there.
- **Client-side requirements:** clients **MUST** implement Resource Indicators (RFC 8707) - i.e. send a `resource` parameter in both the authorization request and the token request, identifying the canonical URI of the target MCP server (e.g. `https://mcp.example.com/mcp`, no fragment, no trailing-slash inconsistency). Clients **MUST** implement PKCE (OAuth 2.1 Section 7.5.2) to protect the authorization code. Dynamic Client Registration (RFC 7591) is **SHOULD**, not MUST - a server without it needs a hardcoded client ID or a manual registration UI.
- **Wire shape:** `Authorization: Bearer <access-token>` header on every HTTP request (never in the URI query string), even within one logical session.
- **Discovery sequence (sequence diagram in spec):** client sends unauthenticated request -> server returns 401 with `WWW-Authenticate: resource_metadata=...` -> client fetches Protected Resource Metadata -> client fetches Authorization Server Metadata -> OAuth 2.1 + PKCE flow with the `resource` param -> client gets an access token -> client retries the MCP request with `Authorization: Bearer`.
- **Error status codes:** `401` unauthorized/invalid token, `403` forbidden/insufficient scope, `400` malformed authorization request.
- **Security musts:** all authorization-server endpoints over HTTPS; redirect URIs must be `localhost` or HTTPS; short-lived access tokens recommended; refresh-token rotation required for public clients; exact redirect-URI matching to prevent open-redirect phishing; state-parameter verification.

## Relevance to this stinger

This is the core source for the new authentication guide covering API keys, bearer tokens, and OAuth for remote/HTTP MCP servers - a gap the prior Hivemind-only pair had zero coverage of, since the Hivemind server never leaves stdio + local credential file. The stdio "SHOULD NOT follow this spec, use environment credentials instead" line is the exact justification for why Hivemind's pattern was correct without ever being framed as a deliberate protocol choice.
