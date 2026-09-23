# tawk.to API - Endpoint Reference

All endpoints are `POST https://api.tawk.to/v1/{method}` with a JSON body and an `Authorization` header (API key Basic Auth or OAuth2 Bearer). Each row lists the OAuth2 scope required; API-key (basic) auth is also accepted on every endpoint. `propertyId` is required in nearly every body.

Scope shorthand: a `_read` scope is read-only, `_manage` allows writes, `_settings_manage` is KB-settings-only.

## Property

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `property.create-site` | `property_manage` | property fields | Create a new property (site) on the account |
| `property.info` | `property_read members_read widgets_read` | `propertyId` | Full property detail incl. members, widgets, assets |
| `property.list` | `property_read` | (none) | List properties the principal can access |

## Widgets

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `widgets.add` | `widgets_manage` | `propertyId`, widget config | Add a widget to a property |
| `widgets.get` | `widgets_read` | `propertyId`, `widgetId` | Get a widget's settings |
| `widgets.update` | `widgets_manage` | `propertyId`, `widgetId`, settings | Update widget settings |
| `widgets.remove` | `widgets_manage` | `propertyId`, `widgetId` | Remove a widget |
| `widgets.cards.add` | `widgets_manage` | `propertyId`, `widgetId`, card | Add a widget card |
| `widgets.cards.update` | `widgets_manage` | card id + fields | Update a widget card |
| `widgets.cards.remove` | `widgets_manage` | card id | Remove a widget card |
| `widgets.global-settings.get` | `widgets_read` | `propertyId` | Get global widget settings |
| `widgets.global-settings.update` | `widgets_manage` | `propertyId`, settings | Update global widget settings |
| `widgets.api-key.list` | `widgets_api_read` | `propertyId` | List widget API keys |

Widget feature flags include `uploads` (end-user file upload in the widget). This is unrelated to KB image hosting.

## Members / Agents

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `agent.me` | (any authenticated) | (none) | Current agent profile |
| `agent.info` | (any authenticated) | agent id | Get an agent's info |
| `members.list` | `members_read` | `propertyId` | List members of a property |
| `members.list-invites` | `members_read` | `propertyId` | List pending invites |
| `members.invite` | `members_manage` | `propertyId`, email, role | Invite an agent to a property |
| `members.edit-invite` | `members_manage` | invite id, role | Edit a pending invite's role |
| `members.remove-invite` | `members_manage` | invite id | Cancel a pending invite |
| `members.enable` | `members_manage` | `propertyId`, member id | Enable a member |
| `members.disable` | `members_manage` | `propertyId`, member id | Disable a member |
| `members.update-permissions` | `members_manage` | member id, permissions | Update member role/permissions |
| `members.remove` | `members_manage` | `propertyId`, member id | Remove a member from a property |

## Chats

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `chat.get` | `chat_history_read` | `propertyId`, chat id | Get a single chat transcript |
| `chat.list` | `chat_history_read` | `propertyId`, filters/pagination | List chats of a property |

## Tickets

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `ticket.get` | `tickets_read` | `propertyId`, ticket id | Get a single ticket |
| `ticket.list` | `tickets_read` | `propertyId`, filters/pagination | List tickets of a property |

## Tabs

| Method | Scope | Required body | Purpose |
|--------|-------|---------------|---------|
| `tabs.add` | `tabs_manage` | `propertyId`, tab | Add a tab to a property |
| `tabs.available` | `tabs_read` | `propertyId` | List installable tab types |
| `tabs.get` | `tabs_read` | `propertyId`, tab id | Get a tab |
| `tabs.list` | `tabs_read` | `propertyId` | List property tabs |
| `tabs.remove` | `tabs_manage` | `propertyId`, tab id | Remove a tab |
| `tabs.update` | `tabs_manage` | tab id + fields, `position` | Update a tab (supports ordering via `position`) |

## Knowledge-Base

Full bodies and content-block schemas are in `knowledge-base.md`. Summary:

### Articles
| Method | Scope | Purpose |
|--------|-------|---------|
| `knowledge-base.article.create` | `knowledgebase_manage` | Create article + its translation for a site. Returns `data.article.id` |
| `knowledge-base.article.update` | `knowledgebase_manage` | Update article (requires `articleId`, full `article` object) |
| `knowledge-base.article.get` | `knowledgebase_read` | Get a single article (returns content blocks) |
| `knowledge-base.article.list` | `knowledgebase_read` | List articles (filters, sort, cursor pagination) |
| `knowledge-base.article.search` | `knowledgebase_read` | Full-text search articles |
| `knowledge-base.article.delete` | `knowledgebase_manage` | Soft delete (recoverable) |
| `knowledge-base.article.destroy` | `knowledgebase_manage` | Permanent delete |

