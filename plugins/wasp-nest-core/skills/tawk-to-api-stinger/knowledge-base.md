# tawk.to Knowledge-Base - Deep Reference

The KB is block-structured. An article body is `content.contents`: an ordered array of typed blocks. There is **no markdown/HTML field** and **no asset upload endpoint** - images are referenced by external URL. See `markdown-to-kb.md` for the conversion + hosting workflow.

## Resource hierarchy

```
Property (propertyId)
  └── Knowledge Base            (knowledge-base.create)
        └── Site (siteId)       one per language; knowledge-base.site.create
              ├── Categories    knowledge-base.category.*
              └── Articles      knowledge-base.article.*
```

A KB article is created "for a site": `content.siteId` ties the translation to a language site. The same logical article can have translations across sites.

## Create Article

`POST /knowledge-base.article.create`, scope `knowledgebase_manage`. Returns `{ ok: true, data: { article: { id, meta: { ... } } } }`.

> GOTCHA (VERIFIED 2026-06-05 live): sending `article.content.metadata` on CREATE returned `validation_error` with message `article.content.metadata` for BOTH the `{ banner, description }` and the `{ description }` only forms. Omitting `metadata` entirely created the article cleanly. The accepted create-time shape for `metadata`/`banner` is not yet confirmed; until it is, omit `metadata` on create and set description/banner via a follow-up `article.update` (or investigate). Also: `meta.categories` / `meta.relatedArticles` must use real ids or be `[]` - placeholder ids fail validation.

> GOTCHA (VERIFIED 2026-06-05 live, batch import of 29 articles): `meta.categories[]` entries must be `{ id, primary }` ONLY. Including `name` (which the snapshot docs list as a field) returns `validation_error` with message `article.meta.categories[0].name` on BOTH `article.create` AND `article.update`. Send `{ "id": "<categoryId>", "primary": true }` and nothing else.

```json
{
  "propertyId": "string",
  "article": {
    "content": {
      "siteId": "string",
      "title": "string",
      "status": "draft",
      "subtitle": "string",
      "author": "agentId-or-null",
      "slug": "string",
      "metadata": {
        "banner": { "type": "url", "content": "https://cdn.example.com/banner.png" },
        "description": "Meta description for SEO"
      },
      "contents": [
        { "type": "header", "content": { "text": "string", "heading": "h2", "color": "#333" } }
      ]
    },
    "meta": {
      "visibility": "private",
      "categories": [ { "id": "categoryId", "primary": true } ],
      "relatedArticles": [ { "id": "articleId", "title": "string" } ]
    }
  }
}
```

### `content` field rules
| Field | Required | Notes |
|-------|----------|-------|
| `siteId` | yes | Language site the translation belongs to |
| `title` | yes | Article title |
| `status` | no (create) / yes (update) | `draft` \| `published` \| `archived` |
| `subtitle` | no | |
| `author` | no | Agent id; set `null` on update to remove |
| `slug` | no | URL slug for the translation |
| `metadata.banner` | no | `{ type: "url", content: <URL> }`; set `null` to remove. Only `url` type is valid |
| `metadata.description` | no | Meta description |
| `contents` | no | Array of blocks (see below) |

### `meta` field rules
| Field | Notes |
|-------|-------|
| `visibility` | `private` \| `public` |
| `categories[]` | `{ id (required), primary (required boolean) }` ONLY. Exactly one should be `primary: true`. Do NOT include `name` (see gotcha below) |
| `relatedArticles[]` | `{ id (required), title (required) }` |

## Content block types (`content.contents[]`)

Every block is `{ "type": "<type>", "content": { ... } }`. Color fields take hex like `#ddd` or `#dddddd`.

### header
```json
{ "type": "header", "content": { "text": "<p>Section title</p>", "heading": "h2", "color": "#000000" } }
```
- `text` (required), `heading` (required): one of `h2 h3 h4 h5 h6`, `color` (optional).
- VERIFIED 2026-06-05: the editor stores header `text` as HTML wrapped in `<p>...</p>` (same HTML field as paragraph). A header has ONLY `text` / `heading` / `color` - no `size` and no `backgroundColor` (those are paragraph-only).

### paragraph
```json
{ "type": "paragraph", "content": { "text": "<p>Body <b>bold</b> <i>italic</i></p>", "size": 18, "color": "#000000", "backgroundColor": "#FFFFFF" } }
```
- `text` (required), `color`, `backgroundColor`, `size` (integer 8-48).
- **VERIFIED 2026-06-05 against a live tawk draft: `text` holds HTML, not plain text.** The rich-text editor stores inline and block HTML in this single field:
  - inline: `<b>`, `<i>`, `<code>`, `<a href="...">` (and typically `<u>`, `<s>`, `<span>`)
  - block: `<p>...</p>` for normal paragraphs, and **lists live here too**: `<ul><li>..</li><li>..</li></ul>` and `<ol>...</ol>`. There is no separate list block type.
