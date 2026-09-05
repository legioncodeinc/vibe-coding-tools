# Bifrost governance and virtual keys
- URL: https://github.com/maximhq/bifrost (docs/features/governance/virtual-keys.mdx at tag transports/v1.6.11)
- Fetched: 2026-09-04
- Source type: official repo docs

## Virtual keys (primary governance entity)

"Virtual Keys are the primary governance entity in Bifrost. Users and applications authenticate using the given headers to access virtual keys and get specific access permissions, budgets, and rate limits."

Allowed headers:
- `x-bf-vk` - virtual key header, e.g. `sk-bf-*`
- `Authorization` - `Bearer sk-bf-*` (OpenAI style)
- `x-api-key` - `sk-bf-*` (Anthropic style)
- `x-goog-api-key` - `sk-bf-*` (Google Gemini style)
- `api-key` - `sk-bf-*` (Azure OpenAI style)

"Old virtual keys (without `sk-bf-*` prefix) are only supported by `x-bf-vk` header."

## Governance docs at this tag

docs/features/governance/: budget-and-limits.mdx, complexity-router.mdx, mcp-tools.mdx, model-limits.mdx, required-headers.mdx, routing.mdx, virtual-keys.mdx.

## Governance scope note (for multi-tenant work)

Bifrost OSS governance is gateway-wide: virtual keys, budgets, rate limits, teams, customers exist but there is no tenant isolation between orgs - any admin-credential holder sees everything. Enterprise adds RBAC/SCIM. A multi-tenant product must put identity+scoping in front of or inside the admin API; it does not exist in OSS.
