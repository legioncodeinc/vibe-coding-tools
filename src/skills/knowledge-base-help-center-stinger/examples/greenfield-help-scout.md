# Example: Greenfield Help Scout Docs — Zero to AI Deflection

## Scenario

**Team profile:** 5-person SaaS startup, email-first support, 30 articles needed at launch, budget-sensitive.
**Goal:** Launch a KB with AI deflection in under one week.

---

## Day 1: Setup (2 hours)

1. **Create Help Scout workspace** and enable Docs: helpscout.com → Create Account → Enable Docs.
2. **Set custom domain**: Settings → Help Center → Custom Domain → add CNAME to `docs.helpscout.net`.
3. **Create category structure** (based on top 5 ticket types from the last 30 days):
   - Getting started
   - Account & billing
   - Integrations
   - Troubleshooting
   - Release notes
4. **Import existing support email drafts** as stub articles — they become the first draft of how-to articles.

---

## Day 2: Article writing (4 hours)

Write the 10 most-searched topics based on last month's support inbox:

1. Create an article for each using the how-to template from `guides/01-information-architecture.md`.
2. Add 3-5 search tags per article (product feature name + user vocabulary).
3. Enable Article Ratings on all articles.

---

## Day 3: Beacon integration (1 hour)

```html
<!-- Add to your product's <head> -->
<script>
  !function(e,t,n){ /* Beacon install script from Settings → Beacon → Install */ }(window,document,"Beacon")
  window.Beacon('init', 'YOUR-BEACON-ID')
  window.Beacon('config', {
    docsEnabled: true,
    messagingEnabled: true,
    aiEnabled: true,      // requires AI Answers plan
    prefill: {
      email: currentUser.email,
      name: currentUser.name
    }
  })
</script>
```

Test: open the product in a browser, trigger the Beacon widget, search for "getting started" — confirm articles appear.

---

## Day 4: AI deflection (30 minutes)

1. Settings → AI → Enable AI Answers.
2. Toggle "Only answer from Docs articles" to ON.
3. Set the "No answer" fallback to "Email us" (routes to the support inbox).
4. Test: ask the Beacon AI "How do I invite a team member?" — confirm it surfaces the correct article.

---

## Day 5: llms.txt (15 minutes)

Create `/llms.txt` at the custom domain root (if self-hosted) or via a custom redirect:

```
# Acme Help Center

> Self-service documentation for Acme — the [product description].

## Documentation

- Getting Started: https://help.acme.com/en/collections/getting-started
- Account & Billing: https://help.acme.com/en/collections/account-billing
- Integrations: https://help.acme.com/en/collections/integrations
- Troubleshooting: https://help.acme.com/en/collections/troubleshooting

## Support

- Contact support: https://help.acme.com/en/support
```

---

## Week 2 onward: Analytics loop

Set up the weekly triage ritual from `guides/05-analytics-loop.md`:
- Monday: pull Search → No Results report.
- 30 minutes: classify, assign, fix.
- Friday: measure if last week's fixes reduced no-result count.

**Expected outcome by week 4:** >55% search success rate, >30% ticket deflection rate.

---

## Rollback plan

If Help Scout Docs does not meet needs within 60 days:
1. Export all articles via Help Scout API: `GET /v1/docs/articles`.
2. Convert HTML export to markdown with `pandoc`.
3. Import markdown into alternative platform (Document360 HTML importer, Intercom Articles importer).
