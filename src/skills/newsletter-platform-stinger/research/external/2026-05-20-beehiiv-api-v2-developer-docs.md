---
source_url: https://developers.beehiiv.com
title: "Beehiiv Developer Documentation - API v2"
source_type: official-docs
authority: official
relevance: high
topic: api-integration
stinger: newsletter-platform-stinger
fetched: 2026-05-20
---

# Beehiiv API v2 Developer Documentation

## Summary

Beehiiv's API v2 is REST-based, using Bearer token authentication tied to a publication ID. Core endpoints cover subscriptions (subscriber management), posts (programmatic content creation), and a Send API (beta, Enterprise-only). Cursor-based pagination was recently introduced as the recommended approach over offset-based pagination.

## Key API endpoints

### Subscriptions (subscriber management)
- `GET https://api.beehiiv.com/v2/publications/:publicationId/subscriptions`
  - List subscriptions with filtering by status, tier, email, creation date
  - OAuth scope: `subscriptions:read`
  - **Cursor-based pagination now recommended** (offset pagination deprecated, limited to 100 pages)
  - Expandable fields: `subscription_premium_tiers`, `referrals`, `stats`, `custom_fields`, `newsletter_lists`

### Posts (content management)
- `GET https://api.beehiiv.com/v2/publications/:publicationId/posts` - list posts
- `POST https://api.beehiiv.com/v2/publications/:publicationId/posts` - create post (Send API, beta)
  - Currently beta, available only to Enterprise users
  - Supports `blocks` (structured widgets) or `body_content` (custom HTML)
  - The `post_template_id` param merges an existing template with API-supplied content

### Authentication
- Bearer token format: `Authorization: Bearer <token>`
- Publication ID format: `pub_[0-9a-fA-F-]+`
- API keys generated from Beehiiv Settings

## Send API (Create Post endpoint) - Beta/Enterprise only

- Endpoint: `POST https://api.beehiiv.com/v2/publications/:publicationId/posts`
- Minimum required fields: `title` + (`blocks` or `body_content`)
- Two content methods - must choose one:
  1. **Blocks**: structured widgets matching Beehiiv UI components
  2. **body_content**: raw custom HTML (note: `<style>` and `<link>` tags are removed; use inline styles only)
- Default behavior without extra params: publishes immediately with default template to all free subscribers

## Key notes for embedded signup integration

- The embedded subscribe form generates a script tag (not an API call)
- For **programmatic subscriber addition**, use the subscriptions API
- Beehiiv's embedded form script supports: inline, popup, slide-left, slide-right, sticky-top, sticky-bottom layouts
- Double opt-in can be toggled per-form (overrides publication-level setting)
- UTM parameter tracking available via attribution tracking script

## API access limitations

- Subscriptions read/write: available on paid plans
- Send API (create posts): Enterprise only (beta)
- Webhook support: available for subscriber events, sends

## Open question for stinger-forge

- **Q from Command Brief**: "Has Beehiiv launched a developer API v2 that supports segment-level API writes?" - The research shows API v2 exists and supports subscription-level writes (creating/updating subscribers), but segment-level API writes were not confirmed in documentation reviewed. Needs direct verification at developers.beehiiv.com.

## Annotations for stinger-forge

- The embedded subscribe form approach (script tag + no coding required) vs API approach (programmatic subscriber creation) are two distinct integration patterns for `guides/01-embedded-signup.md`.
- For Next.js App Router, the API approach (server action or route handler calling Beehiiv API) is cleaner than injecting a third-party script.
- The Send API is Enterprise-only; do not document it as generally available for the typical stinger user.
- Rate limiting on the subscriptions API is not documented in retrieved sources - flag as open question.
