# Multi-language / Multi-locale — Knowledge Base Help Center

## Platform support summary

| Platform | Native multi-locale | Auto-translate | RTL support | TMS integration |
|---|---|---|---|---|
| Help Scout Docs | Partial (locale routing via subdomain) | No | No | Manual export/import |
| Intercom Articles | Fin: 45 languages; Articles: TMS workflow | No (Fin translation) | Partial | Crowdin, Phrase |
| Document360 | Yes (path-based locale routing) | **50+ languages, auto-translate on Business+** | **Yes** | Phrase, Crowdin, Lokalise, Transifex |
| ReadMe.com | Partial | No | No | Manual |
| Zendesk Guide | **Yes (native path routing)** | Partial | **Yes** | Phrase, Crowdin |

Source: `research/external/2026-05-20-multi-language-kb-2026.md`

---

## Locale routing strategies

### Strategy 1: Subdomain per locale
`help.company.com` (EN) / `help.company.com/fr` or `help-fr.company.com` (FR)

Pros: Clean URL structure, easy SEO per locale.
Cons: Subdomain DNS setup per locale; Help Scout Docs uses this approach.

### Strategy 2: Path-based routing
`help.company.com/en/` / `help.company.com/fr/`

Pros: Simpler to configure on most platforms.
Cons: Content tree duplication per locale.

**Document360 and Zendesk Guide default to path-based routing.** This is the recommended approach for 2026 given broad SEO tooling support.

---

## Machine translation vs TMS workflow

### When machine translation is sufficient
- Internal or low-stakes knowledge bases.
- Languages where the user population's primary language is English (partial translation acceptable).
- Early-stage product with frequent article churn (human translation would be stale within a sprint).

**Document360 Business+:** 50+ language auto-translate is production-ready for most SaaS use cases. Enable it as a default and add human review only for languages with a named market (DE, FR, JP).

### When a TMS is required
- Regulated industries (financial, healthcare) where translation accuracy is audited.
- Languages with significant SEO opportunity (DE, FR, JA, ES, PT-BR).
- Customer contracts requiring localized documentation.

**Recommended TMS options (2026):**
| TMS | Best for | Notable feature |
|---|---|---|
| Phrase (formerly Memsource) | Enterprise, multiple products | Translation Memory + Machine Translation combo |
| Crowdin | Mid-market, GitHub-native | GitHub Actions integration, crowdsourced mode |
| Lokalise | SaaS teams | App string + KB in one workflow, Figma plugin |

---

## Locale launch checklist

Before publishing a new locale:

- [ ] Locale routing configured and tested (path or subdomain).
- [ ] 80%+ of Getting Started and top-10-searched articles translated.
- [ ] `llms.txt` updated with locale-specific article URLs.
- [ ] AI deflection (Fin/Eddy) configured to answer in the target language.
- [ ] Search index rebuilt for the new locale.
- [ ] Article feedback / ratings enabled in the new locale.
- [ ] Support fallback in the target language confirmed (or "Contact us in English only" callout added).

---

## RTL language support

Arabic, Hebrew, Persian, and Urdu require right-to-left layout. In 2026:
- **Document360** and **Zendesk Guide** have native RTL support.
- Help Scout Docs, Intercom Articles, and ReadMe.com require custom CSS overrides or a custom portal theme.

If RTL is a hard requirement, Document360 or Zendesk Guide are the only production-ready options.

---

*Sources: `research/external/2026-05-20-multi-language-kb-2026.md`, `research/external/2026-05-20-document360-2026-features.md`.*