- Editor defaults observed: `size: 18`, `color: "#000000"`, `backgroundColor: "#FFFFFF"`.
- Practical consequence: to publish markdown, render each markdown block to HTML and place it in `text`. Use the `header`, `image`, `code`, `table`, `divider`, `video` blocks for those specific types; everything else (paragraphs, lists, blockquotes, inline marks, links) goes into `paragraph.text` as HTML. See `markdown-to-kb.md`.

### image  (the key block for markdown images)
```json
{ "type": "image", "content": { "url": "https://cdn.example.com/pic.png", "alignment": "center" } }
```
- `url` (required): must be a publicly reachable URL. tawk.to does NOT host the file.
- `alignment`: `left` \| `center` \| `right`.

### code
```json
{ "type": "code", "content": { "text": "const x = 1;", "mime": "text/javascript" } }
```
- `text` (required), `mime` (coding-language mime type, e.g. `text/javascript`, `text/x-python`).

### video
```json
{ "type": "video", "content": {
  "url": "https://www.youtube.com/watch?v=...", "source": "youtube",
  "options": { "startTime": 0, "endTime": 60, "autoplay": false, "mobile": true, "mute": false,
               "controls": true, "loop": false, "branding": false, "privacy": false } } }
```
- `url` (required), `source` (required): `youtube` \| `vimeo` \| `dailymotion` \| `selfhosted`.
- **VERIFIED 2026-06-05 (live create+update) - the public docs are wrong here:**
  - `options` is **required**, not optional.
  - `startTime` and `endTime` are **numbers** (seconds), NOT strings. Sending `"0"`, `"00:00:00"`, etc. returns `validation_error` on `options.startTime`.
  - For `source: "youtube"` the validator requires the FULL flag set, each present: `startTime`, `endTime`, `autoplay`, `mobile`, `mute`, `controls`, `loop`, `branding`, `privacy` (numbers for the times, booleans for the rest). The exact create shape above succeeded.
- Source-specific extras documented by the snapshot (treat as numbers/booleans; verify per source): vimeo adds `loop`, `controlsColor`, `introTitle`, `introPortrait`, `introByLine`; dailymotion adds `controls`, `info`, `logo`; selfhosted adds `endTime`, `controls`, `loop`.

### divider
```json
{ "type": "divider", "content": { "type": "line-full", "height": 20, "color": "#ddd" } }
```
- `content.type` (required): `line-min` \| `line-full` \| `dotted-full` \| `blank`.
- `height` (integer 5-120) applies only to `blank`.
- `color` applies only to `line-min`, `line-full`, `dotted-full`.

### table
```json
{ "type": "table", "content": {
  "rows": 2, "columns": 2, "color": "#333", "backgroundColor": "#fff",
  "head": { "cells": [ { "value": "Col A" }, { "value": "Col B" } ] },
  "body": [ { "cells": [ { "value": "a1" }, { "value": "b1" } ] },
            { "cells": [ { "value": "a2" }, { "value": "b2" } ] } ] } }
```
- `rows` (1-100) and `columns` (1-20) are required.
- `head` is `null` if no header; otherwise `head.cells.length` must equal `columns`.
- `body.length` must equal `rows`; each `body[].cells.length` must equal `columns`.

## Update Article

`POST /knowledge-base.article.update`, scope `knowledgebase_manage`. Same `article` shape as create, plus a top-level `articleId`. On update, `status`, `subtitle`, and `author` become required inside `content`. Send the full intended `contents` array (it replaces the existing body).

```json
{ "articleId": "string", "propertyId": "string", "article": { "content": { ... }, "meta": { ... } } }
```

## Get Article

`POST /knowledge-base.article.get`, scope `knowledgebase_read`. Body requires `propertyId`, `articleId`, and `siteId` (the per-language site; the default site id is the literal string `"primary"`). Returns the article with its `content.contents` blocks. Use this to read-modify-write.

