# Example: Zendesk Guide → Help Scout Docs Migration

## Scenario

**Team profile:** 10-person SaaS team, 150 articles, moving off Zendesk Suite to reduce cost. Zendesk Guide bundled; Help Scout Docs included in the Help Scout Pro plan.

**Goal:** Migrate 150 articles with minimal downtime, preserve SEO URL structure where possible.

---

## Pre-migration checklist

- [ ] Export Zendesk Guide article list (Admin → Guide → Articles → Export CSV).
- [ ] Identify top-20 most-viewed articles by URL from Google Analytics (these need 301 redirects).
- [ ] Note any articles with 5+ downvotes (rewrite during migration rather than copying verbatim).
- [ ] Map Zendesk categories → Help Scout categories (adjust naming to user vocabulary; see `guides/01-information-architecture.md`).

---

## Step 1: Export from Zendesk (Day 1)

```bash
# Zendesk REST API export
curl -u email@company.com/token:ZENDESK_TOKEN \
  "https://yourcompany.zendesk.com/api/v2/help_center/articles.json?per_page=100" \
  > articles_page1.json
```

Zendesk does not offer a bulk HTML export. Use the API to export all articles as JSON, then convert body HTML fields to markdown with `pandoc`.

```bash
# Convert HTML to markdown (requires jq + pandoc)
cat articles_page1.json | jq -r '.articles[] | .body' | pandoc -f html -t markdown > articles.md
```

---

## Step 2: Create Help Scout structure (Day 2)

1. Create the new category hierarchy in Help Scout Docs before importing.
2. Map Zendesk categories to Help Scout collections (Help Scout uses "Collections" as top-level).
3. Create empty placeholder articles for each category — this establishes the URL structure before import.

---

## Step 3: Import to Help Scout (Day 2-3)

Help Scout Docs supports HTML import and API import.

**Via API (recommended for bulk):**
```bash
# Create article via Help Scout API
curl -X POST "https://api.helpscout.net/v1/docs/articles" \
  -H "Authorization: Bearer $HELPSCOUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionId": "COLLECTION_ID",
    "name": "Article Title",
    "text": "<p>Article body HTML</p>",
    "status": "published",
    "slug": "custom-url-slug"
  }'
```

Set `slug` to match the Zendesk article slug to preserve URL structure where Help Scout allows custom slugs.

---

## Step 4: 301 redirects (Day 3)

Zendesk Guide URL format: `/hc/en-us/articles/360001234567-article-title`
Help Scout Docs URL format: `/en/articles/12345-article-title`

For top-20 articles, set up 301 redirects from Zendesk URLs to Help Scout URLs via:
- Cloudflare Workers (if using Cloudflare): redirect rule.
- nginx config: `rewrite ^/hc/en-us/articles/360001234567(.*)$ https://help.yourcompany.com/en/articles/12345 permanent;`

For the remaining 130 articles, set up a catch-all redirect from the old Zendesk Help Center subdomain to the new Help Scout domain.

---

## Step 5: DNS cutover (Day 4)

1. Update CNAME for `help.yourcompany.com` from Zendesk Help Center to Help Scout Docs (`docs.helpscout.net`).
2. TTL: reduce to 300s one day before cutover; restore to 3600s after.
3. Verify Beacon widget on product points to new Help Scout domain.
4. Test AI Answers for the top-5 search queries.

---

## Post-migration: 7-day validation

- Monitor Google Search Console for 404s on migrated URLs.
- Check Help Scout search-no-results report daily for the first week.
- Compare ticket volume week-over-week (should be flat or lower if KB search improved).

---

## Rollback plan

Zendesk Help Center can be reactivated within 30 days of cancellation. If the migration fails:
1. Reactivate Zendesk Help Center in Zendesk Admin.
2. Update CNAME back to Zendesk Help Center.
3. Pause Help Scout Docs until issues are resolved.
