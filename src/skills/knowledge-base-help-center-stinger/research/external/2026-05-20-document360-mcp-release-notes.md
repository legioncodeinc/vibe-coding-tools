---
source_url: https://docs.document360.com/docs/march-2026-1231
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: platform-document360
stinger: knowledge-base-help-center-stinger
---

# Document360 v12.3.1 March 2026 Release Notes

**Published:** March 28, 2026 | **Source:** Document360 Official Documentation

## Summary

Official release notes for Document360 v12.3.1, the major March 2026 release. Introduces MCP (Model Context Protocol) server integration enabling AI agents to read/write KB content, SCIM provisioning for SSO, custom metadata fields for structured article management, and multi-language AI reply suggestions. Critical for `guides/08-document360.md` as the authoritative source on current platform capabilities.

## Key quotations / statistics

- **MCP Server capabilities:** AI agents connecting via MCP can perform semantic search, read articles, create categories, write new articles, and update existing content - all while honoring Document360's existing access controls.
- **Supported MCP clients:** Claude, ChatGPT, GitHub Copilot.
- **SCIM provisioning:** automatic user/group sync from identity providers like Okta.
- **Custom metadata fields:** structured article data including product version, ownership, release status.
- **Eddy AI Analytics:** citation references in the Analytics portal now surface the exact source articles used to generate each response.
- **AI reply suggestions in Freshdesk** gained multi-language support.
- **SEO:** canonical URL hygiene improvements for multi-language and multi-workspace sites.
- Interactive table filtering and sorting on live knowledge base pages (new in this release).

## Annotations for stinger-forge

- The Eddy AI Analytics citation feature (showing which articles were used in each AI response) is the key instrument for the content-gap loop (`guides/05-analytics-loop.md`). Teams can trace which articles are being over-relied upon and which are never cited, identifying both overloaded articles and content gaps.
- SCIM provisioning signals Document360's enterprise positioning - this is table stakes for any team with 50+ employees using an SSO provider.
- Custom metadata fields (product version, ownership, release status) are the foundation for multi-version article management and content review workflows in `guides/03-versioning.md`.
- Freshdesk integration with multi-language AI replies opens a cross-platform workflow: Document360 KB content → AI Reply in Freshdesk ticket → in the customer's language. This is a concrete multi-language use case for `guides/04-multi-language.md`.
- Canonical URL hygiene improvement addresses a known SEO risk with multi-language knowledge bases (duplicate content penalties).
