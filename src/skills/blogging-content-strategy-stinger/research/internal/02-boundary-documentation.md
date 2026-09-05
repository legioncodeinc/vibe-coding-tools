---
source_url: internal://command-briefs/blogging-content-strategy-worker-bee-command-brief.md
retrieved_on: 2026-05-20
source_type: internal-brief
authority: official
relevance: critical
topic: boundaries
stinger: blogging-content-strategy-stinger
---

# Boundary Documentation: Overlap with seo-aeo-worker-bee and newsletter-platform-worker-bee

## Summary

This stinger pairs closely with two other Legion Angels. Getting the handoff lines right prevents scope creep and quality dilution. This file defines the exact boundaries so stinger-forge can encode clear escalation paths in SKILL.md and guides.

## Boundary 1: seo-aeo-worker-bee

### What seo-aeo-worker-bee owns (NOT this stinger)
- Canonical tags and hreflang configuration
- robots.txt and crawl budget management
- Core Web Vitals optimization (LCP, INP, CLS)
- Schema markup implementation (the JSON-LD code, not the conceptual structure)
- Site architecture and URL structure
- Internal link equity distribution (technical crawl layer)
- Image compression and technical image SEO
- Page speed and render-blocking resources

### What blogging-content-strategy-worker-bee owns (THIS stinger)
- Which content to write and how to structure it
- Heading hierarchy (H1/H2/H3) from an editorial perspective
- AEO formatting concepts (question-based headings, definition blocks, FAQ sections, concise paragraphs) — the WHAT, not the HOW of JSON-LD
- Internal linking from an editorial strategy perspective (which posts should link to which)
- Content cluster architecture (the editorial model, not the technical crawl model)
- Title tags and meta descriptions (the copy, not the technical implementation)

### The handoff rule (from Command Brief)
> "If it involves HTML meta tags or server response codes, route to `seo-aeo-worker-bee`. If it involves what to write and how to structure it, route here."

### Practical examples

| Task | Owner |
|---|---|
| "Should this post target this keyword?" | blogging-content-strategy-worker-bee |
| "Write the title tag and meta description copy" | blogging-content-strategy-worker-bee |
| "Implement the title tag in the CMS" | seo-aeo-worker-bee |
| "Add FAQPage schema JSON-LD to this post" | seo-aeo-worker-bee |
| "Structure this post's headings for AEO" | blogging-content-strategy-worker-bee |
| "Fix the canonical tag for this URL" | seo-aeo-worker-bee |
| "Add internal links to this post" | blogging-content-strategy-worker-bee |
| "Audit crawl efficiency of internal link graph" | seo-aeo-worker-bee |
| "Write a topic cluster architecture for this site" | blogging-content-strategy-worker-bee |
| "Optimize Core Web Vitals on the blog" | seo-aeo-worker-bee |

### How to surface the handoff in the stinger
When `blogging-content-strategy-worker-bee` identifies a technical SEO issue (e.g., a canonical tag problem, a slow-loading page affecting a cluster), it must:
1. Note the finding in its output
2. Explicitly state: "This requires `seo-aeo-worker-bee` — route there for [specific issue]"
3. NOT attempt to fix or recommend the technical implementation itself

---

## Boundary 2: newsletter-platform-worker-bee

### What newsletter-platform-worker-bee owns (NOT this stinger)
- Platform selection (Beehiiv, ConvertKit, Loops, Substack, Resend, Ghost)
- Email deliverability, SPF/DKIM/DMARC, domain warmup
- Subscriber lifecycle and segmentation strategy
- Newsletter monetization (ad networks, paid subscriptions, sponsorships)
- Email template and design for newsletters
- Platform migration (e.g., Substack to Beehiiv)

### What blogging-content-strategy-worker-bee owns (THIS stinger)
- Recommending "cross-post to newsletter" as a distribution step in the content workflow
- The CTA that invites blog readers to subscribe to a newsletter
- Whether and how blog content should be repurposed into newsletter format (the editorial decision, not the platform configuration)
- The relationship between blog cluster strategy and newsletter content planning (editorial alignment)

### The handoff rule (from Command Brief)
> "`newsletter-platform-worker-bee` owns the email distribution layer; this Angel may recommend 'cross-post to newsletter' in the distribution checklist but does not configure the platform."

### Practical examples

| Task | Owner |
|---|---|
| "Should I repurpose this blog post into a newsletter?" | blogging-content-strategy-worker-bee |
| "Write a newsletter CTA for this blog post" | blogging-content-strategy-worker-bee |
| "Set up Beehiiv for my blog" | newsletter-platform-worker-bee |
| "Configure double opt-in on my newsletter" | newsletter-platform-worker-bee |
| "How often should I send my newsletter?" | newsletter-platform-worker-bee |
| "How does my blog calendar align with newsletter sends?" | blogging-content-strategy-worker-bee (editorial) |
| "How do I import my subscriber list from Mailchimp?" | newsletter-platform-worker-bee |

---

## Boundary 3: website-worker-bee

### What website-worker-bee owns (NOT this stinger)
- Landing page architecture and conversion rate optimization
- Website hosting and deployment
- Overall site information architecture
- Product and pricing page copy strategy

### What blogging-content-strategy-worker-bee owns (THIS stinger)
- Blog section architecture and cluster structure
- Blog post page layout recommendations (from an editorial perspective)
- Content positioning relative to the buyer journey

### Practical note
This boundary is less common to hit in practice. Most handoffs to `website-worker-bee` are triggered when the user asks about non-blog pages (product pages, landing pages, the homepage).

---

## Annotations for stinger-forge

- SKILL.md trigger phrases should explicitly exclude: "set up Beehiiv/ConvertKit", "fix canonical", "Core Web Vitals", "robots.txt", "schema JSON-LD"
- SKILL.md should include a "DO NOT USE FOR" list that references all three boundary Angels by name
- `guides/01-cluster-pillar-architecture.md` should note that the pillar/cluster architecture is an editorial concept; the technical internal-link audit is `seo-aeo-worker-bee`'s domain
- `guides/05-aeo-formatting.md` must distinguish clearly: "This guide covers the editorial layer (content structure, heading choices, FAQ section authoring). For implementing FAQPage schema markup in JSON-LD, route to `seo-aeo-worker-bee`."
