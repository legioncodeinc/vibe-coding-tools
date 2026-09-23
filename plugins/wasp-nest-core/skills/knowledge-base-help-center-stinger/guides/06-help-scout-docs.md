# Help Scout Docs — Platform Guide

## Profile

**Best for:** Email-first SMBs, <500 articles, non-developer authoring teams, price-sensitive buyers.

**AI deflection:** AI Answers ($0.75/resolution). Reads Docs articles natively. Also supports Beacon-based chat widget on the KB portal.

**Versioning:** Article revision history only. No branching or parallel versions.

**Multi-language:** Partial. Locale routing via subdomain or folder; no auto-translate; manual TMS export/import.

**Pricing:** Transparent, contact-based billing. ~$220/mo for a 10-person team at 2,000 conversations.

Source: `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`

---

## Setup steps

1. **Create a Docs site** in Help Scout → Help Center → Create New Site.
2. **Set a custom domain** (required for production): Settings → Custom Domain → CNAME to `docs.helpscout.net`.
3. **Install the Beacon widget** on your product to surface KB articles inline: Settings → Beacon → Install. Embed the JavaScript snippet.
4. **Enable AI Answers** if deflection is needed: Settings → AI → Enable AI Answers. Set the "only answer from articles" toggle to ON to prevent hallucination.
5. **Configure the site theme** (branding, colors, custom CSS) in Settings → Appearance.
6. **Import existing articles** via the CSV/HTML importer: Docs → Import → Upload.
7. **Set up Article Ratings** (thumbs up/down): Settings → Articles → Enable Ratings.

---

## Beacon integration (AI deflection in-product)

Help Scout Beacon can surface KB articles inline in the product UI before the user opens a ticket:

```html
<!-- Install snippet -->
<script>
  !function(e,t,n){
    // Beacon install script (get from Help Scout → Settings → Beacon → Install)
  }(window,document,"Beacon")
  window.Beacon('init', 'YOUR-BEACON-ID')
</script>
```

**Configuration options:**
- `messagingEnabled: true` — enables the chat/email contact form.
- `docsEnabled: true` — enables article search within the Beacon widget.
- `aiEnabled: true` — enables AI Answers (requires AI plan).
- `prefill: { email: user.email, name: user.name }` — pre-fills the contact form for authenticated users.

**Article Ratings API:** Help Scout exposes article feedback via its API. See `research/research-summary.md` OQ-3 for the `developer.helpscout.com/docs-api/` reference.

---

## Content migration from another platform

1. Export articles as HTML or CSV from the source platform.
2. Use Help Scout's HTML import (Docs → Import) for structured imports.
3. For large migrations (>200 articles), use the REST API: `POST /v1/docs/articles` with `collectionId`, `name`, `text` (HTML), and `status: published`.
4. Rebuild the category hierarchy in Help Scout before import (categories cannot be bulk-created via CSV).

---

## Known limitations

- No article versioning or branching — if parallel versions are required, Document360 is the only 2026 option.
- No native multi-language — requires a subdomain strategy + manual TMS.
- AI Answers is limited to reading Docs articles only (no external URL ingestion as of May 2026).
- Beacon widget is not mobile-app-SDK natively; use the Help Scout iOS/Android SDKs separately.

---

*Sources: `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`, `research/internal/command-brief-analysis.md`.*
