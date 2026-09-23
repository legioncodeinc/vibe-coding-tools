# Platform Selection Matrix: Fill-In Template

Use this template to produce a scored recommendation. Fill in each cell before naming a winner.

> Derived from `guides/00-platform-selection.md`.

---

## Team context (fill in)

- **Current docs tool:** {current tool or "none"}
- **Content scope:** {API reference / guides / tutorials / blend}
- **Approximate page count:** {N pages}
- **Hosting constraint:** {self-hosted / managed / either}
- **Budget:** {$N/month hard cap or "flexible"}
- **Primary language/framework:** {Python / JS-TS / Java / etc.}
- **SSO required:** {yes / no}
- **White-label required:** {yes / no}

---

## Hard filter results

| Platform | Eliminated? | Reason if yes |
|---|---|---|
| MkDocs Material | {yes if greenfield} | Maintenance mode Nov 2025 |
| GitBook | {yes if $0 budget} | $65-$249/month per site |
| Mintlify (Pro/Enterprise) | {yes if budget < $300/month} | Pro starts at $300/month |
| {other} | | |

Surviving candidates after filters: {list them}

---

## Scored matrix

Score 1-5 per dimension (5 = best fit for this team).

| Dimension | Starlight | Docusaurus | Mintlify | Nextra v4 | GitBook | Fern |
|---|---|---|---|---|---|---|
| Content type fit | | | | | | |
| Hosting model fit | | | | | | |
| Customization depth | | | | | | |
| Search quality | | | | | | |
| Language ecosystem fit | | | | | | |
| Cost at scale | | | | | | |
| 2026 platform health | | | | | | |
| **Total** | | | | | | |

---

## Recommendation

**Winner:** {platform name}

**One-line reason:** {e.g., "open-source, $0 budget, JS/TS team, needs deep customization"}

**Named trade-off:** {e.g., "v0.x semver: pin versions; minor upgrades may have breaking changes"}

**Fallback:** {e.g., "Docusaurus v3.10 if React component integration proves necessary"}

---

## Next steps

- [ ] Read `guides/{platform-number}-{platform-name}.md` for setup instructions.
- [ ] Run `guides/01-content-pyramid.md` to design content structure.
- [ ] Wire CI per `guides/02-docs-as-code.md`.
- [ ] Configure search per `guides/03-search.md`.
