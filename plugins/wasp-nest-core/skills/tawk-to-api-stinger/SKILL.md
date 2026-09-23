---
name: "tawk-to-api-stinger"
license: AGPL-3.0-or-later
description: "Integrate the tawk.to REST API. Use for contacts, chats, tickets, webhooks, metrics, widgets, or knowledge-base articles."
---

# tawk.to REST API v1.1.0

This summary is self-contained: every endpoint, scope, and schema referenced below is documented in this skill's own files (`endpoints.md`, `knowledge-base.md`, `markdown-to-kb.md`, `reference-article.json`). The original tawk.to documentation lives at https://docs.tawk.to; consult it directly for anything not covered here.

## Core conventions

- **Base URL**: `https://api.tawk.to/v1/{method}`. Methods are dotted, RPC-style names (e.g. `knowledge-base.article.create`).
- **Every endpoint is `POST`** with a JSON body. There are no GET/PUT/DELETE verbs; "get", "list", "delete" are method-name suffixes.
- **Headers**: `Content-Type: application/json`, `Accept: application/json`, plus an `Authorization` header.
- **Property scoping**: almost every body requires `propertyId`. KB calls also require a `siteId` (a KB site is a per-language container). Get a `propertyId` from `property.list`.

## Authentication (two schemes)

Most endpoints accept either scheme. Each endpoint declares the OAuth2 scope it needs (see `endpoints.md`).

1. **API key (HTTP Basic Auth)** - simplest for server-to-server scripts.
   - Header: `Authorization: Basic <base64(apiKey + ":")>` (API key as username, empty password).
   - The API key comes from the tawk.to dashboard (REST API section).

2. **OAuth2** - Bearer tokens, for apps acting on behalf of users.
   - Header: `Authorization: Bearer {access-token}`.
   - Authorize endpoint: `https://oauth.tawk.to/oauth2/auth`
   - Token endpoint: `https://oauth.tawk.to/oauth2/token` (code exchange and refresh)
   - Flows: Authorization Code (`response_type=code`) and Implicit Grant (`response_type=token`).

```bash
# API key example (note the trailing colon before base64-encoding)
curl -X POST https://api.tawk.to/v1/property.list \
  -H 'Content-Type: application/json' \
  -H "Authorization: Basic $(printf '%s:' "$TAWK_API_KEY" | base64)" \
  -d '{}'
```

## Response and error shape

- **Success**: `{ "ok": true, "data": { ... } }` (some write endpoints return just `{ "ok": true }`).
- **Error**: `{ "ok": false, "error": "<code>", "message": "<detail>" }`.

| HTTP | `error` value | Meaning |
|------|---------------|---------|
| 400 | `validation_error` | Bad body / invalid field |
| 403 | `forbidden` (`insufficient_scope`) | Token lacks the required scope |
| 404 | `not_found` | Resource missing |
| 409 | `conflict` (`resource_locked`) | Conflicting state / locked resource |
| 429 | `rate_limited` | Rate limit exceeded; back off and retry |

Always check `ok` before reading `data`. On 429, retry with exponential backoff.

## Endpoint groups (full details in `endpoints.md`)

| Group | Methods | Primary scopes |
|-------|---------|----------------|
| Property | `property.create-site`, `property.info`, `property.list` | `property_*` |
| Widgets | `widgets.add/get/update/remove`, `widgets.cards.*`, `widgets.global-settings.*`, `widgets.api-key.list` | `widgets_*` |
| Members | `agent.info`, `agent.me`, `members.list`, `members.invite`, `members.*-invite`, `members.enable/disable`, `members.update-permissions`, `members.remove` | `members_*` |
| Chats | `chat.get`, `chat.list` | `chat_history_read` |
| Tickets | `ticket.get`, `ticket.list` | `tickets_read` |
| Tabs | `tabs.add/get/list/remove/update`, `tabs.available` | `tabs_*` |
| **Knowledge-Base** | `knowledge-base.article.*`, `.category.*`, `.site.*`, `.site-link.*`, `.settings.*`, `.create`, `.fonts.list`, `.language.list` | `knowledgebase_*` |
| Webhook | `webhooks.create/get/list/update/delete` | `webhooks_*` |
| Metrics | `metrics.chats`, `metrics.tickets-new/-reopened/-resolved/-responses` | `metrics_read` |
| Contacts | `contact.attribute.list-custom`, `contact.person.get` | `contact_*` |

## Knowledge-Base: read this before building KB automation

The KB is the focus of this skill. Two facts drive the whole design:

1. **Article bodies are NOT markdown or HTML.** They are an ordered array of typed **content blocks** (`header`, `paragraph`, `image`, `code`, `video`, `divider`, `table`). To publish markdown you must parse it and emit these blocks.
2. **There is no file/asset upload endpoint.** Image and banner blocks take a `url` only. tawk.to does not host your images. You must upload images to your own public store (Cloudflare R2 or DigitalOcean Spaces), then put the public URL in the block.

Resource hierarchy: **Property -> Knowledge Base -> Site (per language) -> Categories + Articles**.

- Full content-block schemas, every KB request/response body, and category/site CRUD: **`knowledge-base.md`**.
- The end-to-end "markdown file + image links -> published tawk article" workflow, including the R2/Spaces upload step and a markdown-to-blocks mapping table with a reference Node implementation: **`markdown-to-kb.md`**.
- A complete ready-to-POST `article.create` body exercising every block type (header, paragraph with inline HTML, unordered + ordered lists, blockquote, image, code, divider, table, video), with HTML shapes matching a live draft: **`reference-article.json`**.

### Minimal create-article flow

```
1. property.list                      -> pick propertyId
2. knowledge-base.site.list           -> pick siteId (or knowledge-base.site.create)
3. (optional) knowledge-base.category.create / .list  -> category ids
4. Upload local images to R2/Spaces   -> collect public URLs
5. Convert markdown -> contents[] blocks (swap local image paths for hosted URLs)
6. knowledge-base.article.create      -> returns { data: { article: { id } } }
```

## Working method

1. Confirm which auth scheme and scopes the target endpoint needs (`endpoints.md`).
2. For KB writes, confirm the content-block JSON validates against the schema (`knowledge-base.md`) before sending; the API rejects unknown block fields with `validation_error`.
3. Prefer creating articles as `status: "draft"` first, verify rendering in the dashboard, then `knowledge-base.article.update` to `published`.
4. Treat the snapshot file as authoritative when this skill is ambiguous.
