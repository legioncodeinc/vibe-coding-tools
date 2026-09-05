# Research: website-stinger

This folder contains the source material for every claim in the `guides/` directory.

## Contents

| Item | Description |
|---|---|
| `research-plan.md` | Secondary source list, quarterly refresh queries, open questions |
| `source-prds/` | The 12-phase canonical source PRDs (primary load-bearing source) |

## PRD-to-guide mapping

| Phase | Guide | Source PRD |
|---|---|---|
| 1 | `guides/01-monorepo.md` | `source-prds/prd-phase-01-monorepo-architecture.md` |
| 2 | `guides/02-performance-security.md` | `source-prds/prd-phase-02-sveltekit-performance-security.md` |
| 3 | `guides/03-seo-aeo.md` | `source-prds/prd-phase-03-seo-aeo-system.md` |
| 4 | `guides/04-analytics.md` | `source-prds/prd-phase-04-analytics-tracking-stack.md` |
| 5 | `guides/05-supabase.md` | `source-prds/prd-phase-05-supabase-backend-foundation.md` |
| 6 | `guides/06-auth.md` | `source-prds/prd-phase-06-authentication-user-management.md` |
| 7 | `guides/07-admin-payload.md` | `source-prds/prd-phase-07-payload-admin.md` |
| 8 | `guides/08-lead-capture.md` | `source-prds/prd-phase-08-lead-capture-contact-forms.md` |
| 9 | `guides/09-blog.md` | `source-prds/prd-phase-09-blog-content-management.md` |
| 10 | `guides/10-webhooks.md` | `source-prds/prd-phase-10-webhook-integration-system.md` |
| 11 | `guides/11-cro.md` | `source-prds/prd-phase-11-landing-page-conversion-optimization.md` |
| 12 | `guides/12-visual-design.md` | `source-prds/prd-phase-12-visually-stunning-design.md` |

## Payload CMS deep research

Payload-specific deep research lives in its own dedicated stinger's research folder:

`.claude/skills/website-stinger/research/`

This is populated by `scripture-historian` (Phase 1.5 of the factory pipeline). The source PRDs in this folder reference Payload high-level architecture; detailed Payload implementation claims should cite `website-stinger/research/` files.