VERIFIED response shape (2026-06-05):
```json
{ "ok": true, "data": { "article": {
  "id": "string",
  "meta": { "visibility": "public", "categories": [], "relatedArticles": [],
            "sites": [ { "id": "primary", "author": "agentId", "status": "draft" } ],
            "feedback": { "upvotes": 0, "downvotes": 0, "total": 0 },
            "createdAt": "ISO", "updatedAt": "ISO" },
  "content": { "translationId": "string", "siteId": "primary", "title": "string",
               "status": "draft", "subtitle": "string", "author": "agentId",
               "slug": "string", "metadata": { "description": "" },
               "contents": [ { "type": "paragraph", "content": { ... } } ],
               "createdAt": "ISO", "updatedAt": "ISO" } } } }
```

## List Articles - response shape

VERIFIED response shape (2026-06-05): `data` carries cursor pagination plus an `articles[]` summary list. Each article reports per-site status (so the same article can be draft on one site, published on another).
```json
{ "ok": true, "data": {
  "total": 1, "hasNext": false, "hasPrevious": false,
  "next": "cursor", "previous": "cursor",
  "articles": [ {
    "id": "string", "kbId": "string", "title": "string",
    "sites": [ { "id": "primary", "author": "agentId", "status": "draft" } ],
    "categories": [], "feedback": { "upvotes": 0, "downvotes": 0, "total": 0 },
    "visibility": "public", "createdAt": "ISO", "updatedAt": "ISO" } ] } }
```
The list summary does NOT include the body blocks; call `article.get` for `content.contents`.

## Create Category

`POST /knowledge-base.category.create`, scope `knowledgebase_manage`.

```json
{
  "propertyId": "string",
  "category": {
    "meta": {
      "icon": { "type": "predefined", "content": "icon-name" },
      "parent": "parentCategoryId-or-null",
      "position": 0
    },
    "content": { "siteId": "string", "name": "string", "description": "", "slug": "string" }
  }
}
```
- `category.content.siteId` and `name` are required.
- `icon.type` is `predefined`; `content` is an icon name from the available set.
- `parent` is `null` for a root category.
- `slug` disallows: `< > [ ] ( ) { } | ^ \ / " ' ~ ? ! * + = : ; , . % & $ @ #`. Default is the name as `small-case-hyphen-separated`.

### Category - verified shapes and behavior (2026-06-05, live)

- `category.create` is `{ category: { meta, content } }`. `meta` is optional; `meta.icon` may be omitted (stored as `null`). `meta.parent` is `null` for a root category; `meta.position` is a 0-based integer. `content` requires `siteId` + `name`; `description`/`slug` optional (slug defaults to the kebab-cased name).
- `category.create` RESPONSE keeps the nested split: `data.category.{ id, meta:{ sites[], icon, parent, position, articlesCount, createdAt, updatedAt }, content:{ siteId, name, description, slug, createdAt, updatedAt } }`.
- `category.list` RESPONSE is FLATTENED (no meta/content split): `data.categories[]` items are `{ id, name, slug, description, parent, position, icon, sites[], articlesCount, hasChildren, createdAt, updatedAt }`. Sort client-side by `position`.
- RATE LIMIT is real and tight: creating ~5-6 categories back-to-back triggered `429 rate_limited`. Throttle KB writes (add a short delay, e.g. 300-500ms between calls, or retry on 429 with backoff). A retry after a few seconds succeeded.

## Create Knowledge Base

`POST /knowledge-base.create`, scope `knowledgebase_manage`. Returns `{ ok: true }`.

```json
{ "propertyId": "string", "language": "en", "title": "string",
  "description": "string", "subdomain": "string", "widgetId": "string", "published": true }
```
- Required: `propertyId`, `language`, `title`, `subdomain`. Optional: `description`, `widgetId`, `published`.

## Create Site

`POST /knowledge-base.site.create`, scope `knowledgebase_manage`. Returns `{ ok: true, data: { site: { id, banner, ticketForm, links, language, primary, title, description, header, enabled, widgetId } } }`.

```json
{ "propertyId": "string", "language": "en", "title": "string", "description": "string" }
```
- Required: `propertyId`, `language`, `title`.

## Site links (nav)

`knowledge-base.site-link.add` / `.update` / `.remove` (scope `knowledgebase_manage`) manage the `links: [ { id, label, url } ]` array on a site.

## List / Search articles

Bodies use the cursor + filter shape documented in `endpoints.md` (Pagination). `list` returns each article's meta + the primary-site translation; `search` adds full-text matching with optional `highlight`.

## Validation gotchas

- Unknown block fields or wrong `type` values return `400 validation_error`. Match the schema exactly.
- Table cell/row/column counts must be internally consistent (see table rules).
- `metadata.banner` and `image.url` must be valid, publicly reachable URLs.
- Create articles as `draft`, verify in dashboard, then `update` to `published`.
