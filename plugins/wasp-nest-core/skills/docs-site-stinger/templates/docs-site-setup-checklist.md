# Docs Site Setup Checklist

Use this before declaring a docs site "launched." One checkbox per step.

---

## Platform selection
- [ ] Decision tree completed (`guides/00-platform-selection.md`)
- [ ] Platform scored against team's 6 dimensions
- [ ] Trade-off named to the team
- [ ] Fallback identified

## Content structure
- [ ] Diátaxis four kinds mapped to navigation (`guides/01-content-pyramid.md`)
- [ ] Getting-started / guides / reference / concepts sections created
- [ ] Home page (`index.md` / `index.mdx`) written with clear value proposition

## Platform setup
- [ ] Site builds locally without errors
- [ ] All pages load with correct titles and descriptions
- [ ] Logo and favicon configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics configured (if required)

## Docs-as-code CI (`guides/02-docs-as-code.md`)
- [ ] Prose linter (Vale) configured with `.vale.ini`
- [ ] Dead-link checker (lychee) configured with `lychee.toml`
- [ ] GitHub Actions workflow runs on every PR
- [ ] Build check fails the PR on broken MDX/config
- [ ] Preview deploy configured (Vercel / Netlify / platform built-in)
- [ ] `CONTRIBUTING.md` written for docs contributors

## Search (`guides/03-search.md`)
- [ ] Search solution chosen (pagefind / DocSearch / built-in)
- [ ] Search indexed and tested: 5 key terms return correct pages
- [ ] Navigation/footer/sidebar excluded from search index
- [ ] Search works on mobile

## Launch
- [ ] All broken links resolved
- [ ] Redirect map written for any existing URLs that change
- [ ] `robots.txt` allows search crawlers
- [ ] `sitemap.xml` generated and submitted (if SEO is a priority)
- [ ] Internal team review of content quality completed
- [ ] Docs site URL shared with first users