### Categories
| Method | Scope | Purpose |
|--------|-------|---------|
| `knowledge-base.category.create` | `knowledgebase_manage` | Create category (icon, parent, position, name, slug) |
| `knowledge-base.category.update` | `knowledgebase_manage` | Update category |
| `knowledge-base.category.get` | `knowledgebase_read` | Get a category |
| `knowledge-base.category.list` | `knowledgebase_read` | List categories |
| `knowledge-base.category.delete` | `knowledgebase_manage` | Soft delete category |
| `knowledge-base.category.destroy` | `knowledgebase_manage` | Permanent delete category |
| `knowledge-base.category.list-article` | `knowledgebase_read` | List articles in a category |
| `knowledge-base.category.order-article` | `knowledgebase_manage` | Reorder articles within a category |

### Knowledge base, sites, site links
| Method | Scope | Purpose |
|--------|-------|---------|
| `knowledge-base.create` | `knowledgebase_manage` | Create the KB for a property (`language`, `title`, `subdomain`, `widgetId`, `published`) |
| `knowledge-base.site.create` | `knowledgebase_manage` | Create a per-language site (`propertyId`, `language`, `title`). Returns `data.site` |
| `knowledge-base.site.update` | `knowledgebase_manage` | Update site (banner, ticketForm, header, enabled, widgetId) |
| `knowledge-base.site.get` | `knowledgebase_read` | Get a site |
| `knowledge-base.site.list` | `knowledgebase_read` | List sites |
| `knowledge-base.site.delete` | `knowledgebase_manage` | Delete a site |
| `knowledge-base.site-link.add` | `knowledgebase_manage` | Add a nav link to a site |
| `knowledge-base.site-link.update` | `knowledgebase_manage` | Update a nav link |
| `knowledge-base.site-link.remove` | `knowledgebase_manage` | Remove a nav link |

### Helpers and settings
| Method | Scope | Purpose |
|--------|-------|---------|
| `knowledge-base.fonts.list` | `knowledgebase_read` | List available KB fonts |
| `knowledge-base.language.list` | `knowledgebase_read` | List supported languages |
| `knowledge-base.settings.get` | `knowledgebase_read` | Get KB settings |
| `knowledge-base.settings.update` | `knowledgebase_settings_manage` | Update KB settings |
| `knowledge-base.settings.check-subdomain` | `knowledgebase_read` | Check subdomain availability |
| `knowledge-base.settings.update-subdomain` | `knowledgebase_settings_manage` | Change subdomain |
| `knowledge-base.settings.check-domain` | `knowledgebase_read` | Check custom domain availability |
| `knowledge-base.settings.add-domain-candidate` | `knowledgebase_settings_manage` | Add a custom-domain candidate |
| `knowledge-base.settings.remove-domain-candidate` | `knowledgebase_settings_manage` | Remove a domain candidate |
| `knowledge-base.settings.remove-domain` | `knowledgebase_settings_manage` | Remove the custom domain |

## Webhook

| Method | Scope | Purpose |
|--------|-------|---------|
| `webhooks.create` | `webhooks_manage` | Create a webhook subscription |
| `webhooks.get` | `webhooks_read` | Get a webhook |
| `webhooks.list` | `webhooks_read` | List webhooks |
| `webhooks.update` | `webhooks_manage` | Update a webhook |
| `webhooks.delete` | `webhooks_manage` | Delete a webhook |

## Metrics

All require scope `metrics_read` and take `propertyId` plus a date range.

| Method | Purpose |
|--------|---------|
| `metrics.chats` | Chat metrics |
| `metrics.tickets-new` | New ticket counts |
| `metrics.tickets-reopened` | Reopened ticket counts |
| `metrics.tickets-resolved` | Resolved ticket counts |
| `metrics.tickets-responses` | Ticket response metrics |

## Contacts

| Method | Scope | Purpose |
|--------|-------|---------|
| `contact.attribute.list-custom` | `contact_attribute_read` | List custom contact attributes |
| `contact.person.get` | `contact_person_read` | Fetch a person's contact details |

## Pagination (list/search endpoints)

KB list/search bodies use cursor pagination plus filters:

```json
{
  "propertyId": "string",
  "query": "optional search text",
  "filters": {
    "site": ["siteId"],
    "author": ["agentId"],
    "category": ["categoryId"],
    "status": "published",
    "visibility": "public",
    "createdAt": { "from": "ISO-8601", "to": "ISO-8601" },
    "updatedAt": { "from": "ISO-8601", "to": "ISO-8601" }
  },
  "highlight": true,
  "sort": { "field": "title|createdAt|updatedAt", "order": "asc|desc" },
  "next": "cursor-token",
  "previous": "cursor-token",
  "limit": 50
}
```

Pass the `next` cursor from one response into the following request to page forward.
