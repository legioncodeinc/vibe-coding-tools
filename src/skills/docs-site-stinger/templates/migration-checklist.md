# Docs Site Migration Checklist

Use when migrating from one docs platform to another.

**Source platform:** {e.g., GitBook}
**Target platform:** {e.g., Starlight}

---

## Pre-migration
- [ ] Platform selection completed: target platform selected with trade-off named
- [ ] Full content inventory: list all pages + their current URLs
- [ ] GitBook / source platform export completed (Markdown/PDF/HTML as available)
- [ ] Custom CSS, theming, macros, and plugins catalogued
- [ ] API reference pages identified (route to `api-docs-worker-bee` for OpenAPI conversion)
- [ ] Interactive/embedded content (synced blocks, live demos) catalogued for manual conversion

## Content migration
- [ ] All `.md` / `.mdx` files in target platform's content directory
- [ ] Frontmatter converted to target platform format
- [ ] Platform-specific callout/hint syntax converted (e.g., GitBook `{% hint %}` → Starlight admonition)
- [ ] Code blocks converted to target platform syntax (e.g., Expressive Code in Starlight)
- [ ] Tab blocks converted to MDX components
- [ ] Images and assets copied to `public/` or `src/assets/`
- [ ] Internal links updated to target platform URL structure

## Navigation
- [ ] Top-level navigation structure mapped from source to target
- [ ] Sidebar ordering confirmed in target platform config
- [ ] Diátaxis content pyramid applied to new structure (`guides/01-content-pyramid.md`)

## Redirect map
- [ ] All old URLs mapped to new URLs
- [ ] Redirect config written (`vercel.json`, Netlify `_redirects`, etc.)
- [ ] 404 page configured in target platform
- [ ] Redirect map covers all pages with external inbound links

## CI and quality
- [ ] Docs-as-code CI pipeline configured (`guides/02-docs-as-code.md`)
- [ ] Build runs clean with zero errors
- [ ] Dead-link check passes
- [ ] All redirects tested

## Search
- [ ] Search configured in target platform (`guides/03-search.md`)
- [ ] Search indexed after build
- [ ] 5 key terms return correct pages

## Go-live
- [ ] DNS / custom domain updated to new hosting
- [ ] Old platform decommissioned or set to redirect-only
- [ ] Migration report written: pages migrated, manual conversions, redirect coverage
