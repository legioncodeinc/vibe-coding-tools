# KB Setup Checklist

Use this checklist when launching a new KB or migrating to a new platform.

## Platform and infrastructure

- [ ] Platform selected and contract/plan activated
- [ ] Custom domain configured and SSL active
- [ ] DNS TTL reduced to 300s before cutover (if migrating)
- [ ] Old platform redirect rules in place (for migrations)

## Information architecture

- [ ] Category hierarchy defined (max 3 levels; user vocabulary, not internal naming)
- [ ] Article templates selected (concept / how-to / troubleshooting / reference)
- [ ] Top-10 most common support topics have stub articles
- [ ] Article search tags added (3-5 per article)
- [ ] Internal linking verified (concept → how-to → reference chain)

## AI deflection

- [ ] AI deflection pattern selected (Pattern A, B, or C — see `guides/02-ai-deflection.md`)
- [ ] AI deflection enabled and tested with top-5 queries
- [ ] "No answer" fallback configured (contact form or human escalation)
- [ ] `llms.txt` created and served from KB domain root
- [ ] `llms-full.txt` generated from KB sitemap export (optional; recommended)

## Analytics

- [ ] Article Ratings enabled
- [ ] Search analytics / no-results tracking confirmed active
- [ ] CRAVA baseline metrics recorded (Coverage, Reach, Answer rate, Vote score, Avoidance rate)
- [ ] Weekly triage ritual scheduled (see `templates/content-gap-triage.md`)

## Versioning (if needed)

- [ ] Version branches created (main + maintenance branches)
- [ ] Version selector visible in portal navigation
- [ ] Article version tags applied

## Multi-language (if needed)

- [ ] Locale routing configured (path or subdomain)
- [ ] Auto-translate enabled or TMS workflow confirmed
- [ ] RTL layout verified for applicable locales
- [ ] `llms.txt` updated with locale-specific article URLs

## Launch sign-off

- [ ] All Getting Started articles reviewed and published
- [ ] Beacon widget (if applicable) installed and tested in product
- [ ] Support team briefed on KB structure and search
- [ ] Week-1 monitoring calendar invite sent (check search no-results daily)
